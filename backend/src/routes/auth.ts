import express from 'express';
import { prisma } from '../app';
import { jwtCheck, debugJWT, jwtErrorHandler } from '../middleware/auth';

const router = express.Router();

// GET /api/auth/profile - Get or create user profile from Auth0 data
router.get('/profile', jwtCheck, async (req, res) => {
  try {
    const auth0Id = (req as any).auth?.payload?.sub;
    if (!auth0Id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    let user = await prisma.user.findFirst({
      where: { id: auth0Id }
    });

    if (!user) {
      const authPayload = (req as any).auth;
      const email = authPayload?.email || authPayload?.payload?.email || `user-${auth0Id}@auth0.com`;
      const username = authPayload?.nickname || authPayload?.name || authPayload?.payload?.nickname || authPayload?.payload?.name || `user-${auth0Id.slice(-8)}`;
      
      user = await prisma.user.create({
        data: {
          id: auth0Id,
          email: typeof email === 'string' ? email : `user-${auth0Id}@auth0.com`,
          username: typeof username === 'string' ? username : `user-${auth0Id.slice(-8)}`,
          password: 'auth0'
        }
      });
    }

    const userWithCounts = await prisma.user.findFirst({
      where: { id: auth0Id },
      include: {
        _count: {
          select: {
            recipes: true,
            mealPlans: true,
            inventory: true,
            shoppingLists: true
          }
        }
      }
    });

    res.json(userWithCounts);
  } catch (error) {
    console.error('Error fetching/creating user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// PUT /api/auth/profile - Update user profile
router.put('/profile', jwtCheck, async (req, res) => {
  try {
    const auth0Id = (req as any).auth?.sub;
    if (!auth0Id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        username,
        NOT: { id: auth0Id }
      }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    await prisma.user.update({
      where: { id: auth0Id },
      data: { username: username.trim() }
    });

    const updatedUser = await prisma.user.findFirst({
      where: { id: auth0Id },
      include: {
        _count: {
          select: {
            recipes: true,
            mealPlans: true,
            inventory: true,
            shoppingLists: true
          }
        }
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

export default router;