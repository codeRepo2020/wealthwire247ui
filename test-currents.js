const CURRENTS_API_KEY = 'demo'; // Replace with your key
const CURRENTS_BASE_URL = 'https://api.currentsapi.services/v1';

async function testCurrents() {
  console.log('🔄 Testing Currents API...');
  
  try {
    const url = `${CURRENTS_BASE_URL}/latest-news?apiKey=${CURRENTS_API_KEY}&category=business&language=en&limit=5`;
    console.log('📡 Testing URL:', url);
    
    const response = await fetch(url);
    console.log('📊 Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Currents Response:', JSON.stringify(data, null, 2));
    
    if (data.news && data.news.length > 0) {
      console.log('🎉 Currents API is working!');
      console.log('📰 Articles found:', data.news.length);
      console.log('📈 First article:', data.news[0].title);
      return true;
    } else if (data.error) {
      console.log('❌ API Error:', data.error);
      return false;
    } else {
      console.log('❌ No articles returned');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Currents API Error:', error.message);
    return false;
  }
}

testCurrents();