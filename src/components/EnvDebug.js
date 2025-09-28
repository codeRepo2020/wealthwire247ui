import React from 'react';

const EnvDebug = () => {
  const envVars = {
    'REACT_APP_NEWS_API_KEY': process.env.REACT_APP_NEWS_API_KEY,
    'REACT_APP_ALPHA_VANTAGE_KEY': process.env.REACT_APP_ALPHA_VANTAGE_KEY,
    'REACT_APP_GUARDIAN_API_KEY': process.env.REACT_APP_GUARDIAN_API_KEY,
    'REACT_APP_GNEWS_API_KEY': process.env.REACT_APP_GNEWS_API_KEY,
    'NODE_ENV': process.env.NODE_ENV
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      left: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      fontSize: '12px',
      zIndex: 9999,
      borderRadius: '5px'
    }}>
      <h4>Environment Variables Debug:</h4>
      {Object.entries(envVars).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {value ? `${value.substring(0, 8)}...` : 'NOT SET'}
        </div>
      ))}
    </div>
  );
};

export default EnvDebug;