import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ingredients, ingredientsId } from './ingredients';
import type { recipeingredients, recipeingredientsId } from './recipeingredients';
import type { recipesteps, recipestepsId } from './recipesteps';
import type { steps, stepsId } from './steps';

export interface recipesAttributes {
  id: number;
  name: string;
  description?: string;
}

export type recipesPk = "id";
export type recipesId = recipes[recipesPk];
export type recipesOptionalAttributes = "id" | "description";
export type recipesCreationAttributes = Optional<recipesAttributes, recipesOptionalAttributes>;

export class recipes extends Model<recipesAttributes, recipesCreationAttributes> implements recipesAttributes {
  id!: number;
  name!: string;
  description?: string;

  // recipes belongsToMany ingredients via recipeid and ingredientid
  ingredientid_ingredients!: ingredients[];
  getIngredientid_ingredients!: Sequelize.BelongsToManyGetAssociationsMixin<ingredients>;
  setIngredientid_ingredients!: Sequelize.BelongsToManySetAssociationsMixin<ingredients, ingredientsId>;
  addIngredientid_ingredient!: Sequelize.BelongsToManyAddAssociationMixin<ingredients, ingredientsId>;
  addIngredientid_ingredients!: Sequelize.BelongsToManyAddAssociationsMixin<ingredients, ingredientsId>;
  createIngredientid_ingredient!: Sequelize.BelongsToManyCreateAssociationMixin<ingredients>;
  removeIngredientid_ingredient!: Sequelize.BelongsToManyRemoveAssociationMixin<ingredients, ingredientsId>;
  removeIngredientid_ingredients!: Sequelize.BelongsToManyRemoveAssociationsMixin<ingredients, ingredientsId>;
  hasIngredientid_ingredient!: Sequelize.BelongsToManyHasAssociationMixin<ingredients, ingredientsId>;
  hasIngredientid_ingredients!: Sequelize.BelongsToManyHasAssociationsMixin<ingredients, ingredientsId>;
  countIngredientid_ingredients!: Sequelize.BelongsToManyCountAssociationsMixin;
  // recipes hasMany recipeingredients via recipeid
  recipeingredients!: recipeingredients[];
  getRecipeingredients!: Sequelize.HasManyGetAssociationsMixin<recipeingredients>;
  setRecipeingredients!: Sequelize.HasManySetAssociationsMixin<recipeingredients, recipeingredientsId>;
  addRecipeingredient!: Sequelize.HasManyAddAssociationMixin<recipeingredients, recipeingredientsId>;
  addRecipeingredients!: Sequelize.HasManyAddAssociationsMixin<recipeingredients, recipeingredientsId>;
  createRecipeingredient!: Sequelize.HasManyCreateAssociationMixin<recipeingredients>;
  removeRecipeingredient!: Sequelize.HasManyRemoveAssociationMixin<recipeingredients, recipeingredientsId>;
  removeRecipeingredients!: Sequelize.HasManyRemoveAssociationsMixin<recipeingredients, recipeingredientsId>;
  hasRecipeingredient!: Sequelize.HasManyHasAssociationMixin<recipeingredients, recipeingredientsId>;
  hasRecipeingredients!: Sequelize.HasManyHasAssociationsMixin<recipeingredients, recipeingredientsId>;
  countRecipeingredients!: Sequelize.HasManyCountAssociationsMixin;
  // recipes hasMany recipesteps via recipeid
  recipesteps!: recipesteps[];
  getRecipesteps!: Sequelize.HasManyGetAssociationsMixin<recipesteps>;
  setRecipesteps!: Sequelize.HasManySetAssociationsMixin<recipesteps, recipestepsId>;
  addRecipestep!: Sequelize.HasManyAddAssociationMixin<recipesteps, recipestepsId>;
  addRecipesteps!: Sequelize.HasManyAddAssociationsMixin<recipesteps, recipestepsId>;
  createRecipestep!: Sequelize.HasManyCreateAssociationMixin<recipesteps>;
  removeRecipestep!: Sequelize.HasManyRemoveAssociationMixin<recipesteps, recipestepsId>;
  removeRecipesteps!: Sequelize.HasManyRemoveAssociationsMixin<recipesteps, recipestepsId>;
  hasRecipestep!: Sequelize.HasManyHasAssociationMixin<recipesteps, recipestepsId>;
  hasRecipesteps!: Sequelize.HasManyHasAssociationsMixin<recipesteps, recipestepsId>;
  countRecipesteps!: Sequelize.HasManyCountAssociationsMixin;
  // recipes belongsToMany steps via recipeid and stepid
  stepid_steps!: steps[];
  getStepid_steps!: Sequelize.BelongsToManyGetAssociationsMixin<steps>;
  setStepid_steps!: Sequelize.BelongsToManySetAssociationsMixin<steps, stepsId>;
  addStepid_step!: Sequelize.BelongsToManyAddAssociationMixin<steps, stepsId>;
  addStepid_steps!: Sequelize.BelongsToManyAddAssociationsMixin<steps, stepsId>;
  createStepid_step!: Sequelize.BelongsToManyCreateAssociationMixin<steps>;
  removeStepid_step!: Sequelize.BelongsToManyRemoveAssociationMixin<steps, stepsId>;
  removeStepid_steps!: Sequelize.BelongsToManyRemoveAssociationsMixin<steps, stepsId>;
  hasStepid_step!: Sequelize.BelongsToManyHasAssociationMixin<steps, stepsId>;
  hasStepid_steps!: Sequelize.BelongsToManyHasAssociationsMixin<steps, stepsId>;
  countStepid_steps!: Sequelize.BelongsToManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof recipes {
    return recipes.init({
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
