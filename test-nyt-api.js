// Simple NYT API test
const axios = require('axios');

const NYT_API_KEY = 'X6p1A8woMgwyvWJYGFIFK4AViBQi2dZl';
const NYT_BASE_URL = 'https://api.nytimes.com/svc';

async function testNYTAPI() {
  console.log('🧪 Testing NYT API Direct Connection');
  console.log('=' .repeat(50));
  
  try {
    const url = `${NYT_BASE_URL}/topstories/v2/business.json?api-key=${NYT_API_KEY}`;
    console.log('📡 Making request to:', url.replace(NYT_API_KEY, 'API_KEY_HIDDEN'));
    
    const response = await axios.get(url, { timeout: 15000 });
    
    console.log('✅ Response Status:', response.status);
    console.log('📊 Response Data Keys:', Object.keys(response.data));
    
    if (response.data && response.data.results) {
      console.log('📰 Total Articles:', response.data.results.length);
      
      console.log('\n📰 Sample Articles:');
      response.data.results.slice(0, 3).forEach((article, index) => {
        console.log(`${index + 1}. ${article.title}`);
        console.log(`   Abstract: ${article.abstract}`);
        console.log(`   URL: ${article.url}`);
        console.log(`   Published: ${article.published_date}`);
        console.log('');
      });
      
      console.log('✅ NYT API is working correctly!');
    } else {
      console.log('❌ No results in response');
      console.log('Response:', JSON.stringify(response.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ NYT API Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Response Data:', error.response.data);
    }
  }
}

testNYTAPI();