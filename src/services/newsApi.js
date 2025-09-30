import axios from 'axios';
import newsCache from './newsCache.js';

// CORS proxy for production - multiple fallbacks
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://cors-anywhere.herokuapp.com/'
];

let currentProxyIndex = 0;

const getCorsProxy = () => {
  return CORS_PROXIES[currentProxyIndex % CORS_PROXIES.length];
};

const NEWS_APIS = {
  newsapi: {
    baseUrl: 'https://newsapi.org/v2',
    apiKey: process.env.REACT_APP_NEWS_API_KEY || 'demo-key'
  },
  alphavantage: {
    baseUrl: 'https://www.alphavantage.co/query',
    apiKey: process.env.REACT_APP_ALPHA_VANTAGE_KEY || 'demo'
  },
  guardian: {
    baseUrl: 'https://content.guardianapis.com',
    apiKey: process.env.REACT_APP_GUARDIAN_API_KEY || 'test'
  },
  gnews: {
    baseUrl: 'https://gnews.io/api/v4',
    apiKey: process.env.REACT_APP_GNEWS_API_KEY || 'demo'
  },
  currents: {
    baseUrl: 'https://api.currentsapi.services/v1',
    apiKey: process.env.REACT_APP_CURRENTS_API_KEY || 'demo'
  },
  nyt: {
    baseUrl: 'https://api.nytimes.com/svc',
    apiKey: process.env.REACT_APP_NYT_API_KEY || 'demo'
  },
  newsdata: {
    baseUrl: 'https://newsdata.io/api/1',
    apiKey: process.env.REACT_APP_NEWSDATA_API_KEY || 'demo'
  }
};

// Helper function to build URL with CORS proxy
const buildApiUrl = (baseUrl, endpoint, params) => {
  const url = new URL(baseUrl + endpoint);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined) {
      url.searchParams.append(key, params[key]);
    }
  });
  
  // Try direct API call first (for development)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Development mode: Trying direct API call first');
    return url.toString();
  }
  
  const corsProxy = getCorsProxy();
  if (corsProxy.includes('allorigins')) {
    return corsProxy + encodeURIComponent(url.toString());
  } else {
    return corsProxy + url.toString();
  }
};

// Retry with different CORS proxy on failure
const makeRequestWithFallback = async (url, retries = 2) => {
  // In development, try direct call first
  if (process.env.NODE_ENV === 'development') {
    try {
      console.log('🔧 Trying direct API call...');
      const response = await axios.get(url, { timeout: 10000 });
      console.log('✅ Direct API call successful!');
      return response;
    } catch (error) {
      console.log('❌ Direct API call failed, trying CORS proxies...', error.message);
      // Fall through to CORS proxy logic
    }
  }
  
  for (let i = 0; i <= retries; i++) {
    try {
      // Add CORS proxy if not already present
      let proxyUrl = url;
      if (!url.includes('allorigins') && !url.includes('corsproxy') && !url.includes('cors-anywhere')) {
        const corsProxy = getCorsProxy();
        proxyUrl = corsProxy + (corsProxy.includes('allorigins') ? encodeURIComponent(url) : url);
      }
      
      console.log(`🔄 Trying CORS proxy ${currentProxyIndex + 1}:`, proxyUrl.substring(0, 100) + '...');
      const response = await axios.get(proxyUrl, { timeout: 10000 });
      console.log('✅ CORS proxy successful!');
      return response;
    } catch (error) {
      console.warn(`❌ CORS proxy ${currentProxyIndex + 1} failed:`, error.message);
      if (i < retries) {
        currentProxyIndex = (currentProxyIndex + 1) % CORS_PROXIES.length;
        console.log(`🔄 Retrying with proxy ${currentProxyIndex + 1}...`);
      } else {
        throw error;
      }
    }
  }
};

const regionalMarketData = {
  us: [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'META', name: 'Meta Platforms Inc.' }
  ],
  india: [
    { symbol: 'RELIANCE', name: 'Reliance Industries' },
    { symbol: 'TCS', name: 'Tata Consultancy Services' },
    { symbol: 'INFY', name: 'Infosys Limited' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever' },
    { symbol: 'ITC', name: 'ITC Limited' }
  ],
  europe: [
    { symbol: 'ASML', name: 'ASML Holding' },
    { symbol: 'SAP', name: 'SAP SE' },
    { symbol: 'NESN', name: 'Nestle SA' },
    { symbol: 'MC', name: 'LVMH' },
    { symbol: 'NOVO', name: 'Novo Nordisk' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'AAPL', name: 'Apple Inc.' }
  ],
  china: [
    { symbol: 'BABA', name: 'Alibaba Group' },
    { symbol: 'TCEHY', name: 'Tencent Holdings' },
    { symbol: 'JD', name: 'JD.com Inc.' },
    { symbol: 'BIDU', name: 'Baidu Inc.' },
    { symbol: 'NIO', name: 'NIO Inc.' },
    { symbol: 'PDD', name: 'PDD Holdings' },
    { symbol: 'NTES', name: 'NetEase Inc.' }
  ],
  world: [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'META', name: 'Meta Platforms Inc.' }
  ]
};

