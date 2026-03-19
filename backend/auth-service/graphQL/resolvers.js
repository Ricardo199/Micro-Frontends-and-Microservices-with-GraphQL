export const resolvers = {
    Query: {
        me: async (_, __, { user }) => {
            if (!user) throw new Error('Not authenticated');
            return user;
        },
        getUser: async (_, { id }, { User }) => {
            return await User.findById(id);
        },
        getAllUsers: async (_, __, { User }) => {
            return await User.find();
        },
    },
    Mutation: {
        register: async (_, { name, email, password, role }, { User, JWT_SECRET }) => {
            const existingUser = await User.findOne({ email });
            if (existingUser) throw new Error('Email already in use');

            const user = new User({ name, email, password, role });
            await user.save();

            const token = user.generateAuthToken(JWT_SECRET);
            return { token, user };
        },
        login: async (_, { email, password }, { User, JWT_SECRET }) => {
            const user = await User.findOne({ email });
            if (!user) throw new Error('Invalid credentials');

            const isMatch = await user.comparePassword(password);
            if (!isMatch) throw new Error('Invalid credentials');

            const token = user.generateAuthToken(JWT_SECRET);
            return { token, user };
        },
        updateUser: async (_, { id, name, email, password, role }, { User }) => {
            const user = await User.findById(id);
            if (!user) throw new Error('User not found');

            if (name) user.name = name;
            if (email) user.email = email;
            if (password) user.password = password;
            if (role) user.role = role;

            await user.save();
            return user;
        },
        deleteUser: async (_, { id }, { User }) => {
            const result = await User.deleteOne({ _id: id });
            return result.deletedCount > 0;
        },
    },
};