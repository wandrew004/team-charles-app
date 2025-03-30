import type { Sequelize } from "sequelize";
import { databaseversion as _databaseversion } from "./databaseversion";
import type { databaseversionAttributes, databaseversionCreationAttributes } from "./databaseversion";
import { ingredients as _ingredients } from "./ingredients";
import type { ingredientsAttributes, ingredientsCreationAttributes } from "./ingredients";
import { ownedingredients as _ownedingredients } from "./ownedingredients";
import type { ownedingredientsAttributes, ownedingredientsCreationAttributes } from "./ownedingredients";
import { recipeingredients as _recipeingredients } from "./recipeingredients";
import type { recipeingredientsAttributes, recipeingredientsCreationAttributes } from "./recipeingredients";
import { recipes as _recipes } from "./recipes";
import type { recipesAttributes, recipesCreationAttributes } from "./recipes";
import { recipesteps as _recipesteps } from "./recipesteps";
import type { recipestepsAttributes, recipestepsCreationAttributes } from "./recipesteps";
import { steps as _steps } from "./steps";
import type { stepsAttributes, stepsCreationAttributes } from "./steps";
import { units as _units } from "./units";
import type { unitsAttributes, unitsCreationAttributes } from "./units";

export {
  _databaseversion as databaseversion,
  _ingredients as ingredients,
  _ownedingredients as ownedingredients,
  _recipeingredients as recipeingredients,
  _recipes as recipes,
  _recipesteps as recipesteps,
  _steps as steps,
  _units as units,
};

export type {
  databaseversionAttributes,
  databaseversionCreationAttributes,
  ingredientsAttributes,
  ingredientsCreationAttributes,
  ownedingredientsAttributes,
  ownedingredientsCreationAttributes,
  recipeingredientsAttributes,
  recipeingredientsCreationAttributes,
  recipesAttributes,
  recipesCreationAttributes,
  recipestepsAttributes,
  recipestepsCreationAttributes,
  stepsAttributes,
  stepsCreationAttributes,
  unitsAttributes,
  unitsCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const databaseversion = _databaseversion.initModel(sequelize);
  const ingredients = _ingredients.initModel(sequelize);
  const ownedingredients = _ownedingredients.initModel(sequelize);
  const recipeingredients = _recipeingredients.initModel(sequelize);
  const recipes = _recipes.initModel(sequelize);
  const recipesteps = _recipesteps.initModel(sequelize);
  const steps = _steps.initModel(sequelize);
  const units = _units.initModel(sequelize);

  ingredients.belongsToMany(recipes, { as: 'recipeid_recipes', through: recipeingredients, foreignKey: "ingredientid", otherKey: "recipeid" });
  recipes.belongsToMany(ingredients, { as: 'ingredientid_ingredients', through: recipeingredients, foreignKey: "recipeid", otherKey: "ingredientid" });
  recipes.belongsToMany(steps, { as: 'stepid_steps', through: recipesteps, foreignKey: "recipeid", otherKey: "stepid" });
  steps.belongsToMany(recipes, { as: 'recipeid_recipes_recipesteps', through: recipesteps, foreignKey: "stepid", otherKey: "recipeid" });
  ownedingredients.belongsTo(ingredients, { as: "ingredient", foreignKey: "ingredientid"});
  ingredients.hasOne(ownedingredients, { as: "ownedingredient", foreignKey: "ingredientid"});
  recipeingredients.belongsTo(ingredients, { as: "ingredient", foreignKey: "ingredientid"});
  ingredients.hasMany(recipeingredients, { as: "recipeingredients", foreignKey: "ingredientid"});
  recipeingredients.belongsTo(recipes, { as: "recipe", foreignKey: "recipeid"});
  recipes.hasMany(recipeingredients, { as: "recipeingredients", foreignKey: "recipeid"});
  recipesteps.belongsTo(recipes, { as: "recipe", foreignKey: "recipeid"});
  recipes.hasMany(recipesteps, { as: "recipesteps", foreignKey: "recipeid"});
  recipesteps.belongsTo(steps, { as: "step", foreignKey: "stepid"});
  steps.hasMany(recipesteps, { as: "recipesteps", foreignKey: "stepid"});
  ingredients.belongsTo(units, { as: "standard_unit_unit", foreignKey: "standard_unit"});
  units.hasMany(ingredients, { as: "ingredients", foreignKey: "standard_unit"});
  recipeingredients.belongsTo(units, { as: "unit", foreignKey: "unitid"});
  units.hasMany(recipeingredients, { as: "recipeingredients", foreignKey: "unitid"});

  return {
    databaseversion: databaseversion,
    ingredients: ingredients,
    ownedingredients: ownedingredients,
    recipeingredients: recipeingredients,
    recipes: recipes,
    recipesteps: recipesteps,
    steps: steps,
    units: units,
  };
}
