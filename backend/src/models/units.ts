import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ingredients, ingredientsId } from './ingredients';
import type { recipeingredients, recipeingredientsId } from './recipeingredients';

export interface unitsAttributes {
  id: number;
  name: string;
  type: string;
}

export type unitsPk = "id";
export type unitsId = units[unitsPk];
export type unitsOptionalAttributes = "id";
export type unitsCreationAttributes = Optional<unitsAttributes, unitsOptionalAttributes>;

export class units extends Model<unitsAttributes, unitsCreationAttributes> implements unitsAttributes {
  id!: number;
  name!: string;
  type!: string;

  // units hasMany ingredients via standard_unit
  ingredients!: ingredients[];
  getIngredients!: Sequelize.HasManyGetAssociationsMixin<ingredients>;
  setIngredients!: Sequelize.HasManySetAssociationsMixin<ingredients, ingredientsId>;
  addIngredient!: Sequelize.HasManyAddAssociationMixin<ingredients, ingredientsId>;
  addIngredients!: Sequelize.HasManyAddAssociationsMixin<ingredients, ingredientsId>;
  createIngredient!: Sequelize.HasManyCreateAssociationMixin<ingredients>;
  removeIngredient!: Sequelize.HasManyRemoveAssociationMixin<ingredients, ingredientsId>;
  removeIngredients!: Sequelize.HasManyRemoveAssociationsMixin<ingredients, ingredientsId>;
  hasIngredient!: Sequelize.HasManyHasAssociationMixin<ingredients, ingredientsId>;
  hasIngredients!: Sequelize.HasManyHasAssociationsMixin<ingredients, ingredientsId>;
  countIngredients!: Sequelize.HasManyCountAssociationsMixin;
  // units hasMany recipeingredients via unitid
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

  static initModel(sequelize: Sequelize.Sequelize): typeof units {
    return units.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "units_name_key"
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "Type of unit: volume, weight, or other"
    }
  }, {
    sequelize,
    tableName: 'units',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "units_name_key",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "units_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