class NewsService {
  async getTopHeadlines(region = 'all') {
    try {
      // Check cache first
      const cachedData = newsCache.get(region);
      if (cachedData) {
        return cachedData;
      }

      console.log('📡 Fetching fresh news for region:', region);
      console.log('🔑 API Keys status:', {
        newsapi: NEWS_APIS.newsapi.apiKey !== 'demo-key' ? 'Configured' : 'Missing',
        guardian: NEWS_APIS.guardian.apiKey !== 'test' ? 'Configured' : 'Missing',
        gnews: NEWS_APIS.gnews.apiKey !== 'demo' ? 'Configured' : 'Missing',
        currents: NEWS_APIS.currents.apiKey !== 'demo' ? 'Configured' : 'Missing',
        nyt: NEWS_APIS.nyt.apiKey !== 'demo' ? 'Configured' : 'Missing',
        newsdata: NEWS_APIS.newsdata.apiKey !== 'demo' ? 'Configured' : 'Missing'
      });
      
      let articles = [];
      
      if (region === 'all' || region === 'world') {
        // For Global/All: Fetch from ALL APIs for comprehensive coverage
        console.log('🌍 Global mode: Fetching from ALL news APIs...');
        
        const apiPromises = [];
        
        // Guardian - International business
        if (NEWS_APIS.guardian.apiKey !== 'test') {
          apiPromises.push(this.fetchFromGuardian().catch(e => []));
        }
        
        // GNews - Global coverage
        if (NEWS_APIS.gnews.apiKey !== 'demo') {
          apiPromises.push(this.fetchFromGNews('world').catch(e => []));
        }
        
        // NYT - Premium global content
        if (NEWS_APIS.nyt.apiKey !== 'demo') {
          apiPromises.push(this.fetchFromNYT('all').catch(e => {
            console.log('⚠️ NYT failed in global mode:', e.message);
            return [];
          }));
        }
        
        // NewsData.io - Additional global coverage
        if (NEWS_APIS.newsdata.apiKey !== 'demo') {
          console.log('📡 Adding NewsData.io to global fetch...');
          apiPromises.push(this.fetchFromNewsData('world').catch(e => {
            console.log('⚠️ NewsData.io failed in global mode:', e.message);
            return [];
          }));
        }
        
        // Fetch all APIs simultaneously
        console.log('🚀 Starting parallel API calls for global mode...');
        const results = await Promise.allSettled(apiPromises);
        console.log('📊 All API calls completed');
        
        // Combine all results
        results.forEach((result, index) => {
          const apiNames = ['Guardian', 'GNews', 'NYT', 'NewsData'];
          if (result.status === 'fulfilled' && Array.isArray(result.value)) {
            console.log(`✅ ${apiNames[index]} returned ${result.value.length} articles`);
            articles = [...articles, ...result.value];
          } else {
            console.log(`❌ ${apiNames[index]} failed:`, result.reason?.message || 'Unknown error');
          }
        });
        
        console.log('🌍 Global articles from all APIs:', articles.length);
        
        // Log articles by source for debugging
        const sourceCount = {};
        articles.forEach(article => {
          const source = article.id ? article.id.split('-')[0] : 'unknown';
          sourceCount[source] = (sourceCount[source] || 0) + 1;
        });
        console.log('📊 Articles by source:', sourceCount);
        
      } else {
        // Regional mode: Original logic
        // Try NewsAPI first
        if (NEWS_APIS.newsapi.apiKey !== 'demo-key') {
          articles = await this.fetchFromNewsAPI(region);
        }
        
        // Try Guardian for Europe if NewsAPI didn't return enough
        if (region === 'europe' && articles.length < 10 && NEWS_APIS.guardian.apiKey !== 'test') {
          const guardianArticles = await this.fetchFromGuardian();
          articles = [...articles, ...guardianArticles];
        }
        
        // Try GNews for India only (China not available)
        if (region === 'india' && articles.length < 10 && NEWS_APIS.gnews.apiKey !== 'demo') {
          const gnewsArticles = await this.fetchFromGNews(region);
          articles = [...articles, ...gnewsArticles];
        }
        
        // Try Currents API for additional coverage
        if (articles.length < 15 && NEWS_APIS.currents.apiKey !== 'demo') {
          const currentsArticles = await this.fetchFromCurrents(region);
          articles = [...articles, ...currentsArticles];
        }
        
        // Try NYT API for quality content
        if (articles.length < 20 && NEWS_APIS.nyt.apiKey !== 'demo') {
          const nytArticles = await this.fetchFromNYT(region);
          articles = [...articles, ...nytArticles];
        }
      }
      
      if (articles.length > 0) {
        console.log('✅ Live articles fetched:', articles.length);
        // Shuffle articles to mix sources
        const shuffled = articles.sort(() => Math.random() - 0.5);
        const result = {
          articles: shuffled.slice(0, 20),
          totalResults: articles.length
        };
        
        // Cache the result and schedule refresh
        newsCache.set(region, result);
        newsCache.scheduleRefresh(region, () => this.fetchFreshNews(region));
        
        return result;
      }
      
      // Fallback to sample data
      console.log('⚠️ Using sample data - APIs unavailable');
      console.log('📊 Total articles found from all APIs:', articles.length);
      console.log('🔍 API Keys configured:', {
        newsapi: NEWS_APIS.newsapi.apiKey !== 'demo-key',
        guardian: NEWS_APIS.guardian.apiKey !== 'test',
        gnews: NEWS_APIS.gnews.apiKey !== 'demo',
        currents: NEWS_APIS.currents.apiKey !== 'demo',
        nyt: NEWS_APIS.nyt.apiKey !== 'demo'
      });
      
      const sampleData = this.getSampleNews(region);
      // Cache sample data too
      newsCache.set(region, sampleData);
      return sampleData;
    } catch (error) {
      console.error('❌ Error fetching news:', error);
      return this.getSampleNews(region);
    }
  }

