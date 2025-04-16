import type { Sequelize } from "sequelize";
import { DatabaseVersion as _DatabaseVersion } from "./databaseVersion";
import type { DatabaseVersionAttributes, DatabaseVersionCreationAttributes } from "./databaseVersion";
import { Ingredient as _Ingredient } from "./ingredient";
import type { IngredientAttributes, IngredientCreationAttributes } from "./ingredient";
import { OwnedIngredient as _OwnedIngredient } from "./ownedIngredient";
import type { OwnedIngredientAttributes, OwnedIngredientCreationAttributes } from "./ownedIngredient";
import { RecipeIngredient as _RecipeIngredient } from "./recipeIngredient";
import type { RecipeIngredientAttributes, RecipeIngredientCreationAttributes } from "./recipeIngredient";
import { RecipeStep as _RecipeStep } from "./recipeStep";
import type { RecipeStepAttributes, RecipeStepCreationAttributes } from "./recipeStep";
import { Recipe as _Recipe } from "./recipe";
import type { RecipeAttributes, RecipeCreationAttributes } from "./recipe";
import { Step as _Step } from "./step";
import type { StepAttributes, StepCreationAttributes } from "./step";
import { Unit as _Unit } from "./unit";
import type { UnitAttributes, UnitCreationAttributes } from "./unit";
import { User as _User } from "./user";
import type { UserAttributes, UserCreationAttributes } from "./user";

export {
  _DatabaseVersion as DatabaseVersion,
  _Ingredient as Ingredient,
  _OwnedIngredient as OwnedIngredient,
  _RecipeIngredient as RecipeIngredient,
  _RecipeStep as RecipeStep,
  _Recipe as Recipe,
  _Step as Step,
  _Unit as Unit,
  _User as User,
};

export type {
  DatabaseVersionAttributes,
  DatabaseVersionCreationAttributes,
  IngredientAttributes,
  IngredientCreationAttributes,
  OwnedIngredientAttributes,
  OwnedIngredientCreationAttributes,
  RecipeIngredientAttributes,
  RecipeIngredientCreationAttributes,
  RecipeStepAttributes,
  RecipeStepCreationAttributes,
  RecipeAttributes,
  RecipeCreationAttributes,
  StepAttributes,
  StepCreationAttributes,
  UnitAttributes,
  UnitCreationAttributes,
  UserAttributes,
  UserCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const DatabaseVersion = _DatabaseVersion.initModel(sequelize);
  const Ingredient = _Ingredient.initModel(sequelize);
  const OwnedIngredient = _OwnedIngredient.initModel(sequelize);
  const RecipeIngredient = _RecipeIngredient.initModel(sequelize);
  const RecipeStep = _RecipeStep.initModel(sequelize);
  const Recipe = _Recipe.initModel(sequelize);
  const Step = _Step.initModel(sequelize);
  const Unit = _Unit.initModel(sequelize);
  const User = _User.initModel(sequelize);

  Ingredient.belongsToMany(Recipe, { as: 'recipeIdRecipes', through: RecipeIngredient, foreignKey: "ingredientId", otherKey: "recipeId" });
  Recipe.belongsToMany(Ingredient, { as: 'ingredientIdIngredients', through: RecipeIngredient, foreignKey: "recipeId", otherKey: "ingredientId" });
  Recipe.belongsToMany(Step, { as: 'stepIdSteps', through: RecipeStep, foreignKey: "recipeId", otherKey: "stepId" });
  Step.belongsToMany(Recipe, { as: 'recipeIdRecipesRecipeSteps', through: RecipeStep, foreignKey: "stepId", otherKey: "recipeId" });
  OwnedIngredient.belongsTo(Ingredient, { as: "ingredient", foreignKey: "ingredientId"});
  Ingredient.hasOne(OwnedIngredient, { as: "ownedIngredient", foreignKey: "ingredientId"});
  RecipeIngredient.belongsTo(Ingredient, { as: "ingredient", foreignKey: "ingredientId"});
  Ingredient.hasMany(RecipeIngredient, { as: "recipeIngredients", foreignKey: "ingredientId"});
  RecipeIngredient.belongsTo(Recipe, { as: "recipe", foreignKey: "recipeId"});
  Recipe.hasMany(RecipeIngredient, { as: "recipeIngredients", foreignKey: "recipeId"});
  RecipeStep.belongsTo(Recipe, { as: "recipe", foreignKey: "recipeId"});
  Recipe.hasMany(RecipeStep, { as: "recipeSteps", foreignKey: "recipeId"});
  RecipeStep.belongsTo(Step, { as: "step", foreignKey: "stepId"});
  Step.hasMany(RecipeStep, { as: "recipeSteps", foreignKey: "stepId"});
  Ingredient.belongsTo(Unit, { as: "standardUnitUnit", foreignKey: "standardUnit"});
  Unit.hasMany(Ingredient, { as: "ingredients", foreignKey: "standardUnit"});
  RecipeIngredient.belongsTo(Unit, { as: "unit", foreignKey: "unitId"});
  Unit.hasMany(RecipeIngredient, { as: "recipeIngredients", foreignKey: "unitId"});
  OwnedIngredient.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(OwnedIngredient, { as: "ownedIngredients", foreignKey: "userId"});
  Recipe.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(Recipe, { as: "recipes", foreignKey: "userId"});

  return {
    DatabaseVersion: DatabaseVersion,
    Ingredient: Ingredient,
    OwnedIngredient: OwnedIngredient,
    RecipeIngredient: RecipeIngredient,
    RecipeStep: RecipeStep,
    Recipe: Recipe,
    Step: Step,
    Unit: Unit,
    User: User,
  };
}
