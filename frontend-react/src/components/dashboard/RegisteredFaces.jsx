import React, { useState, useEffect } from 'react';
import { photosApi } from '../../api/photos';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, Trash2, Calendar, ShieldCheck, RefreshCw } from 'lucide-react';

export const RegisteredFaces = ({ refreshTrigger }) => {
  const [faces, setFaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const { showToast } = useToast();
  const { refreshUserProfile } = useAuth();

  const fetchFaces = async () => {
    setLoading(true);
    try {
      const res = await photosApi.getMyFaces();
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
  }, [refreshTrigger]);

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

  const formatImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    // Strip leading slash if needed or point to backend
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `http://localhost:5001${cleanPath}`;
  };

  return (
    <div className="glass-card" style={{ padding: '2rem', marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <UserCheck size={20} color="#dfb94a" /> Registered Face Embeddings ({faces.length})
          </h3>
          <p style={{ color: 'var(--gray-light)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Your stored biometric face vectors used across event search queries.
          </p>
        </div>

        <button onClick={fetchFaces} className="btn btn-outline btn-sm" title="Refresh">
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--gray-light)' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem', width: 28, height: 28, border: '2px solid rgba(201,162,39,0.3)', borderTopColor: '#c9a227', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          Loading your registered faces...
        </div>
      ) : faces.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '2.5rem 1rem',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: 'var(--border-radius-md)',
          border: '1px dashed rgba(255, 255, 255, 0.1)'
        }}>
          <ShieldCheck size={40} color="var(--gray)" style={{ margin: '0 auto 1rem' }} />
          <h4 style={{ color: '#fff', marginBottom: '0.4rem' }}>No Faces Registered Yet</h4>
          <p style={{ color: 'var(--gray-light)', fontSize: '0.875rem', maxWidth: '400px', margin: '0 auto' }}>
            Use the camera or file uploader above to register at least 3 face photos.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1.25rem'
        }}>
          {faces.map((face) => (
            <div
              key={face.id}
              style={{
                background: 'rgba(20, 19, 18, 0.8)',
                border: '1px solid rgba(201, 162, 39, 0.2)',
                borderRadius: 'var(--border-radius-md)',
                overflow: 'hidden',
                position: 'relative',
                transition: 'transform var(--transition-fast)'
              }}
            >
              <div style={{ aspectRatio: '1', overflow: 'hidden', background: '#000' }}>
                <img
                  src={formatImageUrl(face.image_path)}
                  alt="Registered face"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=60';
                  }}
                />
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
          ))}
        </div>
      )}
    </div>
  );
};
