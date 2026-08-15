import React, { useState } from 'react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../context/ToastContext';
import { Tag, Plus } from 'lucide-react';

export const EventTypeManager = ({ eventTypes = [], onRefresh }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { showToast } = useToast();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Category name is required', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await adminApi.createEventType({ name, description });
      showToast(`Category "${name}" created`, 'success');
      setName('');
      setDescription('');
      onRefresh();
    } catch (err) {
      showToast(err.message || 'Failed to create category', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const safeTypes = Array.isArray(eventTypes) ? eventTypes : [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
      {/* List */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Tag size={20} color="var(--primary)" /> Existing Categories ({safeTypes.length})
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {safeTypes.map((t) => (
            <div
              key={t.id}
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--border-gold)',
                padding: '1rem',
                borderRadius: 'var(--border-radius-md)'
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '1rem' }}>{t.name}</div>
              {t.description && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                  {t.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <Plus size={20} color="var(--primary)" /> Add New Category
        </h2>
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>Category Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Corporate Summit, Wedding, Concert"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Optional description of this event type..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {submitting ? 'Creating Category...' : 'Create Category'}
          </button>
        </form>
      </div>
    </div>
  );
};
