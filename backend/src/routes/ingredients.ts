import express from 'express';
import { prisma } from '../app';

const router = express.Router();

// GET /api/ingredients - Get all ingredients
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    
    const whereClause: any = {};
    
    if (search) {
      whereClause.name = {
        contains: search as string,
        mode: 'insensitive'
      };
    }
    
    if (category) {
      whereClause.category = category as string;
    }

    const ingredients = await prisma.ingredient.findMany({
      where: whereClause,
      orderBy: { name: 'asc' }
    });

    res.json(ingredients);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ error: 'Failed to fetch ingredients' });
  }
});

// GET /api/ingredients/:id - Get single ingredient
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const ingredient = await prisma.ingredient.findUnique({
      where: { id },
      include: {
        recipeIngredients: {
          include: {
            recipe: true
          }
        }
      }
    });

    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    res.json(ingredient);
  } catch (error) {
    console.error('Error fetching ingredient:', error);
    res.status(500).json({ error: 'Failed to fetch ingredient' });
  }
});

// POST /api/ingredients - Create new ingredient
router.post('/', async (req, res) => {
  try {
    const { name, category, unit } = req.body;

    if (!name || !unit) {
      return res.status(400).json({ error: 'Name and unit are required' });
    }

    const existingIngredient = await prisma.ingredient.findUnique({
      where: { name }
    });

    if (existingIngredient) {
      return res.status(409).json({ error: 'Ingredient already exists' });
    }

    const ingredient = await prisma.ingredient.create({
      data: {
        name: name.trim(),
        category: category?.trim(),
        unit: unit.trim()
      }
    });

    res.status(201).json(ingredient);
  } catch (error) {
    console.error('Error creating ingredient:', error);
    res.status(500).json({ error: 'Failed to create ingredient' });
  }
});

// PUT /api/ingredients/:id - Update ingredient
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, unit } = req.body;

    const existingIngredient = await prisma.ingredient.findUnique({
      where: { id }
    });

    if (!existingIngredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    if (name && name !== existingIngredient.name) {
      const nameExists = await prisma.ingredient.findUnique({
        where: { name }
      });
      if (nameExists) {
        return res.status(409).json({ error: 'Ingredient name already exists' });
      }
    }

    const ingredient = await prisma.ingredient.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(category && { category: category.trim() }),
        ...(unit && { unit: unit.trim() })
      }
    });

    res.json(ingredient);
  } catch (error) {
    console.error('Error updating ingredient:', error);
    res.status(500).json({ error: 'Failed to update ingredient' });
  }
});

// DELETE /api/ingredients/:id - Delete ingredient
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existingIngredient = await prisma.ingredient.findUnique({
      where: { id }
    });

    if (!existingIngredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    const recipeUsage = await prisma.recipeIngredient.findFirst({
      where: { ingredientId: id }
    });

    if (recipeUsage) {
      return res.status(409).json({ 
        error: 'Cannot delete ingredient that is used in recipes' 
      });
    }

    await prisma.ingredient.delete({
      where: { id }
    });

    res.json({ message: 'Ingredient deleted successfully' });
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    res.status(500).json({ error: 'Failed to delete ingredient' });
  }
});

export default router;