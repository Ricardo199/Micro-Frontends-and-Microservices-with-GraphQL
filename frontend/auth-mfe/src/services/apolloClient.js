import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const authHttpLink = new HttpLink({
  uri: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:4001/graphql',
});

const communityHttpLink = new HttpLink({
  uri: import.meta.env.VITE_COMMUNITY_SERVICE_URL || 'http://localhost:4002/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('authToken');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const authApolloClient = new ApolloClient({
  link: authLink.concat(authHttpLink),
  cache: new InMemoryCache(),
});

export const communityApolloClient = new ApolloClient({
  link: authLink.concat(communityHttpLink),
  cache: new InMemoryCache(),
});