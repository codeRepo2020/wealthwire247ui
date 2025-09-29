// Simple direct API test
const testDirectAPI = async () => {
  console.log('🧪 Testing direct API calls...');
  
  // Test Guardian API (usually works well)
  if (process.env.REACT_APP_GUARDIAN_API_KEY && process.env.REACT_APP_GUARDIAN_API_KEY !== 'test') {
    try {
      const guardianUrl = `https://content.guardianapis.com/search?api-key=${process.env.REACT_APP_GUARDIAN_API_KEY}&section=business&page-size=5`;
      console.log('🔗 Guardian URL:', guardianUrl);
      
      const response = await fetch(guardianUrl);
      const data = await response.json();
      
      if (response.ok && data.response && data.response.results) {
        console.log('✅ Guardian API working! Articles:', data.response.results.length);
        return data.response.results.map((article, index) => ({
          id: `guardian-${index}`,
          title: article.webTitle,
          description: article.fields?.trailText || 'No description',
          url: article.webUrl,
          publishedAt: article.webPublicationDate,
          source: { name: 'The Guardian' },
          isLive: true
        }));
      } else {
        console.log('❌ Guardian API error:', data);
      }
    } catch (error) {
      console.log('❌ Guardian API failed:', error.message);
    }
  }
  
  // Test with CORS proxy
  try {
    const corsProxy = 'https://api.allorigins.win/raw?url=';
    const guardianUrl = `https://content.guardianapis.com/search?api-key=${process.env.REACT_APP_GUARDIAN_API_KEY}&section=business&page-size=5`;
    const proxyUrl = corsProxy + encodeURIComponent(guardianUrl);
    
    console.log('🔗 Trying with CORS proxy...');
    const response = await fetch(proxyUrl);
    const data = await response.json();
    
    if (response.ok && data.response && data.response.results) {
      console.log('✅ CORS proxy working! Articles:', data.response.results.length);
      return data.response.results.map((article, index) => ({
        id: `guardian-proxy-${index}`,
        title: article.webTitle,
        description: article.fields?.trailText || 'No description',
        url: article.webUrl,
        publishedAt: article.webPublicationDate,
        source: { name: 'The Guardian (via proxy)' },
        isLive: true
      }));
    } else {
      console.log('❌ CORS proxy error:', data);
    }
  } catch (error) {
    console.log('❌ CORS proxy failed:', error.message);
  }
  
  return [];
};

// Export for use in components
export default testDirectAPI;