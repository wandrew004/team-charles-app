import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Ingredient, IngredientId } from './ingredient';
import type { Recipe, RecipeId } from './recipe';
import type { Unit, UnitId } from './unit';

export interface RecipeIngredientAttributes {
  recipeId: number;
  ingredientId: number;
  quantity?: number;
  unitId?: number;
}

export type RecipeIngredientPk = "recipeId" | "ingredientId";
export type RecipeIngredientId = RecipeIngredient[RecipeIngredientPk];
export type RecipeIngredientOptionalAttributes = "quantity" | "unitId";
export type RecipeIngredientCreationAttributes = Optional<RecipeIngredientAttributes, RecipeIngredientOptionalAttributes>;

export class RecipeIngredient extends Model<RecipeIngredientAttributes, RecipeIngredientCreationAttributes> implements RecipeIngredientAttributes {
  recipeId!: number;
  ingredientId!: number;
  quantity?: number;
  unitId?: number;

  // RecipeIngredient belongsTo Ingredient via ingredientId
  ingredient!: Ingredient;
  getIngredient!: Sequelize.BelongsToGetAssociationMixin<Ingredient>;
  setIngredient!: Sequelize.BelongsToSetAssociationMixin<Ingredient, IngredientId>;
  createIngredient!: Sequelize.BelongsToCreateAssociationMixin<Ingredient>;
  // RecipeIngredient belongsTo Recipe via recipeId
  recipe!: Recipe;
  getRecipe!: Sequelize.BelongsToGetAssociationMixin<Recipe>;
  setRecipe!: Sequelize.BelongsToSetAssociationMixin<Recipe, RecipeId>;
  createRecipe!: Sequelize.BelongsToCreateAssociationMixin<Recipe>;
  // RecipeIngredient belongsTo Unit via unitId
  unit!: Unit;
  getUnit!: Sequelize.BelongsToGetAssociationMixin<Unit>;
  setUnit!: Sequelize.BelongsToSetAssociationMixin<Unit, UnitId>;
  createUnit!: Sequelize.BelongsToCreateAssociationMixin<Unit>;

  static initModel(sequelize: Sequelize.Sequelize): typeof RecipeIngredient {
    return RecipeIngredient.init({
    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'recipes',
        key: 'id'
      },
      field: 'recipe_id'
    },
    ingredientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'ingredients',
        key: 'id'
      },
      field: 'ingredient_id'
    },
    quantity: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    unitId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Unit of measurement for the quantity used in a recipe",
      references: {
        model: 'units',
        key: 'id'
      },
      field: 'unit_id'
    }
  }, {
    sequelize,
    tableName: 'recipe_ingredients',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "recipe_ingredients_pkey",
        unique: true,
        fields: [
          { name: "recipe_id" },
          { name: "ingredient_id" },
        ]
      },
    ]
  });
  }
}
