import User from "../models/User";

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
            const existingUser = await User.findOne({ email });
            if (existingUser) throw new Error('Email already in use');

            const user = new User({ username, email, password, role });
            await user.save();

            const {accessToken, refreshToken} = user.generateAuthToken(JWT_SECRET);
            await user.save();
            return { accessToken, refreshToken, user };
        },
        login: async (_, { email, password }, { User, JWT_SECRET }) => {
            const user = await User.findOne({ email });
            if (!user) throw new Error('Invalid credentials');

            const isMatch = await user.comparePassword(password);
            if (!isMatch) throw new Error('Invalid credentials');

            const {accessToken, refreshToken} = user.generateAuthToken(JWT_SECRET);
            await user.save();
            return { accessToken, refreshToken, user };
        },
        updateUser: async (_, { _id, username, email, password, role }, { User }) => {
            const user = await User.findById(_id);
            if (!user) throw new Error('User not found');

            if (username) user.username = username;
            if (email) user.email = email;
            if (password) user.password = password;
            if (role) user.role = role;

            await user.save();
            return user;
        },
        deleteUser: async (_, { _id }, { User }) => {
            const result = await User.deleteOne({ _id });
            return result.deletedCount > 0;
        },
        logout: async (_, __, { user }) => {
            if (!user) throw new Error('Not authenticated');
            await User.updateOne({ _id: user._id }, { $set: { refreshToken: null } });
            return true;
        },
        refreshToken: async (_, { refreshToken }, { User, JWT_SECRET }) => {
            const user = await User.findOne({ refreshToken });
            if (!user) throw new Error('Invalid refresh token');

            const { accessToken } = user.refreshToken(JWT_SECRET);
            return { accessToken, refreshToken, user };
        }
    },
};