export const resolvers = {
    Query: {
        me: async (_, __, { user }) => {
            if (!user) throw new Error("Not authenticated");
            return user;
        },
        posts: async (_, __, { Post }) => {
            return await Post.find().populate('author', 'name');
        },
        post: async (_, { id }, { Post }) => {
            return await Post.findById(id).populate('author', 'name');
        }
    },
    Mutation: {
        createPost: async (_, { title, content, category }, { user, Post }) => {
            if (!user) throw new Error("Not authenticated");
            const post = new Post({ author: user._id, title, content, category });
            return await post.save();
        },
        updatePost: async (_, { id, title, content, category }, {user, Post}) => {
            if (!user) throw new Error("Not authenticated");
            const post = await Post.findById(id);
            if(!post) throw new Error("Post not found");
            if(post.author.toString() !== user._id.toString()) throw new Error("Unauthorized");
            if (title !== undefined) post.title = title;
            if (content !== undefined) post.content = content;
            if (category !== undefined) post.category = category;
            post.updatedAt = Date.now();
            return await post.save();
        },
        deletePost: async (_, { id }, { user, Post }) => {
            if (!user) throw new Error("Not authenticated");
            const post = await Post.findById(id);
            if (!post) throw new Error("Post not found");
            if (post.author.toString() !== user._id.toString()) throw new Error("Unauthorized");
            await Post.deleteOne({ _id: id });
            return true;
        },
    },
};  