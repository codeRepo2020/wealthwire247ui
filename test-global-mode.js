const newsService = require('./src/services/newsApi.js').default;

async function testGlobalMode() {
  console.log('🧪 Testing Global Mode - All APIs Integration');
  console.log('=' .repeat(50));
  
  try {
    console.log('📡 Fetching news with region="all" (Global Mode)...');
    const response = await newsService.getTopHeadlines('all');
    
    console.log('✅ Response received:');
    console.log(`📊 Total articles: ${response.articles.length}`);
    console.log(`📈 Total results: ${response.totalResults}`);
    
    if (response.articles.length > 0) {
      console.log('\n📰 Sample articles:');
      response.articles.slice(0, 5).forEach((article, index) => {
        console.log(`${index + 1}. ${article.title}`);
        console.log(`   Source: ${article.source.name}`);
        console.log(`   API: ${article.id ? article.id.split('-')[0] : 'unknown'}`);
        console.log(`   Region: ${article.region || 'global'}`);
        console.log(`   Live: ${article.isLive ? 'Yes' : 'No (Sample)'}`);
        console.log('');
      });
      
      // Count articles by API source
      const apiCounts = {};
      response.articles.forEach(article => {
        const apiSource = article.id ? article.id.split('-')[0] : 'sample';
        apiCounts[apiSource] = (apiCounts[apiSource] || 0) + 1;
      });
      
      console.log('📊 Articles by API Source:');
      Object.entries(apiCounts).forEach(([api, count]) => {
        console.log(`   ${api}: ${count} articles`);
      });
      
      console.log('\n✅ Global mode test completed successfully!');
      console.log(`🌍 Fetched from ${Object.keys(apiCounts).length} different sources`);
      
    } else {
      console.log('⚠️ No articles returned');
    }
    
  } catch (error) {
    console.error('❌ Error testing global mode:', error.message);
  }
}

// Run the test
testGlobalMode();