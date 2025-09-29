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
              <span className="price">${Number(stock.price || 0).toFixed(2)}</span>
              <span className={`change ${Number(stock.change || 0) >= 0 ? 'positive' : 'negative'}`}>
                {Number(stock.change || 0) >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {Number(stock.change || 0) >= 0 ? '+' : ''}{Number(stock.change || 0).toFixed(2)} ({Number(stock.changePercent || 0).toFixed(2)}%)
              </span>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
});

MarketTicker.displayName = 'MarketTicker';

export default MarketTicker;