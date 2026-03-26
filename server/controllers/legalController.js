import LegalRequest from '../models/LegalRequest.js';
import LegalGuide from '../models/LegalGuide.js';

const canManageLegalRequest = (legalRequest, user) =>
  user.role === 'admin' || legalRequest.user.toString() === user._id.toString();

export const getLegalGuides = async (_req, res) => {
  const guides = await LegalGuide.find().sort({ createdAt: -1 });
  res.json(guides);
};

export const createLegalGuide = async (req, res) => {
  const guide = await LegalGuide.create(req.body);
  res.status(201).json(guide);
};

export const updateLegalGuide = async (req, res) => {
  const guide = await LegalGuide.findById(req.params.guideId);

  if (!guide) {
    return res.status(404).json({ message: 'Guide not found' });
  }

  ['title', 'category', 'summary', 'details', 'estimatedTime'].forEach((field) => {
    if (req.body[field] !== undefined) {
      guide[field] = req.body[field];
    }
  });

  await guide.save();
  res.json(guide);
};

export const deleteLegalGuide = async (req, res) => {
  const guide = await LegalGuide.findById(req.params.guideId);

  if (!guide) {
    return res.status(404).json({ message: 'Guide not found' });
  }

  await guide.deleteOne();
  res.json({ message: 'Guide deleted' });
};

export const createLegalRequest = async (req, res) => {
  const legalRequest = await LegalRequest.create({ ...req.body, user: req.user._id });
  const populated = await legalRequest.populate('user', 'fullName email nationality');
  res.status(201).json(populated);
};

export const getMyLegalRequests = async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
  const requests = await LegalRequest.find(filter)
    .populate('user', 'fullName email nationality')
    .sort({ createdAt: -1 });
  res.json(requests);
};

export const updateLegalRequest = async (req, res) => {
  const legalRequest = await LegalRequest.findById(req.params.id);

  if (!legalRequest) {
    return res.status(404).json({ message: 'Request not found' });
  }

  if (!canManageLegalRequest(legalRequest, req.user)) {
    return res.status(403).json({ message: 'You do not have access to this request' });
  }

  ['requestType', 'description'].forEach((field) => {
    if (req.body[field] !== undefined) {
      legalRequest[field] = req.body[field];
    }
  });

  if (req.user.role === 'admin' && req.body.status) {
    legalRequest.status = req.body.status;
  }

  await legalRequest.save();
  const populated = await legalRequest.populate('user', 'fullName email nationality');
  res.json(populated);
};

export const deleteLegalRequest = async (req, res) => {
  const legalRequest = await LegalRequest.findById(req.params.id);

  if (!legalRequest) {
    return res.status(404).json({ message: 'Request not found' });
  }

  if (!canManageLegalRequest(legalRequest, req.user)) {
    return res.status(403).json({ message: 'You do not have access to this request' });
  }

  await legalRequest.deleteOne();
  res.json({ message: 'Request deleted' });
};
