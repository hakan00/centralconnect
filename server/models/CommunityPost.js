import mongoose from 'mongoose';

const communityPostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tag: { type: String, enum: ['housing', 'education', 'transport', 'social', 'legal'], default: 'social' }
  },
  { timestamps: true }
);

export default mongoose.model('CommunityPost', communityPostSchema);
