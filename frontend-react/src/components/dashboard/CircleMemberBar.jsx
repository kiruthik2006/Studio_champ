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
  isOpen = false,
  onClose,
}) => {
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Spouse');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const modalOpen = isOpen || internalModalOpen;
  const setModalOpen = (val) => {
    setInternalModalOpen(val);
    if (!val && onClose) onClose();
  };

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
    <>
      {members.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.2rem',
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
                    gap: '0.5rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '999px',
                    background: isSelected ? 'var(--card-bg-elevated)' : 'var(--card-bg)',
                    border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    userSelect: 'none',
                    flexShrink: 0,
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: isSelected ? 'var(--text-main)' : 'var(--text-muted)',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <span>{member.name}</span>
                  {faceCount > 0 && (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        padding: '0.05rem 0.35rem',
                        borderRadius: '999px',
                        background: isSelected ? 'var(--primary)' : 'var(--input-bg)',
                        color: isSelected ? '#000' : 'var(--text-muted)',
                        fontWeight: 700,
                      }}
                    >
                      {faceCount}
                    </span>
                  )}
                  {!member.is_self && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Remove ${member.name} from circle?`)) {
                          onDeleteMember(member.id);
                        }
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.1rem',
                      }}
                    >
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Circle Member Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add to Family & Friends Circle" size="sm">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Person's Name *
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Sarah, Dad, Uncle David"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Relationship
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.5rem' }}>
              {RELATIONSHIP_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setRelationship(opt.value)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--border-radius-sm)',
                    border: relationship === opt.value ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    background: relationship === opt.value ? 'rgba(201, 162, 39, 0.12)' : 'var(--input-bg)',
                    color: relationship === opt.value ? 'var(--primary)' : 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>{opt.icon}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opt.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Notes (Optional)
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Daughter, Maid of Honor"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline btn-sm">
              Cancel
            </button>
            <button type="submit" disabled={submitting || !name.trim()} className="btn btn-primary btn-sm">
              {submitting ? 'Adding...' : 'Add to Circle'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
