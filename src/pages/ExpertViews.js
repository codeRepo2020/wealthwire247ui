import React, { useState, memo } from 'react';
import { User, Calendar, Clock, TrendingUp, Eye, ThumbsUp, Share2, BookOpen, Award, Star } from 'lucide-react';

const ExpertViews = memo(() => {
  const [activeCategory, setActiveCategory] = useState('all');

  const experts = [
    {
      id: 1,
      name: 'Radhika Gupta',
      title: 'CEO, Edelweiss Asset Management',
      avatar: '👩‍💼',
      expertise: 'Mutual Funds',
      rating: 4.8,
      followers: '2.3M'
    },
    {
      id: 2,
      name: 'Nilesh Shah',
      title: 'MD, Kotak Mahindra AMC',
      avatar: '👨‍💼',
      expertise: 'Market Strategy',
      rating: 4.9,
      followers: '1.8M'
    },
    {
      id: 3,
      name: 'Prashant Jain',
      title: 'Former CIO, HDFC AMC',
      avatar: '👨‍💼',
      expertise: 'Equity Research',
      rating: 4.7,
      followers: '1.5M'
    }
  ];

  const articles = [
    {
      id: 1,
      title: 'Why SIP is the Best Investment Strategy for Young Indians',
      excerpt: 'Systematic Investment Plans offer the perfect blend of discipline and growth potential for millennials starting their investment journey.',
      author: experts[0],
      category: 'Investment',
      readTime: '5 min',
      publishedAt: '2024-01-15',
      views: 15420,
      likes: 892,
      image: '📈',
      tags: ['SIP', 'Mutual Funds', 'Investment']
    },
    {
      id: 2,
      title: 'Market Outlook 2024: Navigating Volatility in Uncertain Times',
      excerpt: 'A comprehensive analysis of market trends and investment opportunities in the current economic landscape.',
      author: experts[1],
      category: 'Market Analysis',
      readTime: '8 min',
      publishedAt: '2024-01-12',
      views: 23150,
      likes: 1247,
      image: '📊',
      tags: ['Market', 'Analysis', 'Strategy']
    },
    {
      id: 3,
      title: 'Small Cap vs Large Cap: Where to Invest in 2024',
      excerpt: 'Understanding the risk-reward dynamics between small cap and large cap stocks in the current market scenario.',
      author: experts[2],
      category: 'Equity',
      readTime: '6 min',
      publishedAt: '2024-01-10',
      views: 18750,
      likes: 956,
      image: '🎯',
      tags: ['Equity', 'Small Cap', 'Large Cap']
    },
    {
      id: 4,
      title: 'Crypto in Your Portfolio: A Balanced Approach',
      excerpt: 'How to incorporate cryptocurrency investments while maintaining a diversified and balanced portfolio.',
      author: experts[0],
      category: 'Cryptocurrency',
      readTime: '7 min',
      publishedAt: '2024-01-08',
      views: 12890,
      likes: 743,
      image: '₿',
      tags: ['Crypto', 'Portfolio', 'Diversification']
    },
    {
      id: 5,
      title: 'Tax-Saving Investments: Beyond ELSS',
      excerpt: 'Exploring various tax-saving investment options beyond Equity Linked Savings Schemes for optimal tax planning.',
      author: experts[1],
      category: 'Tax Planning',
      readTime: '9 min',
      publishedAt: '2024-01-05',
      views: 21340,
      likes: 1156,
      image: '💰',
      tags: ['Tax', 'ELSS', 'Planning']
    },
    {
      id: 6,
      title: 'Real Estate vs Stock Market: The Ultimate Comparison',
      excerpt: 'A detailed comparison of real estate and stock market investments to help you make informed decisions.',
      author: experts[2],
      category: 'Investment',
      readTime: '10 min',
      publishedAt: '2024-01-03',
      views: 19680,
      likes: 1089,
      image: '🏠',
      tags: ['Real Estate', 'Stocks', 'Comparison']
    }
  ];

  const categories = ['all', 'Investment', 'Market Analysis', 'Equity', 'Cryptocurrency', 'Tax Planning'];

  const filteredArticles = activeCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === activeCategory);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="expert-views">
      <div className="container">
        <div className="page-header">
          <h1>Expert Views</h1>
          <p>Insights from India's top financial experts</p>
        </div>

        <div className="experts-showcase">
          <h2>Featured Experts</h2>
          <div className="experts-grid">
            {experts.map((expert) => (
              <div key={expert.id} className="expert-card">
                <div className="expert-avatar">{expert.avatar}</div>
                <div className="expert-info">
                  <h3>{expert.name}</h3>
                  <p className="expert-title">{expert.title}</p>
                  <div className="expert-stats">
                    <div className="stat">
                      <Star size={16} />
                      <span>{expert.rating}</span>
                    </div>
                    <div className="stat">
                      <User size={16} />
                      <span>{expert.followers}</span>
                    </div>
                  </div>
                  <span className="expertise-tag">{expert.expertise}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="articles-section">
          <div className="section-header">
            <h2>Latest Articles</h2>
            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                >
                  {category === 'all' ? 'All' : category}
                </button>
              ))}
            </div>
          </div>

          <div className="articles-grid">
            {filteredArticles.map((article) => (
              <article key={article.id} className="article-card">
                <div className="article-header">
                  <div className="article-image">{article.image}</div>
                  <div className="article-meta">
                    <span className="category-tag">{article.category}</span>
                    <div className="article-stats">
                      <div className="stat">
                        <Eye size={14} />
                        <span>{formatNumber(article.views)}</span>
                      </div>
                      <div className="stat">
                        <ThumbsUp size={14} />
                        <span>{formatNumber(article.likes)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="article-content">
                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-excerpt">{article.excerpt}</p>
                  
                  <div className="article-tags">
                    {article.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="article-footer">
                  <div className="author-info">
                    <div className="author-avatar">{article.author.avatar}</div>
                    <div className="author-details">
                      <span className="author-name">{article.author.name}</span>
                      <div className="publish-info">
                        <Calendar size={12} />
                        <span>{formatDate(article.publishedAt)}</span>
                        <Clock size={12} />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                  <button className="share-btn">
                    <Share2 size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .expert-views {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 2rem 0;
        }

        body.dark .expert-views {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .page-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .page-header p {
          color: #6b7280;
          font-size: 1.1rem;
        }

        body.dark .page-header p {
          color: #9ca3af;
        }

        .experts-showcase {
          margin-bottom: 4rem;
        }

        .experts-showcase h2 {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 2rem;
          color: #1f2937;
        }

        body.dark .experts-showcase h2 {
          color: #f9fafb;
        }

        .experts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .expert-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 1rem;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        body.dark .expert-card {
          background: rgba(30, 41, 59, 0.9);
          border-color: rgba(55, 65, 81, 0.3);
        }

        .expert-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .expert-avatar {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .expert-info h3 {
          margin-bottom: 0.5rem;
          color: #1f2937;
          font-size: 1.25rem;
        }

        body.dark .expert-info h3 {
          color: #f9fafb;
        }

        .expert-title {
          color: #6b7280;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        body.dark .expert-title {
          color: #9ca3af;
        }

        .expert-stats {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        body.dark .stat {
          color: #9ca3af;
        }

        .expertise-tag {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .section-header h2 {
          font-size: 2rem;
          color: #1f2937;
        }

        body.dark .section-header h2 {
          color: #f9fafb;
        }

        .category-filters {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .category-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.875rem;
        }

        body.dark .category-btn {
          background: #374151;
          border-color: #4b5563;
          color: #d1d5db;
        }

        .category-btn:hover {
          border-color: #667eea;
          color: #667eea;
        }

        .category-btn.active {
          background: #667eea;
          border-color: #667eea;
          color: white;
        }

        .articles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .article-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 1rem;
          padding: 1.5rem;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        body.dark .article-card {
          background: rgba(30, 41, 59, 0.9);
          border-color: rgba(55, 65, 81, 0.3);
        }

        .article-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }

        .article-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .article-image {
          font-size: 2rem;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          border-radius: 0.5rem;
        }

        body.dark .article-image {
          background: #4b5563;
        }

        .article-meta {
          text-align: right;
        }

        .category-tag {
          background: #e0e7ff;
          color: #3730a3;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          display: inline-block;
        }

        body.dark .category-tag {
          background: #312e81;
          color: #c7d2fe;
        }

        .article-stats {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .article-stats .stat {
          font-size: 0.75rem;
        }

        .article-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        body.dark .article-title {
          color: #f9fafb;
        }

        .article-excerpt {
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        body.dark .article-excerpt {
          color: #9ca3af;
        }

        .article-tags {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .tag {
          background: #f3f4f6;
          color: #374151;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
        }

        body.dark .tag {
          background: #4b5563;
          color: #d1d5db;
        }

        .article-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        body.dark .article-footer {
          border-top-color: #4b5563;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .author-avatar {
          font-size: 1.5rem;
        }

        .author-name {
          font-weight: 500;
          color: #1f2937;
          font-size: 0.875rem;
        }

        body.dark .author-name {
          color: #f9fafb;
        }

        .publish-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }

        body.dark .publish-info {
          color: #9ca3af;
        }

        .share-btn {
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #6b7280;
        }

        body.dark .share-btn {
          background: #374151;
          border-color: #4b5563;
          color: #9ca3af;
        }

        .share-btn:hover {
          border-color: #667eea;
          color: #667eea;
        }

        @media (max-width: 768px) {
          .page-header h1 {
            font-size: 2rem;
          }

          .experts-grid {
            grid-template-columns: 1fr;
          }

          .articles-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            align-items: stretch;
          }

          .category-filters {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
});

ExpertViews.displayName = 'ExpertViews';

export default ExpertViews;