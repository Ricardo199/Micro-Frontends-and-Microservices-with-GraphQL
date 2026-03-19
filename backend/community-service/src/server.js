import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers.js';
import Post from './models/Post.js';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(express.json());

// Middleware to extract JWT from headers
const getUser = (token) => {
    if (!token) return null;
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/community-service');
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

const startServer = async () => {
    await connectDB();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => {
            const token = req.headers.authorization?.replace('Bearer ', '');
            const user = getUser(token);
            return {
                Post,
                user,
                JWT_SECRET,
            };
        },
    });

    await server.start();
    server.applyMiddleware({ app });

    const PORT = process.env.PORT || 4002;
    app.listen(PORT, () => {
        console.log(`Community Service running on port ${PORT}`);
        console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
    });
};

startServer().catch(error => {
    console.error('Server startup failed:', error);
    process.exit(1);
});
