const POLYGON_API_KEY = 'demo'; // Replace with your key
const POLYGON_BASE_URL = 'https://api.polygon.io';

async function testPolygon() {
  console.log('🔄 Testing Polygon.io API...');
  
  try {
    const url = `${POLYGON_BASE_URL}/v2/aggs/ticker/AAPL/prev?adjusted=true&apikey=${POLYGON_API_KEY}`;
    console.log('📡 Testing URL:', url);
    
    const response = await fetch(url);
    console.log('📊 Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Polygon Response:', JSON.stringify(data, null, 2));
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      console.log('🎉 Polygon API is working!');
      console.log('📈 AAPL Close Price:', result.c);
      console.log('📊 Volume:', result.v);
      return true;
    } else if (data.error) {
      console.log('❌ API Error:', data.error);
      return false;
    } else {
      console.log('❌ No data returned');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Polygon API Error:', error.message);
    return false;
  }
}

testPolygon();