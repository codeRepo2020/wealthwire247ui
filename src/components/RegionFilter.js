import React, { memo } from 'react';

const RegionFilter = memo(({ activeRegion, onRegionChange }) => {
  const regions = [
    { id: 'all', label: 'Global', flag: '🌍' },
    { id: 'us', label: 'US', flag: '🇺🇸' },
    { id: 'india', label: 'India', flag: '🇮🇳' },
    { id: 'europe', label: 'Europe', flag: '🇪🇺' },
    { id: 'china', label: 'China', flag: '🇨🇳' }
  ];

  return (
    <div className="region-filter">
      <div className="filter-header">
        <span className="filter-label">Region</span>
        <div className="active-indicator">{regions.find(r => r.id === activeRegion)?.flag} {regions.find(r => r.id === activeRegion)?.label}</div>
      </div>
      <div className="region-pills">
        {regions.map((region) => (
          <button
            key={region.id}
            onClick={() => onRegionChange(region.id)}
            className={`region-pill ${activeRegion === region.id ? 'active' : ''}`}
          >
            <span className="flag">{region.flag}</span>
            <span className="label">{region.label}</span>
          </button>
        ))}
      </div>

      <style jsx>{`
        .region-filter {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        body.dark .region-filter {
          background: #1f2937;
          border-color: #374151;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .filter-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        body.dark .filter-label {
          color: #9ca3af;
        }

        .active-indicator {
          font-size: 0.875rem;
          font-weight: 500;
          color: #2563eb;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        body.dark .active-indicator {
          color: #60a5fa;
        }

        .region-pills {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .region-pill {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.75rem;
          border: 1px solid #d1d5db;
          background: #ffffff;
          border-radius: 0.375rem;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          color: #374151;
        }

        body.dark .region-pill {
          background: #374151;
          border-color: #4b5563;
          color: #d1d5db;
        }

        .region-pill:hover {
          background: #f3f4f6;
          border-color: #2563eb;
          color: #2563eb;
        }

        body.dark .region-pill:hover {
          background: #4b5563;
          border-color: #60a5fa;
          color: #60a5fa;
        }

        .region-pill.active {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
          font-weight: 600;
        }

        body.dark .region-pill.active {
          background: #3b82f6;
          border-color: #3b82f6;
        }

        .flag {
          font-size: 1rem;
          line-height: 1;
        }

        .label {
          font-size: 0.75rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .region-filter {
            padding: 0.75rem;
          }
          
          .region-pill {
            padding: 0.35rem 0.6rem;
          }
          
          .label {
            font-size: 0.75rem;
          }
        }

        @media (max-width: 480px) {
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

RegionFilter.displayName = 'RegionFilter';

export default RegionFilter;