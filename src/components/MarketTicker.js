import React, { useState, useEffect, memo } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import newsService from '../services/newsApi';

const MarketTicker = memo(({ region = 'world' }) => {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const data = await newsService.getMarketData(region);
        setMarketData(data);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    
    // Update every 30 seconds
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, [region]);

  if (loading) {
    return (
      <div className="market-ticker loading">
        <div className="ticker-header">
          <Activity size={20} />
          <span>Loading Market Data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="market-ticker">
      <div className="ticker-header">
        <Activity size={20} />
        <span>Live Markets</span>
        <div className="live-indicator">
          <div className="pulse"></div>
          LIVE
        </div>
      </div>
      
      <div className="ticker-scroll">
        <div className="ticker-content">
          {marketData.concat(marketData).map((stock, index) => (
            <div key={`${stock.symbol}-${index}`} className="ticker-item">
              <span className="symbol">{stock.symbol}</span>
              <span className="price">${stock.price.toFixed(2)}</span>
              <span className={`change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                {stock.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .market-ticker {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border: 1px solid var(--light-border);
          border-radius: 1rem;
          overflow: hidden;
          margin-bottom: 2rem;
          box-shadow: var(--shadow-light);
          position: relative;
        }

        body.dark .market-ticker {
          background: rgba(30, 41, 59, 0.95);
          border-color: var(--dark-border);
        }

        .market-ticker::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .ticker-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: var(--primary-gradient);
          color: white;
          font-weight: 600;
          position: relative;
          overflow: hidden;
        }

        .ticker-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          animation: headerShine 4s infinite;
        }

        @keyframes headerShine {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-left: auto;
          font-size: 0.8rem;
        }

        .pulse {
          width: 8px;
          height: 8px;
          background: var(--success-gradient);
          border-radius: 50%;
          animation: pulse 2s infinite;
          box-shadow: 0 0 10px rgba(52, 168, 83, 0.5);
        }

        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(52, 168, 83, 0.7), 0 0 10px rgba(52, 168, 83, 0.5);
          }
          70% {
            transform: scale(1.1);
            box-shadow: 0 0 0 15px rgba(52, 168, 83, 0), 0 0 20px rgba(52, 168, 83, 0.3);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(52, 168, 83, 0), 0 0 10px rgba(52, 168, 83, 0.5);
          }
        }

        .ticker-scroll {
          height: 60px;
          overflow: hidden;
          position: relative;
        }

        .ticker-content {
          display: flex;
          align-items: center;
          height: 100%;
          animation: scroll 60s linear infinite;
          white-space: nowrap;
          gap: 2rem;
        }

        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .ticker-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0 1.5rem;
          min-width: 220px;
          flex-shrink: 0;
          transition: all 0.3s ease;
          position: relative;
        }

        .ticker-item:not(:last-child)::after {
          content: '';
          position: absolute;
          right: -1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1px;
          height: 30px;
          background: rgba(255, 255, 255, 0.2);
        }

        .ticker-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.05);
        }

        .symbol {
          font-weight: 700;
          color: var(--text-primary);
          min-width: 60px;
        }

        .price {
          font-weight: 600;
          color: var(--text-primary);
          min-width: 80px;
        }

        .change {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .change.positive {
          color: var(--success-color);
          font-weight: 600;
        }

        .change.negative {
          color: var(--danger-color);
          font-weight: 600;
        }

        .loading {
          padding: 1rem 1.5rem;
        }

        @media (max-width: 768px) {
          .ticker-item {
            min-width: 180px;
            padding: 0 1rem;
            gap: 0.5rem;
          }

          .symbol {
            min-width: 45px;
            font-size: 0.9rem;
          }

          .price {
            min-width: 65px;
            font-size: 0.9rem;
          }

          .change {
            font-size: 0.75rem;
          }

          .ticker-content {
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
});

MarketTicker.displayName = 'MarketTicker';

export default MarketTicker;