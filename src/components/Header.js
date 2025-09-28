import React, { useState, memo, useEffect, useRef } from 'react';
import { Search, Menu, X, Sun, Moon, TrendingUp, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';

const Header = memo(({ onSearch, onThemeToggle, isDark, activeCategory, onCategoryChange, activeRegion, onRegionChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const dropdownRef = useRef(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      onSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const location = useLocation();
  
  const navItems = [
    { label: 'News', path: '/' },
    { label: 'Markets', path: '/market' },
    { label: 'Personal Finance', path: '/personal-finance' },
    { label: 'Expert Views', path: '/expert-views' },
    { label: 'About Us', path: '/about' }
  ];
  
  const categories = [
    { id: 'all', label: 'All', emoji: '🌍', color: '#6366f1' },
    { id: 'technology', label: 'Tech', emoji: '📱', color: '#8b5cf6' },
    { id: 'cryptocurrency', label: 'Crypto', emoji: '₿', color: '#f59e0b' },
    { id: 'markets', label: 'Markets', emoji: '📈', color: '#10b981' },
    { id: 'monetary-policy', label: 'Policy', emoji: '🏦', color: '#ef4444' },
    { id: 'banking', label: 'Banking', emoji: '🏛️', color: '#06b6d4' },
    { id: 'economy', label: 'Economy', emoji: '🌐', color: '#84cc16' }
  ];

  const regions = [
    { id: 'all', label: 'Global', flag: '🌍' },
    { id: 'us', label: 'United States', flag: '🇺🇸' },
    { id: 'india', label: 'India', flag: '🇮🇳' },
    { id: 'europe', label: 'Europe', flag: '🇪🇺' },
    { id: 'china', label: 'China', flag: '🇨🇳' }
  ];

  return (
    <header className={`header ${isDark ? 'dark' : ''} ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="container">
        <div className="header-content">
          <div className="logo-section">
            <Link to="/" className="logo">
              <TrendingUp size={48} className="logo-icon" />
              <span className="logo-text">WealthWire247</span>
            </Link>
          </div>

          <nav className="nav-desktop">
            {navItems.map((item) => (
              <Link 
                key={item.label} 
                to={item.path} 
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <form onSubmit={handleSearch} className="search-form">
            <div className="search-container">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search financial news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </form>

          <div className="header-actions">
            <button onClick={onThemeToggle} className="theme-toggle">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {location.pathname === '/' && (
          <div className="categories-bar">
            <div className="container">
              <div className="categories-scroll">
                {categories.map((category) => (
                  <div key={category.id} className="category-group" ref={openDropdown === category.id ? dropdownRef : null}>
                    <button
                      onClick={() => {
                        if (openDropdown === category.id) {
                          setOpenDropdown(null);
                        } else {
                          setOpenDropdown(category.id);
                          onCategoryChange(category.id);
                        }
                      }}
                      className={`category-pill ${activeCategory === category.id ? 'active' : ''} ${openDropdown === category.id ? 'dropdown-open' : ''}`}
                      style={{ '--category-color': category.color }}
                    >
                      <span className="emoji">{category.emoji}</span>
                      <span className="label">{category.label}</span>
                      <ChevronDown 
                        size={14} 
                        className={`dropdown-arrow ${openDropdown === category.id ? 'rotated' : ''}`} 
                      />
                    </button>
                    
                    <div className={`region-dropdown ${openDropdown === category.id ? 'open' : ''}`}>
                      <div className="dropdown-header">
                        <span>Select Region</span>
                      </div>
                      {regions.map((region, index) => (
                        <button
                          key={region.id}
                          onClick={() => {
                            onRegionChange(region.id);
                            setOpenDropdown(null);
                          }}
                          className={`region-option ${activeRegion === region.id ? 'active' : ''}`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <span className="flag">{region.flag}</span>
                          <span className="region-name">{region.label}</span>
                          {activeRegion === region.id && <span className="check">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {isMobileMenuOpen && (
          <div className="mobile-nav-overlay">
            <nav className="mobile-nav">
              {navItems.map((item) => (
                <Link 
                  key={item.label} 
                  to={item.path} 
                  className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      <style jsx>{`
        .header {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          backdrop-filter: blur(20px);
          border-bottom: 2px solid #475569;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          transform: translateY(0);
          transition: transform 0.3s ease;
        }

        .header.hidden {
          transform: translateY(-100%);
        }

        .header.visible {
          transform: translateY(0);
        }

        .header.dark {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-bottom: 2px solid #334155;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
          gap: 2rem;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          font-size: 1.5rem;
          color: #f1f5f9;
          text-decoration: none;
        }

        .logo-icon {
          color: #60a5fa;
        }

        .nav-desktop {
          display: flex;
          gap: 2rem;
        }

        .nav-link {
          color: #e2e8f0;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
          padding: 0.5rem 0;
          position: relative;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s ease;
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }

        body.dark .nav-link {
          color: #cbd5e1;
        }

        .nav-link:hover,
        .nav-link.active {
          color: #60a5fa;
        }

        body.dark .nav-link:hover,
        body.dark .nav-link.active {
          color: #60a5fa;
        }

        .search-form {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .search-container {
          position: relative;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
        }

        .search-icon {
          color: #64748b;
        }

        .header.dark .search-icon {
          color: #94a3b8;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 1px solid #475569;
          border-radius: 0.5rem;
          background: rgba(255, 255, 255, 0.9);
          color: #111827;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .header.dark .search-input {
          background: rgba(71, 85, 105, 0.9);
          border-color: #64748b;
          color: #f1f5f9;
        }

        .search-input:focus {
          outline: none;
          border-color: #60a5fa;
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
          background: rgba(255, 255, 255, 1);
        }

        .header.dark .search-input:focus {
          background: rgba(71, 85, 105, 1);
        }

        .theme-toggle {
          padding: 0.6rem;
          border: 1px solid #475569;
          background: rgba(255, 255, 255, 0.9);
          color: #374151;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .theme-toggle:hover {
          background: rgba(255, 255, 255, 1);
          color: #1e293b;
          transform: scale(1.05);
        }

        .header.dark .theme-toggle:hover {
          background: rgba(71, 85, 105, 1);
          color: #f8fafc;
        }

        .header.dark .theme-toggle {
          background: rgba(71, 85, 105, 0.9);
          border-color: #64748b;
          color: #f1f5f9;
        }

        .header.dark .theme-toggle:hover {
          background: rgba(55, 65, 81, 1);
          color: #d1d5db;
        }

        .categories-bar {
          background: linear-gradient(135deg, #334155 0%, #475569 100%);
          border-bottom: 1px solid #64748b;
          padding: 0.5rem 0 1rem 0;
          position: relative;
          z-index: 50;
        }

        .header.dark + .categories-bar {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          border-bottom-color: #475569;
        }

        .categories-scroll {
          display: flex;
          gap: 0.5rem;
          overflow: visible;
          padding: 0.25rem 0;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .categories-scroll::-webkit-scrollbar {
          display: none;
        }

        .category-group {
          position: relative;
          display: flex;
          flex-direction: column;
          z-index: 100;
        }

        .category-pill {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.6rem 1rem;
          border: 1px solid rgba(209, 213, 219, 0.6);
          background: rgba(255, 255, 255, 0.9);
          border-radius: 0.75rem;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          color: #374151;
          position: relative;
          overflow: hidden;
          width: 120px;
          min-width: 120px;
        }

        .category-pill::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.5s ease;
        }

        .category-pill:hover::before {
          left: 100%;
        }

        body.dark .category-pill {
          background: rgba(55, 65, 81, 0.9);
          border-color: rgba(75, 85, 99, 0.6);
          color: #d1d5db;
        }

        .category-pill:hover {
          background: rgba(255, 255, 255, 1);
          border-color: var(--category-color);
          color: var(--category-color);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        body.dark .category-pill:hover {
          background: rgba(55, 65, 81, 1);
          color: var(--category-color);
        }

        .category-pill.active {
          background: var(--category-color);
          color: white;
          border-color: var(--category-color);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .category-pill.dropdown-open {
          border-bottom-left-radius: 0.25rem;
          border-bottom-right-radius: 0.25rem;
        }

        .dropdown-arrow {
          transition: transform 0.3s ease;
        }

        .dropdown-arrow.rotated {
          transform: rotate(180deg);
        }

        .region-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          min-width: 160px;
          z-index: 9999;
          display: none;
        }

        body.dark .region-dropdown {
          background: #374151;
          border-color: #4b5563;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .region-dropdown.open {
          display: block;
          animation: dropdownFadeIn 0.2s ease-out;
        }

        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-header {
          padding: 0.5rem 0.75rem;
          font-size: 0.7rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #e5e7eb;
        }

        body.dark .dropdown-header {
          color: #9ca3af;
          border-bottom-color: #4b5563;
        }

        .region-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.6rem 0.75rem;
          border: none;
          background: transparent;
          color: #374151;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }

        body.dark .region-option {
          color: #d1d5db;
        }

        .region-option:hover {
          background: #f3f4f6;
          color: #2563eb;
        }

        body.dark .region-option:hover {
          background: #4b5563;
          color: #60a5fa;
        }

        .region-option.active {
          background: #2563eb;
          color: white;
          font-weight: 600;
        }

        body.dark .region-option.active {
          background: #3b82f6;
          color: white;
        }

        .region-option .flag {
          font-size: 1.1rem;
        }

        .region-option .check {
          margin-left: auto;
          color: #10b981;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            padding: 0 1rem;
          }

          .header-content {
            padding: 1rem 0;
            gap: 1rem;
            flex-wrap: wrap;
            align-items: center;
          }

          .logo {
            font-size: 1.4rem;
            flex: 1;
          }

          .logo-icon {
            width: 40px;
            height: 40px;
          }

          .nav-desktop {
            display: none;
          }

          .mobile-menu-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.75rem;
            background: rgba(255, 255, 255, 0.95);
            border: 2px solid #e5e7eb;
            border-radius: 0.75rem;
            color: #374151;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 48px;
            min-height: 48px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .header.dark .mobile-menu-btn {
            background: rgba(55, 65, 81, 0.95);
            border-color: #6b7280;
            color: #f9fafb;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          }

          .mobile-menu-btn:hover {
            background: rgba(255, 255, 255, 1);
            color: #1e293b;
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .header.dark .mobile-menu-btn:hover {
            background: rgba(55, 65, 81, 1);
            color: #f8fafc;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          }

          .mobile-nav-overlay {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            border-bottom: 2px solid #e5e7eb;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            z-index: 999;
            animation: slideDown 0.3s ease-out;
          }

          .header.dark .mobile-nav-overlay {
            background: rgba(17, 24, 39, 0.98);
            border-bottom-color: #374151;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .mobile-nav {
            display: flex;
            flex-direction: column;
            padding: 1.5rem 0;
          }

          .mobile-nav-link {
            display: flex;
            align-items: center;
            padding: 1.25rem 2rem;
            color: #374151;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.125rem;
            transition: all 0.3s ease;
            border-left: 4px solid transparent;
            position: relative;
            min-height: 56px;
          }

          .header.dark .mobile-nav-link {
            color: #e5e7eb;
          }

          .mobile-nav-link::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 0;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            transition: width 0.3s ease;
          }

          .mobile-nav-link:hover {
            background: rgba(59, 130, 246, 0.05);
            color: #2563eb;
            border-left-color: #3b82f6;
            transform: translateX(8px);
          }

          .header.dark .mobile-nav-link:hover {
            background: rgba(59, 130, 246, 0.1);
            color: #60a5fa;
          }

          .mobile-nav-link:hover::before {
            width: 4px;
          }

          .mobile-nav-link.active {
            background: rgba(59, 130, 246, 0.1);
            color: #2563eb;
            border-left-color: #3b82f6;
            font-weight: 700;
          }

          .header.dark .mobile-nav-link.active {
            background: rgba(59, 130, 246, 0.15);
            color: #60a5fa;
          }

          .mobile-nav-link.active::before {
            width: 4px;
          }

          .search-form {
            order: 3;
            flex: 1 1 100%;
            max-width: 100%;
            margin-top: 1rem;
          }

          .search-input {
            padding: 1rem 1.25rem 1rem 3.5rem;
            font-size: 1rem;
            border-radius: 0.75rem;
            border: 2px solid #e5e7eb;
            min-height: 48px;
          }

          .header.dark .search-input {
            border-color: #6b7280;
          }

          .search-input:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          }

          .search-icon {
            left: 1rem;
            width: 20px;
            height: 20px;
          }

          .header-actions {
            order: 2;
            display: flex;
            gap: 0.75rem;
          }

          .theme-toggle {
            padding: 0.75rem;
            border-radius: 0.75rem;
            border: 2px solid #e5e7eb;
            min-width: 48px;
            min-height: 48px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .header.dark .theme-toggle {
            border-color: #6b7280;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          }

          .theme-toggle:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .header.dark .theme-toggle:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          }

          .categories-bar {
            padding: 1rem 0 1.5rem 0;
          }

          .categories-scroll {
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            padding: 0.5rem 0 1rem 0;
            gap: 0.75rem;
          }

          .categories-scroll::-webkit-scrollbar {
            display: none;
          }

          .category-pill {
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            min-width: 110px;
            flex-shrink: 0;
            border-radius: 1rem;
            min-height: 44px;
          }

          .region-dropdown {
            min-width: 160px;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu-btn {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .header {
            padding: 0 0.75rem;
          }

          .header-content {
            padding: 0.75rem 0;
            gap: 0.75rem;
          }

          .logo {
            font-size: 1.2rem;
          }

          .logo-text {
            font-size: 1rem;
          }

          .logo-icon {
            width: 36px;
            height: 36px;
          }

          .search-input {
            padding: 0.875rem 1rem 0.875rem 3rem;
            font-size: 0.9rem;
            min-height: 44px;
          }

          .search-icon {
            left: 0.875rem;
            width: 18px;
            height: 18px;
          }

          .theme-toggle {
            padding: 0.625rem;
            min-width: 44px;
            min-height: 44px;
          }

          .mobile-menu-btn {
            padding: 0.625rem;
            min-width: 44px;
            min-height: 44px;
          }

          .mobile-nav-link {
            padding: 1rem 1.5rem;
            font-size: 1.0625rem;
            min-height: 52px;
          }

          .category-pill {
            padding: 0.625rem 0.875rem;
            font-size: 0.8125rem;
            min-width: 90px;
            min-height: 40px;
          }

          .category-pill .emoji {
            font-size: 1rem;
          }

          .region-dropdown {
            min-width: 140px;
          }

          .region-option {
            padding: 0.75rem;
            font-size: 0.875rem;
            min-height: 44px;
          }
        }
      `}</style>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;