// API Types
export interface Ingredient {
  id: string;
  name: string;
  category?: string;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeIngredient {
  id: string;
  quantity: number;
  unit: string;
  notes?: string;
  recipeId: string;
  ingredientId: string;
  ingredient: Ingredient;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  instructions: string;
  prepTime?: number;
  cookTime?: number;
  servings: number;
  category?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  recipeIngredients: RecipeIngredient[];
}

export interface CreateRecipeData {
  title: string;
  description?: string;
  instructions: string;
  prepTime?: number;
  cookTime?: number;
  servings: number;
  category?: string;
  tags?: string[];
  ingredients: CreateRecipeIngredient[];
}

export interface CreateRecipeIngredient {
  quantity: number;
  unit: string;
  notes?: string;
  ingredient: {
    name: string;
    category?: string;
    unit: string;
  };
}

export interface CreateIngredientData {
  name: string;
  category?: string;
  unit: string;
}

export interface UpdateIngredientData extends Partial<CreateIngredientData> {}

export interface UpdateRecipeData extends Partial<CreateRecipeData> {}

// UI State Types
export interface RecipeFilters {
  search?: string;
  category?: string;
  tags?: string[];
}

export interface IngredientFilters {
  search?: string;
  category?: string;
}