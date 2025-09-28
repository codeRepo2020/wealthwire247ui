import React, { memo } from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = memo(() => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="user-profile">
      <div className="user-info">
        <span className="user-avatar">{user.avatar}</span>
        <div className="user-details">
          <span className="user-name">{user.name}</span>
          <span className="user-email">{user.email}</span>
        </div>
        <button onClick={logout} className="logout-btn" title="Logout">
          <LogOut size={16} />
        </button>
      </div>

      <style jsx>{`
        .user-profile {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 50;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 2px solid #10b981;
          border-radius: 2rem;
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.2);
          font-size: 0.875rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .user-info:hover {
          box-shadow: 0 12px 35px rgba(16, 185, 129, 0.3);
          transform: translateY(-2px);
          border-color: #059669;
        }

        body.dark .user-info {
          background: rgba(31, 41, 59, 0.95);
          border-color: #10b981;
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.2);
        }

        body.dark .user-info:hover {
          box-shadow: 0 12px 35px rgba(16, 185, 129, 0.3);
          border-color: #059669;
        }

        .user-avatar {
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          color: white;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .user-name {
          color: #374151;
          font-weight: 600;
          font-size: 0.9rem;
        }

        body.dark .user-name {
          color: #f9fafb;
        }

        .user-email {
          color: #6b7280;
          font-size: 0.75rem;
        }

        body.dark .user-email {
          color: #9ca3af;
        }

        .logout-btn {
          padding: 0.5rem;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logout-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        body.dark .logout-btn {
          color: #9ca3af;
        }

        body.dark .logout-btn:hover {
          background: #4b5563;
          color: #d1d5db;
        }

        @media (max-width: 768px) {
          .user-profile {
            bottom: 1rem;
            right: 1rem;
          }

          .user-info {
            padding: 0.5rem 0.75rem;
            gap: 0.5rem;
          }

          .user-details {
            display: none;
          }

          .user-avatar {
            width: 32px;
            height: 32px;
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
});

UserProfile.displayName = 'UserProfile';

export default UserProfile;