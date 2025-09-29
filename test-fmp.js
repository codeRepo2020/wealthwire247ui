// Test FMP API
const FMP_API_KEY = 'g3e4dJtc0l7lyuMRWkUped0muAc9XxwH';
const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3';

async function testFMP() {
  console.log('🔄 Testing FMP API...');
  
  try {
    // Test basic quote endpoint
    const url = `${FMP_BASE_URL}/quote/AAPL?apikey=${FMP_API_KEY}`;
    console.log('📡 Testing URL:', url);
    
    const response = await fetch(url);
    console.log('📊 Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ FMP API Response:', data);
    
    if (data && data.length > 0) {
      console.log('🎉 FMP API is working!');
      console.log('📈 AAPL Price:', data[0].price);
      console.log('📊 Change:', data[0].change);
      return true;
    } else {
      console.log('❌ No data returned');
      return false;
    }
    
  } catch (error) {
    console.error('❌ FMP API Error:', error.message);
    return false;
  }
}

// Run test
testFMP();