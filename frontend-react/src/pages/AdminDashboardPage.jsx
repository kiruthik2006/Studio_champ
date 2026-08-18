import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { StatsOverview } from '../components/admin/StatsOverview';
import { EventManager } from '../components/admin/EventManager';
import { BatchPhotoUploader } from '../components/admin/BatchPhotoUploader';
import { EventTypeManager } from '../components/admin/EventTypeManager';
import { UserManager } from '../components/admin/UserManager';
import { LiquidSidebarIndicator } from '../components/common/LiquidSidebarIndicator';
import { adminApi } from '../api/admin';
import {
  Shield,
  Calendar,
  Upload,
  Tag,
  Users,
  RefreshCw,
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('events');
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadSelectedEvent, setUploadSelectedEvent] = useState(null);

  const tabRefs = useRef({});

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, eventsRes, typesRes, usersRes] = await Promise.allSettled([
        adminApi.getStats(),
        adminApi.getEvents(),
        adminApi.getEventTypes(),
        adminApi.getUsers(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        setStats(statsRes.value.data);
      }

      if (eventsRes.status === 'fulfilled' && eventsRes.value?.data) {
        const rawEvents = eventsRes.value.data;
        const eventsList = Array.isArray(rawEvents)
          ? rawEvents
          : Array.isArray(rawEvents.events)
          ? rawEvents.events
          : [];
        setEvents(eventsList);
      } else {
        setEvents([]);
      }

      if (typesRes.status === 'fulfilled' && typesRes.value?.data) {
        const rawTypes = typesRes.value.data;
        const typesList = Array.isArray(rawTypes)
          ? rawTypes
          : Array.isArray(rawTypes.event_types)
          ? rawTypes.event_types
          : [];
        setEventTypes(typesList);
      } else {
        setEventTypes([]);
      }

      if (usersRes.status === 'fulfilled' && usersRes.value?.data) {
        const rawUsers = usersRes.value.data;
        const usersList = Array.isArray(rawUsers)
          ? rawUsers
          : Array.isArray(rawUsers.users)
          ? rawUsers.users
          : [];
        setUsers(usersList);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
      showToast('Error loading administrative data', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleSelectEventForUpload = (ev) => {
    setUploadSelectedEvent(ev);
    setActiveTab('uploader');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--dark)' }}>
      <Navbar />

      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-menu">
            <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#dfb94a', fontWeight: 700, fontSize: '0.9rem' }}>
              <Shield size={18} />
              <span>ADMINISTRATION</span>
            </div>

            {/* Liquid Water Drop Morphing Indicator */}
            <LiquidSidebarIndicator activeTab={activeTab} tabRefs={tabRefs} />

            <button
              ref={(el) => (tabRefs.current['events'] = el)}
              className={`sidebar-item ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              <Calendar size={18} />
              <span>Events & Photos</span>
            </button>

            <button
              ref={(el) => (tabRefs.current['uploader'] = el)}
              className={`sidebar-item ${activeTab === 'uploader' ? 'active' : ''}`}
              onClick={() => setActiveTab('uploader')}
            >
              <Upload size={18} />
              <span>Bulk Photo Ingestion</span>
            </button>

            <button
              ref={(el) => (tabRefs.current['categories'] = el)}
              className={`sidebar-item ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              <Tag size={18} />
              <span>Event Categories</span>
            </button>

            <button
              ref={(el) => (tabRefs.current['users'] = el)}
              className={`sidebar-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={18} />
              <span>User Directory</span>
            </button>

            {/* Google Photos Cloud Ingestion Direct Link */}
            <a
              href="/admin/cloud-ingestion"
              className="sidebar-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                color: 'var(--primary)',
                fontWeight: 600,
                marginTop: '0.5rem',
                border: '1px dashed var(--border-gold)',
                borderRadius: 'var(--border-radius-md)',
                padding: '0.65rem 0.85rem',
                textDecoration: 'none',
              }}
            >
              <Cloud size={18} />
              <span>Cloud Photos Vault</span>
            </a>
          </div>

          <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.8rem', color: 'var(--gray)' }}>
            Logged in as Admin ({user?.first_name || 'Admin'})
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="dashboard-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Shield size={26} color="var(--primary)" /> Control Center
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Manage events, batch ingestion, DeepFace AI embeddings, and users.
                </p>
              </div>

              <button
                onClick={fetchAdminData}
                className="btn btn-outline btn-sm"
                title="Refresh all metrics"
              >
                <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh Metrics
              </button>
            </div>

            {/* Metric Cards */}
            <StatsOverview stats={stats} />

            {/* Tab Content */}
            <div key={activeTab} className="tab-content-enter">
              {activeTab === 'events' && (
                <EventManager
                  events={events}
                  eventTypes={eventTypes}
                  onRefresh={fetchAdminData}
                  onSelectEventForUpload={handleSelectEventForUpload}
                />
              )}

              {activeTab === 'uploader' && (
                <BatchPhotoUploader
                  events={events}
                  selectedEvent={uploadSelectedEvent}
                  onUploadComplete={fetchAdminData}
                  onCancel={() => setActiveTab('events')}
                />
              )}

              {activeTab === 'categories' && (
                <EventTypeManager
                  eventTypes={eventTypes}
                  onRefresh={fetchAdminData}
                />
              )}

              {activeTab === 'users' && (
                <UserManager
                  users={users}
                  onRefresh={fetchAdminData}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
