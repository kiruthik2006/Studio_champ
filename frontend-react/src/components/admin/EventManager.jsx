import React, { useState } from 'react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';
import { Plus, Edit, Trash2, Calendar, MapPin, Upload, RefreshCw, Sparkles, Image as ImageIcon } from 'lucide-react';

export const EventManager = ({
  events,
  eventTypes,
  onRefresh,
  onSelectEventForUpload,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    event_type_id: '',
    event_date: '',
    location: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [reprocessingId, setReprocessingId] = useState(null);

  const { showToast } = useToast();

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormData({
      name: '',
      event_type_id: eventTypes[0]?.id || '',
      event_date: '',
      location: '',
      description: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (ev) => {
    setEditingEvent(ev);
    setFormData({
      name: ev.name || '',
      event_type_id: ev.event_type_id || '',
      event_date: ev.event_date ? ev.event_date.split('T')[0] : '',
      location: ev.location || '',
      description: ev.description || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Event name is required', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      if (editingEvent) {
        await adminApi.updateEvent(editingEvent.id, formData);
        showToast('Event updated successfully', 'success');
      } else {
        await adminApi.createEvent(formData);
        showToast('New event created successfully', 'success');
      }
      setModalOpen(false);
      onRefresh();
    } catch (err) {
      showToast(err.message || 'Failed to save event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event and all its indexed photos?')) {
      return;
    }

    try {
      await adminApi.deleteEvent(eventId);
      showToast('Event deleted', 'success');
      onRefresh();
    } catch (err) {
      showToast(err.message || 'Failed to delete event', 'error');
    }
  };

  const handleReprocess = async (eventId) => {
    setReprocessingId(eventId);
    try {
      const res = await adminApi.reprocessEvent(eventId);
      showToast(res.message || 'Event photos re-processed for face embeddings', 'success');
      onRefresh();
    } catch (err) {
      showToast(err.message || 'Failed to reprocess event', 'error');
    } finally {
      setReprocessingId(null);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Calendar size={20} color="#dfb94a" /> Event Management ({events.length})
          </h2>
          <p style={{ color: 'var(--gray-light)', fontSize: '0.85rem' }}>
            Create events and manage photo galleries for facial recognition scanning.
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-primary btn-sm">
          <Plus size={16} /> Create Event
        </button>
      </div>

      {events.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: 'var(--border-radius-md)',
          border: '1px dashed rgba(255,255,255,0.1)',
        }}>
          <Calendar size={40} color="var(--gray)" style={{ margin: '0 auto 0.75rem' }} />
          <h4 style={{ color: '#fff', marginBottom: '0.3rem' }}>No Events Created</h4>
          <p style={{ color: 'var(--gray-light)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Get started by creating your first event.
          </p>
          <button onClick={handleOpenCreate} className="btn btn-primary btn-sm">
            <Plus size={14} /> Create Event
          </button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Category</th>
                <th>Date & Location</th>
                <th>Photos</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
                      {ev.name}
                    </div>
                    {ev.description && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--gray-light)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ev.description}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className="status-badge badge-gold" style={{ fontSize: '0.7rem' }}>
                      {ev.event_type || 'General'}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: '#fff' }}>
                      {ev.event_date ? new Date(ev.event_date).toLocaleDateString() : 'N/A'}
                    </div>
                    {ev.location && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={11} /> {ev.location}
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#dfb94a', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <ImageIcon size={14} /> {ev.photo_count || 0}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${ev.is_active ? 'badge-active' : 'badge-inactive'}`}>
                      {ev.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => onSelectEventForUpload(ev)}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                        title="Upload photos to event"
                      >
                        <Upload size={13} /> Upload
                      </button>

                      <button
                        onClick={() => handleReprocess(ev.id)}
                        disabled={reprocessingId === ev.id || !ev.photo_count}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                        title="Reprocess all face embeddings"
                      >
                        <RefreshCw size={13} className={reprocessingId === ev.id ? 'spin' : ''} />
                      </button>

                      <button
                        onClick={() => handleOpenEdit(ev)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                        title="Edit event details"
                      >
                        <Edit size={13} />
                      </button>

                      <button
                        onClick={() => handleDelete(ev.id)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                        title="Delete event"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEvent ? 'Edit Event' : 'Create New Event'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Annual Tech Gala 2026"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Event Category</label>
              <select
                className="form-control"
                value={formData.event_type_id}
                onChange={(e) => setFormData({ ...formData, event_type_id: e.target.value })}
              >
                <option value="">Select Category</option>
                {eventTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Event Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Location / Venue</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Grand Ballroom, Beverly Hills"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Provide event details or photographer instructions..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={submitting}
          >
            {submitting ? 'Saving Event...' : editingEvent ? 'Update Event' : 'Create Event'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
