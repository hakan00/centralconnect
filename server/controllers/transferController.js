import Transfer from '../models/Transfer.js';

const canManageTransfer = (transfer, user) =>
  user.role === 'admin' || transfer.user.toString() === user._id.toString();

export const getTransfers = async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
  const transfers = await Transfer.find(filter)
    .populate('user', 'fullName email nationality')
    .sort({ createdAt: -1 });
  res.json(transfers);
};

export const createTransfer = async (req, res) => {
  const transfer = await Transfer.create({ ...req.body, user: req.user._id });
  const populated = await transfer.populate('user', 'fullName email nationality');
  res.status(201).json(populated);
};

export const updateTransfer = async (req, res) => {
  const transfer = await Transfer.findById(req.params.id);

  if (!transfer) {
    return res.status(404).json({ message: 'Transfer not found' });
  }

  if (!canManageTransfer(transfer, req.user)) {
    return res.status(403).json({ message: 'You do not have access to this transfer' });
  }

  const editableFields = ['airport', 'destination', 'arrivalDate', 'passengers', 'notes'];
  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      transfer[field] = req.body[field];
    }
  });

  if (req.user.role === 'admin' && req.body.status) {
    transfer.status = req.body.status;
  }

  await transfer.save();
  const populated = await transfer.populate('user', 'fullName email nationality');
  res.json(populated);
};

export const deleteTransfer = async (req, res) => {
  const transfer = await Transfer.findById(req.params.id);

  if (!transfer) {
    return res.status(404).json({ message: 'Transfer not found' });
  }

  if (!canManageTransfer(transfer, req.user)) {
    return res.status(403).json({ message: 'You do not have access to this transfer' });
  }

  await transfer.deleteOne();
  res.json({ message: 'Transfer deleted' });
};

export const updateTransferStatus = async (req, res) => {
  const transfer = await Transfer.findById(req.params.id);

  if (!transfer) {
    return res.status(404).json({ message: 'Transfer not found' });
  }

  transfer.status = req.body.status || transfer.status;
  await transfer.save();
  const populated = await transfer.populate('user', 'fullName email nationality');
  res.json(populated);
};
