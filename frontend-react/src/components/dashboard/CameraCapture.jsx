import React, { useState, useRef, useEffect } from 'react';
import { Camera, Video, VideoOff, Upload, Trash2, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { photosApi } from '../../api/photos';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const CameraCapture = ({ onFacesUploaded }) => {
  const [streamActive, setStreamActive] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const { showToast } = useToast();
  const { refreshUserProfile } = useAuth();

  // Attach stream to video element when mounted
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch((err) => {
        console.warn('Video play auto-start issue:', err);
      });
    }
  }, [mediaStream, streamActive]);

  // Start live webcam stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setMediaStream(stream);
      setStreamActive(true);
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Could not access camera. Please allow camera permissions or upload images directly.');
      showToast('Camera access denied or unavailable', 'error');
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaStream]);

  // Capture face snapshot from video feed
  const captureFace = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    if (!video.videoWidth || !video.videoHeight || video.readyState < 2) {
      showToast('Camera stream is still starting up, please wait a moment...', 'warning');
      return;
    }

    if (capturedImages.length >= 10) {
      showToast('Maximum 10 face photos allowed', 'warning');
      return;
    }

    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `face_capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
        const previewUrl = URL.createObjectURL(blob);
        setCapturedImages((prev) => [...prev, { file, previewUrl }]);
        showToast(`Face captured (${capturedImages.length + 1})`, 'info');
      },
      'image/jpeg',
      0.95
    );
  };

  // Handle local file uploads
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const validFiles = files.filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      showToast('Please select valid image files (JPG, PNG)', 'warning');
      return;
    }

    if (capturedImages.length + validFiles.length > 10) {
      showToast('Total photos cannot exceed 10', 'warning');
      return;
    }

    const newItems = validFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setCapturedImages((prev) => [...prev, ...newItems]);
    showToast(`Added ${validFiles.length} photo(s)`, 'info');
  };

  const removeCaptured = (index) => {
    setCapturedImages((prev) => {
      const item = prev[index];
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const clearAll = () => {
    capturedImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setCapturedImages([]);
  };

  // Submit all photos to DeepFace embedding endpoint
  const handleUpload = async () => {
    if (capturedImages.length === 0) {
      showToast('Please capture or select at least 1 photo', 'warning');
      return;
    }

    const formData = new FormData();
    capturedImages.forEach((item) => {
      formData.append('faces', item.file);
    });

    setUploading(true);
    try {
      const res = await photosApi.uploadFaces(formData);
      showToast(res.message || 'Faces registered successfully!', 'success');
      clearAll();
      stopCamera();
      await refreshUserProfile();
      if (onFacesUploaded) onFacesUploaded();
    } catch (err) {
      showToast(err.message || 'Failed to process face images. Ensure face is clearly visible.', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={22} color="var(--primary)" /> Face Registration
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Capture 3–5 photos from slightly different angles (front, slight left/right, smile) for maximum recognition accuracy.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-outline btn-sm"
          >
            <Upload size={16} /> Choose Files
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            accept="image/*"
            style={{ display: 'none' }}
          />

          {!streamActive ? (
            <button onClick={startCamera} className="btn btn-primary btn-sm">
              <Video size={16} /> Open Camera
            </button>
          ) : (
            <button onClick={stopCamera} className="btn btn-danger btn-sm">
              <VideoOff size={16} /> Close Camera
            </button>
          )}
        </div>
      </div>

      {cameraError && (
        <div style={{
          background: 'rgba(196, 92, 92, 0.15)',
          border: '1px solid rgba(196, 92, 92, 0.3)',
          padding: '0.9rem',
          borderRadius: 'var(--border-radius-md)',
          color: '#ff9999',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          marginBottom: '1.5rem'
        }}>
          <AlertCircle size={18} />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Video Viewport */}
      {streamActive && (
        <div style={{
          position: 'relative',
          maxWidth: '560px',
          margin: '0 auto 1.5rem',
          borderRadius: 'var(--border-radius-lg)',
          overflow: 'hidden',
          border: '2px solid rgba(201, 162, 39, 0.4)',
          boxShadow: 'var(--shadow-glow)',
          background: '#000'
        }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: 'auto', display: 'block', transform: 'scaleX(-1)' }}
          />
          {/* Target Face Oval Guide */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '210px',
            height: '270px',
            border: '2px dashed rgba(201, 162, 39, 0.6)',
            borderRadius: '50%',
            pointerEvents: 'none',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.25)'
          }} />

          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <button
              onClick={captureFace}
              className="btn btn-primary"
              style={{
                borderRadius: '999px',
                padding: '0.75rem 1.8rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                fontWeight: 700
              }}
            >
              <Camera size={20} /> Capture Face
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Captured Faces Grid */}
      {capturedImages.length > 0 && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1.25rem',
          background: 'var(--input-bg)',
          borderRadius: 'var(--border-radius-md)',
          border: '1px solid var(--border-gold)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckCircle2 size={18} color="var(--primary)" />
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                Photos Ready for AI Analysis ({capturedImages.length})
              </span>
              {capturedImages.length >= 3 && (
                <span className="status-badge badge-active" style={{ fontSize: '0.7rem' }}>
                  Optimal Count
                </span>
              )}
            </div>
            <button onClick={clearAll} className="btn btn-outline btn-sm" style={{ color: 'var(--error)' }}>
              <Trash2 size={14} /> Clear All
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1.25rem'
          }}>
            {capturedImages.map((img, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: 'var(--border-radius-sm)',
                  overflow: 'hidden',
                  border: '1px solid rgba(201, 162, 39, 0.3)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <img
                  src={img.previewUrl}
                  alt={`Capture ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  onClick={() => removeCaptured(idx)}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.75)',
                    color: '#ff8585',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none'
                  }}
                  title="Remove"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleUpload}
            className="btn btn-primary"
            disabled={uploading}
            style={{ width: '100%', padding: '0.9rem' }}
          >
            {uploading ? (
              'Processing Embeddings with DeepFace...'
            ) : (
              <>
                <Sparkles size={18} /> Upload & Compute 512-D Face Vector ({capturedImages.length} photo{capturedImages.length > 1 ? 's' : ''})
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
