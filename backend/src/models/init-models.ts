import type { Sequelize } from "sequelize";
import { databaseversion as _databaseversion } from "./databaseversion";
import type { databaseversionAttributes, databaseversionCreationAttributes } from "./databaseversion";
import { ingredient as _ingredient } from "./ingredient";
import type { ingredientAttributes, ingredientCreationAttributes } from "./ingredient";
import { ownedingredient as _ownedingredient } from "./ownedingredient";
import type { ownedingredientAttributes, ownedingredientCreationAttributes } from "./ownedingredient";
import { recipeingredient as _recipeingredient } from "./recipeingredient";
import type { recipeingredientAttributes, recipeingredientCreationAttributes } from "./recipeingredient";
import { recipe as _recipe } from "./recipe";
import type { recipeAttributes, recipeCreationAttributes } from "./recipe";
import { recipestep as _recipestep } from "./recipestep";
import type { recipestepAttributes, recipestepCreationAttributes } from "./recipestep";
import { step as _step } from "./step";
import type { stepAttributes, stepCreationAttributes } from "./step";
import { unit as _unit } from "./unit";
import type { unitAttributes, unitCreationAttributes } from "./unit";

export {
  _databaseversion as databaseversion,
  _ingredient as ingredient,
  _ownedingredient as ownedingredient,
  _recipeingredient as recipeingredient,
  _recipe as recipe,
  _recipestep as recipestep,
  _step as step,
  _unit as unit,
};

export type {
  databaseversionAttributes,
  databaseversionCreationAttributes,
  ingredientAttributes,
  ingredientCreationAttributes,
  ownedingredientAttributes,
  ownedingredientCreationAttributes,
  recipeingredientAttributes,
  recipeingredientCreationAttributes,
  recipeAttributes,
  recipeCreationAttributes,
  recipestepAttributes,
  recipestepCreationAttributes,
  stepAttributes,
  stepCreationAttributes,
  unitAttributes,
  unitCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const databaseversion = _databaseversion.initModel(sequelize);
  const ingredient = _ingredient.initModel(sequelize);
  const ownedingredient = _ownedingredient.initModel(sequelize);
  const recipeingredient = _recipeingredient.initModel(sequelize);
  const recipe = _recipe.initModel(sequelize);
  const recipestep = _recipestep.initModel(sequelize);
  const step = _step.initModel(sequelize);
  const unit = _unit.initModel(sequelize);

  ingredient.belongsToMany(recipe, { as: 'recipeid_recipes', through: recipeingredient, foreignKey: "ingredientid", otherKey: "recipeid" });
  recipe.belongsToMany(ingredient, { as: 'ingredientid_ingredients', through: recipeingredient, foreignKey: "recipeid", otherKey: "ingredientid" });
  recipe.belongsToMany(step, { as: 'stepid_steps', through: recipestep, foreignKey: "recipeid", otherKey: "stepid" });
  step.belongsToMany(recipe, { as: 'recipeid_recipes_recipesteps', through: recipestep, foreignKey: "stepid", otherKey: "recipeid" });
  ownedingredient.belongsTo(ingredient, { as: "ingredient", foreignKey: "ingredientid"});
  ingredient.hasOne(ownedingredient, { as: "ownedingredient", foreignKey: "ingredientid"});
  recipeingredient.belongsTo(ingredient, { as: "ingredient", foreignKey: "ingredientid"});
  ingredient.hasMany(recipeingredient, { as: "recipeingredients", foreignKey: "ingredientid"});
  recipeingredient.belongsTo(recipe, { as: "recipe", foreignKey: "recipeid"});
  recipe.hasMany(recipeingredient, { as: "recipeingredients", foreignKey: "recipeid"});
  recipestep.belongsTo(recipe, { as: "recipe", foreignKey: "recipeid"});
  recipe.hasMany(recipestep, { as: "recipesteps", foreignKey: "recipeid"});
  recipestep.belongsTo(step, { as: "step", foreignKey: "stepid"});
  step.hasMany(recipestep, { as: "recipesteps", foreignKey: "stepid"});
  ingredient.belongsTo(unit, { as: "standard_unit_unit", foreignKey: "standard_unit"});
  unit.hasMany(ingredient, { as: "ingredients", foreignKey: "standard_unit"});
  recipeingredient.belongsTo(unit, { as: "unit", foreignKey: "unitid"});
  unit.hasMany(recipeingredient, { as: "recipeingredients", foreignKey: "unitid"});

  return {
    databaseversion: databaseversion,
    ingredient: ingredient,
    ownedingredient: ownedingredient,
    recipeingredient: recipeingredient,
    recipe: recipe,
    recipestep: recipestep,
    step: step,
    unit: unit,
  };
}
