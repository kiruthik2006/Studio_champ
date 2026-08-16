import React, { useState, useEffect } from 'react';
import { photosApi } from '../../api/photos';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { formatImageUrl } from '../../utils/imageUrl';
import { UserCheck, Trash2, Calendar, ShieldCheck, RefreshCw, User, Tag, Sparkles } from 'lucide-react';

const SLOT_LABELS = {
  front: { label: 'Front Facing', icon: '👤' },
  left: { label: 'Left 30°', icon: '👈' },
  right: { label: 'Right 30°', icon: '👉' },
  smile: { label: 'Smile', icon: '😄' },
  custom: { label: 'Custom', icon: '📷' },
};

export const RegisteredFaces = ({ memberId = null, memberName = 'All Profiles', refreshTrigger }) => {
  const [faces, setFaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const { showToast } = useToast();
  const { refreshUserProfile } = useAuth();

  const fetchFaces = async () => {
    setLoading(true);
    try {
      const res = await photosApi.getMyFaces(memberId);
      if (res?.data) {
        setFaces(res.data);
      }
    } catch (err) {
      console.error('Failed to load faces:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaces();
  }, [memberId, refreshTrigger]);

  const handleDelete = async (faceId) => {
    if (!window.confirm('Are you sure you want to delete this face embedding? You may need to re-upload to maintain match accuracy.')) {
      return;
    }

    setDeletingId(faceId);
    try {
      await photosApi.deleteFace(faceId);
      showToast('Face embedding removed', 'success');
      setFaces((prev) => prev.filter((f) => f.id !== faceId));
      await refreshUserProfile();
    } catch (err) {
      showToast(err.message || 'Failed to delete face embedding', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '2rem', marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <UserCheck size={20} color="var(--primary)" />
            <span>Registered Faces: <span className="gold-text">{memberName}</span></span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>({faces.length})</span>
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Stored 512-D neural biometric vectors used across event search queries.
          </p>
        </div>

        <button onClick={fetchFaces} className="btn btn-outline btn-sm" title="Refresh">
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem', width: 28, height: 28, border: '2px solid rgba(201,162,39,0.3)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          Loading registered faces...
        </div>
      ) : faces.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '2.5rem 1rem',
          background: 'var(--input-bg)',
          borderRadius: 'var(--border-radius-md)',
          border: '1px dashed var(--border-gold)'
        }}>
          <ShieldCheck size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h4 style={{ color: 'var(--text-main)', marginBottom: '0.4rem' }}>No Faces Registered for {memberName}</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '400px', margin: '0 auto' }}>
            Use the camera above to capture the 4 smart angle slots for this person.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1.25rem'
        }}>
          {faces.map((face) => {
            const slotInfo = SLOT_LABELS[face.angle_slot] || SLOT_LABELS.front;

            return (
              <div
                key={face.id}
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: 'var(--border-radius-md)',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'transform var(--transition-fast)'
                }}
              >
                <div style={{ aspectRatio: '1', overflow: 'hidden', background: '#18181b', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src={formatImageUrl(face.image_path)}
                    alt="Registered face"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.parentElement) {
                        e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-size:0.8rem;">Image unavailable</div>';
                      }
                    }}
                  />

                  {/* Angle Slot Pill */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '6px',
                      left: '6px',
                      background: 'rgba(0, 0, 0, 0.75)',
                      backdropFilter: 'blur(4px)',
                      color: 'var(--primary)',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <span>{slotInfo.icon}</span> {slotInfo.label}
                  </span>

                  {face.member_name && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '6px',
                        left: '6px',
                        background: 'rgba(201, 162, 39, 0.85)',
                        color: '#121110',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      {face.member_name}
                    </span>
                  )}
                </div>

                <div style={{ padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--gray-light)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={12} /> {face.created_at ? new Date(face.created_at).toLocaleDateString() : 'Active'}
                    </span>
                    {face.is_primary && (
                      <span className="status-badge badge-gold" style={{ fontSize: '0.65rem' }}>Primary</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(face.id)}
                    disabled={deletingId === face.id}
                    className="btn btn-danger btn-sm"
                    style={{ width: '100%', marginTop: '0.75rem', fontSize: '0.78rem', padding: '0.35rem 0.6rem' }}
                  >
                    <Trash2 size={12} /> {deletingId === face.id ? 'Deleting...' : 'Delete Face'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
