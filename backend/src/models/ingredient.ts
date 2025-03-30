import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ownedingredient, ownedingredientCreationAttributes, ownedingredientId } from './ownedingredient';
import type { recipeingredient, recipeingredientId } from './recipeingredient';
import type { recipe, recipeId } from './recipe';
import type { unit, unitId } from './unit';

export interface ingredientAttributes {
  id: number;
  name: string;
  description?: string;
  standard_unit?: number;
  density?: number;
}

export type ingredientPk = "id";
export type ingredientId = ingredient[ingredientPk];
export type ingredientOptionalAttributes = "id" | "description" | "standard_unit" | "density";
export type ingredientCreationAttributes = Optional<ingredientAttributes, ingredientOptionalAttributes>;

export class ingredient extends Model<ingredientAttributes, ingredientCreationAttributes> implements ingredientAttributes {
  id!: number;
  name!: string;
  description?: string;
  standard_unit?: number;
  density?: number;

  // ingredient hasOne ownedingredient via ingredientid
  ownedingredient!: ownedingredient;
  getOwnedingredient!: Sequelize.HasOneGetAssociationMixin<ownedingredient>;
  setOwnedingredient!: Sequelize.HasOneSetAssociationMixin<ownedingredient, ownedingredientId>;
  createOwnedingredient!: Sequelize.HasOneCreateAssociationMixin<ownedingredient>;
  // ingredient hasMany recipeingredient via ingredientid
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
  // ingredient belongsToMany recipe via ingredientid and recipeid
  recipeid_recipes!: recipe[];
  getRecipeid_recipes!: Sequelize.BelongsToManyGetAssociationsMixin<recipe>;
  setRecipeid_recipes!: Sequelize.BelongsToManySetAssociationsMixin<recipe, recipeId>;
  addRecipeid_recipe!: Sequelize.BelongsToManyAddAssociationMixin<recipe, recipeId>;
  addRecipeid_recipes!: Sequelize.BelongsToManyAddAssociationsMixin<recipe, recipeId>;
  createRecipeid_recipe!: Sequelize.BelongsToManyCreateAssociationMixin<recipe>;
  removeRecipeid_recipe!: Sequelize.BelongsToManyRemoveAssociationMixin<recipe, recipeId>;
  removeRecipeid_recipes!: Sequelize.BelongsToManyRemoveAssociationsMixin<recipe, recipeId>;
  hasRecipeid_recipe!: Sequelize.BelongsToManyHasAssociationMixin<recipe, recipeId>;
  hasRecipeid_recipes!: Sequelize.BelongsToManyHasAssociationsMixin<recipe, recipeId>;
  countRecipeid_recipes!: Sequelize.BelongsToManyCountAssociationsMixin;
  // ingredient belongsTo unit via standard_unit
  standard_unit_unit!: unit;
  getStandard_unit_unit!: Sequelize.BelongsToGetAssociationMixin<unit>;
  setStandard_unit_unit!: Sequelize.BelongsToSetAssociationMixin<unit, unitId>;
  createStandard_unit_unit!: Sequelize.BelongsToCreateAssociationMixin<unit>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ingredient {
    return ingredient.init({
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
    standard_unit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Default unit for this ingredient (e.g. grams)",
      references: {
        model: 'units',
        key: 'id'
      }
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
