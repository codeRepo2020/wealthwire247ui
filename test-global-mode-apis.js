const axios = require('axios');

const APIs = {
  Guardian: 'https://content.guardianapis.com/search?api-key=a90bedfc-a6d9-487f-b2de-1360c8d903de&section=business&page-size=5',
  GNews: 'https://gnews.io/api/v4/top-headlines?token=798e7d2051eeca518c7fb356c6ead7c4&topic=business&max=5&lang=en',
  NYT: 'https://api.nytimes.com/svc/topstories/v2/business.json?api-key=X6p1A8woMgwyvWJYGFIFK4AViBQi2dZl',
  NewsData: 'https://newsdata.io/api/1/news?apikey=pub_3623827d82a14c7d9d913cfacc869a4f&category=business&language=en&size=5'
};

async function testGlobalModeAPIs() {
  console.log('🌍 Testing Global Mode - All 4 Working APIs');
  console.log('='.repeat(50));
  
  const results = [];
  
  for (const [name, url] of Object.entries(APIs)) {
    try {
      console.log(`📡 Testing ${name}...`);
      const response = await axios.get(url, { timeout: 15000 });
      
      let articleCount = 0;
      let sampleTitle = '';
      
      if (name === 'Guardian' && response.data.response?.results) {
        articleCount = response.data.response.results.length;
        sampleTitle = response.data.response.results[0]?.webTitle;
      } else if (name === 'GNews' && response.data.articles) {
        articleCount = response.data.articles.length;
        sampleTitle = response.data.articles[0]?.title;
      } else if (name === 'NYT' && response.data.results) {
        articleCount = response.data.results.length;
        sampleTitle = response.data.results[0]?.title;
      } else if (name === 'NewsData' && response.data.results) {
        articleCount = response.data.results.length;
        sampleTitle = response.data.results[0]?.title;
      }
      
      results.push({
        name,
        status: '✅ WORKING',
        articles: articleCount,
        sample: sampleTitle?.substring(0, 60) + '...'
      });
      
      console.log(`✅ ${name}: ${articleCount} articles`);
      
    } catch (error) {
      results.push({
        name,
        status: '❌ FAILED',
        error: error.message
      });
      console.log(`❌ ${name}: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 GLOBAL MODE API STATUS:');
  
  const working = results.filter(r => r.status.includes('WORKING'));
  const failed = results.filter(r => r.status.includes('FAILED'));
  
  console.log(`✅ Working APIs: ${working.length}/4`);
  console.log(`❌ Failed APIs: ${failed.length}/4`);
  
  if (working.length > 0) {
    console.log('\n✅ WORKING APIS:');
    working.forEach(api => {
      console.log(`   ${api.name}: ${api.articles} articles`);
      console.log(`   Sample: ${api.sample}`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n❌ FAILED APIS:');
    failed.forEach(api => {
      console.log(`   ${api.name}: ${api.error}`);
    });
  }
  
  console.log(`\n🌍 Global Mode Coverage: ${working.length} APIs available`);
  console.log(`📰 Total articles available: ${working.reduce((sum, api) => sum + api.articles, 0)}`);
}

testGlobalModeAPIs();