const NYT_API_KEY = 'X6p1A8woMgwyvWJYGFIFK4AViBQi2dZl';
const NYT_BASE_URL = 'https://api.nytimes.com/svc';

async function testNYT() {
  console.log('🔄 Testing NYT API...');
  
  try {
    // Test Top Stories API
    const url = `${NYT_BASE_URL}/topstories/v2/business.json?api-key=${NYT_API_KEY}`;
    console.log('📡 Testing URL:', url);
    
    const response = await fetch(url);
    console.log('📊 Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ NYT Response sample:', {
      status: data.status,
      copyright: data.copyright,
      num_results: data.num_results,
      first_article: data.results?.[0] ? {
        title: data.results[0].title,
        abstract: data.results[0].abstract,
        url: data.results[0].url
      } : null
    });
    
    if (data.results && data.results.length > 0) {
      console.log('🎉 NYT API is working!');
      console.log('📰 Articles found:', data.results.length);
      console.log('📈 First article:', data.results[0].title);
      return true;
    } else if (data.fault) {
      console.log('❌ API Error:', data.fault);
      return false;
    } else {
      console.log('❌ No articles returned');
      return false;
    }
    
  } catch (error) {
    console.error('❌ NYT API Error:', error.message);
    return false;
  }
}

async function testNYTSearch() {
  console.log('\n🔍 Testing NYT Article Search...');
  
  try {
    const searchUrl = `${NYT_BASE_URL}/search/v2/articlesearch.json?q=finance&sort=newest&api-key=${NYT_API_KEY}`;
    console.log('📡 Search URL:', searchUrl);
    
    const response = await fetch(searchUrl);
    console.log('📊 Search status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ NYT Search sample:', {
      status: data.status,
      hits: data.response?.meta?.hits,
      first_result: data.response?.docs?.[0] ? {
        headline: data.response.docs[0].headline.main,
        abstract: data.response.docs[0].abstract
      } : null
    });
    
    return data.response?.docs?.length > 0;
    
  } catch (error) {
    console.error('❌ NYT Search Error:', error.message);
    return false;
  }
}

async function runTests() {
  const topStoriesWorking = await testNYT();
  const searchWorking = await testNYTSearch();
  
  console.log('\n📊 NYT API Test Results:');
  console.log('Top Stories API:', topStoriesWorking ? '✅ Working' : '❌ Failed');
  console.log('Article Search API:', searchWorking ? '✅ Working' : '❌ Failed');
}

runTests();