import React, { useState } from 'react';
import { User, Users, Plus, Trash2, Edit2, Shield, Heart, Smile } from 'lucide-react';
import { Modal } from '../common/Modal';

const RELATIONSHIP_OPTIONS = [
  { value: 'Spouse', label: 'Partner / Spouse', icon: '💍' },
  { value: 'Child', label: 'Child (Son / Daughter)', icon: '👶' },
  { value: 'Parent', label: 'Parent (Mom / Dad)', icon: '👵' },
  { value: 'Sibling', label: 'Sibling (Brother / Sister)', icon: '👫' },
  { value: 'Friend', label: 'Close Friend', icon: '🌟' },
  { value: 'VIP', label: 'VIP / Guest of Honor', icon: '👑' },
  { value: 'Family', label: 'Other Family Member', icon: '🏠' },
];

export const CircleMemberBar = ({
  members = [],
  selectedMemberId,
  onSelectMember,
  onCreateMember,
  onDeleteMember,
  loading = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Spouse');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      await onCreateMember({
        name: name.trim(),
        relationship,
        notes: notes.trim(),
      });
      setName('');
      setNotes('');
      setModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const getRelationBadge = (rel, isSelf) => {
    if (isSelf) return { label: 'Self', color: 'var(--primary)', bg: 'rgba(201, 162, 39, 0.15)' };
    switch (rel) {
      case 'Spouse': return { label: 'Partner', color: '#ff6b8b', bg: 'rgba(255, 107, 139, 0.15)' };
      case 'Child': return { label: 'Child', color: '#68d391', bg: 'rgba(104, 211, 145, 0.15)' };
      case 'Parent': return { label: 'Parent', color: '#63b3ed', bg: 'rgba(99, 179, 237, 0.15)' };
      case 'VIP': return { label: 'VIP', color: '#f6ad55', bg: 'rgba(246, 173, 85, 0.15)' };
      default: return { label: rel || 'Family', color: 'var(--text-muted)', bg: 'rgba(255, 255, 255, 0.08)' };
    }
  };

  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={18} color="var(--primary)" />
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', letterSpacing: '0.02em' }}>
            FAMILY & FRIENDS CIRCLE
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            ({members.length} {members.length === 1 ? 'Person' : 'People'})
          </span>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn btn-outline btn-sm"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={14} /> Add Person to Circle
        </button>
      </div>

      {/* Circle Member Badges / Selector */}
      <div
        style={{
          display: 'flex',
          gap: '0.65rem',
          overflowX: 'auto',
          paddingBottom: '0.4rem',
          scrollbarWidth: 'none',
        }}
      >
        {members.map((member) => {
          const isSelected = member.id === selectedMemberId;
          const badge = getRelationBadge(member.relationship, member.is_self);
          const faceCount = member.face_count || member.faces?.length || 0;

          return (
            <div
              key={member.id}
              onClick={() => onSelectMember(member.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.5rem 0.9rem',
                borderRadius: 'var(--border-radius-md)',
                background: isSelected ? 'var(--card-bg-elevated)' : 'var(--card-bg)',
                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                boxShadow: isSelected ? 'var(--shadow-glow)' : 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                userSelect: 'none',
                flexShrink: 0,
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isSelected ? 'var(--primary)' : 'var(--input-bg)',
                  color: isSelected ? '#121110' : 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                {member.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: isSelected ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    {member.name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '999px',
                      color: badge.color,
                      background: badge.bg,
                      fontWeight: 600,
                    }}
                  >
                    {badge.label}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                  {faceCount} {faceCount === 1 ? 'Face Photo' : 'Face Photos'}
                </div>
              </div>

              {!member.is_self && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Remove ${member.name} from your circle?`)) {
                      onDeleteMember(member.id);
                    }
                  }}
                  title="Remove person"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.2rem',
                    marginLeft: '0.2rem',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Circle Member Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Person to Your Circle">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
            Register your family members, partner, children, or friends. Once added, you can capture their face photos to search event galleries together or individually!
          </p>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Full Name or Nickname *
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Sarah, Leo (Son), Grandma Mary"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Relationship / Role
            </label>
            <select
              className="form-control"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
            >
              {RELATIONSHIP_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.icon} {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Notes (Optional)
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Wears glasses sometimes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="btn btn-primary"
            >
              {submitting ? 'Adding...' : 'Create Person Profile'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
