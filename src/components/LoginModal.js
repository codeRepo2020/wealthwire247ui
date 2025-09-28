import React, { memo } from 'react';
import { X, User } from 'lucide-react';

const LoginModal = memo(({ isOpen, onClose, onGoogleLogin, onGuestLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-btn">
          <X size={20} />
        </button>
        
        <div className="modal-header">
          <h2>Welcome to WealthWire247</h2>
          <p>Choose how you'd like to continue</p>
        </div>

        <div className="login-options">
          <button onClick={onGoogleLogin} className="google-btn">
            <div className="google-icon">G</div>
            <span>Continue with Google</span>
          </button>
          
          <div className="divider">
            <span>or</span>
          </div>
          
          <button onClick={onGuestLogin} className="guest-btn">
            <User size={20} />
            <span>Continue as Guest</span>
          </button>
        </div>

        <p className="disclaimer">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          max-width: 400px;
          width: 100%;
          position: relative;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          animation: modalSlideIn 0.3s ease-out;
        }

        body.dark .modal-content {
          background: #1f2937;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        body.dark .close-btn {
          color: #9ca3af;
        }

        body.dark .close-btn:hover {
          background: #374151;
          color: #d1d5db;
        }

        .modal-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.5rem;
        }

        body.dark .modal-header h2 {
          color: #f9fafb;
        }

        .modal-header p {
          color: #6b7280;
        }

        body.dark .modal-header p {
          color: #9ca3af;
        }

        .login-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.875rem 1.5rem;
          background: #4285f4;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .google-btn:hover {
          background: #3367d6;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
        }

        .google-icon {
          width: 20px;
          height: 20px;
          background: white;
          color: #4285f4;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }

        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 0.5rem 0;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        body.dark .divider::before,
        body.dark .divider::after {
          background: #4b5563;
        }

        .divider span {
          padding: 0 1rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        body.dark .divider span {
          color: #9ca3af;
        }

        .guest-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.875rem 1.5rem;
          background: transparent;
          color: #374151;
          border: 2px solid #d1d5db;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .guest-btn:hover {
          border-color: #9ca3af;
          background: #f9fafb;
          transform: translateY(-1px);
        }

        body.dark .guest-btn {
          color: #d1d5db;
          border-color: #4b5563;
        }

        body.dark .guest-btn:hover {
          border-color: #6b7280;
          background: #374151;
        }

        .disclaimer {
          text-align: center;
          font-size: 0.75rem;
          color: #6b7280;
          line-height: 1.4;
        }

        body.dark .disclaimer {
          color: #9ca3af;
        }

        @media (max-width: 480px) {
          .modal-content {
            padding: 1.5rem;
            margin: 1rem;
          }

          .modal-header h2 {
            font-size: 1.25rem;
          }

          .google-btn,
          .guest-btn {
            padding: 0.75rem 1.25rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
});

LoginModal.displayName = 'LoginModal';

export default LoginModal;