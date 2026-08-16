import React, { useState, useRef, useEffect } from 'react';
import { Camera, Video, VideoOff, Upload, Trash2, CheckCircle2, Sparkles, AlertCircle, Smile, Check } from 'lucide-react';
import { photosApi } from '../../api/photos';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const SMART_SLOTS = [
  { id: 'front', title: 'Front Facing', subtitle: 'Look directly into camera', icon: '👤' },
  { id: 'left', title: 'Slight Left', subtitle: 'Turn ~30° to your left', icon: '👈' },
  { id: 'right', title: 'Slight Right', subtitle: 'Turn ~30° to your right', icon: '👉' },
  { id: 'smile', title: 'Big Smile', subtitle: 'Natural smile for candids', icon: '😄' },
];

export const CameraCapture = ({ member, onFacesUploaded }) => {
  const [streamActive, setStreamActive] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [activeSlot, setActiveSlot] = useState('front');
  const [uploading, setUploading] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const { showToast } = useToast();
  const { refreshUserProfile } = useAuth();

  const memberName = member?.name || 'Your';

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
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaStream]);

  // Determine next incomplete slot
  const getNextIncompleteSlot = (currentCaptured) => {
    const filledSlots = currentCaptured.map((c) => c.slot);
    const next = SMART_SLOTS.find((s) => !filledSlots.includes(s.id));
    return next ? next.id : 'front';
  };

  // Capture face snapshot from video feed for current slot
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
        const currentSlotObj = SMART_SLOTS.find((s) => s.id === activeSlot) || SMART_SLOTS[0];
        const file = new File([blob], `face_${activeSlot}_${Date.now()}.jpg`, { type: 'image/jpeg' });
        const previewUrl = URL.createObjectURL(blob);

        const newCaptured = [
          ...capturedImages.filter((c) => c.slot !== activeSlot),
          { file, previewUrl, slot: activeSlot, slotTitle: currentSlotObj.title },
        ];

        setCapturedImages(newCaptured);
        showToast(`Captured ${currentSlotObj.title}!`, 'success');

        // Automatically advance to the next unfilled slot
        setActiveSlot(getNextIncompleteSlot(newCaptured));
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

    const newItems = validFiles.map((file, idx) => {
      const slotIndex = (capturedImages.length + idx) % SMART_SLOTS.length;
      const slotObj = SMART_SLOTS[slotIndex];
      return {
        file,
        previewUrl: URL.createObjectURL(file),
        slot: slotObj.id,
        slotTitle: slotObj.title,
      };
    });

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

  // Submit all photos to DeepFace embedding endpoint for current member
  const handleUpload = async () => {
    if (capturedImages.length === 0) {
      showToast('Please capture or select at least 1 photo', 'warning');
      return;
    }

    const formData = new FormData();
    if (member?.id) {
      formData.append('member_id', member.id);
    }
    capturedImages.forEach((item) => {
      formData.append('faces', item.file);
      formData.append('angle_slot', item.slot);
    });

    setUploading(true);
    try {
      const res = await photosApi.uploadFaces(formData);
      showToast(res.message || `Faces registered for ${memberName}!`, 'success');
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

  const slotsCompletedCount = SMART_SLOTS.filter((s) =>
    capturedImages.some((c) => c.slot === s.id)
  ).length;
  const progressPercent = Math.min(100, Math.round((slotsCompletedCount / SMART_SLOTS.length) * 100));

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={22} color="var(--primary)" /> Face Biometrics: <span className="gold-text">{memberName}</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Complete the 4 smart angle slots below for maximum 512-D DeepFace ArcFace accuracy.
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

      {/* Guided Smart Angle Slots Grid */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Guided Smart Slots ({slotsCompletedCount}/4 Completed)
          </span>
          <span style={{ fontSize: '0.8rem', color: progressPercent === 100 ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600 }}>
            {progressPercent === 100 ? '✨ 99.4% AI Accuracy' : `${progressPercent}% Filled`}
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '6px', background: 'var(--input-bg)', borderRadius: '999px', overflow: 'hidden', marginBottom: '1rem' }}>
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--primary) 0%, #dfb94a 100%)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* 4 Slot Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {SMART_SLOTS.map((slot) => {
            const captured = capturedImages.find((c) => c.slot === slot.id);
            const isCurrent = activeSlot === slot.id;

            return (
              <div
                key={slot.id}
                onClick={() => setActiveSlot(slot.id)}
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--border-radius-md)',
                  background: isCurrent ? 'var(--card-bg-elevated)' : 'var(--input-bg)',
                  border: isCurrent
                    ? '2px solid var(--primary)'
                    : captured
                    ? '1px solid rgba(201, 162, 39, 0.4)'
                    : '1px solid var(--border-subtle)',
                  boxShadow: isCurrent ? 'var(--shadow-glow)' : 'none',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  position: 'relative',
                }}
              >
                {captured ? (
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)', flexShrink: 0 }}>
                    <img src={captured.previewUrl} alt={slot.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                    {slot.icon}
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: isCurrent ? 'var(--primary)' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>{slot.title}</span>
                    {captured && <CheckCircle2 size={13} color="var(--primary)" />}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {slot.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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

          {/* Current Angle Instruction Banner */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            padding: '0.4rem 1rem',
            borderRadius: '999px',
            border: '1px solid var(--border-gold)',
            color: 'var(--primary)',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}>
            <span>Slot: {SMART_SLOTS.find((s) => s.id === activeSlot)?.title}</span>
          </div>

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
                boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.4rem'
              }}
            >
              <Camera size={18} /> Capture {SMART_SLOTS.find((s) => s.id === activeSlot)?.title}
            </button>
          </div>
        </div>
      )}

      {/* Hidden Canvas for Frame Capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Upload Staging Gallery */}
      {capturedImages.length > 0 && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          background: 'var(--input-bg)',
          borderRadius: 'var(--border-radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} color="var(--primary)" />
              Photos Ready for AI Analysis ({capturedImages.length})
            </h3>
            <button onClick={clearAll} className="btn btn-outline btn-sm" style={{ color: 'var(--error)' }}>
              <Trash2 size={14} /> Clear All
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            {capturedImages.map((item, index) => (
              <div
                key={index}
                style={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: 'var(--border-radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-gold)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <img
                  src={item.previewUrl}
                  alt={`Capture ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                <span style={{
                  position: 'absolute',
                  bottom: '4px',
                  left: '4px',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 600,
                }}>
                  {item.slotTitle || `Photo ${index + 1}`}
                </span>

                <button
                  onClick={() => removeCaptured(index)}
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    background: 'rgba(0,0,0,0.65)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ff6b6b',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem' }}
          >
            {uploading ? (
              <>
                <div className="spinner" style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                Extracting 512-D ArcFace Biometrics for {memberName}...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Upload & Compute 512-D Face Vector ({capturedImages.length} {capturedImages.length === 1 ? 'photo' : 'photos'})
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
