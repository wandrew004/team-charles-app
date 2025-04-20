import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Ingredient, IngredientId } from './ingredient';
import type { OwnedIngredient, OwnedIngredientId } from './ownedIngredient';
import type { Recipe, RecipeId } from './recipe';

export interface UserAttributes {
  id: number;
  username: string;
  password: string;
}

export type UserPk = "id";
export type UserId = User[UserPk];
export type UserOptionalAttributes = "id";
export type UserCreationAttributes = Optional<UserAttributes, UserOptionalAttributes>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  id!: number;
  username!: string;
  password!: string;

  // User belongsToMany Ingredient via userId and ingredientId
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
  // User hasMany OwnedIngredient via userId
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
  // User hasMany Recipe via userId
  recipes!: Recipe[];
  getRecipes!: Sequelize.HasManyGetAssociationsMixin<Recipe>;
  setRecipes!: Sequelize.HasManySetAssociationsMixin<Recipe, RecipeId>;
  addRecipe!: Sequelize.HasManyAddAssociationMixin<Recipe, RecipeId>;
  addRecipes!: Sequelize.HasManyAddAssociationsMixin<Recipe, RecipeId>;
  createRecipe!: Sequelize.HasManyCreateAssociationMixin<Recipe>;
  removeRecipe!: Sequelize.HasManyRemoveAssociationMixin<Recipe, RecipeId>;
  removeRecipes!: Sequelize.HasManyRemoveAssociationsMixin<Recipe, RecipeId>;
  hasRecipe!: Sequelize.HasManyHasAssociationMixin<Recipe, RecipeId>;
  hasRecipes!: Sequelize.HasManyHasAssociationsMixin<Recipe, RecipeId>;
  countRecipes!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof User {
    return User.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "users_username_key"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'users',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "users_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "users_username_key",
        unique: true,
        fields: [
          { name: "username" },
        ]
      },
    ]
  });
  }
}
