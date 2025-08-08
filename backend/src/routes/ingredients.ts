import express from 'express';

const router = express.Router();

// GET /api/ingredients
router.get('/', async (req, res) => {
  // TODO: Get all ingredients
  res.json({ message: 'Get ingredients endpoint - coming soon!' });
});

// POST /api/ingredients
router.post('/', async (req, res) => {
  // TODO: Create new ingredient
  res.json({ message: 'Create ingredient endpoint - coming soon!' });
});

export default router;