import React, { useState, useEffect, memo } from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3, Globe, Building2, Wifi, WifiOff } from 'lucide-react';
import newsService from '../services/newsApi';
import marketDataService from '../services/marketDataService';

const MarketCard = memo(({ title, data, icon: Icon, type = 'stock' }) => (
  <div className="market-card">
    <div className="card-header">
      <Icon size={20} />
      <h3>{title}</h3>
    </div>
    <div className="card-content">
      {data.map((item, index) => (
        <div key={index} className="market-item">
          <div className="item-info">
            <span className="symbol">{item.symbol}</span>
            <span className="name">{item.name}</span>
          </div>
          <div className="item-data">
            <span className="price">
              {type === 'index' ? item.value.toLocaleString() : 
                `${item.currency === 'INR' ? '₹' : '$'}${item.price.toFixed(2)}`}
            </span>
            <span className={`change ${item.change >= 0 ? 'positive' : 'negative'}`}>
              {item.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
));

const Market = memo(() => {
  const [marketData, setMarketData] = useState({
    indices: [],
    stocks: [],
    commodities: [],
    forex: []
  });
  const [loading, setLoading] = useState(true);
  const [activeRegion, setActiveRegion] = useState('world');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');

  const regions = [
    { id: 'world', name: 'Global', flag: '🌍' },
    { id: 'us', name: 'United States', flag: '🇺🇸' },
    { id: 'india', name: 'India', flag: '🇮🇳' },
    { id: 'europe', name: 'Europe', flag: '🇪🇺' },
    { id: 'china', name: 'China', flag: '🇨🇳' }
  ];

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, [activeRegion]);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      setApiStatus('loading');
      
      if (marketDataService.isApiConfigured()) {
        console.log('🔄 Testing API connection first...');
        
        // Test API connection first
        const apiWorking = await marketDataService.testApiConnection();
        
        if (apiWorking) {
          console.log('🔄 Fetching market data from Alpha Vantage...');
          
          // Get regional stock symbols
          const regionSymbols = getRegionSymbols(activeRegion);
          
          // Fetch real-time data (limit to 3 stocks for free tier)
          const stocksData = await marketDataService.getMultipleStocks(regionSymbols.slice(0, 3));
          
          if (stocksData.length > 0) {
            let stocks = stocksData.map(stock => ({
              symbol: stock.symbol,
              name: getStockName(stock.symbol),
              price: stock.price,
              change: stock.change,
              changePercent: stock.changePercent,
              daysOld: stock.daysOld || 0,
              lastUpdated: stock.lastUpdated,
              currency: 'USD'
            }));
            
            // Convert to INR for Indian stocks using real exchange rate
            if (activeRegion === 'india') {
              try {
                console.log('💱 Fetching USD/INR exchange rate...');
                const usdInrData = await marketDataService.getForexRate('USD', 'INR');
                const exchangeRate = usdInrData?.price || 83.25;
                console.log('💱 USD/INR rate:', exchangeRate);
                
                stocks = stocks.map(stock => ({
                  ...stock,
                  price: stock.price * exchangeRate,
                  change: stock.change * exchangeRate,
                  currency: 'INR',
                  exchangeRate: exchangeRate
                }));
                console.log('✅ Converted', stocks.length, 'Indian stocks to INR');
              } catch (error) {
                console.warn('⚠️ Exchange rate fetch failed, using fallback rate');
                const fallbackRate = 83.25;
                stocks = stocks.map(stock => ({
                  ...stock,
                  price: stock.price * fallbackRate,
                  change: stock.change * fallbackRate,
                  currency: 'INR',
                  exchangeRate: fallbackRate
                }));
              }
            }
            
            setMarketData({
              stocks: stocks,
              indices: await fetchIndicesData(),
              commodities: await newsService.getCommoditiesData(),
              forex: await fetchForexData()
            });
            
            setApiStatus('live');
            setLastUpdated(new Date());
            console.log('✅ Alpha Vantage data loaded successfully:', stocks.length, 'stocks');
          } else {
            throw new Error('No stock data received from API');
          }
        } else {
          throw new Error('API connection test failed');
        }
        
      } else {
        console.log('⚠️ API not configured, using sample data');
        let sampleStocks = await newsService.getSampleMarketData(activeRegion);
        sampleStocks = sampleStocks.map(stock => ({
          ...stock,
          currency: activeRegion === 'india' ? 'INR' : 'USD'
        }));
        
        setMarketData({
          stocks: sampleStocks,
          indices: newsService.getSampleIndicesData(),
          commodities: await newsService.getCommoditiesData(),
          forex: newsService.getSampleForexData()
        });
        setApiStatus('demo');
      }
      
    } catch (error) {
      console.error('❌ Error fetching market data:', error.message);
      setApiStatus('error');
      
      // Fallback to sample data
      let fallbackStocks = await newsService.getSampleMarketData(activeRegion);
      fallbackStocks = fallbackStocks.map(stock => ({
        ...stock,
        currency: activeRegion === 'india' ? 'INR' : 'USD'
      }));
      
      setMarketData({
        stocks: fallbackStocks,
        indices: newsService.getSampleIndicesData(),
        commodities: await newsService.getCommoditiesData(),
        forex: newsService.getSampleForexData()
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getRegionSymbols = (region) => {
    const symbolMap = {
      us: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'AMZN', 'META'],
      india: ['RELIANCE.NS', 'TCS.NS', 'INFY', 'HDFCBANK.NS', 'ICICIBANK.NS'],
      europe: ['ASML', 'SAP', 'NESN.SW', 'MC.PA', 'NOVO-B.CO'],
      china: ['BABA', 'TCEHY', 'JD', 'BIDU', 'NIO'],
      world: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META']
    };
    return symbolMap[region] || symbolMap.world;
  };
  
  const getStockName = (symbol) => {
    const nameMap = {
      'AAPL': 'Apple Inc.',
      'GOOGL': 'Alphabet Inc.',
      'MSFT': 'Microsoft Corp.',
      'TSLA': 'Tesla Inc.',
      'NVDA': 'NVIDIA Corp.',
      'AMZN': 'Amazon.com Inc.',
      'META': 'Meta Platforms Inc.',
      'RELIANCE.NS': 'Reliance Industries',
      'TCS.NS': 'Tata Consultancy Services',
      'INFY': 'Infosys Limited',
      'HDFCBANK.NS': 'HDFC Bank',
      'ICICIBANK.NS': 'ICICI Bank',
      'ASML': 'ASML Holding',
      'SAP': 'SAP SE',
      'NESN.SW': 'Nestle SA',
      'MC.PA': 'LVMH',
      'NOVO-B.CO': 'Novo Nordisk',
      'BABA': 'Alibaba Group',
      'TCEHY': 'Tencent Holdings',
      'JD': 'JD.com Inc.',
      'BIDU': 'Baidu Inc.',
      'NIO': 'NIO Inc.'
    };
    return nameMap[symbol] || symbol;
  };
  
  const fetchForexData = async () => {
    // Use sample data for forex to save API calls
    return newsService.getSampleForexData();
  };
  
  const getForexName = (symbol) => {
    const nameMap = {
      'EUR/USD': 'Euro to US Dollar',
      'GBP/USD': 'British Pound to USD',
      'USD/JPY': 'US Dollar to Japanese Yen',
      'USD/CAD': 'US Dollar to Canadian Dollar'
    };
    return nameMap[symbol] || symbol;
  };
  
  const fetchIndicesData = async () => {
    // Use sample data for indices to save API calls
    return newsService.getSampleIndicesData();
  };



  if (loading) {
    return (
      <div className="market-page loading">
        <div className="loading-container">
          <Activity size={48} className="spinning" />
          <h2>Loading Market Data...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="market-page">
      <div className="market-header">
        <div className="header-content">
          <h1>Live Market Data</h1>
          <div className="live-indicator">
            <div className="pulse"></div>
            REAL-TIME
          </div>
        </div>
        
        <div className="api-status">
          <div className="status-indicator">
            {apiStatus === 'live' && <Wifi size={16} className="status-icon live" />}
            {apiStatus === 'demo' && <WifiOff size={16} className="status-icon demo" />}
            {apiStatus === 'error' && <WifiOff size={16} className="status-icon error" />}
            {apiStatus === 'loading' && <Activity size={16} className="status-icon loading spinning" />}
            
            <span className="status-text">
              {apiStatus === 'live' && 'Alpha Vantage Connected'}
              {apiStatus === 'demo' && 'Demo Mode'}
              {apiStatus === 'error' && 'API Error - Using Demo Data'}
              {apiStatus === 'loading' && 'Testing API...'}
            </span>
            
            {lastUpdated && apiStatus === 'live' && (
              <span className="last-updated">
                Refreshed: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
          
          {apiStatus === 'live' && (
            <div className="data-freshness">
              <span className="freshness-note">📊 Free tier: Limited to 3 stocks, may be delayed</span>
            </div>
          )}
          
          {apiStatus === 'error' && (
            <div className="data-freshness">
              <span className="error-note">⚠️ Check console for API errors</span>
            </div>
          )}
        </div>
        
        <div className="region-selector">
          {regions.map(region => (
            <button
              key={region.id}
              className={`region-btn ${activeRegion === region.id ? 'active' : ''}`}
              onClick={() => setActiveRegion(region.id)}
            >
              <span className="flag">{region.flag}</span>
              {region.name}
            </button>
          ))}
        </div>
      </div>

      {/* Market Ticker */}
      <div className="market-ticker">
        <div className="ticker-scroll">
          <div className="ticker-content">
            {marketData.stocks.concat(marketData.stocks).map((stock, index) => (
              <div key={`${stock.symbol}-${index}`} className="ticker-item">
                <span className="symbol">{stock.symbol}</span>
                <span className="price">
                  {activeRegion === 'india' ? '₹' : '$'}{stock.price.toFixed(2)}
                </span>
                <span className={`change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                  {stock.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="market-grid">
        <MarketCard
          title="Major Indices"
          data={marketData.indices}
          icon={BarChart3}
          type="index"
        />
        
        <MarketCard
          title="Top Stocks"
          data={marketData.stocks}
          icon={Building2}
          type="stock"
        />
        
        <MarketCard
          title="Commodities"
          data={marketData.commodities}
          icon={Globe}
          type="stock"
        />
        
        <MarketCard
          title="Forex"
          data={marketData.forex}
          icon={Activity}
          type="stock"
        />
      </div>

      <style jsx>{`
        .market-page {
          min-height: calc(100vh - 60px);
          padding: 2rem 0;
        }

        .market-header {
          margin-bottom: 2rem;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .header-content h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        body.dark .header-content h1 {
          color: var(--text-primary-dark);
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--success-gradient);
          color: white;
          border-radius: 2rem;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .pulse {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        .api-status {
          margin-bottom: 1rem;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 0.5rem;
          border: 1px solid var(--light-border);
          display: inline-block;
        }

        body.dark .api-status {
          background: rgba(30, 41, 59, 0.9);
          border-color: var(--dark-border);
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-icon {
          flex-shrink: 0;
        }

        .status-icon.live {
          color: #10b981;
        }

        .status-icon.demo {
          color: #f59e0b;
        }

        .status-icon.error {
          color: #ef4444;
        }

        .status-icon.loading {
          color: var(--primary-color);
        }

        .status-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        body.dark .status-text {
          color: var(--text-primary-dark);
        }

        .last-updated {
          font-size: 0.8rem;
          color: #6b7280;
          margin-left: auto;
        }

        body.dark .last-updated {
          color: #9ca3af;
        }

        .data-freshness {
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid #e5e7eb;
        }

        body.dark .data-freshness {
          border-top-color: #374151;
        }

        .freshness-note {
          font-size: 0.75rem;
          color: #6b7280;
          font-style: italic;
        }

        body.dark .freshness-note {
          color: #9ca3af;
        }

        .error-note {
          font-size: 0.75rem;
          color: #dc2626;
          font-style: italic;
        }

        body.dark .error-note {
          color: #fca5a5;
        }

        .region-selector {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .region-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid var(--light-border);
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        body.dark .region-btn {
          background: rgba(30, 41, 59, 0.9);
          border-color: var(--dark-border);
          color: var(--text-primary-dark);
        }

        .region-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .region-btn.active {
          background: var(--primary-gradient);
          color: white;
          border-color: transparent;
        }

        .flag {
          font-size: 1.2rem;
        }

        .market-ticker {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border: 1px solid var(--light-border);
          border-radius: 1rem;
          overflow: hidden;
          margin-bottom: 2rem;
          box-shadow: var(--shadow-light);
        }

        body.dark .market-ticker {
          background: rgba(30, 41, 59, 0.95);
          border-color: var(--dark-border);
        }

        .ticker-scroll {
          height: 60px;
          overflow: hidden;
        }

        .ticker-content {
          display: flex;
          align-items: center;
          height: 100%;
          animation: scroll 60s linear infinite;
          gap: 2rem;
        }

        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        .ticker-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0 1.5rem;
          min-width: 220px;
          flex-shrink: 0;
        }

        .ticker-item .symbol {
          font-weight: 700;
          color: var(--text-primary);
          min-width: 60px;
        }

        .ticker-item .price {
          font-weight: 600;
          color: var(--text-primary);
          min-width: 80px;
        }

        .ticker-item .change {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .change.positive {
          color: var(--success-color);
        }

        .change.negative {
          color: var(--danger-color);
        }

        .market-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .market-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border: 1px solid var(--light-border);
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: var(--shadow-light);
          transition: transform 0.2s ease;
        }

        body.dark .market-card {
          background: rgba(30, 41, 59, 0.95);
          border-color: var(--dark-border);
        }

        .market-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--light-border);
        }

        body.dark .card-header {
          border-bottom-color: var(--dark-border);
        }

        .card-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        body.dark .card-header h3 {
          color: var(--text-primary-dark);
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .market-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: rgba(0, 0, 0, 0.02);
          border-radius: 0.5rem;
          transition: background 0.2s ease;
        }

        body.dark .market-item {
          background: rgba(255, 255, 255, 0.05);
        }

        .market-item:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        body.dark .market-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .item-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .symbol {
          font-weight: 700;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        body.dark .symbol {
          color: var(--text-primary-dark);
        }

        .name {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .item-data {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }

        .price {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        body.dark .price {
          color: var(--text-primary-dark);
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          gap: 1rem;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        .market-item {
          position: relative;
        }

        .market-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.1), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .market-item:hover::before {
          opacity: 1;
        }

        .change.positive {
          color: #10b981;
          font-weight: 600;
        }

        .change.negative {
          color: #ef4444;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .market-page {
            padding: 1rem 0;
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .header-content h1 {
            font-size: 2rem;
          }

          .market-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .market-card {
            padding: 1rem;
          }

          .ticker-item {
            min-width: 180px;
            padding: 0 1rem;
            gap: 0.5rem;
          }

          .ticker-item .symbol {
            min-width: 45px;
            font-size: 0.9rem;
          }

          .ticker-item .price {
            min-width: 65px;
            font-size: 0.9rem;
          }

          .ticker-item .change {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
});

Market.displayName = 'Market';

export default Market;