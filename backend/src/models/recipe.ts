import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ingredient, ingredientId } from './ingredient';
import type { recipeingredient, recipeingredientId } from './recipeingredient';
import type { recipestep, recipestepId } from './recipestep';
import type { step, stepId } from './step';

export interface recipeAttributes {
  id: number;
  name: string;
  description?: string;
}

export type recipePk = "id";
export type recipeId = recipe[recipePk];
export type recipeOptionalAttributes = "id" | "description";
export type recipeCreationAttributes = Optional<recipeAttributes, recipeOptionalAttributes>;

export class recipe extends Model<recipeAttributes, recipeCreationAttributes> implements recipeAttributes {
  id!: number;
  name!: string;
  description?: string;

  // recipe belongsToMany ingredient via recipeid and ingredientid
  ingredientid_ingredients!: ingredient[];
  getIngredientid_ingredients!: Sequelize.BelongsToManyGetAssociationsMixin<ingredient>;
  setIngredientid_ingredients!: Sequelize.BelongsToManySetAssociationsMixin<ingredient, ingredientId>;
  addIngredientid_ingredient!: Sequelize.BelongsToManyAddAssociationMixin<ingredient, ingredientId>;
  addIngredientid_ingredients!: Sequelize.BelongsToManyAddAssociationsMixin<ingredient, ingredientId>;
  createIngredientid_ingredient!: Sequelize.BelongsToManyCreateAssociationMixin<ingredient>;
  removeIngredientid_ingredient!: Sequelize.BelongsToManyRemoveAssociationMixin<ingredient, ingredientId>;
  removeIngredientid_ingredients!: Sequelize.BelongsToManyRemoveAssociationsMixin<ingredient, ingredientId>;
  hasIngredientid_ingredient!: Sequelize.BelongsToManyHasAssociationMixin<ingredient, ingredientId>;
  hasIngredientid_ingredients!: Sequelize.BelongsToManyHasAssociationsMixin<ingredient, ingredientId>;
  countIngredientid_ingredients!: Sequelize.BelongsToManyCountAssociationsMixin;
  // recipe hasMany recipeingredient via recipeid
  recipeingredients!: recipeingredient[];
  getRecipeingredients!: Sequelize.HasManyGetAssociationsMixin<recipeingredient>;
  setRecipeingredients!: Sequelize.HasManySetAssociationsMixin<recipeingredient, recipeingredientId>;
  addRecipeingredient!: Sequelize.HasManyAddAssociationMixin<recipeingredient, recipeingredientId>;
  addRecipeingredients!: Sequelize.HasManyAddAssociationsMixin<recipeingredient, recipeingredientId>;
  createRecipeingredient!: Sequelize.HasManyCreateAssociationMixin<recipeingredient>;
  removeRecipeingredient!: Sequelize.HasManyRemoveAssociationMixin<recipeingredient, recipeingredientId>;
  removeRecipeingredients!: Sequelize.HasManyRemoveAssociationsMixin<recipeingredient, recipeingredientId>;
  hasRecipeingredient!: Sequelize.HasManyHasAssociationMixin<recipeingredient, recipeingredientId>;
  hasRecipeingredients!: Sequelize.HasManyHasAssociationsMixin<recipeingredient, recipeingredientId>;
  countRecipeingredients!: Sequelize.HasManyCountAssociationsMixin;
  // recipe hasMany recipestep via recipeid
  recipesteps!: recipestep[];
  getRecipesteps!: Sequelize.HasManyGetAssociationsMixin<recipestep>;
  setRecipesteps!: Sequelize.HasManySetAssociationsMixin<recipestep, recipestepId>;
  addRecipestep!: Sequelize.HasManyAddAssociationMixin<recipestep, recipestepId>;
  addRecipesteps!: Sequelize.HasManyAddAssociationsMixin<recipestep, recipestepId>;
  createRecipestep!: Sequelize.HasManyCreateAssociationMixin<recipestep>;
  removeRecipestep!: Sequelize.HasManyRemoveAssociationMixin<recipestep, recipestepId>;
  removeRecipesteps!: Sequelize.HasManyRemoveAssociationsMixin<recipestep, recipestepId>;
  hasRecipestep!: Sequelize.HasManyHasAssociationMixin<recipestep, recipestepId>;
  hasRecipesteps!: Sequelize.HasManyHasAssociationsMixin<recipestep, recipestepId>;
  countRecipesteps!: Sequelize.HasManyCountAssociationsMixin;
  // recipe belongsToMany step via recipeid and stepid
  stepid_steps!: step[];
  getStepid_steps!: Sequelize.BelongsToManyGetAssociationsMixin<step>;
  setStepid_steps!: Sequelize.BelongsToManySetAssociationsMixin<step, stepId>;
  addStepid_step!: Sequelize.BelongsToManyAddAssociationMixin<step, stepId>;
  addStepid_steps!: Sequelize.BelongsToManyAddAssociationsMixin<step, stepId>;
  createStepid_step!: Sequelize.BelongsToManyCreateAssociationMixin<step>;
  removeStepid_step!: Sequelize.BelongsToManyRemoveAssociationMixin<step, stepId>;
  removeStepid_steps!: Sequelize.BelongsToManyRemoveAssociationsMixin<step, stepId>;
  hasStepid_step!: Sequelize.BelongsToManyHasAssociationMixin<step, stepId>;
  hasStepid_steps!: Sequelize.BelongsToManyHasAssociationsMixin<step, stepId>;
  countStepid_steps!: Sequelize.BelongsToManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof recipe {
    return recipe.init({
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
