const axios = require('axios');

const testGuardianAPI = async () => {
  try {
    console.log('Testing Guardian API...');
    
    const response = await axios.get('https://content.guardianapis.com/search', {
      params: {
        'api-key': 'a90bedfc-a6d9-487f-b2de-1360c8d903de',
        section: 'business',
        'page-size': 5,
        'show-fields': 'thumbnail,trailText',
        'order-by': 'newest'
      }
    });
    
    console.log('✅ Guardian API Response Status:', response.status);
    console.log('📰 Articles found:', response.data.response?.results?.length || 0);
    
    if (response.data.response?.results?.length > 0) {
      console.log('\n📋 Sample Article:');
      const article = response.data.response.results[0];
      console.log('Title:', article.webTitle);
      console.log('URL:', article.webUrl);
      console.log('Published:', article.webPublicationDate);
      console.log('Description:', article.fields?.trailText || 'No description');
    }
    
  } catch (error) {
    console.error('❌ Guardian API Error:', error.response?.data || error.message);
  }
};

testGuardianAPI();