import React from 'react';
import { Users, User, Filter, Sparkles, Check, CheckSquare, Square, Sliders } from 'lucide-react';

export const MultiPersonFilterBar = ({
  members = [],
  selectedMemberIds = [],
  onToggleMember,
  onSelectAllMembers,
  onClearMembers,
  matchMode = 'ANY',
  onChangeMatchMode,
  threshold = 0.50,
  onChangeThreshold,
  onSearch,
  isSearching = false,
}) => {
  return (
    <div
      className="glass-card"
      style={{
        padding: '1.25rem 1.5rem',
        marginBottom: '1.75rem',
        border: '1px solid var(--border-gold)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Users size={18} color="var(--primary)" />
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
            MULTI-PERSON SEARCH FILTERS
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            ({selectedMemberIds.length} of {members.length} selected)
          </span>
        </div>

        {/* Quick select buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem' }}>
          <button
            onClick={onSelectAllMembers}
            className="btn btn-outline btn-sm"
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
          >
            Select All
          </button>
          <button
            onClick={onClearMembers}
            className="btn btn-outline btn-sm"
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Member Selection Chips */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {members.map((member) => {
          const isSelected = selectedMemberIds.includes(member.id);
          const faceCount = member.face_count || member.faces?.length || 0;

          return (
            <div
              key={member.id}
              onClick={() => onToggleMember(member.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '999px',
                background: isSelected ? 'var(--badge-gold-bg)' : 'var(--input-bg)',
                border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                userSelect: 'none',
                fontWeight: isSelected ? 700 : 500,
                fontSize: '0.85rem',
                transition: 'all var(--transition-fast)',
              }}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isSelected ? 'var(--primary)' : 'transparent',
                  border: isSelected ? 'none' : '1.5px solid var(--text-muted)',
                  color: '#121110',
                }}
              >
                {isSelected && <Check size={12} strokeWidth={3} />}
              </div>

              <span>{member.name}</span>
              {faceCount === 0 && (
                <span style={{ fontSize: '0.7rem', color: '#ff9999' }}>(No faces)</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Boolean Match Mode & Action Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '0.9rem',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        {/* Match Mode Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Search Mode:
          </span>

          <div
            style={{
              display: 'inline-flex',
              background: 'var(--input-bg)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '2px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              onClick={() => onChangeMatchMode('ANY')}
              style={{
                padding: '0.35rem 0.75rem',
                border: 'none',
                borderRadius: '4px',
                background: matchMode === 'ANY' ? 'var(--primary)' : 'transparent',
                color: matchMode === 'ANY' ? '#121110' : 'var(--text-muted)',
                fontWeight: matchMode === 'ANY' ? 700 : 500,
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              title="Return photos with ANY of the selected people"
            >
              👤 Any of Us (OR)
            </button>

            <button
              onClick={() => onChangeMatchMode('ALL')}
              style={{
                padding: '0.35rem 0.75rem',
                border: 'none',
                borderRadius: '4px',
                background: matchMode === 'ALL' ? 'var(--primary)' : 'transparent',
                color: matchMode === 'ALL' ? '#121110' : 'var(--text-muted)',
                fontWeight: matchMode === 'ALL' ? 700 : 500,
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              title="Only return photos where ALL selected people appear together"
            >
              👥 All Together (AND)
            </button>

            <button
              onClick={() => onChangeMatchMode('SOLO')}
              style={{
                padding: '0.35rem 0.75rem',
                border: 'none',
                borderRadius: '4px',
                background: matchMode === 'SOLO' ? 'var(--primary)' : 'transparent',
                color: matchMode === 'SOLO' ? '#121110' : 'var(--text-muted)',
                fontWeight: matchMode === 'SOLO' ? 700 : 500,
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              title="Focus on individual solo shots"
            >
              🎯 Solo Only
            </button>
          </div>
        </div>

        {/* Search Action */}
        {onSearch && (
          <button
            onClick={onSearch}
            disabled={isSearching || selectedMemberIds.length === 0}
            className="btn btn-primary btn-sm"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
          >
            {isSearching ? (
              'Scanning Faces...'
            ) : (
              <>
                <Sparkles size={15} /> Run Multi-Person AI Match
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
