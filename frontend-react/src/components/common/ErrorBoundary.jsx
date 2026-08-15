import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled React Error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          background: 'var(--dark)'
        }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: 16,
            background: 'rgba(196, 92, 92, 0.15)',
            border: '1px solid rgba(196, 92, 92, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ff8585',
            marginBottom: '1.5rem'
          }}>
            <AlertTriangle size={30} />
          </div>

          <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Something went wrong
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '420px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </p>

          <button
            onClick={this.handleReload}
            className="btn btn-primary btn-sm"
          >
            <RefreshCw size={14} /> Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
