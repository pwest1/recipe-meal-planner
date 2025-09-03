import express from 'express';
import { prisma } from '../app';

const router = express.Router();

// GET /api/recipes - Get all recipes for authenticated user
router.get('/', async (req, res) => {
  try {
    const userId = (req as any).auth?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const recipes = await prisma.recipe.findMany({
      where: { userId },
      include: {
        recipeIngredients: {
          include: {
            ingredient: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// GET /api/recipes/:id - Get single recipe
router.get('/:id', async (req, res) => {
  try {
    const userId = (req as any).auth?.sub;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const recipe = await prisma.recipe.findFirst({
      where: { id, userId },
      include: {
        recipeIngredients: {
          include: {
            ingredient: true
          }
        }
      }
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
router.post('/', async (req, res) => {
  try {
    const userId = (req as any).auth?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { title, description, instructions, prepTime, cookTime, servings, category, tags, ingredients } = req.body;

    if (!title || !instructions) {
      return res.status(400).json({ error: 'Title and instructions are required' });
    }

    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        instructions,
        prepTime,
        cookTime,
        servings: servings || 1,
        category,
        tags: tags || [],
        userId,
        recipeIngredients: {
          create: ingredients?.map((ing: any) => ({
            quantity: ing.quantity,
            unit: ing.unit,
            notes: ing.notes,
            ingredient: {
              connectOrCreate: {
                where: { name: ing.ingredient.name },
                create: {
                  name: ing.ingredient.name,
                  category: ing.ingredient.category,
                  unit: ing.ingredient.unit
                }
              }
            }
          })) || []
        }
      },
      include: {
        recipeIngredients: {
          include: {
            ingredient: true
          }
        }
      }
    });

    res.status(201).json(recipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

// PUT /api/recipes/:id - Update recipe
router.put('/:id', async (req, res) => {
  try {
    const userId = (req as any).auth?.sub;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const existingRecipe = await prisma.recipe.findFirst({
      where: { id, userId }
    });

    if (!existingRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const { title, description, instructions, prepTime, cookTime, servings, category, tags, ingredients } = req.body;

    await prisma.recipeIngredient.deleteMany({
      where: { recipeId: id }
    });

    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        title,
        description,
        instructions,
        prepTime,
        cookTime,
        servings,
        category,
        tags,
        recipeIngredients: {
          create: ingredients?.map((ing: any) => ({
            quantity: ing.quantity,
            unit: ing.unit,
            notes: ing.notes,
            ingredient: {
              connectOrCreate: {
                where: { name: ing.ingredient.name },
                create: {
                  name: ing.ingredient.name,
                  category: ing.ingredient.category,
                  unit: ing.ingredient.unit
                }
              }
            }
          })) || []
        }
      },
      include: {
        recipeIngredients: {
          include: {
            ingredient: true
          }
        }
      }
    });

    res.json(recipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
});

// DELETE /api/recipes/:id - Delete recipe
router.delete('/:id', async (req, res) => {
  try {
    const userId = (req as any).auth?.sub;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const existingRecipe = await prisma.recipe.findFirst({
      where: { id, userId }
    });

    if (!existingRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    await prisma.recipe.delete({
      where: { id }
    });

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

export default router;