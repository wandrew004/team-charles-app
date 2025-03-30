import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ingredients, ingredientsId } from './ingredients';

export interface ownedingredientsAttributes {
  ingredientid: number;
  quantity: number;
}

export type ownedingredientsPk = "ingredientid";
export type ownedingredientsId = ownedingredients[ownedingredientsPk];
export type ownedingredientsCreationAttributes = ownedingredientsAttributes;

export class ownedingredients extends Model<ownedingredientsAttributes, ownedingredientsCreationAttributes> implements ownedingredientsAttributes {
  ingredientid!: number;
  quantity!: number;

  // ownedingredients belongsTo ingredients via ingredientid
  ingredient!: ingredients;
  getIngredient!: Sequelize.BelongsToGetAssociationMixin<ingredients>;
  setIngredient!: Sequelize.BelongsToSetAssociationMixin<ingredients, ingredientsId>;
  createIngredient!: Sequelize.BelongsToCreateAssociationMixin<ingredients>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ownedingredients {
    return ownedingredients.init({
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
      allowNull: false,
      comment: "Amount of ingredient available"
    }
  }, {
    sequelize,
    tableName: 'ownedingredients',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "ownedingredients_pkey",
        unique: true,
        fields: [
          { name: "ingredientid" },
        ]
      },
    ]
  });
  }
}
