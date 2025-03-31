import * as Sequelize from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import type { Recipe, RecipeId } from './recipe';
import type { Step, StepId } from './step';

export interface RecipeStepAttributes {
  recipeId: number;
  stepId: number;
}

export type RecipeStepPk = 'recipeId' | 'stepId';
export type RecipeStepId = RecipeStep[RecipeStepPk];
export type RecipeStepCreationAttributes = RecipeStepAttributes;

export class RecipeStep extends Model<RecipeStepAttributes, RecipeStepCreationAttributes> implements RecipeStepAttributes {
    recipeId!: number;
    stepId!: number;

    // RecipeStep belongsTo Recipe via recipeId
    recipe!: Recipe;
    getRecipe!: Sequelize.BelongsToGetAssociationMixin<Recipe>;
    setRecipe!: Sequelize.BelongsToSetAssociationMixin<Recipe, RecipeId>;
    createRecipe!: Sequelize.BelongsToCreateAssociationMixin<Recipe>;
    // RecipeStep belongsTo Step via stepId
    step!: Step;
    getStep!: Sequelize.BelongsToGetAssociationMixin<Step>;
    setStep!: Sequelize.BelongsToSetAssociationMixin<Step, StepId>;
    createStep!: Sequelize.BelongsToCreateAssociationMixin<Step>;

    static initModel(sequelize: Sequelize.Sequelize): typeof RecipeStep {
        return RecipeStep.init({
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
            stepId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'steps',
                    key: 'id'
                },
                field: 'step_id'
            }
        }, {
            sequelize,
            tableName: 'recipe_steps',
            schema: 'public',
            timestamps: false,
            indexes: [
                {
                    name: 'recipe_steps_pkey',
                    unique: true,
                    fields: [
                        { name: 'recipe_id' },
                        { name: 'step_id' },
                    ]
                },
            ]
        });
    }
}
