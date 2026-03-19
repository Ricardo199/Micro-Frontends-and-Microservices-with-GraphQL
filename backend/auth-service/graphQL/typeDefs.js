import { gql } from 'apollo-server-express';

export const typeDefs = gql`

type User {
    _id: ID!
    username: String!
    email: String!
    role: String!
    createdAt: String!
    refreshToken: String
}

type AuthPayload {
    accessToken: String!
    refreshToken: String!
    user: User!
}

type Query {
    me: User
    getUser(_id: ID!): User
    getAllUsers: [User!]!
}

type Mutation {
    register(username: String!, email: String!, password: String!, role: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    logout: Boolean!
    updateUser(_id: ID!, username: String, email: String, password: String, role: String): User!
    deleteUser(_id: ID!): Boolean!
    refreshToken(refreshToken: String!): AuthPayload!
}
`;