  async fetchFromNewsAPI(region) {
    try {
      console.log('📡 Trying NewsAPI for region:', region);
      
      let params;
      let endpoint = '/top-headlines';
      
      if (region === 'us') {
        params = { country: 'us', category: 'business', pageSize: 20 };
      } else if (region === 'india') {
        params = { country: 'in', category: 'business', pageSize: 20 };
      } else if (region === 'china') {
        endpoint = '/everything';
        params = {
          q: 'China AND (business OR economy OR finance OR market)',
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 20
        };
      } else if (region === 'europe') {
        params = { country: 'gb', category: 'business', pageSize: 20 };
      } else {
        endpoint = '/everything';
        params = {
          q: 'finance OR market OR economy OR business',
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 20
        };
      }
      
      const apiUrl = buildApiUrl(NEWS_APIS.newsapi.baseUrl, endpoint, {
        ...params,
        apiKey: NEWS_APIS.newsapi.apiKey
      });
      
      console.log('🔗 NewsAPI URL:', apiUrl.substring(0, 100) + '...');
      
      const response = await makeRequestWithFallback(apiUrl);
      
      if (response.data && response.data.articles) {
        console.log('✅ NewsAPI success:', response.data.articles.length, 'articles');
        return response.data.articles.map((article, index) => ({
          ...article,
          id: `newsapi-${region}-${index}`,
          category: this.categorizeArticle(article.title),
          region: region,
          isLive: true
        }));
      } else {
        console.log('⚠️ NewsAPI returned no articles');
        return [];
      }
    } catch (error) {
      console.error('❌ NewsAPI error:', error.message);
      return [];
    }
  }

  async fetchFromGuardian() {
    try {
      console.log('📡 Trying Guardian API...');
      
      const apiUrl = buildApiUrl(NEWS_APIS.guardian.baseUrl, '/search', {
        'api-key': NEWS_APIS.guardian.apiKey,
        section: 'business',
        'page-size': 10,
        'show-fields': 'thumbnail,trailText',
        'order-by': 'newest'
      });
      
      console.log('🔗 Guardian URL:', apiUrl.substring(0, 100) + '...');
      
      const response = await makeRequestWithFallback(apiUrl);
      
      if (response.data && response.data.response && response.data.response.results) {
        console.log('✅ Guardian success:', response.data.response.results.length, 'articles');
        return response.data.response.results.map((article, index) => ({
          id: `guardian-${index}`,
          title: article.webTitle,
          description: article.fields?.trailText || '',
          url: article.webUrl,
          urlToImage: article.fields?.thumbnail,
          publishedAt: article.webPublicationDate,
          source: { name: 'The Guardian' },
          category: this.categorizeArticle(article.webTitle),
          region: 'europe',
          isLive: true
        }));
      } else {
        console.log('⚠️ Guardian returned no articles');
        return [];
      }
    } catch (error) {
      console.error('❌ Guardian API error:', error.message);
      return [];
    }
  }

