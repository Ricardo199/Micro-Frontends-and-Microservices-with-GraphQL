import User from "../models/User.js";
import logger from "../utils/logger.js";

export const resolvers = {
    Query: {
        me: async (_, __, { user }) => {
            if (!user) throw new Error('Not authenticated');
            return user;
        },
        getUser: async (_, { _id }, { User }) => {
            return await User.findById(_id);
        },
        getAllUsers: async (_, __, { User }) => {
            return await User.find();
        },
    },
    Mutation: {
        signup: async (_, { username, email, password, role }, { User, JWT_SECRET }) => {
            try{
                const existingUser = await User.findOne({ email });
                if (existingUser) throw new Error('Email already in use');

                const user = new User({ username, email, password, role });
                await user.save();

                const {accessToken, refreshToken} = user.generateAuthToken(JWT_SECRET);
                await user.save();
                logger.logAuth('signup', email, true);
                return { accessToken, refreshToken, user };
            }catch(err){
                logger.logAuth('signup', email, false, err.message);
                throw new Error(err);
            }
        },
        login: async (_, { email, password }, { User, JWT_SECRET }) => {
            try{
                const user = await User.findOne({ email });
                if (!user) throw new Error('Invalid credentials');

                const isMatch = await user.comparePassword(password);
                if (!isMatch) throw new Error('Invalid credentials');

                const {accessToken, refreshToken} = user.generateAuthToken(JWT_SECRET);
                await user.save();
                logger.logAuth('login', email, true);
                return { accessToken, refreshToken, user };
            }catch(err){ 
                logger.logAuth('login', email, false, err.message); throw new Error(err); 
            }
        },
        updateUser: async (_, { _id, username, email, password, role }, { User }) => {
            try{
            const user = await User.findById(_id);
            if (!user) throw new Error('User not found');

            if (username) user.username = username;
            if (email) user.email = email;
            if (password) user.password = password;
            if (role) user.role = role;

            await user.save();
            logger.logAuth('updateUser', user.email, true);
            return user;
            }catch(err){
                logger.logAuth('updateUser', email || 'unknown', false, err.message);
                throw new Error(err);
            }
        },
        deleteUser: async (_, { _id }, { User }) => {
            try{
            const result = await User.deleteOne({ _id });
            logger.logAuth('deleteUser', _id, true);
            return result.deletedCount > 0;
            }catch(err){
                logger.logAuth('deleteUser', _id, false, err.message);
                throw new Error(err);
            }
        },
        logout: async (_, __, { user }) => {
            try{
            if (!user) throw new Error('Not authenticated');
            await User.updateOne({ _id: user._id }, { $set: { refreshToken: null } });
            logger.logAuth('logout', user.email, true);
            return true;
            }catch(err){
                logger.logAuth('logout', user ? user.email : 'unknown', false, err.message);
                throw new Error(err);
            }
        },
        refreshToken: async (_, { refreshToken }, { User, JWT_SECRET }) => {
            try{
                const user = await User.findOne({ refreshToken });
                if (!user) throw new Error('Invalid refresh token');

                const { accessToken } = user.generateNewAccessToken(JWT_SECRET);
                logger.logRefreshToken('auth-service', 'refreshToken', user._id, true);
                return { accessToken, refreshToken, user };
            }catch(err){
                logger.logRefreshToken('auth-service', 'refreshToken', 'unknown', false, err.message);
                throw new Error(err);
            }
        }
    },
};