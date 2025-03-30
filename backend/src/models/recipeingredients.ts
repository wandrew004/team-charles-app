import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ingredients, ingredientsId } from './ingredients';
import type { recipes, recipesId } from './recipes';
import type { units, unitsId } from './units';

export interface recipeingredientsAttributes {
  recipeid: number;
  ingredientid: number;
  quantity?: number;
  unitid?: number;
}

export type recipeingredientsPk = "recipeid" | "ingredientid";
export type recipeingredientsId = recipeingredients[recipeingredientsPk];
export type recipeingredientsOptionalAttributes = "quantity" | "unitid";
export type recipeingredientsCreationAttributes = Optional<recipeingredientsAttributes, recipeingredientsOptionalAttributes>;

export class recipeingredients extends Model<recipeingredientsAttributes, recipeingredientsCreationAttributes> implements recipeingredientsAttributes {
  recipeid!: number;
  ingredientid!: number;
  quantity?: number;
  unitid?: number;

  // recipeingredients belongsTo ingredients via ingredientid
  ingredient!: ingredients;
  getIngredient!: Sequelize.BelongsToGetAssociationMixin<ingredients>;
  setIngredient!: Sequelize.BelongsToSetAssociationMixin<ingredients, ingredientsId>;
  createIngredient!: Sequelize.BelongsToCreateAssociationMixin<ingredients>;
  // recipeingredients belongsTo recipes via recipeid
  recipe!: recipes;
  getRecipe!: Sequelize.BelongsToGetAssociationMixin<recipes>;
  setRecipe!: Sequelize.BelongsToSetAssociationMixin<recipes, recipesId>;
  createRecipe!: Sequelize.BelongsToCreateAssociationMixin<recipes>;
  // recipeingredients belongsTo units via unitid
  unit!: units;
  getUnit!: Sequelize.BelongsToGetAssociationMixin<units>;
  setUnit!: Sequelize.BelongsToSetAssociationMixin<units, unitsId>;
  createUnit!: Sequelize.BelongsToCreateAssociationMixin<units>;

  static initModel(sequelize: Sequelize.Sequelize): typeof recipeingredients {
    return recipeingredients.init({
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
