import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Ingredient, IngredientId } from './ingredient';
import type { RecipeIngredient, RecipeIngredientId } from './recipeIngredient';

export interface UnitAttributes {
  id: number;
  name: string;
  type: string;
}

export type UnitPk = 'id';
export type UnitId = Unit[UnitPk];
export type UnitOptionalAttributes = 'id';
export type UnitCreationAttributes = Optional<UnitAttributes, UnitOptionalAttributes>;

export class Unit extends Model<UnitAttributes, UnitCreationAttributes> implements UnitAttributes {
    id!: number;
    name!: string;
    type!: string;

    // Unit hasMany Ingredient via standardUnit
    ingredients!: Ingredient[];
    getIngredients!: Sequelize.HasManyGetAssociationsMixin<Ingredient>;
    setIngredients!: Sequelize.HasManySetAssociationsMixin<Ingredient, IngredientId>;
    addIngredient!: Sequelize.HasManyAddAssociationMixin<Ingredient, IngredientId>;
    addIngredients!: Sequelize.HasManyAddAssociationsMixin<Ingredient, IngredientId>;
    createIngredient!: Sequelize.HasManyCreateAssociationMixin<Ingredient>;
    removeIngredient!: Sequelize.HasManyRemoveAssociationMixin<Ingredient, IngredientId>;
    removeIngredients!: Sequelize.HasManyRemoveAssociationsMixin<Ingredient, IngredientId>;
    hasIngredient!: Sequelize.HasManyHasAssociationMixin<Ingredient, IngredientId>;
    hasIngredients!: Sequelize.HasManyHasAssociationsMixin<Ingredient, IngredientId>;
    countIngredients!: Sequelize.HasManyCountAssociationsMixin;
    // Unit hasMany RecipeIngredient via unitId
    recipeIngredients!: RecipeIngredient[];
    getRecipeIngredients!: Sequelize.HasManyGetAssociationsMixin<RecipeIngredient>;
    setRecipeIngredients!: Sequelize.HasManySetAssociationsMixin<RecipeIngredient, RecipeIngredientId>;
    addRecipeIngredient!: Sequelize.HasManyAddAssociationMixin<RecipeIngredient, RecipeIngredientId>;
    addRecipeIngredients!: Sequelize.HasManyAddAssociationsMixin<RecipeIngredient, RecipeIngredientId>;
    createRecipeIngredient!: Sequelize.HasManyCreateAssociationMixin<RecipeIngredient>;
    removeRecipeIngredient!: Sequelize.HasManyRemoveAssociationMixin<RecipeIngredient, RecipeIngredientId>;
    removeRecipeIngredients!: Sequelize.HasManyRemoveAssociationsMixin<RecipeIngredient, RecipeIngredientId>;
    hasRecipeIngredient!: Sequelize.HasManyHasAssociationMixin<RecipeIngredient, RecipeIngredientId>;
    hasRecipeIngredients!: Sequelize.HasManyHasAssociationsMixin<RecipeIngredient, RecipeIngredientId>;
    countRecipeIngredients!: Sequelize.HasManyCountAssociationsMixin;

    static initModel(sequelize: Sequelize.Sequelize): typeof Unit {
        return Unit.init({
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: 'units_name_key'
            },
            type: {
                type: DataTypes.STRING(20),
                allowNull: false,
                comment: 'Type of unit: volume, weight, or other'
            }
        }, {
            sequelize,
            tableName: 'units',
            schema: 'public',
            timestamps: false,
            indexes: [
                {
                    name: 'units_name_key',
                    unique: true,
                    fields: [
                        { name: 'name' },
                    ]
                },
                {
                    name: 'units_pkey',
                    unique: true,
                    fields: [
                        { name: 'id' },
                    ]
                },
            ]
        });
    }
}
