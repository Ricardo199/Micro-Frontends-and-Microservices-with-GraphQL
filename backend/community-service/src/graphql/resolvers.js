export const resolvers = {
    Query: {
        me: async (_, __, { user }) => {
            if (!user) throw new Error("Not authenticated");
            return user;
        },
        posts: async (_, {category}, { Post }) => {
            const filter = category ? { category } : {};
            const posts = await Post.find(filter);
            return posts.map(post => ({
                ...post.toObject(),
                author: { _id: post.author, username: "Unknown User", email: "unknown@example.com" }
            }));
        },
        post: async (_, { _id }, { Post }) => {
            const post = await Post.findById(_id);
            if (!post) throw new Error("Post not found");
            return {
                ...post.toObject(),
                author: { _id: post.author,
                    username: "Unknown User",
                    email: "unknown@example.com"
                }
            };
        },
        helpRequests: async (_, { isResolved }, { HelpRequest }) => {
            const filter = isResolved !== undefined ? { isResolved } : {};
            const helpRequests = await HelpRequest.find(filter);
            return helpRequests.map(helpRequest => ({
                ...helpRequest.toObject(),
                author: { _id: helpRequest.author, username: "Unknown User", email: "unknown@example.com" },
                volunteers: helpRequest.volunteers.map(volunteerId => ({ _id: volunteerId, username: "Unknown Volunteer", email: "unknown@example.com" }))
            }));
        },
        helpRequest: async (_, { _id }, { HelpRequest }) => {
            const helpRequest = await HelpRequest.findById(_id);
            if (!helpRequest) throw new Error("Help request not found");
            return {
                ...helpRequest.toObject(),
                author: { _id: helpRequest.author, username: "Unknown User", email: "unknown@example.com" },
                volunteers: helpRequest.volunteers.map(volunteerId => ({ _id: volunteerId, username: "Unknown Volunteer", email: "unknown@example.com" }))
            };
        },
    },
    Mutation: {
        createPost: async (_, { title, content, category }, { user, Post }) => {
            if (!user) throw new Error("Not authenticated");
            if (!user._id || !user.username || !user.email) throw new Error("User isn't signed in");
            const post = new Post({ author: user._id, title, content, category });
            const savedPost = await post.save();
            return { ...savedPost.toObject(), 
                author: { _id: user._id, username: user.username, email: user.email }
            };
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
            if (!user._id || !user.username || !user.email) throw new Error("User authentication data is incomplete");
            const helpRequest = new HelpRequest({ author: user._id, description, location });
            const savedHelpRequest = await helpRequest.save();
            
            return { ...savedHelpRequest.toObject(),
                author: { _id: user._id, username: user.username, email: user.email },
                volunteers: []
            };
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