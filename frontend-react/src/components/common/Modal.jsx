import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = '480px' }) => {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setIsClosing(false);
    } else if (isRendered) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsRendered(false);
        setIsClosing(false);
      }, 240); // Matches exit animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen, isRendered]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isRendered && !isClosing) {
        onClose();
      }
    };
    if (isRendered) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRendered, isClosing, onClose]);

  if (!isRendered) return null;

  return (
    <div
      className={`modal-overlay ${isClosing ? 'modal-overlay-closing' : 'modal-overlay-entering'}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`modal-content ${isClosing ? 'modal-content-closing' : 'modal-content-entering'}`}
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        {title && (
          <h2 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
};
