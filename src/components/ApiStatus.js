import React, { useState, useEffect } from 'react';

const ApiStatus = ({ activeRegion, newsCount }) => {
  const [status, setStatus] = useState({});
  const [testing, setTesting] = useState(false);
  const [isGlobalMode, setIsGlobalMode] = useState(false);

  useEffect(() => {
    setIsGlobalMode(activeRegion === 'all');
  }, [activeRegion]);

  const testAPI = async (name, url) => {
    try {
      const response = await fetch(url);
      return {
        name,
        status: response.ok ? 'Working' : `Error ${response.status}`,
        ok: response.ok
      };
    } catch (error) {
      return {
        name,
        status: `Failed: ${error.message}`,
        ok: false
      };
    }
  };

  const runTests = async () => {
    setTesting(true);
    const tests = [];

    // Test APIs with CORS proxy
    const corsProxy = 'https://api.allorigins.win/raw?url=';
    
    if (process.env.REACT_APP_NEWS_API_KEY && process.env.REACT_APP_NEWS_API_KEY !== 'demo-key') {
      tests.push(testAPI('NewsAPI', 
        corsProxy + encodeURIComponent(`https://newsapi.org/v2/top-headlines?country=us&category=business&pageSize=1&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`)
      ));
    }

    if (process.env.REACT_APP_GUARDIAN_API_KEY && process.env.REACT_APP_GUARDIAN_API_KEY !== 'test') {
      tests.push(testAPI('Guardian', 
        corsProxy + encodeURIComponent(`https://content.guardianapis.com/search?api-key=${process.env.REACT_APP_GUARDIAN_API_KEY}&section=business&page-size=1`)
      ));
    }

    if (process.env.REACT_APP_GNEWS_API_KEY && process.env.REACT_APP_GNEWS_API_KEY !== 'demo') {
      tests.push(testAPI('GNews', 
        corsProxy + encodeURIComponent(`https://gnews.io/api/v4/top-headlines?token=${process.env.REACT_APP_GNEWS_API_KEY}&topic=business&max=1&lang=en`)
      ));
    }

    const results = await Promise.all(tests);
    const statusObj = {};
    results.forEach(result => {
      statusObj[result.name] = result;
    });
    
    setStatus(statusObj);
    setTesting(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: isGlobalMode ? 'rgba(34, 197, 94, 0.9)' : 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 1000,
      maxWidth: '220px',
      border: isGlobalMode ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.2)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        {isGlobalMode && <span style={{ fontSize: '14px' }}>🌍</span>}
        {isGlobalMode ? 'Global Multi-API Mode' : 'API Status'} 
        {testing && '(Testing...)'}
      </div>
      
      {isGlobalMode && (
        <div style={{ 
          background: 'rgba(255,255,255,0.2)', 
          padding: '6px', 
          borderRadius: '4px', 
          marginBottom: '8px',
          fontSize: '11px'
        }}>
          📊 Fetching from ALL available APIs<br/>
          {newsCount > 0 && `📰 ${newsCount} articles loaded`}
        </div>
      )}
      
      {Object.entries(status).map(([name, result]) => (
        <div key={name} style={{ 
          color: result.ok ? '#4CAF50' : '#f44336',
          marginBottom: '3px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{name}:</span>
          <span style={{ fontSize: '10px' }}>{result.status}</span>
        </div>
      ))}
      
      <button 
        onClick={runTests} 
        disabled={testing}
        style={{
          background: isGlobalMode ? '#059669' : '#2196F3',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '10px',
          marginTop: '8px',
          cursor: 'pointer',
          width: '100%',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => e.target.style.opacity = '0.8'}
        onMouseOut={(e) => e.target.style.opacity = '1'}
      >
        {isGlobalMode ? 'Test All APIs' : 'Retest APIs'}
      </button>
    </div>
  );
};

export default ApiStatus;