  async fetchFromGNews(region) {
    try {
      if (NEWS_APIS.gnews.apiKey === 'demo') {
        console.log('GNews API key not configured');
        return [];
      }
      
      const countryMap = { 'india': 'in', 'china': 'cn' };
      
      const apiUrl = buildApiUrl(NEWS_APIS.gnews.baseUrl, '/top-headlines', {
        token: NEWS_APIS.gnews.apiKey,
        topic: 'business',
        country: countryMap[region] || 'us',
        max: 10,
        lang: 'en'
      });
      
      const response = await makeRequestWithFallback(apiUrl);
      
      if (response.data && response.data.articles) {
        return response.data.articles.map((article, index) => ({
          id: `gnews-${region}-${index}`,
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.image,
          publishedAt: article.publishedAt,
          source: { name: article.source.name },
          category: this.categorizeArticle(article.title),
          region: region,
          isLive: true
        }));
      }
      
      return [];
    } catch (error) {
      console.error('GNews API error:', error.response?.data || error.message);
      return [];
    }
  }

  async fetchFromCurrents(region) {
    try {
      if (NEWS_APIS.currents.apiKey === 'demo') {
        console.log('Currents API key not configured');
        return [];
      }
      
      const regionMap = {
        'us': 'US',
        'india': 'IN',
        'europe': 'GB',
        'china': 'CN',
        'world': null
      };
      
      const params = {
        apiKey: NEWS_APIS.currents.apiKey,
        category: 'business',
        language: 'en',
        limit: 10
      };
      
      if (regionMap[region]) {
        params.country = regionMap[region];
      }
      
      const apiUrl = buildApiUrl(NEWS_APIS.currents.baseUrl, '/latest-news', params);
      
      const response = await makeRequestWithFallback(apiUrl);
      
      if (response.data && response.data.news) {
        return response.data.news.map((article, index) => ({
          id: `currents-${region}-${index}`,
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.image,
          publishedAt: article.published,
          source: { name: article.author || 'Currents API' },
          category: this.categorizeArticle(article.title),
          region: region,
          isLive: true
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Currents API error:', error.response?.data || error.message);
      return [];
    }
  }

  async fetchFromNewsData(region) {
    try {
      console.log('📡 Trying NewsData.io API...');
      
      if (NEWS_APIS.newsdata.apiKey === 'demo') {
        console.log('⚠️ NewsData.io API key not configured');
        return [];
      }
      
      const apiUrl = buildApiUrl(NEWS_APIS.newsdata.baseUrl, '/news', {
        apikey: NEWS_APIS.newsdata.apiKey,
        category: 'business',
        language: 'en',
        size: 10
      });
      
      const response = await makeRequestWithFallback(apiUrl);
      
      if (response.data && response.data.results) {
        console.log('✅ NewsData.io success:', response.data.results.length, 'articles');
        return response.data.results.map((article, index) => ({
          id: `newsdata-${region}-${index}`,
          title: article.title,
          description: article.description,
          url: article.link,
          urlToImage: article.image_url,
          publishedAt: article.pubDate,
          source: { name: article.source_id || 'NewsData.io' },
          category: this.categorizeArticle(article.title),
          region: region,
          isLive: true
        }));
      }
      
      return [];
    } catch (error) {
      console.error('❌ NewsData.io API error:', error.message);
      return [];
    }
  }

  async fetchFromNYT(region) {
    try {
      console.log('📡 Trying NYT API for region:', region);
      
      if (NEWS_APIS.nyt.apiKey === 'demo') {
        console.log('⚠️ NYT API key not configured');
        return [];
      }
      
      console.log('🔑 NYT API Key configured:', NEWS_APIS.nyt.apiKey.substring(0, 8) + '...');
      
      // Use Top Stories API for business news - Direct call (NYT blocks CORS proxies)
      const directUrl = `${NEWS_APIS.nyt.baseUrl}/topstories/v2/business.json?api-key=${NEWS_APIS.nyt.apiKey}`;
      
      console.log('🔗 NYT Direct URL:', directUrl.substring(0, 100) + '...');
      
      const response = await axios.get(directUrl, { timeout: 10000 });
      
      console.log('📊 NYT Response status:', response.status);
      console.log('📊 NYT Response data keys:', Object.keys(response.data || {}));
      
      if (response.data && response.data.results) {
        console.log('✅ NYT success:', response.data.results.length, 'articles');
        const articles = response.data.results.slice(0, 8).map((article, index) => ({
          id: `nyt-${region}-${index}`,
          title: article.title,
          description: article.abstract,
          url: article.url,
          urlToImage: article.multimedia?.[0]?.url || null,
          publishedAt: article.published_date,
          source: { name: 'The New York Times' },
          category: this.categorizeArticle(article.title),
          region: region,
          isLive: true
        }));
        
        console.log('📰 NYT Sample article:', articles[0]?.title);
        return articles;
      } else {
        console.log('⚠️ NYT returned no results or invalid structure');
        console.log('📊 Full NYT response:', JSON.stringify(response.data, null, 2));
      }
      
      return [];
    } catch (error) {
      console.error('❌ NYT API error:', error.response?.data || error.message);
      console.error('❌ NYT Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url
      });
      return [];
    }
  }

  getSampleNews(region) {
    const sampleArticles = {
      us: [
        {
          id: 'us1',
          title: 'Federal Reserve Signals Potential Rate Cuts',
          description: 'The Federal Reserve hints at possible interest rate reductions as economic indicators show mixed signals.',
          url: 'https://www.federalreserve.gov',
          urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
          publishedAt: new Date().toISOString(),
          source: { name: 'Federal Reserve' },
          category: 'monetary-policy',
          region: 'us'
        },
        {
          id: 'us2',
          title: 'Tech Stocks Rally on AI Investment News',
          description: 'Major technology companies see gains as investors show confidence in AI sector growth.',
          url: 'https://finance.yahoo.com',
          urlToImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: { name: 'Yahoo Finance' },
          category: 'technology',
          region: 'us'
        }
      ],
      india: [
        {
          id: 'in1',
          title: 'RBI Maintains Repo Rate at 6.5%',
          description: 'Reserve Bank of India keeps key interest rates unchanged amid inflation concerns.',
          url: 'https://www.rbi.org.in',
          urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
          publishedAt: new Date().toISOString(),
          source: { name: 'RBI' },
          category: 'monetary-policy',
          region: 'india'
        }
      ],
      europe: [
        {
          id: 'eu1',
          title: 'ECB Considers Monetary Easing Measures',
          description: 'European Central Bank evaluates stimulus options as eurozone growth remains subdued.',
          url: 'https://www.ecb.europa.eu',
          urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
          publishedAt: new Date().toISOString(),
          source: { name: 'ECB' },
          category: 'monetary-policy',
          region: 'europe'
        }
      ],
      china: [
        {
          id: 'cn1',
          title: 'PBOC Injects Liquidity to Support Recovery',
          description: 'People\'s Bank of China implements measures to boost lending and economic growth.',
          url: 'https://www.pbc.gov.cn',
          urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
          publishedAt: new Date().toISOString(),
          source: { name: 'PBOC' },
          category: 'monetary-policy',
          region: 'china'
        }
      ],
      world: [
        {
          id: 'w1',
          title: 'Global Markets Rally on Central Bank Coordination',
          description: 'International markets surge as major central banks signal coordinated monetary policy.',
          url: 'https://www.imf.org',
          urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
          publishedAt: new Date().toISOString(),
          source: { name: 'IMF' },
          category: 'monetary-policy',
          region: 'world'
        },
        {
          id: 'w2',
          title: 'International Trade Tensions Impact Global Supply Chains',
          description: 'Ongoing trade disputes between major economies continue to affect worldwide commerce and logistics.',
          url: 'https://www.wto.org',
          urlToImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          source: { name: 'World Trade Organization' },
          category: 'economy',
          region: 'world'
        }
      ]
    };
    
    const articles = region === 'all' 
      ? [
          ...sampleArticles.us, 
          ...sampleArticles.india, 
          ...sampleArticles.europe, 
          ...sampleArticles.china, 
          ...sampleArticles.world,
          // Add more diverse sample articles for comprehensive coverage
          {
            id: 'global1',
            title: 'Global Markets Show Mixed Signals Amid Economic Uncertainty',
            description: 'International markets display varied performance as investors navigate geopolitical tensions and monetary policy changes.',
            url: 'https://www.reuters.com',
            urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
            publishedAt: new Date(Date.now() - 1800000).toISOString(),
            source: { name: 'Reuters' },
            category: 'markets',
            region: 'global',
            isLive: false
          },
          {
            id: 'global2',
            title: 'Cryptocurrency Market Volatility Continues Across Exchanges',
            description: 'Digital assets experience significant price swings as regulatory clarity remains uncertain in major markets.',
            url: 'https://www.coindesk.com',
            urlToImage: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400',
            publishedAt: new Date(Date.now() - 2700000).toISOString(),
            source: { name: 'CoinDesk' },
            category: 'cryptocurrency',
            region: 'global',
            isLive: false
          },
          {
            id: 'nyt-sample-1',
            title: 'Wall Street Rallies as Inflation Data Shows Signs of Cooling',
            description: 'Major stock indexes posted gains after the latest consumer price index showed inflation continuing to moderate.',
            url: 'https://www.nytimes.com',
            urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            source: { name: 'The New York Times' },
            category: 'markets',
            region: 'global',
            isLive: false
          },
          {
            id: 'nyt-sample-2',
            title: 'Federal Reserve Officials Signal Cautious Approach to Rate Cuts',
            description: 'Central bank policymakers emphasize data-dependent strategy amid mixed economic signals.',
            url: 'https://www.nytimes.com',
            urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
            publishedAt: new Date(Date.now() - 5400000).toISOString(),
            source: { name: 'The New York Times' },
            category: 'monetary-policy',
            region: 'global',
            isLive: false
          }
        ]
      : sampleArticles[region] || sampleArticles.world;
    
    return {
      articles,
      totalResults: articles.length
    };
  }

  async searchNews(query) {
    try {
      let articles = [];
      
      // Try NewsAPI first
      if (NEWS_APIS.newsapi.apiKey !== 'demo-key') {
        const apiUrl = buildApiUrl(NEWS_APIS.newsapi.baseUrl, '/everything', {
          q: `${query} AND (finance OR market OR economy)`,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 15,
          apiKey: NEWS_APIS.newsapi.apiKey
        });
        
        const response = await axios.get(apiUrl);
        articles = response.data.articles?.map((article, index) => ({
          ...article,
          id: `search-${index}`,
          category: this.categorizeArticle(article.title)
        })) || [];
      }
      
      // Try NYT Article Search API
      if (articles.length < 15 && NEWS_APIS.nyt.apiKey !== 'demo') {
        try {
          const nytUrl = buildApiUrl(NEWS_APIS.nyt.baseUrl, '/search/v2/articlesearch.json', {
            q: `${query} AND (business OR finance OR economy)`,
            sort: 'newest',
            page: 0,
            'api-key': NEWS_APIS.nyt.apiKey
          });
          
          const nytResponse = await axios.get(nytUrl);
          const nytArticles = nytResponse.data.response?.docs?.slice(0, 10).map((article, index) => ({
            id: `nyt-search-${index}`,
            title: article.headline.main,
            description: article.abstract,
            url: article.web_url,
            urlToImage: article.multimedia?.[0] ? `https://www.nytimes.com/${article.multimedia[0].url}` : null,
            publishedAt: article.pub_date,
            source: { name: 'The New York Times' },
            category: this.categorizeArticle(article.headline.main)
          })) || [];
          
          articles = [...articles, ...nytArticles];
        } catch (error) {
          console.error('NYT search error:', error.message);
        }
      }
      
      if (articles.length > 0) {
        return {
          articles: articles.slice(0, 20),
          totalResults: articles.length
        };
      }
      
      // Fallback search in sample data
      const sampleData = this.getSampleNews('all');
      const filteredArticles = sampleData.articles.filter(article => 
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase())
      );
      
      return {
        articles: filteredArticles,
        totalResults: filteredArticles.length
      };
    } catch (error) {
      console.error('Search error:', error);
      return { articles: [], totalResults: 0 };
    }
  }

  async getMarketData(region = 'world') {
    try {
      const regionData = regionalMarketData[region] || regionalMarketData.world;
      console.log('📊 Fetching real-time market data for region:', region);
      
      if (NEWS_APIS.alphavantage.apiKey === 'demo') {
        console.log('⚠️ Alpha Vantage API key not configured, using sample data');
        return this.getSampleMarketData(region);
      }
      
      const marketPromises = regionData.slice(0, 5).map(async (stock) => {
        try {
          // Clean symbol for Alpha Vantage API
          const cleanSymbol = stock.symbol.replace('.BSE', '').replace('.AS', '').replace('.SW', '').replace('.PA', '').replace('.CO', '');
          
          const apiUrl = buildApiUrl(NEWS_APIS.alphavantage.baseUrl, '', {
            function: 'GLOBAL_QUOTE',
            symbol: cleanSymbol,
            apikey: NEWS_APIS.alphavantage.apiKey
          });
          
          const response = await axios.get(apiUrl, { timeout: 10000 });
          
          const quote = response.data['Global Quote'];
          if (quote && quote['05. price']) {
            const price = parseFloat(quote['05. price']);
            const change = parseFloat(quote['09. change']);
            const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
            
            return {
              symbol: stock.symbol,
              name: stock.name,
              price: price,
              change: change,
              changePercent: changePercent
            };
          }
          
          throw new Error('Invalid API response');
        } catch (error) {
          console.warn(`Failed to fetch data for ${stock.symbol}:`, error.message);
          return this.getSampleStockData(stock);
        }
      });
      
      const results = await Promise.all(marketPromises);
      console.log('✅ Real-time market data fetched:', results.length);
      return results;
      
    } catch (error) {
      console.error('Market data error:', error);
      return this.getSampleMarketData(region);
    }
  }
  
  getSampleStockData(stock) {
    const basePrice = Math.random() * 200 + 50;
    const change = (Math.random() - 0.5) * 10;
    const changePercent = (change / basePrice) * 100;
    
    return {
      symbol: stock.symbol,
      name: stock.name,
      price: basePrice,
      change: change,
      changePercent: changePercent,
      currency: 'USD'
    };
  }
  
  getSampleMarketData(region) {
    const regionData = regionalMarketData[region] || regionalMarketData.world;
    const stocks = regionData.map(stock => this.getSampleStockData(stock));
    
    // Convert Indian stocks to realistic INR prices
    if (region === 'india') {
      return stocks.map(stock => {
        const inrPrices = {
          'RELIANCE': { price: 2456.75, change: 45.20 },
          'TCS': { price: 3234.60, change: -23.45 },
          'INFY': { price: 1567.80, change: 34.25 },
          'HDFCBANK': { price: 1678.90, change: -12.30 },
          'ICICIBANK': { price: 945.25, change: 18.75 }
        };
        
        const cleanSymbol = stock.symbol.replace('.NS', '');
        const inrData = inrPrices[cleanSymbol];
        
        if (inrData) {
          const variation = (Math.random() - 0.5) * 0.02;
          return {
            ...stock,
            price: inrData.price * (1 + variation),
            change: inrData.change * (1 + variation),
            changePercent: (inrData.change / inrData.price) * 100,
            currency: 'INR'
          };
        }
        
        return { ...stock, currency: 'INR' };
      });
    }
    
    return stocks.map(stock => ({ ...stock, currency: 'USD' }));
  }
  
  async getRealTimeIndices() {
    try {
      if (NEWS_APIS.alphavantage.apiKey === 'demo') {
        return this.getSampleIndicesData();
      }
      
      const indices = ['SPY', 'QQQ', 'DIA', 'IWM']; // ETFs representing major indices
      const indicesPromises = indices.map(async (symbol) => {
        try {
          const apiUrl = buildApiUrl(NEWS_APIS.alphavantage.baseUrl, '', {
            function: 'GLOBAL_QUOTE',
            symbol: symbol,
            apikey: NEWS_APIS.alphavantage.apiKey
          });
          
          const response = await axios.get(apiUrl, { timeout: 10000 });
          
          const quote = response.data['Global Quote'];
          if (quote && quote['05. price']) {
            const price = parseFloat(quote['05. price']);
            const change = parseFloat(quote['09. change']);
            const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
            
            const nameMap = {
              'SPY': 'S&P 500 ETF',
              'QQQ': 'NASDAQ 100 ETF',
              'DIA': 'Dow Jones ETF',
              'IWM': 'Russell 2000 ETF'
            };
            
            return {
              symbol: symbol,
              name: nameMap[symbol],
              value: price,
              change: change,
              changePercent: changePercent
            };
          }
          
          throw new Error('Invalid API response');
        } catch (error) {
          console.warn(`Failed to fetch index data for ${symbol}:`, error.message);
          return null;
        }
      });
      
      const results = await Promise.all(indicesPromises);
      return results.filter(result => result !== null);
      
    } catch (error) {
      console.error('Indices data error:', error);
      return this.getSampleIndicesData();
    }
  }
  
  getSampleIndicesData() {
    return [
      { symbol: 'S&P 500', name: 'Standard & Poor\'s 500', value: 4567.89, change: 23.45, changePercent: 0.52 },
      { symbol: 'NASDAQ', name: 'NASDAQ Composite', value: 14234.56, change: -45.67, changePercent: -0.32 },
      { symbol: 'DOW', name: 'Dow Jones Industrial', value: 34567.12, change: 156.78, changePercent: 0.46 },
      { symbol: 'RUSSELL', name: 'Russell 2000', value: 1876.43, change: 12.34, changePercent: 0.66 }
    ];
  }
  
  async getRealTimeForex() {
    try {
      if (NEWS_APIS.alphavantage.apiKey === 'demo') {
        return this.getSampleForexData();
      }
      
      const pairs = ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCAD'];
      const forexPromises = pairs.map(async (pair) => {
        try {
          const apiUrl = buildApiUrl(NEWS_APIS.alphavantage.baseUrl, '', {
            function: 'CURRENCY_EXCHANGE_RATE',
            from_currency: pair.substring(0, 3),
            to_currency: pair.substring(3, 6),
            apikey: NEWS_APIS.alphavantage.apiKey
          });
          
          const response = await axios.get(apiUrl, { timeout: 10000 });
          
          const rate = response.data['Realtime Currency Exchange Rate'];
          if (rate && rate['5. Exchange Rate']) {
            const price = parseFloat(rate['5. Exchange Rate']);
            const change = (Math.random() - 0.5) * 0.01; // Small random change
            const changePercent = (change / price) * 100;
            
            const nameMap = {
              'EURUSD': 'Euro to US Dollar',
              'GBPUSD': 'British Pound to USD',
              'USDJPY': 'US Dollar to Japanese Yen',
              'USDCAD': 'US Dollar to Canadian Dollar'
            };
            
            return {
              symbol: pair.substring(0, 3) + '/' + pair.substring(3, 6),
              name: nameMap[pair],
              price: price,
              change: change,
              changePercent: changePercent
            };
          }
          
          throw new Error('Invalid API response');
        } catch (error) {
          console.warn(`Failed to fetch forex data for ${pair}:`, error.message);
          return null;
        }
      });
      
      const results = await Promise.all(forexPromises);
      return results.filter(result => result !== null);
      
    } catch (error) {
      console.error('Forex data error:', error);
      return this.getSampleForexData();
    }
  }
  
  getSampleForexData() {
    return [
      { symbol: 'EUR/USD', name: 'Euro to US Dollar', price: 1.0876, change: 0.0023, changePercent: 0.21 },
      { symbol: 'GBP/USD', name: 'British Pound to USD', price: 1.2543, change: -0.0045, changePercent: -0.36 },
      { symbol: 'USD/JPY', name: 'US Dollar to Japanese Yen', price: 149.87, change: 0.67, changePercent: 0.45 },
      { symbol: 'USD/CAD', name: 'US Dollar to Canadian Dollar', price: 1.3654, change: 0.0087, changePercent: 0.64 }
    ];
  }

  categorizeArticle(text) {
    const categories = {
      'technology': ['tech', 'ai', 'artificial intelligence', 'digital', 'software', 'innovation'],
      'cryptocurrency': ['crypto', 'bitcoin', 'blockchain', 'digital currency', 'ethereum'],
      'markets': ['stock', 'market', 'trading', 'investment', 'portfolio'],
      'monetary-policy': ['fed', 'interest rate', 'central bank', 'monetary', 'policy'],
      'forex': ['currency', 'dollar', 'euro', 'exchange rate', 'forex'],
      'banking': ['bank', 'lending', 'credit', 'financial institution'],
      'economy': ['economic', 'gdp', 'inflation', 'recession', 'growth']
    };

    const lowerText = text.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return category;
      }
    }
    
    return 'general';
  }

