import React, { memo } from 'react';

const CategoryFilter = memo(({ activeCategory, onCategoryChange }) => {
  const categories = [
    { id: 'all', label: 'All', emoji: '🌍', color: '#6366f1' },
    { id: 'technology', label: 'Tech', emoji: '📱', color: '#8b5cf6' },
    { id: 'cryptocurrency', label: 'Crypto', emoji: '₿', color: '#f59e0b' },
    { id: 'markets', label: 'Markets', emoji: '📈', color: '#10b981' },
    { id: 'monetary-policy', label: 'Policy', emoji: '🏦', color: '#ef4444' },
    { id: 'banking', label: 'Banking', emoji: '🏦', color: '#06b6d4' },
    { id: 'economy', label: 'Economy', emoji: '🌐', color: '#84cc16' }
  ];

  return (
    <div className="category-filter">
      <div className="filter-header">
        <span className="filter-label">Category</span>
        <div className="active-indicator">
          {categories.find(c => c.id === activeCategory)?.emoji} {categories.find(c => c.id === activeCategory)?.label}
        </div>
      </div>
      <div className="category-grid">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`category-chip ${activeCategory === category.id ? 'active' : ''}`}
            style={{
              '--category-color': category.color,
              '--category-color-light': category.color + '20'
            }}
          >
            <span className="emoji">{category.emoji}</span>
            <span className="label">{category.label}</span>
          </button>
        ))}
      </div>

      <style jsx>{`
        .category-filter {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid var(--light-border);
          border-radius: 0.75rem;
          padding: 1rem;
        }

        body.dark .category-filter {
          background: rgba(30, 41, 59, 0.8);
          border-color: var(--dark-border);
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .filter-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .active-indicator {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--category-color, var(--primary-color));
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
          gap: 0.5rem;
        }

        .category-chip {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.6rem 0.4rem;
          border: 1px solid transparent;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 0.75rem;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        body.dark .category-chip {
          background: rgba(255, 255, 255, 0.1);
        }

        .category-chip::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--category-color-light);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .category-chip:hover::before {
          opacity: 1;
        }

        .category-chip:hover {
          border-color: var(--category-color);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .category-chip.active {
          background: var(--category-color);
          color: white;
          border-color: var(--category-color);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .category-chip.active::before {
          opacity: 0;
        }

        .category-chip.active:hover {
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .emoji {
          font-size: 1.2rem;
          line-height: 1;
          position: relative;
          z-index: 1;
        }

        .label {
          font-size: 0.7rem;
          font-weight: 600;
          text-align: center;
          line-height: 1.2;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .category-filter {
            padding: 0.75rem;
          }
          
          .category-grid {
            grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
            gap: 0.4rem;
          }
          
          .category-chip {
            padding: 0.5rem 0.3rem;
          }
          
          .emoji {
            font-size: 1rem;
          }
          
          .label {
            font-size: 0.65rem;
          }
        }

        @media (max-width: 480px) {
          .category-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          
          .label {
            display: none;
          }
          
          .active-indicator .label {
            display: inline;
          }
        }
      `}</style>
    </div>
  );
});

CategoryFilter.displayName = 'CategoryFilter';

export default CategoryFilter;