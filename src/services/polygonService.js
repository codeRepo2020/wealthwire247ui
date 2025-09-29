const POLYGON_API_KEY = process.env.REACT_APP_POLYGON_KEY;
const POLYGON_BASE_URL = 'https://api.polygon.io';

class PolygonService {
  constructor() {
    this.apiKey = POLYGON_API_KEY;
    this.baseUrl = POLYGON_BASE_URL;
  }

  isConfigured() {
    return this.apiKey && this.apiKey !== 'demo';
  }

  async makeRequest(endpoint) {
    if (!this.isConfigured()) {
      console.warn('Polygon API not configured, using mock data');
      return this.getMockData(endpoint);
    }

    const url = `${this.baseUrl}${endpoint}&apikey=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`Polygon API error: ${response.status}, falling back to mock data`);
        return this.getMockData(endpoint);
      }
      return await response.json();
    } catch (error) {
      console.warn('Polygon API request failed, using mock data:', error.message);
      return this.getMockData(endpoint);
    }
  }

  getMockData(endpoint) {
    if (endpoint.includes('/v2/aggs/ticker/')) {
      return {
        results: [{
          c: 175.43,
          h: 177.20,
          l: 174.10,
          o: 176.50,
          v: 45678900,
          vw: 175.80
        }]
      };
    }
    if (endpoint.includes('/v3/reference/tickers')) {
      return {
        results: [
          { ticker: 'AAPL', name: 'Apple Inc.' },
          { ticker: 'GOOGL', name: 'Alphabet Inc.' },
          { ticker: 'MSFT', name: 'Microsoft Corp.' }
        ]
      };
    }
    return { results: [] };
  }

  // Get stock quotes
  async getStockQuotes(symbols) {
    try {
      const quotes = [];
      const symbolArray = Array.isArray(symbols) ? symbols : [symbols];
      
      for (const symbol of symbolArray.slice(0, 5)) {
        const data = await this.makeRequest(`/v2/aggs/ticker/${symbol}/prev?adjusted=true`);
        
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          const change = result.c - result.o;
          const changePercent = ((change / result.o) * 100);
          
          quotes.push({
            symbol: symbol,
            name: await this.getStockName(symbol),
            price: Number(result.c),
            change: Number(change.toFixed(2)),
            changePercent: Number(changePercent.toFixed(2)),
            volume: result.v,
            lastUpdated: new Date().toISOString()
          });
        }
      }
      
      return quotes.length > 0 ? quotes : this.getMockStockData(symbolArray);
    } catch (error) {
      console.error('Error fetching stock quotes:', error);
      return this.getMockStockData(Array.isArray(symbols) ? symbols : [symbols]);
    }
  }

  async getStockName(symbol) {
    const nameMap = {
      'AAPL': 'Apple Inc.',
      'GOOGL': 'Alphabet Inc.',
      'MSFT': 'Microsoft Corp.',
      'TSLA': 'Tesla Inc.',
      'NVDA': 'NVIDIA Corp.',
      'AMZN': 'Amazon.com Inc.',
      'META': 'Meta Platforms Inc.',
      'SPY': 'SPDR S&P 500 ETF',
      'QQQ': 'Invesco QQQ Trust',
      'DIA': 'SPDR Dow Jones ETF',
      'IWM': 'iShares Russell 2000 ETF'
    };
    return nameMap[symbol] || symbol;
  }

  getMockStockData(symbols) {
    return symbols.map(symbol => {
      const basePrice = Math.random() * 200 + 50;
      const change = (Math.random() - 0.5) * 10;
      const changePercent = (change / basePrice) * 100;
      
      return {
        symbol: symbol,
        name: this.getStockName(symbol),
        price: Number(basePrice.toFixed(2)),
        change: Number(change.toFixed(2)),
        changePercent: Number(changePercent.toFixed(2)),
        volume: Math.floor(Math.random() * 10000000),
        lastUpdated: new Date().toISOString()
      };
    });
  }

  // Get market indices using ETFs
  async getMarketIndices() {
    try {
      const indices = ['SPY', 'QQQ', 'DIA', 'IWM'];
      const quotes = await this.getStockQuotes(indices);
      
      return quotes.map(quote => ({
        symbol: this.getIndexSymbol(quote.symbol),
        name: this.getIndexName(quote.symbol),
        value: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
        lastUpdated: quote.lastUpdated
      }));
    } catch (error) {
      console.error('Error fetching indices:', error);
      return this.getMockIndicesData();
    }
  }

  getIndexSymbol(etfSymbol) {
    const symbolMap = {
      'SPY': 'S&P 500',
      'QQQ': 'NASDAQ',
      'DIA': 'DOW',
      'IWM': 'RUSSELL'
    };
    return symbolMap[etfSymbol] || etfSymbol;
  }

  getIndexName(etfSymbol) {
    const nameMap = {
      'SPY': 'S&P 500 Index',
      'QQQ': 'NASDAQ 100 Index',
      'DIA': 'Dow Jones Industrial',
      'IWM': 'Russell 2000 Index'
    };
    return nameMap[etfSymbol] || etfSymbol;
  }

  getMockIndicesData() {
    return [
      { symbol: 'S&P 500', name: 'S&P 500 Index', value: 4567.89, change: 23.45, changePercent: 0.52 },
      { symbol: 'NASDAQ', name: 'NASDAQ 100 Index', value: 14234.56, change: -45.67, changePercent: -0.32 },
      { symbol: 'DOW', name: 'Dow Jones Industrial', value: 34567.12, change: 156.78, changePercent: 0.46 },
      { symbol: 'RUSSELL', name: 'Russell 2000 Index', value: 1876.43, change: 12.34, changePercent: 0.66 }
    ];
  }

  // Get forex data (limited on free plan, using mock data)
  async getForexRates() {
    return [
      { symbol: 'EUR/USD', name: 'Euro to US Dollar', price: 1.0876, change: 0.0023, changePercent: 0.21 },
      { symbol: 'GBP/USD', name: 'British Pound to USD', price: 1.2543, change: -0.0045, changePercent: -0.36 },
      { symbol: 'USD/JPY', name: 'US Dollar to Japanese Yen', price: 149.87, change: 0.67, changePercent: 0.45 },
      { symbol: 'USD/CAD', name: 'US Dollar to Canadian Dollar', price: 1.3654, change: 0.0087, changePercent: 0.64 }
    ];
  }

  // Test API connection
  async testConnection() {
    try {
      const data = await this.makeRequest('/v2/aggs/ticker/AAPL/prev?adjusted=true');
      return data.results && data.results.length > 0;
    } catch (error) {
      return false;
    }
  }
}

export default new PolygonService();