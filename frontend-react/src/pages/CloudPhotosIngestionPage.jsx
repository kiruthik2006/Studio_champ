import React, { useState } from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { useToast } from '../context/ToastContext';
import { GooglePhotosIcon } from '../components/dashboard/GoogleDriveStorageWidget';
import {
  Cloud,
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Eye,
  UserCheck,
  Layers,
  ArrowRight,
  Filter,
  Download,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Database,
  Lock,
} from 'lucide-react';

/**
 * CloudPhotosIngestionPage
 * Hidden Operator & Admin Console for inspecting connected Google Photos streams,
 * running automated 512-D vector extraction on cloud albums, and matching against event photos.
 */
export const CloudPhotosIngestionPage = () => {
  const { showToast } = useToast();
  const [selectedUser, setSelectedUser] = useState('user-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState(new Set());
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'detected' | 'enrolled'

  // Mock Connected Google Cloud Users Directory
  const connectedUsers = [
    {
      id: 'user-1',
      name: 'Kiruthik (You)',
      email: 'kiruthikracer@gmail.com',
      avatar: 'K',
      totalCloudPhotos: 1420,
      facesDetected: 38,
      status: 'Sync Active',
      lastSync: '10 mins ago',
      authScopes: ['photoslibrary.readonly', 'photoslibrary.appendonly'],
    },
    {
      id: 'user-2',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@gmail.com',
      avatar: 'S',
      totalCloudPhotos: 840,
      facesDetected: 19,
      status: 'Sync Active',
      lastSync: '1 hour ago',
      authScopes: ['photoslibrary.readonly'],
    },
    {
      id: 'user-3',
      name: 'David Miller',
      email: 'david.miller@gmail.com',
      avatar: 'D',
      totalCloudPhotos: 2150,
      facesDetected: 64,
      status: 'Sync Active',
      lastSync: 'Yesterday',
      authScopes: ['photoslibrary.readonly', 'photoslibrary.appendonly'],
    },
  ];

  // Mock Stream of Google Photos for the selected user
  const [userPhotos, setUserPhotos] = useState([
    {
      id: 'gp-1',
      url: '/covers/wedding.jpg',
      title: 'Amalfi Coast Golden Hour',
      timestamp: 'Aug 14, 2026 • 18:42',
      resolution: '4032 x 3024',
      camera: 'Sony A7R V (85mm f/1.4)',
      facesFound: 2,
      confidence: 0.996,
      enrolled: true,
      qualityScore: 98,
      tags: ['Portrait', 'Outdoor', 'Golden Hour'],
    },
    {
      id: 'gp-2',
      url: '/covers/gala.jpg',
      title: 'Fashion Awards Red Carpet',
      timestamp: 'Jul 28, 2026 • 20:15',
      resolution: '5120 x 3840',
      camera: 'Canon EOS R5 (50mm f/1.2)',
      facesFound: 4,
      confidence: 0.994,
      enrolled: false,
      qualityScore: 95,
      tags: ['Black Tie', 'Indoor', 'Editorial'],
    },
    {
      id: 'gp-3',
      url: '/covers/family.jpg',
      title: 'Lavender Garden Family Shoot',
      timestamp: 'Jun 19, 2026 • 17:30',
      resolution: '4000 x 3000',
      camera: 'Nikon Z9 (70-200mm f/2.8)',
      facesFound: 7,
      confidence: 0.988,
      enrolled: true,
      qualityScore: 94,
      tags: ['Family Circle', 'Sunny', 'Group'],
    },
    {
      id: 'gp-4',
      url: '/covers/summit.jpg',
      title: 'Keynote Tech Presentation',
      timestamp: 'May 04, 2026 • 11:20',
      resolution: '3840 x 2160',
      camera: 'Leica SL2 (35mm f/2.0)',
      facesFound: 1,
      confidence: 0.992,
      enrolled: false,
      qualityScore: 96,
      tags: ['Conference', 'Stage', 'Keynote'],
    },
  ]);

  const currentUser = connectedUsers.find((u) => u.id === selectedUser) || connectedUsers[0];

  const handleToggleSelect = (id) => {
    const next = new Set(selectedPhotos);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedPhotos(next);
  };

  const handleBatchIngestVectors = () => {
    if (selectedPhotos.size === 0) {
      showToast('Please select at least 1 Google Photos image to ingest', 'warning');
      return;
    }
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setUserPhotos((prev) =>
        prev.map((p) => (selectedPhotos.has(p.id) ? { ...p, enrolled: true } : p))
      );
      showToast(
        `Successfully extracted 512-D vectors from ${selectedPhotos.size} Google Photos into ${currentUser.name}'s biometric profile!`,
        'success'
      );
      setSelectedPhotos(new Set());
    }, 2200);
  };

  const handleRunFullCloudScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      showToast(
        `Cloud scan complete! Scanned ${currentUser.totalCloudPhotos} photos in ${currentUser.name}'s Google Photos library. Found 14 high-confidence face matches.`,
        'success'
      );
    }, 2500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-body)' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '6rem 2rem 3rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {/* Header Title & Security Notice */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.35rem' }}>
              <Lock size={13} />
              <span>Studio Operator Console • Google Photos Library Ingestion</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.4rem)', color: 'var(--text-main)', margin: 0, fontWeight: 800 }}>
              Cloud Photos <span className="gold-text">Biometric Ingestion</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Directly access connected Google Photos libraries to extract 512-D facial vectors and auto-match event albums.
            </p>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleRunFullCloudScan}
              disabled={isScanning}
              className="btn btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem' }}
            >
              <RefreshCw size={14} className={isScanning ? 'spin' : ''} />
              <span>{isScanning ? 'Scanning Cloud Library...' : 'Scan Google Photos'}</span>
            </button>

            <button
              type="button"
              onClick={handleBatchIngestVectors}
              disabled={selectedPhotos.size === 0 || isScanning}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem' }}
            >
              <Cpu size={14} />
              <span>Ingest Vectors ({selectedPhotos.size})</span>
            </button>
          </div>
        </div>

        {/* 2-Column Console Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.75rem', alignItems: 'start' }}>
          {/* Left Column: Connected Users Directory */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Connected Accounts ({connectedUsers.length})
                </span>
                <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                  OAuth Active
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {connectedUsers.map((user) => {
                  const isSelected = user.id === selectedUser;
                  return (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUser(user.id)}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--border-radius-md)',
                        background: isSelected ? 'var(--card-bg-elevated)' : 'var(--bg-surface)',
                        border: isSelected ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: isSelected ? 'var(--gradient-gold)' : 'var(--card-bg)',
                          color: isSelected ? '#0d0d0d' : 'var(--text-main)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          flexShrink: 0,
                        }}
                      >
                        {user.avatar}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user.email}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                          {user.totalCloudPhotos} photos • {user.facesDetected} vectors
                        </div>
                      </div>

                      <ChevronRight size={16} color={isSelected ? 'var(--primary)' : 'var(--text-muted)'} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Google Photos API Health Telemetry */}
            <div className="glass-card" style={{ padding: '1.25rem', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>
                <GooglePhotosIcon size={18} />
                <span>Google Photos API Scope</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Permission Scope</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>photoslibrary.readonly</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Rate Quota</span>
                <span style={{ fontWeight: 600, color: '#10b981' }}>10,000 / Day (98% Avail)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>ArcFace Ingestion</span>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>512-D Vectors</span>
              </div>
            </div>
          </div>

          {/* Right Column: User's Google Photos Cloud Stream & Ingestion Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Filter & Selection Bar */}
            <div
              className="glass-card"
              style={{
                padding: '0.85rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Viewing Library for: <strong style={{ color: 'var(--primary)' }}>{currentUser.name}</strong>
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  ({userPhotos.length} Cloud Photos Loaded)
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedPhotos(new Set(userPhotos.map((p) => p.id)))}
                  style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, background: 'transparent', cursor: 'pointer' }}
                >
                  Select All
                </button>
                <span style={{ color: 'var(--border-subtle)' }}>|</span>
                <button
                  type="button"
                  onClick={() => setSelectedPhotos(new Set())}
                  style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'transparent', cursor: 'pointer' }}
                >
                  Deselect
                </button>
              </div>
            </div>

            {/* Photos Ingestion Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {userPhotos.map((photo) => {
                const isSelected = selectedPhotos.has(photo.id);
                return (
                  <div
                    key={photo.id}
                    className="glass-card"
                    style={{
                      overflow: 'hidden',
                      padding: 0,
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleToggleSelect(photo.id)}
                  >
                    {/* Checkbox badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: isSelected ? 'var(--primary)' : 'rgba(0, 0, 0, 0.65)',
                        border: '2px solid #fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.4)',
                      }}
                    >
                      {isSelected && <CheckCircle2 size={16} color="#0d0d0d" />}
                    </div>

                    {/* Status badge */}
                    <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
                      {photo.enrolled ? (
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.85)', color: '#fff', backdropFilter: 'blur(4px)' }}>
                          ✓ Vector Enrolled
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.55rem', borderRadius: '999px', background: 'rgba(0, 0, 0, 0.65)', color: 'var(--primary)', backdropFilter: 'blur(4px)' }}>
                          Ready to Ingest
                        </span>
                      )}
                    </div>

                    {/* Photo Image with simulated Face Detection box */}
                    <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                      <img
                        src={photo.url}
                        alt={photo.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {/* Simulated AI Face Box Overlay */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '25%',
                          left: '35%',
                          width: '30%',
                          height: '45%',
                          border: '2px dashed #10b981',
                          borderRadius: '6px',
                          boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
                          pointerEvents: 'none',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'center',
                          paddingTop: '2px',
                        }}
                      >
                        <span style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 700, background: 'rgba(0,0,0,0.7)', padding: '1px 3px', borderRadius: '3px' }}>
                          {Math.round(photo.confidence * 100)}% 512-D
                        </span>
                      </div>
                    </div>

                    {/* Photo Meta & AI Diagnostics */}
                    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', margin: 0, fontWeight: 700 }}>
                        {photo.title}
                      </h4>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {photo.timestamp}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', paddingTop: '0.35rem', borderTop: '1px solid var(--border-subtle)' }}>
                        <span>Camera: {photo.camera}</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Quality: {photo.qualityScore}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
