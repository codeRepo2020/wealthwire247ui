import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('wealthwire_user');
    const hasSeenModal = localStorage.getItem('wealthwire_modal_seen');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (!hasSeenModal) {
      setShowLoginModal(true);
    }
    
    setIsLoading(false);
  }, []);

  const loginWithGoogle = () => {
    // Simulate Google login - in real app, use Google OAuth
    const mockUser = {
      id: 'google_' + Date.now(),
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      avatar: '👤',
      provider: 'google'
    };
    
    setUser(mockUser);
    localStorage.setItem('wealthwire_user', JSON.stringify(mockUser));
    localStorage.setItem('wealthwire_modal_seen', 'true');
    setShowLoginModal(false);
  };

  const continueAsGuest = () => {
    localStorage.setItem('wealthwire_modal_seen', 'true');
    setShowLoginModal(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wealthwire_user');
    localStorage.removeItem('wealthwire_modal_seen');
  };

  const value = {
    user,
    isLoading,
    showLoginModal,
    setShowLoginModal,
    loginWithGoogle,
    continueAsGuest,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;