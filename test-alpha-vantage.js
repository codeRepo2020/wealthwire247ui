const ALPHA_VANTAGE_KEY = 'ZNSYW50CSUJ15CKB';
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

async function testAlphaVantage() {
  console.log('🔄 Testing Alpha Vantage API...');
  
  try {
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=AAPL&apikey=${ALPHA_VANTAGE_KEY}`;
    console.log('📡 Testing URL:', url);
    
    const response = await fetch(url);
    console.log('📊 Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Alpha Vantage Response:', JSON.stringify(data, null, 2));
    
    if (data['Global Quote'] && data['Global Quote']['05. price']) {
      console.log('🎉 Alpha Vantage API is working!');
      console.log('📈 AAPL Price:', data['Global Quote']['05. price']);
      console.log('📊 Change:', data['Global Quote']['09. change']);
      return true;
    } else if (data['Error Message']) {
      console.log('❌ API Error:', data['Error Message']);
      return false;
    } else if (data['Note']) {
      console.log('⚠️ Rate Limit:', data['Note']);
      return false;
    } else {
      console.log('❌ Unexpected response format');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Alpha Vantage API Error:', error.message);
    return false;
  }
}

testAlphaVantage();