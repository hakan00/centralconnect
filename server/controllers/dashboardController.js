import Application from '../models/Application.js';
import CommunityPost from '../models/CommunityPost.js';
import LegalGuide from '../models/LegalGuide.js';
import LegalRequest from '../models/LegalRequest.js';
import Tour from '../models/Tour.js';
import Transfer from '../models/Transfer.js';

export const getPublicOverview = async (_req, res) => {
  const [tourCount, communityCount, guideCount, featuredTours, latestPosts, featuredGuides] = await Promise.all([
    Tour.countDocuments(),
    CommunityPost.countDocuments(),
    LegalGuide.countDocuments(),
    Tour.find().sort({ createdAt: -1 }).limit(3),
    CommunityPost.find().populate('user', 'fullName').sort({ createdAt: -1 }).limit(3),
    LegalGuide.find().sort({ createdAt: -1 }).limit(3)
  ]);

  res.json({
    metrics: {
      tours: tourCount,
      communityPosts: communityCount,
      legalGuides: guideCount
    },
    featuredTours,
    latestPosts,
    featuredGuides
  });
};

export const getDashboardSummary = async (req, res) => {
  const ownFilter = req.user.role === 'admin' ? {} : { user: req.user._id };
  const ownCommunityFilter = req.user.role === 'admin' ? {} : { user: req.user._id };

  const [
    transferCount,
    activeTransferCount,
    applicationCount,
    activeApplicationCount,
    legalCount,
    openLegalCount,
    communityCount,
    guideCount,
    nextTransfer,
    latestApplication,
    latestLegalRequest,
    latestPosts,
    featuredTours
  ] = await Promise.all([
    Transfer.countDocuments(ownFilter),
    Transfer.countDocuments({ ...ownFilter, status: { $in: ['pending', 'confirmed'] } }),
    Application.countDocuments(ownFilter),
    Application.countDocuments({ ...ownFilter, status: { $in: ['draft', 'submitted', 'under-review'] } }),
    LegalRequest.countDocuments(ownFilter),
    LegalRequest.countDocuments({ ...ownFilter, status: { $in: ['submitted', 'in-review'] } }),
    CommunityPost.countDocuments(ownCommunityFilter),
    LegalGuide.countDocuments(),
    Transfer.findOne({ ...ownFilter, arrivalDate: { $gte: new Date() } }).sort({ arrivalDate: 1 }),
    Application.findOne(ownFilter).sort({ updatedAt: -1 }),
    LegalRequest.findOne(ownFilter).sort({ updatedAt: -1 }),
    CommunityPost.find().populate('user', 'fullName').sort({ createdAt: -1 }).limit(4),
    Tour.find().sort({ createdAt: -1 }).limit(3)
  ]);

  res.json({
    profile: {
      fullName: req.user.fullName,
      email: req.user.email,
      nationality: req.user.nationality,
      role: req.user.role
    },
    metrics: {
      transfers: transferCount,
      activeTransfers: activeTransferCount,
      applications: applicationCount,
      activeApplications: activeApplicationCount,
      legalRequests: legalCount,
      openLegalRequests: openLegalCount,
      communityPosts: communityCount,
      legalGuides: guideCount
    },
    highlights: {
      nextTransfer,
      latestApplication,
      latestLegalRequest,
      latestPosts,
      featuredTours
    }
  });
};
