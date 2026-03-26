import Tour from '../models/Tour.js';

export const getTours = async (_req, res) => {
  const tours = await Tour.find().sort({ createdAt: -1 });
  res.json(tours);
};

export const createTour = async (req, res) => {
  const tour = await Tour.create(req.body);
  res.status(201).json(tour);
};

export const updateTour = async (req, res) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return res.status(404).json({ message: 'Tour not found' });
  }

  ['title', 'city', 'duration', 'category', 'description'].forEach((field) => {
    if (req.body[field] !== undefined) {
      tour[field] = req.body[field];
    }
  });

  await tour.save();
  res.json(tour);
};

export const deleteTour = async (req, res) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return res.status(404).json({ message: 'Tour not found' });
  }

  await tour.deleteOne();
  res.json({ message: 'Tour deleted' });
};
