import Application from '../models/Application.js';

const canManageApplication = (application, user) =>
  user.role === 'admin' || application.user.toString() === user._id.toString();

export const getApplications = async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
  const applications = await Application.find(filter)
    .populate('user', 'fullName email nationality')
    .sort({ createdAt: -1 });
  res.json(applications);
};

export const createApplication = async (req, res) => {
  const application = await Application.create({ ...req.body, user: req.user._id });
  const populated = await application.populate('user', 'fullName email nationality');
  res.status(201).json(populated);
};

export const updateApplication = async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  if (!canManageApplication(application, req.user)) {
    return res.status(403).json({ message: 'You do not have access to this application' });
  }

  const editableFields = ['universityName', 'programName', 'intakeTerm', 'notes', 'status'];
  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      application[field] = req.body[field];
    }
  });

  await application.save();
  const populated = await application.populate('user', 'fullName email nationality');
  res.json(populated);
};

export const deleteApplication = async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  if (!canManageApplication(application, req.user)) {
    return res.status(403).json({ message: 'You do not have access to this application' });
  }

  await application.deleteOne();
  res.json({ message: 'Application deleted' });
};

export const updateApplicationStatus = async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  application.status = req.body.status || application.status;
  await application.save();
  const populated = await application.populate('user', 'fullName email nationality');
  res.json(populated);
};
