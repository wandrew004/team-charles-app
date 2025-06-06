import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Ingredient, IngredientId } from './ingredient';
import type { RecipeIngredient, RecipeIngredientId } from './recipeIngredient';
import type { RecipeStep, RecipeStepId } from './recipeStep';
import type { Step, StepId } from './step';
import type { User, UserId } from './user';

export interface RecipeAttributes {
  id: number;
  name: string;
  description?: string;
  userId?: number;
}

export type RecipePk = "id";
export type RecipeId = Recipe[RecipePk];
export type RecipeOptionalAttributes = "id" | "description" | "userId";
export type RecipeCreationAttributes = Optional<RecipeAttributes, RecipeOptionalAttributes>;

export class Recipe extends Model<RecipeAttributes, RecipeCreationAttributes> implements RecipeAttributes {
  id!: number;
  name!: string;
  description?: string;
  userId?: number;

  // Recipe belongsToMany Ingredient via recipeId and ingredientId
  ingredientIdIngredientsRecipeIngredients!: Ingredient[];
  getIngredientIdIngredientsRecipeIngredients!: Sequelize.BelongsToManyGetAssociationsMixin<Ingredient>;
  setIngredientIdIngredientsRecipeIngredients!: Sequelize.BelongsToManySetAssociationsMixin<Ingredient, IngredientId>;
  addIngredientIdIngredientsRecipeIngredient!: Sequelize.BelongsToManyAddAssociationMixin<Ingredient, IngredientId>;
  addIngredientIdIngredientsRecipeIngredients!: Sequelize.BelongsToManyAddAssociationsMixin<Ingredient, IngredientId>;
  createIngredientIdIngredientsRecipeIngredient!: Sequelize.BelongsToManyCreateAssociationMixin<Ingredient>;
  removeIngredientIdIngredientsRecipeIngredient!: Sequelize.BelongsToManyRemoveAssociationMixin<Ingredient, IngredientId>;
  removeIngredientIdIngredientsRecipeIngredients!: Sequelize.BelongsToManyRemoveAssociationsMixin<Ingredient, IngredientId>;
  hasIngredientIdIngredientsRecipeIngredient!: Sequelize.BelongsToManyHasAssociationMixin<Ingredient, IngredientId>;
  hasIngredientIdIngredientsRecipeIngredients!: Sequelize.BelongsToManyHasAssociationsMixin<Ingredient, IngredientId>;
  countIngredientIdIngredientsRecipeIngredients!: Sequelize.BelongsToManyCountAssociationsMixin;
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
  // Recipe belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

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
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'user_id'
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
