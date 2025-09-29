// Test environment variables
console.log('🔍 Environment Variables Test:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('API Keys Status:');
console.log('- NewsAPI:', process.env.REACT_APP_NEWS_API_KEY ? 'Loaded' : 'Missing');
console.log('- Guardian:', process.env.REACT_APP_GUARDIAN_API_KEY ? 'Loaded' : 'Missing');
console.log('- GNews:', process.env.REACT_APP_GNEWS_API_KEY ? 'Loaded' : 'Missing');
console.log('- Currents:', process.env.REACT_APP_CURRENTS_API_KEY ? 'Loaded' : 'Missing');
console.log('- NYT:', process.env.REACT_APP_NYT_API_KEY ? 'Loaded' : 'Missing');
console.log('- Alpha Vantage:', process.env.REACT_APP_ALPHA_VANTAGE_KEY ? 'Loaded' : 'Missing');

// Test a simple API call
const testSimpleAPI = async () => {
  try {
    console.log('🧪 Testing simple API call...');
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    const data = await response.json();
    console.log('✅ Simple API test successful:', data.title);
  } catch (error) {
    console.error('❌ Simple API test failed:', error.message);
  }
};

testSimpleAPI();

export default {
  newsapi: process.env.REACT_APP_NEWS_API_KEY,
  guardian: process.env.REACT_APP_GUARDIAN_API_KEY,
  gnews: process.env.REACT_APP_GNEWS_API_KEY,
  currents: process.env.REACT_APP_CURRENTS_API_KEY,
  nyt: process.env.REACT_APP_NYT_API_KEY,
  alphavantage: process.env.REACT_APP_ALPHA_VANTAGE_KEY
};