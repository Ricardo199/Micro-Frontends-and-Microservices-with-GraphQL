import { gql } from 'apollo-server-express';

export const typeDefs = gql`

type User {
    id: ID!
    username: String!
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
    getUser(_id: ID!): User
    getAllUsers: [User!]!
}

type Mutation {
    register(username: String!, email: String!, password: String!, role: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateUser(_id: ID!, username: String, email: String, password: String, role: String): User!
    deleteUser(_id: ID!): Boolean!
}
`;