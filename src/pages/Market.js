import React, { useState, useEffect, memo } from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3, Globe, Building2, Wifi, WifiOff } from 'lucide-react';
import newsService from '../services/newsApi';
import marketDataService from '../services/marketDataService';
import polygonService from '../services/polygonService';

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
              {type === 'index' ? Number(item.value || 0).toLocaleString() : 
                `${item.currency === 'INR' ? '₹' : '$'}${Number(item.price || 0).toFixed(2)}`}
            </span>
            <span className={`change ${Number(item.change || 0) >= 0 ? 'positive' : 'negative'}`}>
              {Number(item.change || 0) >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {Number(item.change || 0) >= 0 ? '+' : ''}{Number(item.change || 0).toFixed(2)} ({Number(item.changePercent || 0).toFixed(2)}%)
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
      
      // Test Polygon API first (best free tier)
      const polygonWorking = polygonService.isConfigured() && await polygonService.testConnection();
      
      if (polygonWorking) {
        console.log('🔄 Fetching market data from Polygon.io...');
        
        const regionSymbols = getRegionSymbols(activeRegion);
        const [stocksData, indicesData] = await Promise.allSettled([
          polygonService.getStockQuotes(regionSymbols.slice(0, 5)),
          polygonService.getMarketIndices()
        ]);
        
        let stocks = stocksData.status === 'fulfilled' ? stocksData.value : [];
        
        if (activeRegion === 'india' && stocks.length > 0) {
          const exchangeRate = 83.25;
          stocks = stocks.map(stock => ({
            ...stock,
            price: stock.price * exchangeRate,
            change: stock.change * exchangeRate,
            currency: 'INR'
          }));
        }
        
        setMarketData({
          stocks: stocks.length > 0 ? stocks : await newsService.getSampleMarketData(activeRegion),
          indices: indicesData.status === 'fulfilled' ? indicesData.value : newsService.getSampleIndicesData(),
          commodities: await newsService.getCommoditiesData(),
          forex: await polygonService.getForexRates()
        });
        
        setApiStatus('live');
        setLastUpdated(new Date());
        console.log('✅ Polygon data loaded successfully');
        
      } else if (marketDataService.isApiConfigured()) {
        console.log('🔄 Polygon unavailable, trying Alpha Vantage...');
        
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
              {apiStatus === 'live' && 'Polygon.io Connected'}
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
                  {activeRegion === 'india' ? '₹' : '$'}{Number(stock.price || 0).toFixed(2)}
                </span>
                <span className={`change ${Number(stock.change || 0) >= 0 ? 'positive' : 'negative'}`}>
                  {Number(stock.change || 0) >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {Number(stock.change || 0) >= 0 ? '+' : ''}{Number(stock.change || 0).toFixed(2)} ({Number(stock.changePercent || 0).toFixed(2)}%)
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

    </div>
  );
});

Market.displayName = 'Market';

export default Market;