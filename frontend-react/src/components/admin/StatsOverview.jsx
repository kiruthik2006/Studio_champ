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
      color: '#6ed696',
    },
    {
      label: 'Indexed Photos',
      value: stats?.total_photos ?? 0,
      icon: ImageIcon,
      color: '#dfb94a',
    },
    {
      label: 'Face Matches Found',
      value: stats?.total_matches ?? 0,
      icon: Sparkles,
      color: '#a68520',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1.25rem',
      marginBottom: '2rem'
    }}>
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="glass-card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid rgba(201, 162, 39, 0.2)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--gray-light)', marginBottom: '0.25rem' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                {item.value.toLocaleString()}
              </div>
            </div>

            <div style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--border-radius-md)',
              background: 'rgba(201, 162, 39, 0.12)',
              border: '1px solid rgba(201, 162, 39, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: item.color
            }}>
              <Icon size={24} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
