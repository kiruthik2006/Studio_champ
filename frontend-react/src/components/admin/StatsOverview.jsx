import React from 'react';
import { Users, Calendar, Image as ImageIcon, Sparkles } from 'lucide-react';

export const StatsOverview = ({ stats }) => {
  const statItems = [
    {
      label: 'Total Users',
      value: stats?.total_users ?? 0,
      icon: Users,
      color: '#dfb94a',
    },
    {
      label: 'Total Events',
      value: stats?.total_events ?? 0,
      icon: Calendar,
      color: '#10b981',
    },
    {
      label: 'Indexed Photos',
      value: stats?.total_photos ?? 0,
      icon: ImageIcon,
      color: '#f59e0b',
    },
    {
      label: 'Face Matches Found',
      value: stats?.total_matches ?? 0,
      icon: Sparkles,
      color: '#8b5cf6',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.25rem',
      marginBottom: '2rem',
      contain: 'layout style',
    }}>
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="glass-card"
            style={{
              padding: '1.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid var(--border-gold)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 500 }}>
                {item.label}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                {item.value.toLocaleString()}
              </div>
            </div>

            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(201, 162, 39, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.color,
                border: '1px solid rgba(201, 162, 39, 0.2)',
                flexShrink: 0,
              }}
            >
              <Icon size={20} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
