import express from 'express';
import { prisma } from '../app';
import { jwtCheck } from '../middleware/auth';

const router = express.Router();

// GET /api/recipes - Get all recipes for authenticated user
router.get('/', jwtCheck, async (req, res) => {
  try {
    const userId = (req as any).auth.sub;
    const recipes = await prisma.recipe.findMany({
      where: { userId },
      include: {
        recipeIngredients: {
          include: {
            ingredient: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// GET /api/recipes/:id - Get single recipe
router.get('/:id', jwtCheck, async (req, res) => {
  try {
    const userId = (req as any).auth.sub;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Recipe ID is required' });
    }

    const recipe = await prisma.recipe.findFirst({
      where: { id, userId },
      include: {
        recipeIngredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

// POST /api/recipes - Create new recipe
router.post('/', jwtCheck, async (req, res) => {
  try {
    const userId = (req as any).auth.sub;
    const { title, instructions, ingredients  } = req.body;

    if (!title || !instructions) {
      return res.status(400).json({ error: 'Title and instructions are required' });
    }

    const recipe = await prisma.recipe.create({
      data: {
        ...req.body,
        userId,
      },
    });
    res.status(201).json(recipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

// PUT /api/recipes/:id - Update recipe
router.put('/:id', jwtCheck, async (req, res) => {
  try {
    const userId = (req as any).auth.sub;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Recipe ID is required' });
    }

    const existingRecipe = await prisma.recipe.findFirst({
      where: { id, userId },
    });

    if (!existingRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Your deleteMany and update logic here
    await prisma.recipeIngredient.deleteMany({ where: { recipeId: id } });
    const recipe = await prisma.recipe.update({
      where: { id },
      data: {  },
    });
    res.json(recipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
});

// DELETE /api/recipes/:id - Delete recipe
router.delete('/:id', jwtCheck, async (req, res) => {
  try {
    const userId = (req as any).auth.sub; // <-- TYPO FIXED
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Recipe ID is required' });
    }

    const existingRecipe = await prisma.recipe.findFirst({
      where: { id, userId },
    });

    if (!existingRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    await prisma.recipe.delete({
      where: { id },
    });
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

export default router;