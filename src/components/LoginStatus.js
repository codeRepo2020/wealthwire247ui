import React, { memo } from 'react';
import { User, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginStatus = memo(() => {
  const { user, setShowLoginModal } = useAuth();

  if (user) return null; // Don't show if user is logged in

  return (
    <div className="login-status">
      <button onClick={() => setShowLoginModal(true)} className="login-prompt">
        <User size={20} />
        <span>Sign In</span>
        <LogIn size={16} />
      </button>

      <style jsx>{`
        .login-status {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 50;
        }

        .login-prompt {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 2px solid #3b82f6;
          border-radius: 2rem;
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
          font-size: 0.875rem;
          font-weight: 500;
          color: #3b82f6;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .login-prompt:hover {
          box-shadow: 0 12px 35px rgba(59, 130, 246, 0.3);
          transform: translateY(-2px);
          border-color: #2563eb;
          color: #2563eb;
        }

        body.dark .login-prompt {
          background: rgba(31, 41, 59, 0.95);
          border-color: #3b82f6;
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
          color: #60a5fa;
        }

        body.dark .login-prompt:hover {
          box-shadow: 0 12px 35px rgba(59, 130, 246, 0.3);
          border-color: #2563eb;
          color: #3b82f6;
        }

        @media (max-width: 768px) {
          .login-status {
            bottom: 1rem;
            right: 1rem;
          }

          .login-prompt {
            padding: 0.75rem 1rem;
            gap: 0.5rem;
          }

          .login-prompt span {
            display: none;
          }
        }
      `}</style>
    </div>
  );
});

LoginStatus.displayName = 'LoginStatus';

export default LoginStatus;