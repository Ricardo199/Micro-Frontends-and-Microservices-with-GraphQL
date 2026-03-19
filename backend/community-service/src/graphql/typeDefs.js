import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
        email: String!
    }

    type Post {
        _id: ID!
        author: User!
        title: String!
        content: String!
        category: String!
        aiSummary: String
        createdAt: String!
        updatedAt: String!
    }

    type HelpRequest {
        _id: ID!
        author: User!
        description: String!
        location: String
        isResolved: Boolean!
        volunteers: [User!]!
        createdAt: String!
        updatedAt: String
    }

    type Query {
        me: User
        posts(category: String): [Post!]!
        post(_id: ID!): Post
        helpRequest(_id: ID!): HelpRequest
        updateHelpRequest(_id: ID!, description: String, location: String, isResolved: Boolean): HelpRequest
    }

    type Mutation {
        createPost(title: String!, content: String!, category: String!): Post!
        updatePost(_id: ID!, title: String, content: String, category: String): Post!
        deletePost(_id: ID!): Boolean!
        createHelpRequest(description: String!, location: String): HelpRequest!
        resolveHelpRequest(_id: ID!): HelpRequest!
        volunteerForHelpRequest(_id: ID!): HelpRequest!
    }`;