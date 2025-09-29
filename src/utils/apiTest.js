// Simple API connectivity test
const testAPIs = async () => {
  const results = {};
  
  // Test NewsAPI directly (might fail due to CORS)
  try {
    const newsResponse = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=business&pageSize=5&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`);
    results.newsapi = newsResponse.ok ? 'Working' : `Error: ${newsResponse.status}`;
  } catch (error) {
    results.newsapi = `CORS/Network Error: ${error.message}`;
  }
  
  // Test Guardian API directly
  try {
    const guardianResponse = await fetch(`https://content.guardianapis.com/search?api-key=${process.env.REACT_APP_GUARDIAN_API_KEY}&section=business&page-size=5`);
    results.guardian = guardianResponse.ok ? 'Working' : `Error: ${guardianResponse.status}`;
  } catch (error) {
    results.guardian = `CORS/Network Error: ${error.message}`;
  }
  
  // Test Alpha Vantage directly
  try {
    const alphaResponse = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=${process.env.REACT_APP_ALPHA_VANTAGE_KEY}`);
    results.alphavantage = alphaResponse.ok ? 'Working' : `Error: ${alphaResponse.status}`;
  } catch (error) {
    results.alphavantage = `CORS/Network Error: ${error.message}`;
  }
  
  console.log('🔍 API Connectivity Test Results:', results);
  return results;
};

export default testAPIs;