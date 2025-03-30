import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ownedingredients, ownedingredientsCreationAttributes, ownedingredientsId } from './ownedingredients';
import type { recipeingredients, recipeingredientsId } from './recipeingredients';
import type { recipes, recipesId } from './recipes';
import type { units, unitsId } from './units';

export interface ingredientsAttributes {
  id: number;
  name: string;
  description?: string;
  standard_unit?: number;
  density?: number;
}

export type ingredientsPk = "id";
export type ingredientsId = ingredients[ingredientsPk];
export type ingredientsOptionalAttributes = "id" | "description" | "standard_unit" | "density";
export type ingredientsCreationAttributes = Optional<ingredientsAttributes, ingredientsOptionalAttributes>;

export class ingredients extends Model<ingredientsAttributes, ingredientsCreationAttributes> implements ingredientsAttributes {
  id!: number;
  name!: string;
  description?: string;
  standard_unit?: number;
  density?: number;

  // ingredients hasOne ownedingredients via ingredientid
  ownedingredient!: ownedingredients;
  getOwnedingredient!: Sequelize.HasOneGetAssociationMixin<ownedingredients>;
  setOwnedingredient!: Sequelize.HasOneSetAssociationMixin<ownedingredients, ownedingredientsId>;
  createOwnedingredient!: Sequelize.HasOneCreateAssociationMixin<ownedingredients>;
  // ingredients hasMany recipeingredients via ingredientid
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
  // ingredients belongsToMany recipes via ingredientid and recipeid
  recipeid_recipes!: recipes[];
  getRecipeid_recipes!: Sequelize.BelongsToManyGetAssociationsMixin<recipes>;
  setRecipeid_recipes!: Sequelize.BelongsToManySetAssociationsMixin<recipes, recipesId>;
  addRecipeid_recipe!: Sequelize.BelongsToManyAddAssociationMixin<recipes, recipesId>;
  addRecipeid_recipes!: Sequelize.BelongsToManyAddAssociationsMixin<recipes, recipesId>;
  createRecipeid_recipe!: Sequelize.BelongsToManyCreateAssociationMixin<recipes>;
  removeRecipeid_recipe!: Sequelize.BelongsToManyRemoveAssociationMixin<recipes, recipesId>;
  removeRecipeid_recipes!: Sequelize.BelongsToManyRemoveAssociationsMixin<recipes, recipesId>;
  hasRecipeid_recipe!: Sequelize.BelongsToManyHasAssociationMixin<recipes, recipesId>;
  hasRecipeid_recipes!: Sequelize.BelongsToManyHasAssociationsMixin<recipes, recipesId>;
  countRecipeid_recipes!: Sequelize.BelongsToManyCountAssociationsMixin;
  // ingredients belongsTo units via standard_unit
  standard_unit_unit!: units;
  getStandard_unit_unit!: Sequelize.BelongsToGetAssociationMixin<units>;
  setStandard_unit_unit!: Sequelize.BelongsToSetAssociationMixin<units, unitsId>;
  createStandard_unit_unit!: Sequelize.BelongsToCreateAssociationMixin<units>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ingredients {
    return ingredients.init({
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
