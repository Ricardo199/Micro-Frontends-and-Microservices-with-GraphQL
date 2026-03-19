import { gql } from 'apollo-server-express';

export const typeDefs = gql`

type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    createdAt: String!
}

type AuthPayload {
    token: String!
    user: User!
}

type Query {
    me: User
    getUser(id: ID!): User
    getAllUsers: [User!]!
}

type Mutation {
    register(name: String!, email: String!, password: String!, role: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateUser(id: ID!, name: String, email: String, password: String, role: String): User!
    deleteUser(id: ID!): Boolean!
}
`;