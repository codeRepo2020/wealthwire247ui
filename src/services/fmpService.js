const FMP_API_KEY = process.env.REACT_APP_FMP_KEY;
const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v4';

class FMPService {
  constructor() {
    this.apiKey = FMP_API_KEY;
    this.baseUrl = FMP_BASE_URL;
  }

  isConfigured() {
    return this.apiKey && this.apiKey !== 'demo';
  }

  async makeRequest(endpoint) {
    if (!this.isConfigured()) {
      console.warn('FMP API not configured, using mock data');
      return this.getMockData(endpoint);
    }

    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${this.baseUrl}${endpoint}${separator}apikey=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`FMP API error: ${response.status}, falling back to mock data`);
        return this.getMockData(endpoint);
      }
      return await response.json();
    } catch (error) {
      console.warn('FMP API request failed, using mock data:', error.message);
      return this.getMockData(endpoint);
    }
  }

  getMockData(endpoint) {
    if (endpoint.includes('/quote/')) {
      return [{
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 175.43,
        change: 2.15,
        changesPercentage: 1.24,
        volume: 45678900,
        marketCap: 2750000000000,
        pe: 28.5,
        eps: 6.15
      }];
    }
    if (endpoint.includes('stock_news')) {
      return [{
        title: 'Market Update: Tech Stocks Rally',
        text: 'Technology stocks showed strong performance today...',
        url: '#',
        image: null,
        publishedDate: new Date().toISOString(),
        site: 'Demo News',
        symbol: 'AAPL'
      }];
    }
    if (endpoint.includes('sector-performance')) {
      return [
        { sector: 'Technology', changesPercentage: '2.5%' },
        { sector: 'Healthcare', changesPercentage: '1.2%' },
        { sector: 'Finance', changesPercentage: '-0.8%' }
      ];
    }
    return [];
  }

  // Get real-time stock quotes
  async getStockQuotes(symbols) {
    try {
      const symbolsStr = Array.isArray(symbols) ? symbols.join(',') : symbols;
      const data = await this.makeRequest(`/quote/${symbolsStr}`);
      
      return (Array.isArray(data) ? data : [data]).map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: stock.change,
        changePercent: stock.changesPercentage,
        volume: stock.volume,
        marketCap: stock.marketCap,
        pe: stock.pe,
        eps: stock.eps,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching stock quotes:', error);
      return this.getMockData('/quote/').map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: stock.change,
        changePercent: stock.changesPercentage,
        volume: stock.volume,
        marketCap: stock.marketCap,
        pe: stock.pe,
        eps: stock.eps,
        lastUpdated: new Date().toISOString()
      }));
    }
  }

  // Get major market indices
  async getMarketIndices() {
    try {
      const indices = ['^GSPC', '^DJI', '^IXIC', '^RUT']; // S&P 500, Dow, Nasdaq, Russell
      const data = await this.makeRequest(`/quote/${indices.join(',')}`);
      
      return data.map(index => ({
        symbol: index.symbol,
        name: this.getIndexName(index.symbol),
        value: index.price,
        change: index.change,
        changePercent: index.changesPercentage,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching market indices:', error);
      return [];
    }
  }

  // Get forex rates
  async getForexRates() {
    try {
      const pairs = ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCAD'];
      const data = await this.makeRequest(`/fx/${pairs.join(',')}`);
      
      return data.map(pair => ({
        symbol: this.formatForexSymbol(pair.ticker),
        name: this.getForexName(pair.ticker),
        price: pair.bid,
        change: pair.changes,
        changePercent: (pair.changes / pair.bid) * 100,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching forex rates:', error);
      return [];
    }
  }

  // Get commodities data
  async getCommodities() {
    try {
      const commodities = ['GCUSD', 'SIUSD', 'CLUSD', 'NGUSD']; // Gold, Silver, Oil, Natural Gas
      const data = await this.makeRequest(`/quote/${commodities.join(',')}`);
      
      return data.map(commodity => ({
        symbol: commodity.symbol,
        name: this.getCommodityName(commodity.symbol),
        price: commodity.price,
        change: commodity.change,
        changePercent: commodity.changesPercentage,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching commodities:', error);
      return [];
    }
  }

  // Get market news
  async getMarketNews(limit = 10) {
    try {
      const data = await this.makeRequest(`/stock_news?limit=${limit}`);
      
      return data.map(article => ({
        title: article.title,
        summary: article.text,
        url: article.url,
        image: article.image,
        publishedDate: article.publishedDate,
        site: article.site,
        symbol: article.symbol
      }));
    } catch (error) {
      console.error('Error fetching market news:', error);
      return [];
    }
  }

  // Get sector performance
  async getSectorPerformance() {
    try {
      const data = await this.makeRequest('/sector-performance');
      
      return data.map(sector => ({
        sector: sector.sector,
        changePercent: parseFloat(sector.changesPercentage.replace('%', '')),
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching sector performance:', error);
      return [];
    }
  }

  // Helper methods
  getIndexName(symbol) {
    const names = {
      '^GSPC': 'S&P 500',
      '^DJI': 'Dow Jones',
      '^IXIC': 'NASDAQ',
      '^RUT': 'Russell 2000'
    };
    return names[symbol] || symbol;
  }

  formatForexSymbol(ticker) {
    return ticker.replace('USD', '/USD').replace('EUR', 'EUR/').replace('GBP', 'GBP/').replace('JPY', '/JPY').replace('CAD', '/CAD');
  }

  getForexName(ticker) {
    const names = {
      'EURUSD': 'Euro to US Dollar',
      'GBPUSD': 'British Pound to USD',
      'USDJPY': 'US Dollar to Japanese Yen',
      'USDCAD': 'US Dollar to Canadian Dollar'
    };
    return names[ticker] || ticker;
  }

  getCommodityName(symbol) {
    const names = {
      'GCUSD': 'Gold',
      'SIUSD': 'Silver',
      'CLUSD': 'Crude Oil',
      'NGUSD': 'Natural Gas'
    };
    return names[symbol] || symbol;
  }

  // Test API connection
  async testConnection() {
    try {
      const data = await this.makeRequest('/quote/AAPL');
      return Array.isArray(data) && data.length > 0;
    } catch (error) {
      return false;
    }
  }
}

export default new FMPService();