  async fetchFreshNews(region) {
    // This method bypasses cache for scheduled refreshes
    const originalMethod = this.getTopHeadlines;
    // Temporarily disable cache check
    newsCache.cache.delete(newsCache.getCacheKey(region));
    return originalMethod.call(this, region);
  }

  async getRegionalNews(region) {
    return this.getTopHeadlines(region);
  }

  filterByCategory(articles, category) {
    if (category === 'all') return articles;
    return articles.filter(article => article.category === category);
  }
  
  async getCommoditiesData() {
    // Note: Alpha Vantage has limited commodity data, using realistic sample data
    return [
      { symbol: 'GOLD', name: 'Gold Spot', price: 1987.45 + (Math.random() - 0.5) * 20, change: (Math.random() - 0.5) * 30, changePercent: (Math.random() - 0.5) * 2 },
      { symbol: 'SILVER', name: 'Silver Spot', price: 24.56 + (Math.random() - 0.5) * 2, change: (Math.random() - 0.5) * 1, changePercent: (Math.random() - 0.5) * 4 },
      { symbol: 'CRUDE', name: 'Crude Oil WTI', price: 78.92 + (Math.random() - 0.5) * 5, change: (Math.random() - 0.5) * 3, changePercent: (Math.random() - 0.5) * 3 },
      { symbol: 'NATGAS', name: 'Natural Gas', price: 2.87 + (Math.random() - 0.5) * 0.5, change: (Math.random() - 0.5) * 0.3, changePercent: (Math.random() - 0.5) * 8 }
    ];
  }
}

// Add rate limiting to prevent API quota exhaustion
class RateLimiter {
  constructor(maxRequests = 5, timeWindow = 60000) { // 5 requests per minute
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }
  
  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    return this.requests.length < this.maxRequests;
  }
  
  recordRequest() {
    this.requests.push(Date.now());
  }
}

const rateLimiter = new RateLimiter();

export default new NewsService();
export { rateLimiter };