import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { recipes, recipesId } from './recipes';
import type { steps, stepsId } from './steps';

export interface recipestepsAttributes {
  recipeid: number;
  stepid: number;
}

export type recipestepsPk = "recipeid" | "stepid";
export type recipestepsId = recipesteps[recipestepsPk];
export type recipestepsCreationAttributes = recipestepsAttributes;

export class recipesteps extends Model<recipestepsAttributes, recipestepsCreationAttributes> implements recipestepsAttributes {
  recipeid!: number;
  stepid!: number;

  // recipesteps belongsTo recipes via recipeid
  recipe!: recipes;
  getRecipe!: Sequelize.BelongsToGetAssociationMixin<recipes>;
  setRecipe!: Sequelize.BelongsToSetAssociationMixin<recipes, recipesId>;
  createRecipe!: Sequelize.BelongsToCreateAssociationMixin<recipes>;
  // recipesteps belongsTo steps via stepid
  step!: steps;
  getStep!: Sequelize.BelongsToGetAssociationMixin<steps>;
  setStep!: Sequelize.BelongsToSetAssociationMixin<steps, stepsId>;
  createStep!: Sequelize.BelongsToCreateAssociationMixin<steps>;

  static initModel(sequelize: Sequelize.Sequelize): typeof recipesteps {
    return recipesteps.init({
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
