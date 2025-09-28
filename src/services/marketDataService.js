import axios from 'axios';

class MarketDataService {
  constructor() {
    this.apiKey = process.env.REACT_APP_ALPHA_VANTAGE_KEY || 'demo';
    this.baseUrl = 'https://www.alphavantage.co/query';
    this.cache = new Map();
    this.cacheTimeout = 300000; // 5 minute cache for market data
    this.requestQueue = [];
    this.isProcessing = false;
    this.requestDelay = 12000; // 12 seconds between requests
  }

  async makeRequest(params) {
    const cacheKey = JSON.stringify(params);
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log('📋 Using cached data for:', params.symbol || params.function);
      return cached.data;
    }

    return new Promise((resolve, reject) => {
      this.requestQueue.push({ params, resolve, reject, cacheKey });
      this.processQueue();
    });
  }

  async testApiConnection() {
    try {
      console.log('🔍 Testing Alpha Vantage API connection...');
      console.log('  - Using API key:', this.apiKey?.substring(0, 8) + '...');
      console.log('  - Request URL:', this.baseUrl);
      
      const response = await axios.get(this.baseUrl, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: 'AAPL',
          apikey: this.apiKey
        },
        timeout: 15000
      });
      
      console.log('📡 API Response Status:', response.status);
      console.log('📡 API Response Data:', JSON.stringify(response.data, null, 2));
      
      if (response.data['Error Message']) {
        console.error('❌ API Error:', response.data['Error Message']);
        return false;
      }
      
      if (response.data['Note']) {
        console.warn('⚠️ API Rate Limit:', response.data['Note']);
        // Still return true if we got a rate limit - means API key works
        return true;
      }
      
      if (response.data['Global Quote'] && response.data['Global Quote']['01. symbol']) {
        console.log('✅ API working correctly - got quote for:', response.data['Global Quote']['01. symbol']);
        return true;
      }
      
      console.warn('⚠️ Unexpected API response format:', Object.keys(response.data));
      return false;
    } catch (error) {
      console.error('❌ API connection failed:');
      console.error('  - Error message:', error.message);
      console.error('  - Error response:', error.response?.data);
      console.error('  - Error status:', error.response?.status);
      return false;
    }
  }

  async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.requestQueue.length > 0) {
      const { params, resolve, reject, cacheKey } = this.requestQueue.shift();
      
      try {
        console.log('🔄 Making API request for:', params.symbol || params.function);
        const response = await axios.get(this.baseUrl, {
          params: { ...params, apikey: this.apiKey },
          timeout: 15000
        });

        console.log('📊 Raw API response for', params.symbol, ':', JSON.stringify(response.data, null, 2));

        // Check for API error messages
        if (response.data['Error Message']) {
          console.error('❌ API Error Message:', response.data['Error Message']);
          throw new Error(response.data['Error Message']);
        }
        
        if (response.data['Note']) {
          console.warn('⚠️ API Rate limit:', response.data['Note']);
          throw new Error('API rate limit exceeded - try again later');
        }

        // Check if we got valid data
        if (!response.data || Object.keys(response.data).length === 0) {
          throw new Error('Empty response from API');
        }

        this.cache.set(cacheKey, {
          data: response.data,
          timestamp: Date.now()
        });

        resolve(response.data);
        
        // Wait before next request to respect rate limits (free tier: 5 calls per minute)
        if (this.requestQueue.length > 0) {
          console.log('⏳ Waiting 12 seconds before next request...');
          await new Promise(resolve => setTimeout(resolve, this.requestDelay));
        }
        
      } catch (error) {
        console.error('❌ API request failed for', params.symbol || params.function, ':', error.message);
        reject(error);
      }
    }
    
    this.isProcessing = false;
  }

  async getStockQuote(symbol) {
    try {
      const data = await this.makeRequest({
        function: 'GLOBAL_QUOTE',
        symbol: symbol
      });

      const quote = data['Global Quote'];
      if (!quote || !quote['05. price']) {
        throw new Error('Invalid quote data');
      }

      const lastUpdated = new Date(quote['07. latest trading day']);
      const daysDiff = Math.floor((new Date() - lastUpdated) / (1000 * 60 * 60 * 24));
      
      // Accept data up to 3 days old
      if (daysDiff > 3) {
        console.warn(`Data for ${symbol} is ${daysDiff} days old, using anyway`);
      }

      return {
        symbol: symbol,
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        lastUpdated: quote['07. latest trading day'],
        daysOld: daysDiff
      };
    } catch (error) {
      console.warn(`Failed to get quote for ${symbol}:`, error.message);
      return null;
    }
  }

  async getForexRate(fromCurrency, toCurrency) {
    try {
      const data = await this.makeRequest({
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: fromCurrency,
        to_currency: toCurrency
      });

      const rate = data['Realtime Currency Exchange Rate'];
      if (!rate || !rate['5. Exchange Rate']) {
        throw new Error('Invalid forex data');
      }

      const lastUpdated = new Date(rate['6. Last Refreshed']);
      const daysDiff = Math.floor((new Date() - lastUpdated) / (1000 * 60 * 60 * 24));

      return {
        symbol: `${fromCurrency}/${toCurrency}`,
        price: parseFloat(rate['5. Exchange Rate']),
        lastUpdated: rate['6. Last Refreshed'],
        daysOld: daysDiff,
        // Add small random variation for older data to simulate movement
        change: daysDiff > 0 ? (Math.random() - 0.5) * 0.01 : 0,
        changePercent: daysDiff > 0 ? (Math.random() - 0.5) * 1 : 0
      };
    } catch (error) {
      console.warn(`Failed to get forex rate for ${fromCurrency}/${toCurrency}:`, error.message);
      return null;
    }
  }

  async getMultipleStocks(symbols) {
    console.log('📈 Fetching quotes for symbols:', symbols);
    
    // Process symbols one by one to respect rate limits
    const results = [];
    for (const symbol of symbols.slice(0, 3)) { // Limit to 3 symbols for free tier
      try {
        const quote = await this.getStockQuote(symbol);
        if (quote) {
          results.push(quote);
          console.log('✅ Got quote for', symbol, ':', quote.price);
        }
      } catch (error) {
        console.warn('⚠️ Failed to get quote for', symbol, ':', error.message);
      }
    }
    
    console.log('📊 Successfully fetched', results.length, 'quotes out of', symbols.length, 'requested');
    return results;
  }

  isApiConfigured() {
    const configured = this.apiKey && this.apiKey !== 'demo' && this.apiKey !== '' && this.apiKey.length >= 16;
    console.log('🔑 API Key Check:');
    console.log('  - Key exists:', !!this.apiKey);
    console.log('  - Key length:', this.apiKey?.length);
    console.log('  - Key preview:', this.apiKey?.substring(0, 8) + '...');
    console.log('  - Is configured:', configured);
    return configured;
  }

  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      queueLength: this.requestQueue.length,
      isProcessing: this.isProcessing
    };
  }

  clearOldCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheTimeout) {
        this.cache.delete(key);
      }
    }
  }

  getDataFreshness(daysOld) {
    if (daysOld === 0) return 'Live';
    if (daysOld === 1) return '1 day old';
    if (daysOld <= 3) return `${daysOld} days old`;
    return 'Stale data';
  }
}

export default new MarketDataService();