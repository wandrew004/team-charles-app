import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { recipe, recipeId } from './recipe';
import type { recipestep, recipestepId } from './recipestep';

export interface stepAttributes {
  id: number;
  stepnumber: number;
  steptext: string;
}

export type stepPk = "id";
export type stepId = step[stepPk];
export type stepOptionalAttributes = "id";
export type stepCreationAttributes = Optional<stepAttributes, stepOptionalAttributes>;

export class step extends Model<stepAttributes, stepCreationAttributes> implements stepAttributes {
  id!: number;
  stepnumber!: number;
  steptext!: string;

  // step belongsToMany recipe via stepid and recipeid
  recipeid_recipes_recipesteps!: recipe[];
  getRecipeid_recipes_recipesteps!: Sequelize.BelongsToManyGetAssociationsMixin<recipe>;
  setRecipeid_recipes_recipesteps!: Sequelize.BelongsToManySetAssociationsMixin<recipe, recipeId>;
  addRecipeid_recipes_recipestep!: Sequelize.BelongsToManyAddAssociationMixin<recipe, recipeId>;
  addRecipeid_recipes_recipesteps!: Sequelize.BelongsToManyAddAssociationsMixin<recipe, recipeId>;
  createRecipeid_recipes_recipestep!: Sequelize.BelongsToManyCreateAssociationMixin<recipe>;
  removeRecipeid_recipes_recipestep!: Sequelize.BelongsToManyRemoveAssociationMixin<recipe, recipeId>;
  removeRecipeid_recipes_recipesteps!: Sequelize.BelongsToManyRemoveAssociationsMixin<recipe, recipeId>;
  hasRecipeid_recipes_recipestep!: Sequelize.BelongsToManyHasAssociationMixin<recipe, recipeId>;
  hasRecipeid_recipes_recipesteps!: Sequelize.BelongsToManyHasAssociationsMixin<recipe, recipeId>;
  countRecipeid_recipes_recipesteps!: Sequelize.BelongsToManyCountAssociationsMixin;
  // step hasMany recipestep via stepid
  recipesteps!: recipestep[];
  getRecipesteps!: Sequelize.HasManyGetAssociationsMixin<recipestep>;
  setRecipesteps!: Sequelize.HasManySetAssociationsMixin<recipestep, recipestepId>;
  addRecipestep!: Sequelize.HasManyAddAssociationMixin<recipestep, recipestepId>;
  addRecipesteps!: Sequelize.HasManyAddAssociationsMixin<recipestep, recipestepId>;
  createRecipestep!: Sequelize.HasManyCreateAssociationMixin<recipestep>;
  removeRecipestep!: Sequelize.HasManyRemoveAssociationMixin<recipestep, recipestepId>;
  removeRecipesteps!: Sequelize.HasManyRemoveAssociationsMixin<recipestep, recipestepId>;
  hasRecipestep!: Sequelize.HasManyHasAssociationMixin<recipestep, recipestepId>;
  hasRecipesteps!: Sequelize.HasManyHasAssociationsMixin<recipestep, recipestepId>;
  countRecipesteps!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof step {
    return step.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    stepnumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    steptext: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'steps',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "steps_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
