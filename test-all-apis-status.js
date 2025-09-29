const axios = require('axios');

const APIs = {
  NewsAPI: {
    url: 'https://newsapi.org/v2/top-headlines?country=us&category=business&pageSize=5&apiKey=22792c4998e546c0bddee0c4121ade15',
    key: '22792c4998e546c0bddee0c4121ade15'
  },
  Guardian: {
    url: 'https://content.guardianapis.com/search?api-key=a90bedfc-a6d9-487f-b2de-1360c8d903de&section=business&page-size=5',
    key: 'a90bedfc-a6d9-487f-b2de-1360c8d903de'
  },
  GNews: {
    url: 'https://gnews.io/api/v4/top-headlines?token=798e7d2051eeca518c7fb356c6ead7c4&topic=business&max=5&lang=en',
    key: '798e7d2051eeca518c7fb356c6ead7c4'
  },
  Currents: {
    url: 'https://api.currentsapi.services/v1/latest-news?apiKey=m7EykBzbLpIOaosQN-JmVi8u9qmUtJCpvGKXHJvE-O9lbV1B&category=business&language=en&limit=5',
    key: 'm7EykBzbLpIOaosQN-JmVi8u9qmUtJCpvGKXHJvE-O9lbV1B'
  },
  NYT: {
    url: 'https://api.nytimes.com/svc/topstories/v2/business.json?api-key=X6p1A8woMgwyvWJYGFIFK4AViBQi2dZl',
    key: 'X6p1A8woMgwyvWJYGFIFK4AViBQi2dZl'
  }
};

async function testAPI(name, config) {
  try {
    console.log(`🧪 Testing ${name}...`);
    const response = await axios.get(config.url, { timeout: 15000 });
    
    let articleCount = 0;
    if (name === 'NewsAPI' && response.data.articles) {
      articleCount = response.data.articles.length;
    } else if (name === 'Guardian' && response.data.response?.results) {
      articleCount = response.data.response.results.length;
    } else if (name === 'GNews' && response.data.articles) {
      articleCount = response.data.articles.length;
    } else if (name === 'Currents' && response.data.news) {
      articleCount = response.data.news.length;
    } else if (name === 'NYT' && response.data.results) {
      articleCount = response.data.results.length;
    }
    
    return {
      name,
      status: '✅ WORKING',
      code: response.status,
      articles: articleCount,
      key: config.key.substring(0, 8) + '...'
    };
  } catch (error) {
    return {
      name,
      status: '❌ FAILED',
      code: error.response?.status || 'NO_RESPONSE',
      error: error.message,
      key: config.key.substring(0, 8) + '...'
    };
  }
}

async function testAllAPIs() {
  console.log('🚀 Testing All News APIs');
  console.log('='.repeat(60));
  
  const results = [];
  
  for (const [name, config] of Object.entries(APIs)) {
    const result = await testAPI(name, config);
    results.push(result);
    
    if (result.status.includes('WORKING')) {
      console.log(`${result.status} ${name} - ${result.articles} articles (${result.code})`);
    } else {
      console.log(`${result.status} ${name} - ${result.error} (${result.code})`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  
  const working = results.filter(r => r.status.includes('WORKING'));
  const failed = results.filter(r => r.status.includes('FAILED'));
  
  console.log(`📊 SUMMARY:`);
  console.log(`✅ Working APIs: ${working.length}/5`);
  console.log(`❌ Failed APIs: ${failed.length}/5`);
  
  if (working.length > 0) {
    console.log(`\n✅ Working: ${working.map(r => r.name).join(', ')}`);
  }
  
  if (failed.length > 0) {
    console.log(`❌ Failed: ${failed.map(r => r.name).join(', ')}`);
  }
  
  console.log(`\n🌍 Global Mode Coverage: ${working.length} APIs available`);
}

testAllAPIs();