import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ingredient, ingredientId } from './ingredient';

export interface ownedingredientAttributes {
  ingredientid: number;
  quantity: number;
}

export type ownedingredientPk = "ingredientid";
export type ownedingredientId = ownedingredient[ownedingredientPk];
export type ownedingredientCreationAttributes = ownedingredientAttributes;

export class ownedingredient extends Model<ownedingredientAttributes, ownedingredientCreationAttributes> implements ownedingredientAttributes {
  ingredientid!: number;
  quantity!: number;

  // ownedingredient belongsTo ingredient via ingredientid
  ingredient!: ingredient;
  getIngredient!: Sequelize.BelongsToGetAssociationMixin<ingredient>;
  setIngredient!: Sequelize.BelongsToSetAssociationMixin<ingredient, ingredientId>;
  createIngredient!: Sequelize.BelongsToCreateAssociationMixin<ingredient>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ownedingredient {
    return ownedingredient.init({
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
