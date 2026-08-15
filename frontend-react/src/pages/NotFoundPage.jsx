import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Camera, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--dark)' }}>
      <Navbar />

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{
          width: 70,
          height: 70,
          borderRadius: 20,
          background: 'rgba(201, 162, 39, 0.15)',
          border: '1px solid rgba(201, 162, 39, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#dfb94a',
          marginBottom: '1.5rem'
        }}>
          <Camera size={36} />
        </div>

        <h1 style={{ fontSize: '4rem', color: '#fff', lineHeight: 1, marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--gray-light)', maxWidth: '400px', margin: '0 auto 2rem', fontSize: '0.95rem' }}>
          The page you are looking for doesn't exist or has been moved.
        </p>

        <Link to="/" className="btn btn-primary">
          <Home size={16} /> Back to Homepage
        </Link>
      </div>

      <Footer />
    </div>
  );
};
