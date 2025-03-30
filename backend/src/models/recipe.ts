import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Ingredient, IngredientId } from './ingredient';
import type { RecipeIngredient, RecipeIngredientId } from './recipeIngredient';
import type { RecipeStep, RecipeStepId } from './recipeStep';
import type { Step, StepId } from './step';

export interface RecipeAttributes {
  id: number;
  name: string;
  description?: string;
}

export type RecipePk = "id";
export type RecipeId = Recipe[RecipePk];
export type RecipeOptionalAttributes = "id" | "description";
export type RecipeCreationAttributes = Optional<RecipeAttributes, RecipeOptionalAttributes>;

export class Recipe extends Model<RecipeAttributes, RecipeCreationAttributes> implements RecipeAttributes {
  id!: number;
  name!: string;
  description?: string;

  // Recipe belongsToMany Ingredient via recipeId and ingredientId
  ingredientIdIngredients!: Ingredient[];
  getIngredientIdIngredients!: Sequelize.BelongsToManyGetAssociationsMixin<Ingredient>;
  setIngredientIdIngredients!: Sequelize.BelongsToManySetAssociationsMixin<Ingredient, IngredientId>;
  addIngredientIdIngredient!: Sequelize.BelongsToManyAddAssociationMixin<Ingredient, IngredientId>;
  addIngredientIdIngredients!: Sequelize.BelongsToManyAddAssociationsMixin<Ingredient, IngredientId>;
  createIngredientIdIngredient!: Sequelize.BelongsToManyCreateAssociationMixin<Ingredient>;
  removeIngredientIdIngredient!: Sequelize.BelongsToManyRemoveAssociationMixin<Ingredient, IngredientId>;
  removeIngredientIdIngredients!: Sequelize.BelongsToManyRemoveAssociationsMixin<Ingredient, IngredientId>;
  hasIngredientIdIngredient!: Sequelize.BelongsToManyHasAssociationMixin<Ingredient, IngredientId>;
  hasIngredientIdIngredients!: Sequelize.BelongsToManyHasAssociationsMixin<Ingredient, IngredientId>;
  countIngredientIdIngredients!: Sequelize.BelongsToManyCountAssociationsMixin;
  // Recipe hasMany RecipeIngredient via recipeId
  recipeIngredients!: RecipeIngredient[];
  getRecipeIngredients!: Sequelize.HasManyGetAssociationsMixin<RecipeIngredient>;
  setRecipeIngredients!: Sequelize.HasManySetAssociationsMixin<RecipeIngredient, RecipeIngredientId>;
  addRecipeIngredient!: Sequelize.HasManyAddAssociationMixin<RecipeIngredient, RecipeIngredientId>;
  addRecipeIngredients!: Sequelize.HasManyAddAssociationsMixin<RecipeIngredient, RecipeIngredientId>;
  createRecipeIngredient!: Sequelize.HasManyCreateAssociationMixin<RecipeIngredient>;
  removeRecipeIngredient!: Sequelize.HasManyRemoveAssociationMixin<RecipeIngredient, RecipeIngredientId>;
  removeRecipeIngredients!: Sequelize.HasManyRemoveAssociationsMixin<RecipeIngredient, RecipeIngredientId>;
  hasRecipeIngredient!: Sequelize.HasManyHasAssociationMixin<RecipeIngredient, RecipeIngredientId>;
  hasRecipeIngredients!: Sequelize.HasManyHasAssociationsMixin<RecipeIngredient, RecipeIngredientId>;
  countRecipeIngredients!: Sequelize.HasManyCountAssociationsMixin;
  // Recipe hasMany RecipeStep via recipeId
  recipeSteps!: RecipeStep[];
  getRecipeSteps!: Sequelize.HasManyGetAssociationsMixin<RecipeStep>;
  setRecipeSteps!: Sequelize.HasManySetAssociationsMixin<RecipeStep, RecipeStepId>;
  addRecipeStep!: Sequelize.HasManyAddAssociationMixin<RecipeStep, RecipeStepId>;
  addRecipeSteps!: Sequelize.HasManyAddAssociationsMixin<RecipeStep, RecipeStepId>;
  createRecipeStep!: Sequelize.HasManyCreateAssociationMixin<RecipeStep>;
  removeRecipeStep!: Sequelize.HasManyRemoveAssociationMixin<RecipeStep, RecipeStepId>;
  removeRecipeSteps!: Sequelize.HasManyRemoveAssociationsMixin<RecipeStep, RecipeStepId>;
  hasRecipeStep!: Sequelize.HasManyHasAssociationMixin<RecipeStep, RecipeStepId>;
  hasRecipeSteps!: Sequelize.HasManyHasAssociationsMixin<RecipeStep, RecipeStepId>;
  countRecipeSteps!: Sequelize.HasManyCountAssociationsMixin;
  // Recipe belongsToMany Step via recipeId and stepId
  stepIdSteps!: Step[];
  getStepIdSteps!: Sequelize.BelongsToManyGetAssociationsMixin<Step>;
  setStepIdSteps!: Sequelize.BelongsToManySetAssociationsMixin<Step, StepId>;
  addStepIdStep!: Sequelize.BelongsToManyAddAssociationMixin<Step, StepId>;
  addStepIdSteps!: Sequelize.BelongsToManyAddAssociationsMixin<Step, StepId>;
  createStepIdStep!: Sequelize.BelongsToManyCreateAssociationMixin<Step>;
  removeStepIdStep!: Sequelize.BelongsToManyRemoveAssociationMixin<Step, StepId>;
  removeStepIdSteps!: Sequelize.BelongsToManyRemoveAssociationsMixin<Step, StepId>;
  hasStepIdStep!: Sequelize.BelongsToManyHasAssociationMixin<Step, StepId>;
  hasStepIdSteps!: Sequelize.BelongsToManyHasAssociationsMixin<Step, StepId>;
  countStepIdSteps!: Sequelize.BelongsToManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof Recipe {
    return Recipe.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'recipes',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "recipes_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
