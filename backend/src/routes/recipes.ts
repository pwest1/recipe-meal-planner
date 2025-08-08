import express from 'express';

const router = express.Router();

// GET /api/recipes
router.get('/', async (req, res) => {
  // TODO: Get all recipes for user
  res.json({ message: 'Get recipes endpoint - coming soon!' });
});

// GET /api/recipes/:id
router.get('/:id', async (req, res) => {
  // TODO: Get single recipe
  res.json({ message: `Get recipe ${req.params.id} - coming soon!` });
});

// POST /api/recipes
router.post('/', async (req, res) => {
  // TODO: Create new recipe
  res.json({ message: 'Create recipe endpoint - coming soon!' });
});

// PUT /api/recipes/:id
router.put('/:id', async (req, res) => {
  // TODO: Update recipe
  res.json({ message: `Update recipe ${req.params.id} - coming soon!` });
});

// DELETE /api/recipes/:id
router.delete('/:id', async (req, res) => {
  // TODO: Delete recipe
  res.json({ message: `Delete recipe ${req.params.id} - coming soon!` });
});

export default router;