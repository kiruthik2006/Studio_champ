import React, { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle2, RotateCcw, Sparkles, ChevronRight, X, AlertCircle, ArrowRight, ShieldCheck, SunMedium } from 'lucide-react';
import { photosApi } from '../../api/photos';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { analyzeImageQuality } from '../../utils/imageDiagnostics';

const JOURNEY_STEPS = [
  {
    id: 'front',
    title: 'Front Facing',
    subtitle: 'Look directly at the camera with a neutral expression',
    icon: '👤',
    prompt: 'Keep your head straight and look at the dot',
  },
  {
    id: 'left',
    title: 'Turn Left (30°)',
    subtitle: 'Gently turn your head slightly to your left',
    icon: '👈',
    prompt: 'Turn your head slightly to the left side',
  },
  {
    id: 'right',
    title: 'Turn Right (30°)',
    subtitle: 'Gently turn your head slightly to your right',
    icon: '👉',
    prompt: 'Turn your head slightly to the right side',
  },
  {
    id: 'smile',
    title: 'Big Smile!',
    subtitle: 'Give us a bright, natural smile for candid party moments',
    icon: '😄',
    prompt: 'Smile naturally as if reacting to a great photo!',
  },
];

export const GuidedCaptureJourneyModal = ({ isOpen, onClose, member, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [capturedSteps, setCapturedSteps] = useState({});
  const [mediaStream, setMediaStream] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [autoProgress, setAutoProgress] = useState(true);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const countdownTimerRef = useRef(null);

  const { showToast } = useToast();
  const { refreshUserProfile } = useAuth();

  const memberName = member?.name || 'Your';
  const currentStep = JOURNEY_STEPS[currentStepIndex];

  // Start live webcam when modal opens
  useEffect(() => {
    if (isOpen && !isReviewMode) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, isReviewMode]);

  // Bind video element stream
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch((err) => console.warn('Video play issue:', err));
    }
  }, [mediaStream, currentStepIndex]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setMediaStream(stream);
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Camera access unavailable or blocked. Please allow permissions in your browser.');
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
  };

  // Trigger automated 3-2-1 countdown for hands-free journey
  const startCountdown = () => {
    if (countdown !== null) return;
    setCountdown(3);

    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
          captureCurrentFrame();
          return null;
        }
        return prev - 1;
      });
    }, 900);
  };

  // Capture frame from video
  const captureCurrentFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    if (!video.videoWidth || !video.videoHeight || video.readyState < 2) {
      showToast('Camera is warming up, please try in a second', 'warning');
      return;
    }

    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Analyze lighting and diagnostics on canvas image
    const diagnostics = analyzeImageQuality(canvas);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `journey_${currentStep.id}_${Date.now()}.jpg`, { type: 'image/jpeg' });
        const previewUrl = URL.createObjectURL(blob);

        const updated = {
          ...capturedSteps,
          [currentStep.id]: {
            step: currentStep,
            file,
            previewUrl,
            diagnostics,
          },
        };
        setCapturedSteps(updated);

        // Advance to next step or review mode
        if (currentStepIndex < JOURNEY_STEPS.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsReviewMode(true);
        }
      },
      'image/jpeg',
      0.95
    );
  };

  // Retake a specific step from review mode
  const handleRetakeStep = (stepIndex) => {
    setCurrentStepIndex(stepIndex);
    setIsReviewMode(false);
  };

  // Submit all 4 journey photos to backend DeepFace ArcFace
  const handleSubmitJourney = async () => {
    const stepKeys = Object.keys(capturedSteps);
    if (stepKeys.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      if (member?.id) {
        formData.append('member_id', member.id);
      }

      stepKeys.forEach((key) => {
        const item = capturedSteps[key];
        formData.append('faces', item.file);
        formData.append('angle_slot', key);
      });

      const res = await photosApi.uploadFaces(formData);
      showToast(res.message || `Biometric journey completed for ${memberName}!`, 'success');
      await refreshUserProfile();
      if (onComplete) onComplete();
      handleClose();
    } catch (err) {
      showToast(err.message || 'Failed to process biometric vectors', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    stopCamera();
    Object.values(capturedSteps).forEach((s) => s.previewUrl && URL.revokeObjectURL(s.previewUrl));
    setCapturedSteps({});
    setCurrentStepIndex(0);
    setIsReviewMode(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(10, 9, 8, 0.88)',
        backdropFilter: 'blur(12px)',
        padding: '1rem',
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 'var(--border-radius-lg)',
          border: '1px solid var(--border-gold)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
          background: 'var(--card-bg-elevated)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--card-bg)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 700, margin: 0 }}>
                Biometric Enrollment Journey: <span className="gold-text">{memberName}</span>
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
              4-Step Guided DeepFace Calibration for 99.4% Match Accuracy
            </p>
          </div>

          <button
            onClick={handleClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.3rem',
              borderRadius: '50%',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Journey Progress Steps Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem',
            padding: '0.85rem 1.75rem',
            background: 'var(--input-bg)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {JOURNEY_STEPS.map((step, idx) => {
            const isCompleted = !!capturedSteps[step.id];
            const isCurrent = idx === currentStepIndex && !isReviewMode;

            return (
              <div
                key={step.id}
                onClick={() => {
                  if (isCompleted || isReviewMode) {
                    setCurrentStepIndex(idx);
                    setIsReviewMode(false);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.5rem',
                  borderRadius: '6px',
                  background: isCurrent ? 'var(--badge-gold-bg)' : 'transparent',
                  border: isCurrent ? '1px solid var(--primary)' : '1px solid transparent',
                  cursor: isCompleted ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: isCompleted ? '#48bb78' : isCurrent ? 'var(--primary)' : 'var(--card-bg)',
                    color: isCompleted || isCurrent ? '#121110' : 'var(--text-muted)',
                  }}
                >
                  {isCompleted ? <CheckCircle2 size={13} color="#fff" /> : idx + 1}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: isCurrent ? 700 : 500,
                      color: isCurrent ? 'var(--primary)' : isCompleted ? 'var(--text-main)' : 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {step.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content: Guided Live Capture or Review Summary */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1.75rem' }}>
          {!isReviewMode ? (
            /* Live Guided Capture View */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Step Instruction Card */}
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.78rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 700,
                    color: 'var(--primary)',
                  }}
                >
                  Step {currentStepIndex + 1} of 4 • {currentStep.title}
                </span>
                <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginTop: '0.2rem', marginBottom: '0.3rem' }}>
                  {currentStep.prompt}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  {currentStep.subtitle}
                </p>
              </div>

              {/* Video Frame with Face Oval Guide */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '460px',
                  aspectRatio: '4/3',
                  borderRadius: 'var(--border-radius-lg)',
                  overflow: 'hidden',
                  background: '#000',
                  border: '2px solid rgba(201, 162, 39, 0.5)',
                  boxShadow: '0 0 30px rgba(0, 0, 0, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                />

                {/* Oval Face Silhouette Guide */}
                <div
                  style={{
                    position: 'absolute',
                    width: '190px',
                    height: '240px',
                    borderRadius: '50%',
                    border: '2px dashed rgba(201, 162, 39, 0.7)',
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.3)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Animated Scanning Beam */}
                <div
                  style={{
                    position: 'absolute',
                    width: '180px',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
                    animation: 'pulse 1.8s infinite',
                    pointerEvents: 'none',
                  }}
                />

                {/* Countdown Overlay */}
                {countdown !== null && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10,
                    }}
                  >
                    <div
                      style={{
                        fontSize: '5rem',
                        fontWeight: 900,
                        color: 'var(--primary)',
                        textShadow: '0 0 30px rgba(201, 162, 39, 0.8)',
                      }}
                    >
                      {countdown}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Controls */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', width: '100%', maxWidth: '460px' }}>
                <button
                  onClick={startCountdown}
                  disabled={countdown !== null}
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Sparkles size={16} /> 3s Auto-Timer
                </button>

                <button
                  onClick={captureCurrentFrame}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Camera size={18} /> Capture Now
                </button>
              </div>
            </div>
          ) : (
            /* Review & Vector Health Diagnostics View */
            <div>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(72, 187, 120, 0.15)',
                    color: '#48bb78',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem',
                  }}
                >
                  <ShieldCheck size={28} />
                </div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)', margin: 0 }}>
                  Journey Completed for <span className="gold-text">{memberName}</span>!
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  Review your 4-angle biometric calibration before saving into your vector vault.
                </p>
              </div>

              {/* 4 Angle Review Cards with Lighting / Sharpness Diagnostics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
                {JOURNEY_STEPS.map((step, idx) => {
                  const data = capturedSteps[step.id];
                  const diag = data?.diagnostics || { status: 'good', issue: 'Optimal', score: 95 };

                  return (
                    <div
                      key={step.id}
                      style={{
                        background: 'var(--input-bg)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--border-radius-md)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <div style={{ position: 'relative', aspectRatio: '1', background: '#000' }}>
                        {data?.previewUrl ? (
                          <img src={data.previewUrl} alt={step.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                            No Image
                          </div>
                        )}

                        <span
                          style={{
                            position: 'absolute',
                            top: '4px',
                            left: '4px',
                            background: 'rgba(0,0,0,0.75)',
                            color: '#fff',
                            fontSize: '0.65rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: 600,
                          }}
                        >
                          {step.title}
                        </span>
                      </div>

                      <div style={{ padding: '0.6rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: diag.status === 'poor' ? '#f56565' : diag.status === 'warning' ? '#ecc94b' : '#48bb78', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <SunMedium size={11} /> {diag.issue || 'Good Lighting'}
                          </div>
                        </div>

                        <button
                          onClick={() => handleRetakeStep(idx)}
                          className="btn btn-outline btn-sm"
                          style={{ marginTop: '0.5rem', padding: '0.2rem 0.4rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                        >
                          <RotateCcw size={10} /> Retake
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Primary Submit Button */}
              <button
                onClick={handleSubmitJourney}
                disabled={uploading}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                }}
              >
                {uploading ? (
                  <>
                    <div className="spinner" style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    Generating 512-D ArcFace Biometrics...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Enroll Biometric Vault (99.4% Accuracy Ready)
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};
