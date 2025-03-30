import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { recipes, recipesId } from './recipes';
import type { recipesteps, recipestepsId } from './recipesteps';

export interface stepsAttributes {
  id: number;
  stepnumber: number;
  steptext: string;
}

export type stepsPk = "id";
export type stepsId = steps[stepsPk];
export type stepsOptionalAttributes = "id";
export type stepsCreationAttributes = Optional<stepsAttributes, stepsOptionalAttributes>;

export class steps extends Model<stepsAttributes, stepsCreationAttributes> implements stepsAttributes {
  id!: number;
  stepnumber!: number;
  steptext!: string;

  // steps belongsToMany recipes via stepid and recipeid
  recipeid_recipes_recipesteps!: recipes[];
  getRecipeid_recipes_recipesteps!: Sequelize.BelongsToManyGetAssociationsMixin<recipes>;
  setRecipeid_recipes_recipesteps!: Sequelize.BelongsToManySetAssociationsMixin<recipes, recipesId>;
  addRecipeid_recipes_recipestep!: Sequelize.BelongsToManyAddAssociationMixin<recipes, recipesId>;
  addRecipeid_recipes_recipesteps!: Sequelize.BelongsToManyAddAssociationsMixin<recipes, recipesId>;
  createRecipeid_recipes_recipestep!: Sequelize.BelongsToManyCreateAssociationMixin<recipes>;
  removeRecipeid_recipes_recipestep!: Sequelize.BelongsToManyRemoveAssociationMixin<recipes, recipesId>;
  removeRecipeid_recipes_recipesteps!: Sequelize.BelongsToManyRemoveAssociationsMixin<recipes, recipesId>;
  hasRecipeid_recipes_recipestep!: Sequelize.BelongsToManyHasAssociationMixin<recipes, recipesId>;
  hasRecipeid_recipes_recipesteps!: Sequelize.BelongsToManyHasAssociationsMixin<recipes, recipesId>;
  countRecipeid_recipes_recipesteps!: Sequelize.BelongsToManyCountAssociationsMixin;
  // steps hasMany recipesteps via stepid
  recipesteps!: recipesteps[];
  getRecipesteps!: Sequelize.HasManyGetAssociationsMixin<recipesteps>;
  setRecipesteps!: Sequelize.HasManySetAssociationsMixin<recipesteps, recipestepsId>;
  addRecipestep!: Sequelize.HasManyAddAssociationMixin<recipesteps, recipestepsId>;
  addRecipesteps!: Sequelize.HasManyAddAssociationsMixin<recipesteps, recipestepsId>;
  createRecipestep!: Sequelize.HasManyCreateAssociationMixin<recipesteps>;
  removeRecipestep!: Sequelize.HasManyRemoveAssociationMixin<recipesteps, recipestepsId>;
  removeRecipesteps!: Sequelize.HasManyRemoveAssociationsMixin<recipesteps, recipestepsId>;
  hasRecipestep!: Sequelize.HasManyHasAssociationMixin<recipesteps, recipestepsId>;
  hasRecipesteps!: Sequelize.HasManyHasAssociationsMixin<recipesteps, recipestepsId>;
  countRecipesteps!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof steps {
    return steps.init({
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
