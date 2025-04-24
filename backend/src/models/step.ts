import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { RecipeStep, RecipeStepId } from './recipeStep';
import type { Recipe, RecipeId } from './recipe';

export interface StepAttributes {
  id: number;
  stepNumber: number;
  stepText: string;
}

export type StepPk = "id";
export type StepId = Step[StepPk];
export type StepOptionalAttributes = "id";
export type StepCreationAttributes = Optional<StepAttributes, StepOptionalAttributes>;

export class Step extends Model<StepAttributes, StepCreationAttributes> implements StepAttributes {
  id!: number;
  stepNumber!: number;
  stepText!: string;

  // Step hasMany RecipeStep via stepId
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
  // Step belongsToMany Recipe via stepId and recipeId
  recipeIdRecipesRecipeSteps!: Recipe[];
  getRecipeIdRecipesRecipeSteps!: Sequelize.BelongsToManyGetAssociationsMixin<Recipe>;
  setRecipeIdRecipesRecipeSteps!: Sequelize.BelongsToManySetAssociationsMixin<Recipe, RecipeId>;
  addRecipeIdRecipesRecipeStep!: Sequelize.BelongsToManyAddAssociationMixin<Recipe, RecipeId>;
  addRecipeIdRecipesRecipeSteps!: Sequelize.BelongsToManyAddAssociationsMixin<Recipe, RecipeId>;
  createRecipeIdRecipesRecipeStep!: Sequelize.BelongsToManyCreateAssociationMixin<Recipe>;
  removeRecipeIdRecipesRecipeStep!: Sequelize.BelongsToManyRemoveAssociationMixin<Recipe, RecipeId>;
  removeRecipeIdRecipesRecipeSteps!: Sequelize.BelongsToManyRemoveAssociationsMixin<Recipe, RecipeId>;
  hasRecipeIdRecipesRecipeStep!: Sequelize.BelongsToManyHasAssociationMixin<Recipe, RecipeId>;
  hasRecipeIdRecipesRecipeSteps!: Sequelize.BelongsToManyHasAssociationsMixin<Recipe, RecipeId>;
  countRecipeIdRecipesRecipeSteps!: Sequelize.BelongsToManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof Step {
    return Step.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    stepNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'step_number'
    },
    stepText: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'step_text'
    }
  }, {
    sequelize,
    tableName: 'steps',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "steps_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
