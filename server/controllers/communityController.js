import CommunityPost from '../models/CommunityPost.js';

const canManagePost = (post, user) =>
  user.role === 'admin' || post.user.toString() === user._id.toString();

export const getPosts = async (_req, res) => {
  const posts = await CommunityPost.find().populate('user', 'fullName').sort({ createdAt: -1 });
  res.json(posts);
};

export const createPost = async (req, res) => {
  const post = await CommunityPost.create({ ...req.body, user: req.user._id });
  const populated = await post.populate('user', 'fullName');
  res.status(201).json(populated);
};

export const updatePost = async (req, res) => {
  const post = await CommunityPost.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  if (!canManagePost(post, req.user)) {
    return res.status(403).json({ message: 'You do not have access to this post' });
  }

  ['title', 'content', 'tag'].forEach((field) => {
    if (req.body[field] !== undefined) {
      post[field] = req.body[field];
    }
  });

  await post.save();
  const populated = await post.populate('user', 'fullName');
  res.json(populated);
};

export const deletePost = async (req, res) => {
  const post = await CommunityPost.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  if (!canManagePost(post, req.user)) {
    return res.status(403).json({ message: 'You do not have access to this post' });
  }

  await post.deleteOne();
  res.json({ message: 'Post deleted' });
};
