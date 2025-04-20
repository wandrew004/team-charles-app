import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { OwnedIngredient, OwnedIngredientId } from './ownedIngredient';
import type { RecipeIngredient, RecipeIngredientId } from './recipeIngredient';
import type { Recipe, RecipeId } from './recipe';
import type { Unit, UnitId } from './unit';
import type { User, UserId } from './user';

export interface IngredientAttributes {
  id: number;
  name: string;
  description?: string;
  standardUnit?: number;
  density?: number;
}

export type IngredientPk = "id";
export type IngredientId = Ingredient[IngredientPk];
export type IngredientOptionalAttributes = "id" | "description" | "standardUnit" | "density";
export type IngredientCreationAttributes = Optional<IngredientAttributes, IngredientOptionalAttributes>;

export class Ingredient extends Model<IngredientAttributes, IngredientCreationAttributes> implements IngredientAttributes {
  id!: number;
  name!: string;
  description?: string;
  standardUnit?: number;
  density?: number;

  // Ingredient hasMany OwnedIngredient via ingredientId
  ownedIngredients!: OwnedIngredient[];
  getOwnedIngredients!: Sequelize.HasManyGetAssociationsMixin<OwnedIngredient>;
  setOwnedIngredients!: Sequelize.HasManySetAssociationsMixin<OwnedIngredient, OwnedIngredientId>;
  addOwnedIngredient!: Sequelize.HasManyAddAssociationMixin<OwnedIngredient, OwnedIngredientId>;
  addOwnedIngredients!: Sequelize.HasManyAddAssociationsMixin<OwnedIngredient, OwnedIngredientId>;
  createOwnedIngredient!: Sequelize.HasManyCreateAssociationMixin<OwnedIngredient>;
  removeOwnedIngredient!: Sequelize.HasManyRemoveAssociationMixin<OwnedIngredient, OwnedIngredientId>;
  removeOwnedIngredients!: Sequelize.HasManyRemoveAssociationsMixin<OwnedIngredient, OwnedIngredientId>;
  hasOwnedIngredient!: Sequelize.HasManyHasAssociationMixin<OwnedIngredient, OwnedIngredientId>;
  hasOwnedIngredients!: Sequelize.HasManyHasAssociationsMixin<OwnedIngredient, OwnedIngredientId>;
  countOwnedIngredients!: Sequelize.HasManyCountAssociationsMixin;
  // Ingredient hasMany RecipeIngredient via ingredientId
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
  // Ingredient belongsToMany Recipe via ingredientId and recipeId
  recipeIdRecipes!: Recipe[];
  getRecipeIdRecipes!: Sequelize.BelongsToManyGetAssociationsMixin<Recipe>;
  setRecipeIdRecipes!: Sequelize.BelongsToManySetAssociationsMixin<Recipe, RecipeId>;
  addRecipeIdRecipe!: Sequelize.BelongsToManyAddAssociationMixin<Recipe, RecipeId>;
  addRecipeIdRecipes!: Sequelize.BelongsToManyAddAssociationsMixin<Recipe, RecipeId>;
  createRecipeIdRecipe!: Sequelize.BelongsToManyCreateAssociationMixin<Recipe>;
  removeRecipeIdRecipe!: Sequelize.BelongsToManyRemoveAssociationMixin<Recipe, RecipeId>;
  removeRecipeIdRecipes!: Sequelize.BelongsToManyRemoveAssociationsMixin<Recipe, RecipeId>;
  hasRecipeIdRecipe!: Sequelize.BelongsToManyHasAssociationMixin<Recipe, RecipeId>;
  hasRecipeIdRecipes!: Sequelize.BelongsToManyHasAssociationsMixin<Recipe, RecipeId>;
  countRecipeIdRecipes!: Sequelize.BelongsToManyCountAssociationsMixin;
  // Ingredient belongsToMany User via ingredientId and userId
  userIdUsers!: User[];
  getUserIdUsers!: Sequelize.BelongsToManyGetAssociationsMixin<User>;
  setUserIdUsers!: Sequelize.BelongsToManySetAssociationsMixin<User, UserId>;
  addUserIdUser!: Sequelize.BelongsToManyAddAssociationMixin<User, UserId>;
  addUserIdUsers!: Sequelize.BelongsToManyAddAssociationsMixin<User, UserId>;
  createUserIdUser!: Sequelize.BelongsToManyCreateAssociationMixin<User>;
  removeUserIdUser!: Sequelize.BelongsToManyRemoveAssociationMixin<User, UserId>;
  removeUserIdUsers!: Sequelize.BelongsToManyRemoveAssociationsMixin<User, UserId>;
  hasUserIdUser!: Sequelize.BelongsToManyHasAssociationMixin<User, UserId>;
  hasUserIdUsers!: Sequelize.BelongsToManyHasAssociationsMixin<User, UserId>;
  countUserIdUsers!: Sequelize.BelongsToManyCountAssociationsMixin;
  // Ingredient belongsTo Unit via standardUnit
  standardUnitUnit!: Unit;
  getStandardUnitUnit!: Sequelize.BelongsToGetAssociationMixin<Unit>;
  setStandardUnitUnit!: Sequelize.BelongsToSetAssociationMixin<Unit, UnitId>;
  createStandardUnitUnit!: Sequelize.BelongsToCreateAssociationMixin<Unit>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Ingredient {
    return Ingredient.init({
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
    standardUnit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Default unit for this ingredient (e.g. grams)",
      references: {
        model: 'units',
        key: 'id'
      },
      field: 'standard_unit'
    },
    density: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      comment: "Used for converting between volume and weight"
    }
  }, {
    sequelize,
    tableName: 'ingredients',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "ingredients_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
