import cv2
import numpy as np
from PIL import Image
import os
import json
import warnings

warnings.filterwarnings("ignore")

# Try to import deepface - FORCE DeepFace mode
DEEPFACE_AVAILABLE = False
DEEPFACE_IMPORT_ERROR = None

try:
    from deepface import DeepFace
    from scipy.spatial.distance import cosine

    DEEPFACE_AVAILABLE = True
    print("[DEEPFACE] Successfully loaded DeepFace module")
except ImportError as e:
    DEEPFACE_IMPORT_ERROR = str(e)
    print(f"[DEEPFACE] ERROR: Failed to import DeepFace: {e}")
    print("[DEEPFACE] Face recognition will NOT work without DeepFace!")
    raise ImportError(f"DeepFace is required but not available: {e}")


class FaceRecognitionService:
    def __init__(self, app_config):
        self.config = app_config
        self.detection_model = app_config.get("FACE_DETECTION_MODEL", "retinaface")
        self.recognition_model = app_config.get("FACE_RECOGNITION_MODEL", "ArcFace")
        self.confidence_threshold = app_config.get("FACE_DETECTION_CONFIDENCE", 0.85)
        self.match_threshold = app_config.get("FACE_MATCH_THRESHOLD", 0.65)
        self.max_dimension = app_config.get("MAX_IMAGE_DIMENSION", 2048)

        # Validate DeepFace is available
        if not DEEPFACE_AVAILABLE:
            raise RuntimeError(
                "DeepFace is not available. Cannot initialize FaceRecognitionService."
            )

        # Log initialization
        print(f"[FACE SERVICE] Initialized with:")
        print(f"  - Detection Model: {self.detection_model}")
        print(f"  - Recognition Model: {self.recognition_model}")
        print(f"  - Match Threshold: {self.match_threshold}")
        print(f"  - Detection Confidence: {self.confidence_threshold}")

        # Load OpenCV face detector (as backup)
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        )

    def load_image(self, image_path):
        """Load and preprocess image for face recognition"""
        try:
            # Load with PIL first for better format support
            pil_image = Image.open(image_path)

            # Convert to RGB if necessary
            if pil_image.mode != "RGB":
                pil_image = pil_image.convert("RGB")

            # Convert to numpy array
            img_array = np.array(pil_image)

            # Resize if too large (to save memory and processing time)
            height, width = img_array.shape[:2]
            if max(height, width) > self.max_dimension:
                scale = self.max_dimension / max(height, width)
                new_width = int(width * scale)
                new_height = int(height * scale)
                img_array = cv2.resize(img_array, (new_width, new_height))

            return img_array
        except Exception as e:
            raise ValueError(f"Error loading image: {str(e)}")

    def detect_faces(self, image_path):
        """
        Detect faces in an image using DeepFace backend
        Returns: List of dicts with keys: box, confidence
        """
        try:
            # Use DeepFace for detection
            detections = DeepFace.extract_faces(
                img_path=image_path,
                detector_backend=self.detection_model,
                enforce_detection=True,
                align=True,
            )

            detected_faces = []
            for det in detections:
                facial_area = det.get("facial_area", {})
                confidence = det.get("confidence", 0)

                if confidence >= self.confidence_threshold:
                    detected_faces.append(
                        {
                            "box": {
                                "x": int(facial_area.get("x", 0)),
                                "y": int(facial_area.get("y", 0)),
                                "w": int(facial_area.get("w", 0)),
                                "h": int(facial_area.get("h", 0)),
                            },
                            "confidence": float(confidence),
                        }
                    )

            print(
                f"[DETECT] Found {len(detected_faces)} faces in {os.path.basename(image_path)}"
            )
            return detected_faces

        except Exception as e:
            print(f"[DETECT] DeepFace detection failed: {str(e)}")
            # Fallback to OpenCV if DeepFace fails
            print("[DETECT] Falling back to OpenCV Haar Cascade")
            return self._detect_faces_opencv(image_path)

    def _detect_faces_opencv(self, image_path):
        """OpenCV fallback detection"""
        try:
            img = cv2.imread(image_path)
            if img is None:
                return []

            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            faces = self.face_cascade.detectMultiScale(
                gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
            )

            detected_faces = []
            for x, y, w, h in faces:
                detected_faces.append(
                    {
                        "box": {"x": int(x), "y": int(y), "w": int(w), "h": int(h)},
                        "confidence": 0.9,
                    }
                )

            return detected_faces
        except Exception as e:
            print(f"OpenCV face detection error: {str(e)}")
            return []

    def extract_face_embedding(self, image_path, enforce_detection=True):
        """
        Extract face embedding from an image using DeepFace
        Returns: dict with embedding array and face info
        """
        if not DEEPFACE_AVAILABLE:
            raise RuntimeError("DeepFace is not available. Cannot extract embeddings.")

        try:
            print(f"[EXTRACT] Processing: {os.path.basename(image_path)}")
            print(
                f"[EXTRACT] Using model: {self.recognition_model}, detector: {self.detection_model}"
            )

            embeddings = DeepFace.represent(
                img_path=image_path,
                model_name=self.recognition_model,
                detector_backend=self.detection_model,
                enforce_detection=enforce_detection,
                align=True,
            )

            results = []
            for emb in embeddings:
                embedding = emb["embedding"]
                embedding_len = len(embedding)
                print(f"[EXTRACT] Got embedding of length {embedding_len}")

                results.append(
                    {
                        "embedding": embedding,
                        "facial_area": emb.get("facial_area", {}),
                        "confidence": emb.get("confidence", 1.0),
                        "embedding_length": embedding_len,
                    }
                )

            print(f"[EXTRACT] Successfully extracted {len(results)} embeddings")
            return results

        except Exception as e:
            print(f"[EXTRACT] ERROR: DeepFace embedding extraction failed: {str(e)}")
            import traceback

            traceback.print_exc()
            return []

    def compare_faces(self, embedding1, embedding2):
        """
        Compare two face embeddings using cosine similarity
        Returns: similarity score (0-1, higher = more similar)
        """
        try:
            # Handle different embedding dimensions - reject if clearly incompatible
            dim1 = len(embedding1) if isinstance(embedding1, (list, np.ndarray)) else 0
            dim2 = len(embedding2) if isinstance(embedding2, (list, np.ndarray)) else 0

            # ArcFace/Facenet = 512 dim, OpenCV fallback = 10000 dim
            # If dimensions differ significantly, they're incompatible
            if dim1 != dim2:
                print(f"[COMPARE] Embedding dimension mismatch: {dim1} vs {dim2}")
                # Check if this is old (10000) vs new (512) embedding
                if (dim1 == 10000 and dim2 == 512) or (dim1 == 512 and dim2 == 10000):
                    print(
                        "[COMPARE] ERROR: Old fallback embeddings vs new DeepFace embeddings - INCOMPATIBLE!"
                    )
                    print("[COMPARE] Old photos need to be re-processed with new model")
                    return 0.0
                return 0.0

            # Convert to numpy arrays
            if isinstance(embedding1, list):
                embedding1 = np.array(embedding1)
            if isinstance(embedding2, list):
                embedding2 = np.array(embedding2)

            # Calculate cosine similarity
            distance = cosine(embedding1, embedding2)
            similarity = float(1 - distance)

            print(f"[COMPARE] Similarity score: {similarity:.4f}")
            return similarity

        except Exception as e:
            print(f"[COMPARE] ERROR: Face comparison failed: {str(e)}")
            import traceback

            traceback.print_exc()
            return 0.0

    def find_matching_faces(
        self, user_embedding, photo_embeddings_list, threshold=None
    ):
        """
        Find all photos where user face matches above threshold
        Returns: List of dicts with photo_id, confidence, matched_face_index
        """
        if threshold is None:
            threshold = self.match_threshold

        print(f"[FIND_MATCH] Starting search with threshold: {threshold}")
        print(f"[FIND_MATCH] User embedding length: {len(user_embedding)}")
        print(f"[FIND_MATCH] Searching {len(photo_embeddings_list)} photos")

        matches = []

        for photo_data in photo_embeddings_list:
            photo_id = photo_data.get("photo_id")
            embeddings = photo_data.get("embeddings", [])

            if not embeddings:
                continue

            best_match = None
            best_confidence = 0

            for idx, face_embedding in enumerate(embeddings):
                confidence = self.compare_faces(user_embedding, face_embedding)

                if confidence > best_confidence:
                    best_confidence = confidence
                    best_match = idx

            if best_confidence >= threshold:
                matches.append(
                    {
                        "photo_id": photo_id,
                        "confidence": best_confidence,
                        "matched_face_index": best_match,
                    }
                )
                print(
                    f"[FIND_MATCH] MATCH found! Photo {photo_id}: {best_confidence:.4f}"
                )

        matches.sort(key=lambda x: x["confidence"], reverse=True)
        print(f"[FIND_MATCH] Total matches found: {len(matches)}")
        return matches

    def process_photo_for_faces(self, image_path):
        """
        Process a photo to detect all faces and extract embeddings
        Returns: dict with face_count, embeddings, detected_faces
        """
        try:
            # Use extract_faces to get both detection and embeddings
            detections = DeepFace.extract_faces(
                img_path=image_path,
                detector_backend=self.detection_model,
                enforce_detection=False,
                align=True,
            )

            embeddings = []
            face_data = []

            for idx, det in enumerate(detections):
                confidence = det.get("confidence", 0)
                if confidence < self.confidence_threshold:
                    continue

                facial_area = det.get("facial_area", {})

                # Extract embedding for this face
                try:
                    # Crop the face region and extract embedding
                    x = facial_area.get("x", 0)
                    y = facial_area.get("y", 0)
                    w = facial_area.get("w", 0)
                    h = facial_area.get("h", 0)

                    # Use the full image with DeepFace's detected face
                    emb_result = DeepFace.represent(
                        img_path=image_path,
                        model_name=self.recognition_model,
                        detector_backend=self.detection_model,
                        enforce_detection=False,
                        align=True,
                    )

                    if emb_result and idx < len(emb_result):
                        embeddings.append(emb_result[idx]["embedding"])
                        face_data.append(
                            {
                                "index": idx,
                                "box": {
                                    "x": int(x),
                                    "y": int(y),
                                    "w": int(w),
                                    "h": int(h),
                                },
                                "confidence": float(confidence),
                            }
                        )
                except Exception as e:
                    print(f"[PROCESS] Error extracting embedding for face {idx}: {e}")
                    continue

            print(
                f"[PROCESS] {os.path.basename(image_path)}: {len(embeddings)} faces processed"
            )
            return {
                "face_count": len(embeddings),
                "embeddings": embeddings,
                "detected_faces": face_data,
            }
        except Exception as e:
            print(f"[PROCESS] Photo processing error: {str(e)}")
            return {
                "face_count": 0,
                "embeddings": [],
                "detected_faces": [],
                "error": str(e),
            }

    def annotate_image_with_faces(self, image_path, faces, output_path):
        """
        Draw bounding boxes around detected faces
        """
        try:
            img = cv2.imread(image_path)
            if img is None:
                raise ValueError("Could not load image")

            for face in faces:
                box = face.get("box", {})
                x = box.get("x", 0)
                y = box.get("y", 0)
                w = box.get("w", 0)
                h = box.get("h", 0)
                confidence = face.get("confidence", 0)

                # Draw rectangle
                cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)

                # Draw confidence text
                label = f"{confidence:.2%}"
                cv2.putText(
                    img,
                    label,
                    (x, y - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (0, 255, 0),
                    2,
                )

            # Save annotated image
            cv2.imwrite(output_path, img)
            return True
        except Exception as e:
            print(f"Annotation error: {str(e)}")
            return False

    def verify_face_match(self, image1_path, image2_path):
        """
        Verify if two images contain the same person
        Returns: dict with verified (bool), similarity
        """
        try:
            print(
                f"[VERIFY] Comparing {os.path.basename(image1_path)} vs {os.path.basename(image2_path)}"
            )

            result = DeepFace.verify(
                img1_path=image1_path,
                img2_path=image2_path,
                model_name=self.recognition_model,
                detector_backend=self.detection_model,
                distance_metric="cosine",
            )

            similarity = 1 - float(result["distance"])
            print(
                f"[VERIFY] Similarity: {similarity:.4f}, Threshold: {result['threshold']:.4f}, Verified: {result['verified']}"
            )

            return {
                "verified": result["verified"],
                "distance": float(result["distance"]),
                "threshold": float(result["threshold"]),
                "model": self.recognition_model,
                "similarity": similarity,
            }

        except Exception as e:
            print(f"[VERIFY] ERROR: Face verification failed: {str(e)}")
            import traceback

            traceback.print_exc()
            return {"verified": False, "error": str(e)}


# Singleton instance
face_service = None


def init_face_service(app_config):
    """Initialize the face recognition service singleton"""
    global face_service
    face_service = FaceRecognitionService(app_config)
    return face_service


def get_face_service():
    """Get the face recognition service instance"""
    global face_service
    if face_service is None:
        raise RuntimeError("Face recognition service not initialized")
    return face_service
