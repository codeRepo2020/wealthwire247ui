import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

const ApiStatus = () => {
  const [apiStatus, setApiStatus] = useState({
    newsapi: false,
    alphavantage: false,
    isLive: false
  });

  useEffect(() => {
    const checkApiStatus = () => {
      const newsApiKey = process.env.REACT_APP_NEWS_API_KEY;
      const alphaVantageKey = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
      
      const status = {
        newsapi: newsApiKey && newsApiKey !== 'demo-key',
        alphavantage: alphaVantageKey && alphaVantageKey !== 'demo',
        isLive: (newsApiKey && newsApiKey !== 'demo-key') || (alphaVantageKey && alphaVantageKey !== 'demo')
      };
      
      setApiStatus(status);
    };

    checkApiStatus();
  }, []);

  if (!apiStatus.isLive) {
    return (
      <div className="api-status demo">
        <WifiOff size={16} />
        <span>Demo Mode - Using Mock Data</span>
        <style jsx>{`
          .api-status {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 1rem;
            font-size: 0.8rem;
            font-weight: 500;
            margin-bottom: 1rem;
          }

          .api-status.demo {
            background: rgba(251, 188, 4, 0.1);
            color: #d97706;
            border: 1px solid rgba(251, 188, 4, 0.3);
          }

          .api-status.live {
            background: rgba(34, 197, 94, 0.1);
            color: #16a34a;
            border: 1px solid rgba(34, 197, 94, 0.3);
          }

          body.dark .api-status.demo {
            background: rgba(251, 188, 4, 0.15);
            color: #fbbf24;
          }

          body.dark .api-status.live {
            background: rgba(34, 197, 94, 0.15);
            color: #22c55e;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="api-status live">
      <Wifi size={16} />
      <span>Live Data Active</span>
      {apiStatus.newsapi && <span>• NewsAPI (✓)</span>}
      {apiStatus.alphavantage && <span>• Alpha Vantage (✓)</span>}
      <span className="api-note">Real-time financial news & market data</span>
      <style jsx>{`
        .api-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 1rem;
          font-size: 0.8rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .api-status.live {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
          border: 1px solid rgba(34, 197, 94, 0.3);
          flex-wrap: wrap;
        }

        body.dark .api-status.live {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
        }

        .api-note {
          font-size: 0.7rem;
          opacity: 0.8;
          margin-left: auto;
        }
      `}</style>
    </div>
  );
};

export default ApiStatus;