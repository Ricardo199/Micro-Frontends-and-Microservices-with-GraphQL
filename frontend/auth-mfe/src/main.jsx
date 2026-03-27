import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client'
import { authApolloClient } from './services/apolloClient.js'
import './index.css'
import App from './App.jsx'

// Check backend services on startup
console.log('=== Backend Service Status Check ===');

// Test Auth Service with proper GraphQL query
fetch('http://localhost:4001/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: '{ __schema { types { name } } }'
  })
})
  .then(response => {
    if (response.ok) {
      console.log('✅ Auth Service (port 4001) is accessible');
    } else {
      console.log('❌ Auth Service (port 4001) returned error:', response.status);
      console.log('Please ensure the Auth Service is running and check the console for details');
    }
  })
  .catch(error => {
    console.log('❌ Auth Service (port 4001) is not accessible:', error.message);
    console.log('Please ensure the Auth Service is running on port 4001');
  });

// Test Community Service with proper GraphQL query
fetch('http://localhost:4002/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: '{ __schema { types { name } } }'
  })
})
  .then(response => {
    if (response.ok) {
      console.log('✅ Community Service (port 4002) is accessible');
    } else {
      console.log('❌ Community Service (port 4002) returned error:', response.status);
      console.log('Please ensure the Community Service is running and check the console for details');
    }
  })
  .catch(error => {
    console.log('❌ Community Service (port 4002) is not accessible:', error.message);
    console.log('Please ensure the Community Service is running on port 4002');
  });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={authApolloClient}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
