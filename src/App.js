import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import RegionFilter from './components/RegionFilter';
import ApiStatus from './components/ApiStatus';
import LoginModal from './components/LoginModal';
import UserProfile from './components/UserProfile';
import LoginStatus from './components/LoginStatus';
import Market from './pages/Market';
import PersonalFinance from './pages/PersonalFinance';
import ExpertViews from './pages/ExpertViews';
import About from './pages/About';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import newsService from './services/newsApi';
import { RefreshCw, AlertCircle } from 'lucide-react';
import './utils/envTest'; // Test environment variables
import testDirectAPI from './utils/simpleApiTest';

const NewsCard = lazy(() => import('./components/NewsCard'));
const ParticleBackground = lazy(() => import('./components/ParticleBackground'));
const FloatingElements = lazy(() => import('./components/FloatingElements'));

const AppContent = () => {
  const { showLoginModal, setShowLoginModal, loginWithGoogle, continueAsGuest } = useAuth();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeRegion, setActiveRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.body.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [activeCategory, activeRegion]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (searchQuery) {
        response = await newsService.searchNews(searchQuery);
      } else {
        // Map 'all' region to 'all' for comprehensive API coverage
        const regionForAPI = activeRegion === 'all' ? 'all' : activeRegion;
        response = await newsService.getTopHeadlines(regionForAPI);
        if (activeCategory !== 'all') {
          response.articles = newsService.filterByCategory(response.articles, activeCategory);
        }
      }
      
      setNews(response.articles || []);
    } catch (err) {
      setError('Failed to fetch news. Please try again.');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeToggle = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query);
    setActiveCategory('all');
    
    try {
      setLoading(true);
      const response = await newsService.searchNews(query);
      setNews(response.articles || []);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
    setSearchQuery('');
  }, []);

  const handleRegionChange = useCallback((region) => {
    setActiveRegion(region);
    setSearchQuery('');
  }, []);

  const handleRefresh = useCallback(() => {
    fetchNews();
  }, [fetchNews]);

  const { featuredNews, regularNews, pageTitle, pageSubtitle } = useMemo(() => ({
    featuredNews: news.slice(0, 1),
    regularNews: news.slice(1),
    pageTitle: searchQuery ? `Search Results for "${searchQuery}"` : 
      `${activeRegion === 'all' ? 'Global' : activeRegion.charAt(0).toUpperCase() + activeRegion.slice(1)} Financial News`,
    pageSubtitle: `${activeCategory === 'all' ? 'All Categories' : 
      activeCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} • 
      ${activeRegion === 'all' ? 'Multi-Source Global Coverage' : 
      `${activeRegion.charAt(0).toUpperCase() + activeRegion.slice(1)} Market Updates`}`
  }), [news, searchQuery, activeRegion, activeCategory]);

  const NewsPage = () => (
    <div className="container">
      <ApiStatus activeRegion={activeRegion} newsCount={news.length} />
      
      <div className="content-header">
        <div className="title-section">
          <h1 className="page-title">{pageTitle}</h1>
          <p className="page-subtitle">{pageSubtitle}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleRefresh} className="refresh-btn" disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
            <span>Refresh</span>
          </button>
          <button 
            onClick={async () => {
              console.log('🧪 Testing All APIs Integration...');
              try {
                setLoading(true);
                // Force fetch from all APIs by setting region to 'all'
                const response = await newsService.getTopHeadlines('all');
                if (response.articles && response.articles.length > 0) {
                  setNews(response.articles);
                  console.log('✅ All APIs integration test successful:', response.articles.length, 'articles');
                } else {
                  console.log('❌ All APIs integration test failed - no articles');
                }
              } catch (error) {
                console.error('❌ All APIs integration test error:', error);
              } finally {
                setLoading(false);
              }
            }}
            className="refresh-btn"
            style={{ background: '#059669' }}
          >
            Test All APIs
          </button>
        </div>
      </div>



      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={handleRefresh} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading latest financial news...</p>
        </div>
      ) : (
        <div className="news-layout">
          <Suspense fallback={<div className="loading-container"><div className="spinner"></div></div>}>
            {featuredNews.length > 0 && (
              <section className="featured-section">
                <h2 className="section-title">Featured Story</h2>
                <NewsCard article={featuredNews[0]} variant="featured" />
              </section>
            )}

            {regularNews.length > 0 && (
              <section className="news-grid-section">
                <h2 className="section-title">
                  {searchQuery ? 'Search Results' : 'Latest News'}
                </h2>
                <div className="news-grid">
                  {regularNews.map((article, index) => (
                    <NewsCard key={article.id || index} article={article} />
                  ))}
                </div>
              </section>
            )}
          </Suspense>

          {news.length === 0 && !loading && (
            <div className="empty-state">
              <AlertCircle size={48} />
              <h3>No news found</h3>
              <p>Try adjusting your search or category filter</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onGoogleLogin={loginWithGoogle}
        onGuestLogin={continueAsGuest}
      />
      <Router>
        <div className="App" style={{ paddingTop: 'clamp(120px, 15vh, 160px)' }}>
          <Suspense fallback={null}>
            <ParticleBackground isDark={isDark} />
            <FloatingElements isDark={isDark} />
          </Suspense>
          <UserProfile />
          <LoginStatus />
          <Header 
          onSearch={handleSearch}
          onThemeToggle={handleThemeToggle}
          isDark={isDark}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          activeRegion={activeRegion}
          onRegionChange={handleRegionChange}
        />
        
        <main className="main-content">
          <Routes>
            <Route path="/market" element={<div className="container"><Market /></div>} />
            <Route path="/personal-finance" element={<PersonalFinance />} />
            <Route path="/expert-views" element={<ExpertViews />} />
            <Route path="/about" element={<About />} />
            <Route path="/" element={<NewsPage />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <p>&copy; 2024 WealthWire247. All rights reserved.</p>
              <p className="disclaimer">
                Market data and news are for informational purposes only and should not be considered as investment advice.
              </p>
            </div>
          </div>
        </footer>

        <style jsx>{`
          .main-content {
            min-height: calc(100vh - 140px);
            padding: clamp(1rem, 3vw, 2rem) 0;
          }

          .content-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: clamp(1rem, 3vw, 2rem);
            gap: 1rem;
          }

          .title-section {
            flex: 1;
            min-width: 0;
          }

          .page-title {
            font-size: clamp(1.5rem, 5vw, 2.25rem);
            font-weight: 700;
            color: #111827;
            margin-bottom: 0.5rem;
            line-height: 1.2;
            word-wrap: break-word;
          }

          body.dark .page-title {
            color: #f9fafb;
          }

          .page-subtitle {
            color: #6b7280;
            font-size: clamp(0.875rem, 2.5vw, 1rem);
            line-height: 1.4;
          }

          body.dark .page-subtitle {
            color: #9ca3af;
          }

          .refresh-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem 1rem;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 0.375rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s ease;
            white-space: nowrap;
          }

          .refresh-btn:hover:not(:disabled) {
            background: #1d4ed8;
          }

          body.dark .refresh-btn {
            background: #3b82f6;
          }

          body.dark .refresh-btn:hover:not(:disabled) {
            background: #2563eb;
          }

          .refresh-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .spinning {
            animation: spin 1s linear infinite;
          }

          .filters-container {
            margin-bottom: 1.5rem;
          }

          .news-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
            gap: clamp(1rem, 3vw, 2rem);
            animation: fadeInUp 0.6s ease-out;
          }

          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: clamp(2rem, 5vw, 4rem) 1rem;
            gap: 1rem;
          }

          .error-message {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 0.375rem;
            color: #dc2626;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
          }

          body.dark .error-message {
            background: #1f2937;
            border-color: #ef4444;
            color: #fca5a5;
          }

          .retry-btn {
            padding: 0.5rem 1rem;
            background: #dc2626;
            color: white;
            border: none;
            border-radius: 0.25rem;
            cursor: pointer;
            font-size: 0.875rem;
          }

          .section-title {
            font-size: clamp(1.125rem, 3vw, 1.25rem);
            font-weight: 600;
            color: #111827;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #2563eb;
            display: inline-block;
          }

          body.dark .section-title {
            color: #f9fafb;
            border-bottom-color: #3b82f6;
          }

          .news-layout {
            display: flex;
            flex-direction: column;
            gap: 3rem;
          }

          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 4rem 2rem;
            text-align: center;
            color: #6b7280;
          }

          body.dark .empty-state {
            color: #9ca3af;
          }

          .empty-state h3 {
            margin: 1rem 0 0.5rem;
            color: #111827;
          }

          body.dark .empty-state h3 {
            color: #f9fafb;
          }

          .footer {
            background: #f8fafc;
            border-top: 1px solid #e5e7eb;
            padding: clamp(1.5rem, 3vw, 2rem) 0;
            margin-top: clamp(2rem, 5vw, 4rem);
          }

          body.dark .footer {
            background: #111827;
            border-top-color: #374151;
          }

          .footer-content {
            text-align: center;
            color: #6b7280;
          }

          body.dark .footer-content {
            color: #9ca3af;
          }

          .disclaimer {
            font-size: clamp(0.75rem, 2vw, 0.875rem);
            margin-top: 0.5rem;
            opacity: 0.8;
          }

          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @media (max-width: 768px) {
            .content-header {
              flex-direction: column;
              align-items: stretch;
              gap: 1rem;
            }

            .refresh-btn {
              align-self: flex-start;
              padding: 0.6rem 1rem;
              font-size: 0.9rem;
            }

            .news-grid {
              grid-template-columns: 1fr;
              gap: 1rem;
            }

            .filters-container {
              margin-bottom: 1rem;
            }
          }

          @media (max-width: 480px) {
            .refresh-btn span {
              display: none;
            }

            .error-message {
              flex-direction: column;
              align-items: flex-start;
              gap: 0.5rem;
              padding: 0.75rem;
            }

            .news-grid {
              gap: 0.75rem;
            }
          }

          @media (min-width: 1200px) {
            .news-grid {
              grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
            }
          }
        `}</style>
        </div>
      </Router>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;