const FMP_API_KEY = 'g3e4dJtc0l7lyuMRWkUped0muAc9XxwH';
const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3';

async function testEndpoint(endpoint, description) {
  console.log(`\n🔄 Testing ${description}...`);
  
  try {
    const url = `${FMP_BASE_URL}${endpoint}?apikey=${FMP_API_KEY}`;
    console.log('📡 URL:', url);
    
    const response = await fetch(url);
    console.log('📊 Status:', response.status, response.statusText);
    
    const text = await response.text();
    
    if (response.ok) {
      const data = JSON.parse(text);
      console.log('✅ Success:', data.slice ? data.slice(0, 1) : data);
      return true;
    } else {
      console.log('❌ Error Response:', text);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Request Error:', error.message);
    return false;
  }
}

async function testFMPDetailed() {
  console.log('🚀 FMP API Detailed Test');
  console.log('🔑 API Key:', FMP_API_KEY);
  
  const tests = [
    ['/quote/AAPL', 'Stock Quote (AAPL)'],
    ['/stock_news?limit=1', 'Stock News'],
    ['/sector-performance', 'Sector Performance'],
    ['/fx/EURUSD', 'Forex (EUR/USD)'],
    ['/profile/AAPL', 'Company Profile']
  ];
  
  let successCount = 0;
  
  for (const [endpoint, description] of tests) {
    const success = await testEndpoint(endpoint, description);
    if (success) successCount++;
  }
  
  console.log(`\n📊 Results: ${successCount}/${tests.length} endpoints working`);
  
  if (successCount === 0) {
    console.log('\n❌ FMP API is not working. Possible issues:');
    console.log('   • Invalid or expired API key');
    console.log('   • Rate limit exceeded');
    console.log('   • Free plan limitations');
    console.log('   • Account suspended');
  }
}

testFMPDetailed();