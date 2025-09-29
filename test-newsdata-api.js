const axios = require('axios');

const NEWSDATA_API_KEY = 'pub_3623827d82a14c7d9d913cfacc869a4f';

async function testNewsDataAPI() {
  console.log('🧪 Testing NewsData.io API');
  console.log('=' .repeat(40));
  
  try {
    const url = `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&category=business&language=en&size=5`;
    console.log('📡 Making request to NewsData.io...');
    
    const response = await axios.get(url, { timeout: 15000 });
    
    console.log('✅ Response Status:', response.status);
    console.log('📊 Total Articles:', response.data.results?.length || 0);
    
    if (response.data.results && response.data.results.length > 0) {
      console.log('\n📰 Sample Articles:');
      response.data.results.slice(0, 3).forEach((article, index) => {
        console.log(`${index + 1}. ${article.title}`);
        console.log(`   Source: ${article.source_id}`);
        console.log(`   Published: ${article.pubDate}`);
        console.log('');
      });
      console.log('✅ NewsData.io API is working!');
    } else {
      console.log('❌ No articles returned');
    }
    
  } catch (error) {
    console.error('❌ NewsData.io Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    }
  }
}

testNewsDataAPI();