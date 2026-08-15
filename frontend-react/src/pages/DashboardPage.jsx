import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { CameraCapture } from '../components/dashboard/CameraCapture';
import { RegisteredFaces } from '../components/dashboard/RegisteredFaces';
import { EventCard } from '../components/dashboard/EventCard';
import { PhotoGallery } from '../components/dashboard/PhotoGallery';
import { photosApi } from '../api/photos';
import confetti from 'canvas-confetti';
import {
  UserPlus,
  Calendar,
  Images,
  Settings,
  Shield,
  Search,
  Key,
  User as UserIcon,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, updateProfile, refreshUserProfile } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('face-registration');
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsSearchQuery, setEventsSearchQuery] = useState('');
  const [searchingEventId, setSearchingEventId] = useState(null);
  const [matchedPhotos, setMatchedPhotos] = useState([]);
  const [lastSearchedEventName, setLastSearchedEventName] = useState('');
  const [faceRefreshKey, setFaceRefreshKey] = useState(0);

  // Settings tab form state
  const [profileData, setProfileData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
      });
    }
  }, [user]);

  // Load events
  const loadEvents = async () => {
    setEventsLoading(true);
    try {
      const res = await photosApi.getEvents();
      if (res?.data) {
        setEvents(res.data);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Run AI matching for a specific event
  const handleMatchPhotosInEvent = async (eventId) => {
    setSearchingEventId(eventId);
    try {
      const res = await photosApi.matchPhotos({ eventId, threshold: 0.55 });
      const targetEvent = events.find((e) => e.id === eventId);
      setLastSearchedEventName(targetEvent?.name || 'Event');

      if (res?.data?.matches) {
        setMatchedPhotos(res.data.matches);
        setActiveTab('my-photos');

        if (res.data.matches.length > 0) {
          showToast(`Found ${res.data.matches.length} matching photos!`, 'success');
          // Fire celebration confetti
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#dfb94a', '#c9a227', '#ffffff']
            });
          } catch {}
        } else {
          showToast('No matching photos found for your face in this event album.', 'info');
        }
      }
    } catch (err) {
      showToast(err.message || 'Face matching scan failed. Ensure you have registered faces.', 'error');
    } finally {
      setSearchingEventId(null);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile(profileData);
      showToast('Profile information updated', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'warning');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'warning');
      return;
    }

    setChangingPassword(true);
    try {
      await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      showToast('Password changed successfully', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.message || 'Failed to change password. Check your current password.', 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  const filteredEvents = events.filter((e) => {
    const q = eventsSearchQuery.toLowerCase();
    return (
      (e.name && e.name.toLowerCase().includes(q)) ||
      (e.location && e.location.toLowerCase().includes(q)) ||
      (e.event_type && e.event_type.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--dark)' }}>
      <Navbar />

      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-menu">
            <button
              className={`sidebar-item ${activeTab === 'face-registration' ? 'active' : ''}`}
              onClick={() => setActiveTab('face-registration')}
            >
              <UserPlus size={18} />
              <span>Face Registration</span>
            </button>

            <button
              className={`sidebar-item ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              <Calendar size={18} />
              <span>Browse Events</span>
            </button>

            <button
              className={`sidebar-item ${activeTab === 'my-photos' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-photos')}
            >
              <Images size={18} />
              <span>My Matched Photos</span>
            </button>

            <button
              className={`sidebar-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={18} />
              <span>Account Settings</span>
            </button>
          </div>

          <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.8rem', color: 'var(--gray)' }}>
            FaceRec Events v2.0
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-main">
          {/* TAB 1: Face Registration */}
          {activeTab === 'face-registration' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: '#fff', marginBottom: '0.4rem' }}>
                  Face Biometric Registration
                </h1>
                <p style={{ color: 'var(--gray-light)', fontSize: '0.95rem' }}>
                  Register your face using your webcam or uploaded photos to find yourself in event albums.
                </p>
              </div>

              <CameraCapture onFacesUploaded={() => setFaceRefreshKey((k) => k + 1)} />

              <RegisteredFaces refreshTrigger={faceRefreshKey} />
            </div>
          )}

          {/* TAB 2: Events List */}
          {activeTab === 'events' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: '2rem', color: '#fff', marginBottom: '0.4rem' }}>
                    Browse Events
                  </h1>
                  <p style={{ color: 'var(--gray-light)', fontSize: '0.95rem' }}>
                    Select an event to run the AI face search across all published galleries.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '240px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
                    <input
                      type="text"
                      className="form-control"
                      style={{ paddingLeft: '2.4rem', fontSize: '0.85rem' }}
                      placeholder="Search events..."
                      value={eventsSearchQuery}
                      onChange={(e) => setEventsSearchQuery(e.target.value)}
                    />
                  </div>

                  <button onClick={loadEvents} className="btn btn-outline btn-sm" title="Refresh Events">
                    <RefreshCw size={14} className={eventsLoading ? 'spin' : ''} />
                  </button>
                </div>
              </div>

              {eventsLoading ? (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--gray-light)' }}>
                  <div className="spinner" style={{ margin: '0 auto 1rem', width: 28, height: 28, border: '2px solid rgba(201,162,39,0.3)', borderTopColor: '#c9a227', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  Loading available events...
                </div>
              ) : filteredEvents.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: 'var(--border-radius-md)',
                  border: '1px dashed rgba(255,255,255,0.1)'
                }}>
                  <Calendar size={44} color="var(--gray)" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ color: '#fff', marginBottom: '0.4rem' }}>No Events Available</h3>
                  <p style={{ color: 'var(--gray-light)', fontSize: '0.875rem' }}>
                    Check back soon or ask your event organizer to publish photos.
                  </p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onSearch={handleMatchPhotosInEvent}
                      searching={searchingEventId === event.id}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: My Photos */}
          {activeTab === 'my-photos' && (
            <div>
              <PhotoGallery
                photos={matchedPhotos}
                title={lastSearchedEventName ? `Matched Photos (${lastSearchedEventName})` : "Matched Photos"}
                emptyMessage="Select an event from the 'Browse Events' tab and click 'Find My Photos' to scan through albums."
              />
            </div>
          )}

          {/* TAB 4: Settings & Profile */}
          {activeTab === 'settings' && (
            <div style={{ maxWidth: 800 }}>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: '#fff', marginBottom: '0.4rem' }}>
                  Account Settings
                </h1>
                <p style={{ color: 'var(--gray-light)', fontSize: '0.95rem' }}>
                  Manage your personal information and account credentials.
                </p>
              </div>

              {/* Profile Card */}
              <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  <UserIcon size={18} color="#dfb94a" /> Personal Information
                </h3>

                <form onSubmit={handleUpdateProfile}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={user?.email || ''}
                      disabled
                      style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    />
                    <small style={{ color: 'var(--gray-light)', marginTop: '0.3rem', display: 'block' }}>
                      Email address is tied to your account authentication and cannot be changed.
                    </small>
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="btn btn-primary"
                  >
                    {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </form>
              </div>

              {/* Password Card */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  <Lock size={18} color="#dfb94a" /> Change Password
                </h3>

                <form onSubmit={handleChangePassword}>
                  <div className="form-group">
                    <label>Current Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        className="form-control"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }}
                        tabIndex={-1}
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>New Password (min 6)</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          className="form-control"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }}
                          tabIndex={-1}
                        >
                          {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="btn btn-primary"
                  >
                    {changingPassword ? 'Updating Password...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};
