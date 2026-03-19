import { gql } from 'apollo-server-express';

export const typeDefs = gql`
type Post {
    author: User!
    title: String!
    content: String!
    category: String!
    aiSummary: String
    createdAt: String!
    updatedAt: String!
}
`;