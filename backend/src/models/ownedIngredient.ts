import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Ingredient, IngredientId } from './ingredient';
import type { User, UserId } from './user';

export interface OwnedIngredientAttributes {
  ingredientId: number;
  quantity: number;
  userId: number;
}

export type OwnedIngredientPk = "ingredientId" | "userId";
export type OwnedIngredientId = OwnedIngredient[OwnedIngredientPk];
export type OwnedIngredientCreationAttributes = OwnedIngredientAttributes;

export class OwnedIngredient extends Model<OwnedIngredientAttributes, OwnedIngredientCreationAttributes> implements OwnedIngredientAttributes {
  ingredientId!: number;
  quantity!: number;
  userId!: number;

  // OwnedIngredient belongsTo Ingredient via ingredientId
  ingredient!: Ingredient;
  getIngredient!: Sequelize.BelongsToGetAssociationMixin<Ingredient>;
  setIngredient!: Sequelize.BelongsToSetAssociationMixin<Ingredient, IngredientId>;
  createIngredient!: Sequelize.BelongsToCreateAssociationMixin<Ingredient>;
  // OwnedIngredient belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof OwnedIngredient {
    return OwnedIngredient.init({
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
      allowNull: false,
      comment: "Amount of ingredient available"
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'user_id'
    }
  }, {
    sequelize,
    tableName: 'owned_ingredients',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "owned_ingredients_pkey",
        unique: true,
        fields: [
          { name: "ingredient_id" },
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
