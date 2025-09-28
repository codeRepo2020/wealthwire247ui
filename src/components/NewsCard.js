import React, { memo } from 'react';
import { Clock, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getOptimizedImageUrl } from '../utils/imageOptimization';

const NewsCard = memo(({ article, variant = 'default' }) => {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });
  
  const handleCardClick = () => {
    if (article.url && article.url !== '#') {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };
  
  const getCategoryColor = (category) => {
    const colors = {
      'monetary-policy': 'bg-blue-100 text-blue-800',
      'technology': 'bg-purple-100 text-purple-800',
      'cryptocurrency': 'bg-yellow-100 text-yellow-800',
      'energy': 'bg-green-100 text-green-800',
      'real-estate': 'bg-red-100 text-red-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.default;
  };
  
  const isClickable = article.url && article.url !== '#';

  if (variant === 'featured') {
    return (
      <article 
        className={`news-card featured ${isClickable ? 'clickable' : ''}`}
        onClick={isClickable ? handleCardClick : undefined}
        style={{ cursor: isClickable ? 'pointer' : 'default' }}
      >
        <div className="featured-image">
          <img 
            src={getOptimizedImageUrl(article.urlToImage, 800)} 
            alt={article.title}
            loading="lazy"
            onError={(e) => {
              e.target.src = getOptimizedImageUrl(null, 800);
            }}
          />
          <div className="featured-overlay">
            <span className={`category-tag ${getCategoryColor(article.category)}`}>
              {article.category?.replace('-', ' ').toUpperCase() || 'BUSINESS'}
            </span>
          </div>
        </div>
        <div className="featured-content">
          <h2 className="featured-title">{article.title}</h2>
          <p className="featured-description">{article.description}</p>
          <div className="featured-meta">
            <span className="source">{article.source.name}</span>
            {article.region && (
              <>
                <div className="meta-divider">•</div>
                <span className="region">{article.region.toUpperCase()}</span>
              </>
            )}
            <div className="meta-divider">•</div>
            <span className="time">
              <Clock size={14} />
              {timeAgo}
            </span>
            {isClickable && (
              <button 
                className="read-more" 
                onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
              >
                <ExternalLink size={16} />
                Read Full Article
              </button>
            )}
          </div>
        </div>

        <style jsx>{`
          .news-card.featured {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            border: 1px solid var(--light-border);
            border-radius: 1.5rem;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            position: relative;
            box-shadow: var(--shadow-light);
          }

          body.dark .news-card.featured {
            background: rgba(30, 41, 59, 0.95);
            border-color: var(--dark-border);
          }

          .news-card.featured::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--primary-gradient);
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: -1;
          }

          .news-card.featured:hover {
            transform: translateY(-6px);
            box-shadow: 0 15px 35px rgba(37, 99, 235, 0.2);
          }
          
          .news-card.featured.clickable:hover {
            transform: translateY(-8px) scale(1.01);
            box-shadow: 0 20px 40px rgba(37, 99, 235, 0.25);
          }

          body.dark .news-card.featured:hover {
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
          }

          .news-card.featured:hover::before {
            opacity: 0.05;
          }

          .featured-image {
            position: relative;
            height: clamp(200px, 40vw, 300px);
            overflow: hidden;
          }

          .featured-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }

          .news-card.featured:hover .featured-image img {
            transform: scale(1.05);
          }

          .featured-overlay {
            position: absolute;
            top: 1rem;
            left: 1rem;
          }

          .category-tag {
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.75rem;
            font-weight: 600;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
          }

          .category-tag:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }

          .featured-content {
            padding: 1.5rem;
          }

          .featured-title {
            font-size: clamp(1.25rem, 4vw, 1.5rem);
            font-weight: 700;
            line-height: 1.3;
            margin-bottom: 1rem;
            color: var(--text-primary);
          }

          .featured-description {
            color: var(--text-secondary);
            line-height: 1.6;
            margin-bottom: 1.5rem;
          }

          .featured-meta {
            display: flex;
            align-items: center;
            gap: 1rem;
            font-size: 0.875rem;
            color: var(--text-secondary);
          }

          .source {
            font-weight: 600;
            color: var(--primary-color);
          }

          .region {
            font-size: 0.7rem;
            font-weight: 500;
            color: var(--text-secondary);
            background: var(--light-surface);
            padding: 0.2rem 0.5rem;
            border-radius: 0.5rem;
            margin-left: 0.5rem;
          }

          body.dark .region {
            background: var(--dark-surface);
            color: var(--text-secondary-dark);
          }

          .time {
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }

          .read-more {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            color: var(--primary-color);
            background: none;
            border: none;
            font-weight: 500;
            margin-left: auto;
            transition: color 0.2s ease;
            cursor: pointer;
          }

          .read-more:hover {
            color: #1557b0;
          }

          .meta-divider {
            color: var(--light-border);
          }

          @media (max-width: 768px) {
            .featured-content {
              padding: 1rem;
            }

            .featured-meta {
              flex-wrap: wrap;
              gap: 0.5rem;
              font-size: 0.8rem;
            }

            .read-more {
              margin-left: 0;
              margin-top: 0.5rem;
            }
          }

          @media (max-width: 480px) {
            .featured-content {
              padding: 0.75rem;
            }

            .featured-meta {
              flex-direction: column;
              align-items: flex-start;
              gap: 0.25rem;
            }

            .meta-divider {
              display: none;
            }
          }
        `}</style>
      </article>
    );
  }

  return (
    <article 
      className={`news-card ${isClickable ? 'clickable' : ''}`}
      onClick={isClickable ? handleCardClick : undefined}
      style={{ cursor: isClickable ? 'pointer' : 'default' }}
    >
      <div className="card-image">
        <img 
          src={getOptimizedImageUrl(article.urlToImage, 400)} 
          alt={article.title}
          loading="lazy"
          onError={(e) => {
            e.target.src = getOptimizedImageUrl(null, 400);
          }}
        />
      </div>
      <div className="card-content">
        <span className={`category-tag ${getCategoryColor(article.category)}`}>
          {article.category?.replace('-', ' ').toUpperCase() || 'BUSINESS'}
        </span>
        <h3 className="card-title">{article.title}</h3>
        <p className="card-description">{article.description}</p>
        <div className="card-meta">
          <div className="meta-left">
            <span className="source">{article.source.name}</span>
            {article.region && (
              <span className="region">{article.region.toUpperCase()}</span>
            )}
          </div>
          <span className="time">
            <Clock size={12} />
            {timeAgo}
          </span>
        </div>
        {isClickable && (
          <button 
            className="card-link" 
            onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
          >
            <ExternalLink size={14} />
          </button>
        )}
      </div>

      <style jsx>{`
        .news-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border: 1px solid var(--light-border);
          border-radius: 1rem;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          cursor: pointer;
          box-shadow: var(--shadow-light);
        }

        body.dark .news-card {
          background: rgba(30, 41, 59, 0.95);
          border-color: var(--dark-border);
        }

        .news-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--accent-gradient);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .news-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 25px rgba(37, 99, 235, 0.15);
        }
        
        .news-card.clickable:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 15px 30px rgba(37, 99, 235, 0.2);
        }

        body.dark .news-card:hover {
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3);
        }

        .news-card:hover::after {
          opacity: 0.03;
        }

        .card-image {
          height: clamp(150px, 30vw, 200px);
          overflow: hidden;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          filter: brightness(0.9) contrast(1.1);
        }

        .news-card:hover .card-image img {
          transform: scale(1.1) rotate(1deg);
          filter: brightness(1.1) contrast(1.2) saturate(1.2);
        }

        .card-content {
          padding: 1.25rem;
        }

        .category-tag {
          padding: 0.25rem 0.5rem;
          border-radius: 0.75rem;
          font-size: 0.7rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          display: inline-block;
        }

        .card-title {
          font-size: clamp(1rem, 3vw, 1.1rem);
          font-weight: 600;
          line-height: 1.4;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-description {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .meta-left {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .source {
          font-weight: 600;
          color: var(--primary-color);
        }

        .card-meta .region {
          font-size: 0.65rem;
          font-weight: 500;
          color: var(--text-secondary);
          background: var(--light-surface);
          padding: 0.15rem 0.4rem;
          border-radius: 0.4rem;
        }

        body.dark .card-meta .region {
          background: var(--dark-surface);
          color: var(--text-secondary-dark);
        }

        .time {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .card-link {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: var(--primary-color);
          padding: 0.5rem;
          border-radius: 50%;
          color: white;
          border: none;
          transition: all 0.2s ease;
          opacity: 0;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
          cursor: pointer;
        }

        .news-card:hover .card-link {
          opacity: 1;
        }

        .card-link:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
        }
      `}</style>
    </article>
  );
});

NewsCard.displayName = 'NewsCard';

export default NewsCard;