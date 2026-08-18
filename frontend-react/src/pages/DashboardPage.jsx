import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { CameraCapture } from '../components/dashboard/CameraCapture';
import { RegisteredFaces } from '../components/dashboard/RegisteredFaces';
import { EventCard } from '../components/dashboard/EventCard';
import { PhotoGallery } from '../components/dashboard/PhotoGallery';
import { CircleMemberBar } from '../components/dashboard/CircleMemberBar';
import { MultiPersonFilterBar } from '../components/dashboard/MultiPersonFilterBar';
import { VectorHealthReport } from '../components/dashboard/VectorHealthReport';
import { GuidedCaptureJourneyModal } from '../components/dashboard/GuidedCaptureJourneyModal';
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
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
  EyeOff,
  Users
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('face-registration');
  const [faceRefreshKey, setFaceRefreshKey] = useState(0);
  const [isJourneyModalOpen, setIsJourneyModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const tabRefs = useRef({});

  // Circle Members State
  const [circleMembers, setCircleMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [selectedMemberIdsForFilter, setSelectedMemberIdsForFilter] = useState([]);
  const [matchMode, setMatchMode] = useState('ANY'); // 'ANY', 'ALL', 'SOLO'
  const [matchThreshold, setMatchThreshold] = useState(0.50);

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

  // Load Circle Members
  const loadCircleMembers = async () => {
    try {
      const res = await photosApi.getCircleMembers();
      if (res?.data) {
        const membersList = res.data;
        setCircleMembers(membersList);

        // Default selected member to 'Me' or first
        if (!selectedMemberId && membersList.length > 0) {
          const selfMem = membersList.find((m) => m.is_self) || membersList[0];
          setSelectedMemberId(selfMem.id);
        }

        // Default filter members to all members with faces
        const membersWithFaces = membersList.filter((m) => m.face_count > 0 || (m.faces && m.faces.length > 0));
        setSelectedMemberIdsForFilter(membersWithFaces.map((m) => m.id));
      }
    } catch (err) {
      console.error('Failed to load circle members:', err);
    }
  };

  useEffect(() => {
    loadCircleMembers();
  }, [faceRefreshKey]);

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

  // Handle Circle Member Management
  const handleCreateMember = async (memberData) => {
    try {
      const res = await photosApi.createCircleMember(memberData);
      showToast(res.message || 'Circle member added!', 'success');
      await loadCircleMembers();
      if (res.data?.id) {
        setSelectedMemberId(res.data.id);
      }
    } catch (err) {
      showToast(err.message || 'Failed to add circle member', 'error');
    }
  };

  const handleDeleteMember = async (memberId) => {
    try {
      const res = await photosApi.deleteCircleMember(memberId);
      showToast(res.message || 'Member removed from circle', 'success');
      await loadCircleMembers();
    } catch (err) {
      showToast(err.message || 'Failed to delete circle member', 'error');
    }
  };

  // Direct File Upload handler with automatic angle assignment
  const handleDirectFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const validFiles = files.filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      showToast('Please select valid image files (JPG, PNG)', 'warning');
      return;
    }

    const formData = new FormData();
    if (selectedMemberId) {
      formData.append('member_id', selectedMemberId);
    }
    const slots = ['front', 'left', 'right', 'smile'];
    validFiles.forEach((file, idx) => {
      formData.append('faces', file);
      formData.append('angle_slot', slots[idx % slots.length]);
    });

    try {
      showToast(`Uploading ${validFiles.length} photo(s)...`, 'info');
      const res = await photosApi.uploadFaces(formData);
      showToast(res.message || 'Photos uploaded and analyzed!', 'success');
      setFaceRefreshKey((k) => k + 1);
    } catch (err) {
      showToast(err.message || 'Failed to upload photos', 'error');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle run Multi-Person face match on event
  const handleFindPhotosInEvent = async (event) => {
    setSelectedEventForMatch(event);
    setMatchingInProgress(true);
    setActiveTab('my-photos');

    try {
      const targetMemberIds = selectedMemberIdsForFilter.length > 0
        ? selectedMemberIdsForFilter
        : circleMembers.map((m) => m.id);

      const res = await photosApi.matchCirclePhotos({
        eventId: event.id,
        memberIds: targetMemberIds,
        matchMode: matchMode,
        threshold: matchThreshold,
      });

      const matched = res?.data?.matches || res?.data || [];
      setMatchedPhotos(Array.isArray(matched) ? matched : []);

      if (matched.length > 0) {
        showToast(`Found ${matched.length} photo(s) matching your constraints!`, 'success');
      } else {
        showToast('No matching photos found with current constraints in this event.', 'info');
      }
    } catch (err) {
      showToast(err.message || 'Failed to match photos. Make sure face photos are registered.', 'error');
      setMatchedPhotos([]);
    } finally {
      setMatchingInProgress(false);
    }
  };

  // Re-run match when constraints or members change
  const handleReRunMatch = () => {
    if (selectedEventForMatch) {
      handleFindPhotosInEvent(selectedEventForMatch);
    }
  };

  const handleToggleFilterMember = (memberId) => {
    setSelectedMemberIdsForFilter((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  const handleSelectAllFilterMembers = () => {
    setSelectedMemberIdsForFilter(circleMembers.map((m) => m.id));
  };

  const handleClearFilterMembers = () => {
    setSelectedMemberIdsForFilter([]);
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

  const currentSelectedMember = circleMembers.find((m) => m.id === selectedMemberId) || circleMembers[0];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-body)' }}>
      <Navbar />

      <div className="dashboard-layout">
        {/* Rich Informative Sidebar */}
        <DashboardSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabRefs={tabRefs}
          circleMembers={circleMembers}
          events={events}
          matchedPhotosCount={matchedPhotos.length}
          onStartJourney={() => {
            setActiveTab('face-registration');
            setIsJourneyModalOpen(true);
          }}
        />

        {/* Main Content Area */}
        <main className="dashboard-main">
          <div className="dashboard-content">
            <div key={activeTab} className="tab-content-enter">
              {/* TAB 1: Face & Circle Registration */}
              {activeTab === 'face-registration' && (
                <div>
                  <div style={{ marginBottom: '1.75rem' }}>
                    <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '0.4rem', fontWeight: 800 }}>
                      Face & Circle Profiles
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                      Set up your face and add friends or family to easily find all your event photos.
                    </p>
                  </div>

                  {/* Family Member Profile Switcher */}
                  <CircleMemberBar
                    members={circleMembers}
                    selectedMemberId={selectedMemberId}
                    onSelectMember={(id) => setSelectedMemberId(id)}
                    onCreateMember={handleCreateMember}
                    onDeleteMember={handleDeleteMember}
                  />

                  {/* Biometric Vector Health & AI Diagnostic Report */}
                  <VectorHealthReport
                    member={currentSelectedMember}
                    members={circleMembers}
                    faces={currentSelectedMember?.faces || []}
                    onStartJourney={() => setIsJourneyModalOpen(true)}
                    onOpenUpload={() => fileInputRef.current?.click()}
                    onSelectMember={(id) => setSelectedMemberId(id)}
                  />

                  {/* Hidden File Input for Direct Upload */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleDirectFileUpload}
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                  />

                  {/* Guided 4-Step Capture Journey Modal */}
                  <GuidedCaptureJourneyModal
                    isOpen={isJourneyModalOpen}
                    onClose={() => setIsJourneyModalOpen(false)}
                    member={currentSelectedMember}
                    onComplete={() => {
                      setFaceRefreshKey((k) => k + 1);
                      setIsJourneyModalOpen(false);
                    }}
                  />

                  {/* Registered Faces List for Selected Member */}
                  <RegisteredFaces
                    memberId={selectedMemberId}
                    memberName={currentSelectedMember?.name || 'All Profiles'}
                    refreshTrigger={faceRefreshKey}
                  />
                </div>
              )}

              {/* TAB 2: Events List */}
              {activeTab === 'events' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                        Browse Events
                      </h1>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        Search any event album using your Family Circle multi-person filters.
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

                  {/* Multi-Person Filter Bar */}
                  {circleMembers.length > 0 && (
                    <MultiPersonFilterBar
                      members={circleMembers}
                      selectedMemberIds={selectedMemberIdsForFilter}
                      onToggleMember={handleToggleFilterMember}
                      onSelectAllMembers={handleSelectAllFilterMembers}
                      onClearMembers={handleClearFilterMembers}
                      matchMode={matchMode}
                      onChangeMatchMode={(m) => setMatchMode(m)}
                      threshold={matchThreshold}
                      onChangeThreshold={(th) => setMatchThreshold(th)}
                    />
                  )}

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

              {/* TAB 3: My Matched Photos with Multi-Person Filters */}
              {activeTab === 'my-photos' && (
                <div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                      {selectedEventForMatch ? `Matched Photos: ${selectedEventForMatch.name}` : 'My Matched Photos'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                      Photos matching your Family Circle constraints ({matchMode === 'ALL' ? 'All Together' : matchMode === 'SOLO' ? 'Solo Only' : 'Any Member'}).
                    </p>
                  </div>

                  {/* Multi-Person Filter Bar with instant Re-Match Button */}
                  {circleMembers.length > 0 && selectedEventForMatch && (
                    <MultiPersonFilterBar
                      members={circleMembers}
                      selectedMemberIds={selectedMemberIdsForFilter}
                      onToggleMember={handleToggleFilterMember}
                      onSelectAllMembers={handleSelectAllFilterMembers}
                      onClearMembers={handleClearFilterMembers}
                      matchMode={matchMode}
                      onChangeMatchMode={(m) => setMatchMode(m)}
                      threshold={matchThreshold}
                      onChangeThreshold={(th) => setMatchThreshold(th)}
                      onSearch={handleReRunMatch}
                      isSearching={matchingInProgress}
                    />
                  )}

                  <PhotoGallery
                    photos={matchedPhotos}
                    title={selectedEventForMatch ? `Gallery: ${selectedEventForMatch.name}` : 'Matched Photos'}
                    emptyMessage={
                      selectedEventForMatch
                        ? 'No photos in this album match the selected family members under this constraint. Try switching to "Any of Us (OR)" or lowering the threshold.'
                        : 'Select an event from the Browse Events tab to run the AI face search.'
                    }
                  />
                </div>
              )}

              {/* TAB 4: Account Settings */}
              {activeTab === 'settings' && (
                <div style={{ maxWidth: '650px' }}>
                  <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                      Account Settings
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                      Manage your profile information and account security.
                    </p>
                  </div>

                  {/* Profile Info Form */}
                  <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <UserIcon size={18} color="var(--primary)" /> Profile Information
                    </h3>

                    <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div className="form-group">
                        <label>Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          value={user?.email || ''}
                          disabled
                          style={{ opacity: 0.7, cursor: 'not-allowed' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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

                      <button
                        type="submit"
                        disabled={savingProfile}
                        className="btn btn-primary"
                        style={{ alignSelf: 'flex-start' }}
                      >
                        {savingProfile ? 'Saving Changes...' : 'Save Profile'}
                      </button>
                    </form>
                  </div>

                  {/* Password Form */}
                  <div className="glass-card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Lock size={18} color="var(--primary)" /> Change Password
                    </h3>

                    <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                            style={{
                              position: 'absolute',
                              right: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                            }}
                          >
                            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

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
                            style={{
                              position: 'absolute',
                              right: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                            }}
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

                      <button
                        type="submit"
                        disabled={changingPassword}
                        className="btn btn-primary"
                        style={{ alignSelf: 'flex-start' }}
                      >
                        {changingPassword ? 'Updating Password...' : 'Update Password'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
