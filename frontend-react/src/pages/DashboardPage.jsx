import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { CameraCapture } from '../components/dashboard/CameraCapture';
import { RegisteredFaces } from '../components/dashboard/RegisteredFaces';
import { EventCard } from '../components/dashboard/EventCard';
import { PhotoGallery } from '../components/dashboard/PhotoGallery';
import { photosApi } from '../api/photos';
import { authApi } from '../api/auth';
import { LiquidSidebarIndicator } from '../components/common/LiquidSidebarIndicator';
import {
  UserPlus,
  Calendar,
  Images,
  Settings,
  Search,
  Sparkles,
  Camera,
  Layers,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('face-registration');
  const [faceRefreshKey, setFaceRefreshKey] = useState(0);

  const tabRefs = useRef({});

  // Events & Matching
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [searchEventQuery, setSearchEventQuery] = useState('');
  const [selectedEventForMatch, setSelectedEventForMatch] = useState(null);
  const [matchedPhotos, setMatchedPhotos] = useState([]);
  const [matchingInProgress, setMatchingInProgress] = useState(false);

  // Profile Form
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
        const raw = res.data;
        const eventsList = Array.isArray(raw)
          ? raw
          : Array.isArray(raw.events)
          ? raw.events
          : [];
        setEvents(eventsList);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Handle run face match on event
  const handleFindPhotosInEvent = async (event) => {
    setSelectedEventForMatch(event);
    setMatchingInProgress(true);
    setActiveTab('my-photos');

    try {
      const res = await photosApi.matchPhotos({ eventId: event.id, threshold: 0.6 });
      const matched = res?.data?.matched_photos || res?.data || [];
      setMatchedPhotos(Array.isArray(matched) ? matched : []);

      if (matched.length > 0) {
        showToast(`Found ${matched.length} photos matching your face!`, 'success');
      } else {
        showToast('No matching photos found in this event gallery yet.', 'info');
      }
    } catch (err) {
      showToast(err.message || 'Failed to match photos. Make sure your face is registered.', 'error');
      setMatchedPhotos([]);
    } finally {
      setMatchingInProgress(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile(profileData);
      showToast('Profile updated successfully', 'success');
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
      showToast('Password must be at least 6 characters', 'warning');
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
      showToast(err.message || 'Failed to change password', 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  const filteredEvents = events.filter((e) => {
    const q = searchEventQuery.toLowerCase();
    return (
      (e.name && e.name.toLowerCase().includes(q)) ||
      (e.location && e.location.toLowerCase().includes(q)) ||
      (e.event_type && e.event_type.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-body)' }}>
      <Navbar />

      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-menu">
            {/* Liquid Water Drop Morphing Indicator */}
            <LiquidSidebarIndicator activeTab={activeTab} tabRefs={tabRefs} />

            <button
              ref={(el) => (tabRefs.current['face-registration'] = el)}
              className={`sidebar-item ${activeTab === 'face-registration' ? 'active' : ''}`}
              onClick={() => setActiveTab('face-registration')}
            >
              <UserPlus size={18} />
              <span>Face Registration</span>
            </button>

            <button
              ref={(el) => (tabRefs.current['events'] = el)}
              className={`sidebar-item ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              <Calendar size={18} />
              <span>Browse Events</span>
            </button>

            <button
              ref={(el) => (tabRefs.current['my-photos'] = el)}
              className={`sidebar-item ${activeTab === 'my-photos' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-photos')}
            >
              <Images size={18} />
              <span>My Matched Photos</span>
            </button>

            <button
              ref={(el) => (tabRefs.current['settings'] = el)}
              className={`sidebar-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={18} />
              <span>Account Settings</span>
            </button>
          </div>

          <div style={{ padding: '1rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            FaceRec Events v2.0
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-main">
          <div className="dashboard-content">
            <div key={activeTab} className="tab-content-enter">
              {/* TAB 1: Face Registration */}
              {activeTab === 'face-registration' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  Face Biometric Registration
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
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
                  <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                    Browse Events
                  </h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    Select an event to run the AI face search across all published galleries.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '240px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search events or venues..."
                      value={searchEventQuery}
                      onChange={(e) => setSearchEventQuery(e.target.value)}
                      style={{ paddingLeft: '2.4rem' }}
                    />
                  </div>

                  <button onClick={loadEvents} className="btn btn-outline btn-sm">
                    Refresh
                  </button>
                </div>
              </div>

              {eventsLoading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                  Loading events directory...
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
                  <Calendar size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ color: 'var(--text-main)', marginBottom: '0.4rem' }}>No Events Available</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Check back soon as administrators upload new event albums.
                  </p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '1.75rem'
                }}>
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onFindPhotos={handleFindPhotosInEvent}
                      isLoading={matchingInProgress && selectedEventForMatch?.id === event.id}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: My Matched Photos */}
          {activeTab === 'my-photos' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  {selectedEventForMatch ? `Matched Photos: ${selectedEventForMatch.name}` : 'My Matched Photos'}
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Photos detected using 512-D neural cosine similarity matching.
                </p>
              </div>

              <PhotoGallery
                photos={matchedPhotos}
                title={selectedEventForMatch ? `${selectedEventForMatch.name}` : 'AI Face Matches'}
                emptyMessage={matchingInProgress ? 'Neural search in progress across album...' : null}
              />
            </div>
          )}

          {/* TAB 4: Settings & Profile */}
          {activeTab === 'settings' && (
            <div style={{ maxWidth: 800 }}>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  Account Settings
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Manage your personal information and account credentials.
                </p>
              </div>

              {/* Profile Card */}
              <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  <UserIcon size={18} color="var(--primary)" /> Personal Information
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
                    <small style={{ color: 'var(--text-muted)', marginTop: '0.3rem', display: 'block' }}>
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
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  <Lock size={18} color="var(--primary)" /> Change Password
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
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                        tabIndex={-1}
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>New Password</label>
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
                          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
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
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};
