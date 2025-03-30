import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { recipe, recipeId } from './recipe';
import type { step, stepId } from './step';

export interface recipestepAttributes {
  recipeid: number;
  stepid: number;
}

export type recipestepPk = "recipeid" | "stepid";
export type recipestepId = recipestep[recipestepPk];
export type recipestepCreationAttributes = recipestepAttributes;

export class recipestep extends Model<recipestepAttributes, recipestepCreationAttributes> implements recipestepAttributes {
  recipeid!: number;
  stepid!: number;

  // recipestep belongsTo recipe via recipeid
  recipe!: recipe;
  getRecipe!: Sequelize.BelongsToGetAssociationMixin<recipe>;
  setRecipe!: Sequelize.BelongsToSetAssociationMixin<recipe, recipeId>;
  createRecipe!: Sequelize.BelongsToCreateAssociationMixin<recipe>;
  // recipestep belongsTo step via stepid
  step!: step;
  getStep!: Sequelize.BelongsToGetAssociationMixin<step>;
  setStep!: Sequelize.BelongsToSetAssociationMixin<step, stepId>;
  createStep!: Sequelize.BelongsToCreateAssociationMixin<step>;

  static initModel(sequelize: Sequelize.Sequelize): typeof recipestep {
    return recipestep.init({
    recipeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'recipes',
        key: 'id'
      }
    },
    stepid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'steps',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'recipesteps',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "recipesteps_pkey",
        unique: true,
        fields: [
          { name: "recipeid" },
          { name: "stepid" },
        ]
      },
    ]
  });
  }
}
