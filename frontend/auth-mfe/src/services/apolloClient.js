import { ApolloClient, HttpLink, InMemoryCache, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const authHttpLink = new HttpLink({
  uri: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:4001/graphql',
});

const communityHttpLink = new HttpLink({
  uri: import.meta.env.VITE_COMMUNITY_SERVICE_URL || 'http://localhost:4002/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('authToken');
  
  console.log('Apollo Client Auth Debug:', {
    token: token ? 'TOKEN_PRESENT' : 'TOKEN_MISSING',
    tokenLength: token ? token.length : 0,
    headers: headers
  });
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    console.log('Apollo Client Response:', {
      operationName: operation.operationName,
      variables: operation.variables,
      response: response
    });
    return response;
  }).catch(error => {
    console.error('Apollo Client Network Error:', {
      operationName: operation.operationName,
      variables: operation.variables,
      error: error
    });
    return error;
  });
});

export const authApolloClient = new ApolloClient({
  link: authLink.concat(authHttpLink),
  cache: new InMemoryCache(),
});

export const communityApolloClient = new ApolloClient({
  link: authLink.concat(communityHttpLink),
  cache: new InMemoryCache(),
});