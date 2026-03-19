export const resolvers = {
    Query: {
        me: async (_, __, { user }) => {
            if (!user) throw new Error("Not authenticated");
            return user;
        },
        posts: async (_, {category}, { Post }) => {
            const filter = category ? { category } : {};
            return await Post.find(filter).populate('author', 'name');
        },
        post: async (_, { _id }, { Post }) => {
            return await Post.findById(_id).populate('author', 'name');
        },
        helpRequests: async (_, { isResolved }, { HelpRequest }) => {
            const filter = isResolved !== undefined ? { isResolved } : {};
            return await HelpRequest.find(filter).populate('author', 'name').populate('volunteers', 'name');
        },
        helpRequest: async (_, { _id }, { HelpRequest }) => {
            return await HelpRequest.findById(_id).populate('author', 'name').populate('volunteers', 'name');
        },
    },
    Mutation: {
        createPost: async (_, { title, content, category }, { user, Post }) => {
            if (!user) throw new Error("Not authenticated");
            const post = new Post({ author: user._id, title, content, category });
            return await post.save();
        },
        updatePost: async (_, { _id, title, content, category }, {user, Post}) => {
            if (!user) throw new Error("Not authenticated");
            const post = await Post.findById(_id);
            if(!post) throw new Error("Post not found");
            if(post.author.toString() !== user._id.toString()) throw new Error("Unauthorized");
            if (title !== undefined) post.title = title;
            if (content !== undefined) post.content = content;
            if (category !== undefined) post.category = category;
            post.updatedAt = Date.now();
            return await post.save();
        },
        deletePost: async (_, { _id }, { user, Post }) => {
            if (!user) throw new Error("Not authenticated");
            const post = await Post.findById(_id);
            if (!post) throw new Error("Post not found");
            if (post.author.toString() !== user._id.toString()) throw new Error("Unauthorized");
            await Post.deleteOne({ _id: _id });
            return true;
        },
        createHelpRequest: async (_, { description, location }, { user, HelpRequest }) => {
            if (!user) throw new Error("Not authenticated");
            const helpRequest = new HelpRequest({ author: user._id, description, location });
            return await helpRequest.save();
        },
        updateHelpRequest: async (_, { _id, description, location, isResolved }, { user, HelpRequest }) => {
            if (!user) throw new Error("Not authenticated");
            const helpRequest = await HelpRequest.findById(_id);
            if (!helpRequest) throw new Error("Help request not found");
            if (helpRequest.author.toString() !== user._id.toString()) throw new Error("Unauthorized");
            if (description !== undefined) helpRequest.description = description;
            if (location !== undefined) helpRequest.location = location;
            if (isResolved !== undefined) helpRequest.isResolved = isResolved;
            helpRequest.updatedAt = Date.now();
            return await helpRequest.save();
        },
        volunteerForHelpRequest: async (_, { _id }, { user, HelpRequest }) => {
            if (!user) throw new Error("Not authenticated");
            const helpRequest = await HelpRequest.findById(_id);
            if (!helpRequest) throw new Error("Help request not found");
            if (helpRequest.volunteers.includes(user._id)) throw new Error("Already volunteered");
            helpRequest.volunteers.push(user._id);
            return await helpRequest.save();
        },
        resolveHelpRequest: async (_, { _id }, { user, HelpRequest }) => {
            if (!user) throw new Error("Not authenticated");
            const helpRequest = await HelpRequest.findById(_id);
            if (!helpRequest) throw new Error("Help request not found");
            if (helpRequest.author.toString() !== user._id.toString()) throw new Error("Unauthorized");
            helpRequest.isResolved = true;
            return await helpRequest.save();
        },
    },
};  