import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ingredient, ingredientId } from './ingredient';
import type { recipeingredient, recipeingredientId } from './recipeingredient';

export interface unitAttributes {
  id: number;
  name: string;
  type: string;
}

export type unitPk = "id";
export type unitId = unit[unitPk];
export type unitOptionalAttributes = "id";
export type unitCreationAttributes = Optional<unitAttributes, unitOptionalAttributes>;

export class unit extends Model<unitAttributes, unitCreationAttributes> implements unitAttributes {
  id!: number;
  name!: string;
  type!: string;

  // unit hasMany ingredient via standard_unit
  ingredients!: ingredient[];
  getIngredients!: Sequelize.HasManyGetAssociationsMixin<ingredient>;
  setIngredients!: Sequelize.HasManySetAssociationsMixin<ingredient, ingredientId>;
  addIngredient!: Sequelize.HasManyAddAssociationMixin<ingredient, ingredientId>;
  addIngredients!: Sequelize.HasManyAddAssociationsMixin<ingredient, ingredientId>;
  createIngredient!: Sequelize.HasManyCreateAssociationMixin<ingredient>;
  removeIngredient!: Sequelize.HasManyRemoveAssociationMixin<ingredient, ingredientId>;
  removeIngredients!: Sequelize.HasManyRemoveAssociationsMixin<ingredient, ingredientId>;
  hasIngredient!: Sequelize.HasManyHasAssociationMixin<ingredient, ingredientId>;
  hasIngredients!: Sequelize.HasManyHasAssociationsMixin<ingredient, ingredientId>;
  countIngredients!: Sequelize.HasManyCountAssociationsMixin;
  // unit hasMany recipeingredient via unitid
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

  static initModel(sequelize: Sequelize.Sequelize): typeof unit {
    return unit.init({
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
