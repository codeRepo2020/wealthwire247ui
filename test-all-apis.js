// Test all news APIs
const APIs = {
  newsapi: {
    key: '22792c4998e546c0bddee0c4121ade15',
    url: 'https://newsapi.org/v2/top-headlines?country=us&category=business&pageSize=5&apiKey='
  },
  guardian: {
    key: 'a90bedfc-a6d9-487f-b2de-1360c8d903de',
    url: 'https://content.guardianapis.com/search?section=business&page-size=5&api-key='
  },
  gnews: {
    key: '798e7d2051eeca518c7fb356c6ead7c4',
    url: 'https://gnews.io/api/v4/top-headlines?topic=business&lang=en&max=5&token='
  },
  currents: {
    key: 'm7EykBzbLpIOaosQN-JmVi8u9qmUtJCpvGKXHJvE-O9lbV1B',
    url: 'https://api.currentsapi.services/v1/latest-news?category=business&language=en&limit=5&apiKey='
  },
  nyt: {
    key: 'X6p1A8woMgwyvWJYGFIFK4AViBQi2dZl',
    url: 'https://api.nytimes.com/svc/topstories/v2/business.json?api-key='
  }
};

async function testAPI(name, config) {
  console.log(`\n🔄 Testing ${name.toUpperCase()} API...`);
  
  try {
    const url = config.url + config.key;
    console.log(`📡 URL: ${url.substring(0, 80)}...`);
    
    const response = await fetch(url);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Error: ${errorText.substring(0, 200)}`);
      return false;
    }
    
    const data = await response.json();
    
    // Check for data based on API structure
    let hasData = false;
    let articleCount = 0;
    
    if (name === 'newsapi' && data.articles) {
      hasData = data.articles.length > 0;
      articleCount = data.articles.length;
    } else if (name === 'guardian' && data.response?.results) {
      hasData = data.response.results.length > 0;
      articleCount = data.response.results.length;
    } else if (name === 'gnews' && data.articles) {
      hasData = data.articles.length > 0;
      articleCount = data.articles.length;
    } else if (name === 'currents' && data.news) {
      hasData = data.news.length > 0;
      articleCount = data.news.length;
    } else if (name === 'nyt' && data.results) {
      hasData = data.results.length > 0;
      articleCount = data.results.length;
    }
    
    if (hasData) {
      console.log(`✅ ${name.toUpperCase()} API Working! Articles: ${articleCount}`);
      return true;
    } else {
      console.log(`❌ ${name.toUpperCase()} API: No articles returned`);
      console.log(`Response sample:`, JSON.stringify(data).substring(0, 200));
      return false;
    }
    
  } catch (error) {
    console.log(`❌ ${name.toUpperCase()} API Error: ${error.message}`);
    return false;
  }
}

async function testAllAPIs() {
  console.log('🚀 Testing All News APIs...\n');
  
  const results = {};
  
  for (const [name, config] of Object.entries(APIs)) {
    results[name] = await testAPI(name, config);
  }
  
  console.log('\n📊 API Test Results Summary:');
  console.log('================================');
  
  let workingCount = 0;
  for (const [name, working] of Object.entries(results)) {
    const status = working ? '✅ Working' : '❌ Failed';
    console.log(`${name.toUpperCase().padEnd(10)}: ${status}`);
    if (working) workingCount++;
  }
  
  console.log(`\n🎯 Working APIs: ${workingCount}/5`);
  
  if (workingCount === 0) {
    console.log('\n⚠️ No APIs are working. Possible issues:');
    console.log('   • CORS blocking requests');
    console.log('   • API keys expired/invalid');
    console.log('   • Rate limits exceeded');
    console.log('   • Network connectivity issues');
  }
}

testAllAPIs();