import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ingredient, ingredientId } from './ingredient';
import type { recipe, recipeId } from './recipe';
import type { unit, unitId } from './unit';

export interface recipeingredientAttributes {
  recipeid: number;
  ingredientid: number;
  quantity?: number;
  unitid?: number;
}

export type recipeingredientPk = "recipeid" | "ingredientid";
export type recipeingredientId = recipeingredient[recipeingredientPk];
export type recipeingredientOptionalAttributes = "quantity" | "unitid";
export type recipeingredientCreationAttributes = Optional<recipeingredientAttributes, recipeingredientOptionalAttributes>;

export class recipeingredient extends Model<recipeingredientAttributes, recipeingredientCreationAttributes> implements recipeingredientAttributes {
  recipeid!: number;
  ingredientid!: number;
  quantity?: number;
  unitid?: number;

  // recipeingredient belongsTo ingredient via ingredientid
  ingredient!: ingredient;
  getIngredient!: Sequelize.BelongsToGetAssociationMixin<ingredient>;
  setIngredient!: Sequelize.BelongsToSetAssociationMixin<ingredient, ingredientId>;
  createIngredient!: Sequelize.BelongsToCreateAssociationMixin<ingredient>;
  // recipeingredient belongsTo recipe via recipeid
  recipe!: recipe;
  getRecipe!: Sequelize.BelongsToGetAssociationMixin<recipe>;
  setRecipe!: Sequelize.BelongsToSetAssociationMixin<recipe, recipeId>;
  createRecipe!: Sequelize.BelongsToCreateAssociationMixin<recipe>;
  // recipeingredient belongsTo unit via unitid
  unit!: unit;
  getUnit!: Sequelize.BelongsToGetAssociationMixin<unit>;
  setUnit!: Sequelize.BelongsToSetAssociationMixin<unit, unitId>;
  createUnit!: Sequelize.BelongsToCreateAssociationMixin<unit>;

  static initModel(sequelize: Sequelize.Sequelize): typeof recipeingredient {
    return recipeingredient.init({
    recipeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'recipes',
        key: 'id'
      }
    },
    ingredientid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'ingredients',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    unitid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Unit of measurement for the quantity used in a recipe",
      references: {
        model: 'units',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'recipeingredients',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "recipeingredients_pkey",
        unique: true,
        fields: [
          { name: "recipeid" },
          { name: "ingredientid" },
        ]
      },
    ]
  });
  }
}
