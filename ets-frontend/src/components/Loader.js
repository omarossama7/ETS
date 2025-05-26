import React from 'react';

function Loader() {
  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <div className="spinner" />
      <p>Loading...</p>
      <style>
        {`
          .spinner {
            margin: 0 auto 10px;
            border: 4px solid #eee;
            border-top: 4px solid #333;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}
      </style>
    </div>
  );
}

export default Loader;
