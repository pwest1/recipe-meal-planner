import express from 'express';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  // TODO: Implement user registration
  res.json({ message: 'Registration endpoint - coming soon!' });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  // TODO: Implement user login
  res.json({ message: 'Login endpoint - coming soon!' });
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  // TODO: Implement get current user
  res.json({ message: 'Get current user - coming soon!' });
});

export default router;