import React from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <Typography variant="h4" className="text-green-900 font-bold">
          Hi, User!
        </Typography>
        <div className="flex flex-wrap gap-4">
          <Link to="/add-recipe">
            <Button variant="contained" className="bg-green-700 text-yellow-300">
              add recipe
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="contained" className="bg-green-700 text-yellow-300">
              see profile
            </Button>
          </Link>
          <Link to="/add-ingredient">
            <Button variant="contained" className="bg-green-700 text-yellow-300">
              add ingredient
            </Button>
          </Link>
          <Link to="/ingredients">
            <Button variant="contained" className="bg-green-700 text-yellow-300">
              see ingredients
            </Button>
          </Link>
        </div>
      </div>

      {/* Your Recipes */}
      <div>
        <Typography variant="h6" className="text-green-800 mb-2">
          your recipes
        </Typography>
        <div className="flex flex-wrap gap-4">
          {[1, 2, 3].map((id, i) => (
            <Card key={i} className="bg-green-100 w-64">
              <CardContent>
                <Typography variant="subtitle1" className="font-semibold">
                  {id === 2 ? "Oven Baked Salmon" : "My Brownie Recipe"}
                </Typography>
                <Typography
                  className={
                    id === 2 ? "text-green-600" : "text-red-600"
                  }
                  variant="body2"
                >
                  {id === 2 ? "all ingredients present" : "dont have all ingredients!"}
                </Typography>
              </CardContent>
            </Card>
          ))}
          <Button variant="outlined" className="self-center">
            + see more
          </Button>
        </div>
      </div>

      {/* Your Pantry */}
      <div>
        <Typography variant="h6" className="text-green-800 mb-2">
          your pantry
        </Typography>
        <div className="flex flex-wrap gap-4">
          {["meat and poultry", "produce", "seasoning"].map((category, i) => (
            <Card key={i} className="bg-green-100 w-64">
              <CardContent>
                <Typography variant="subtitle1" className="text-green-900">
                  {category} →
                </Typography>
              </CardContent>
            </Card>
          ))}
          <Button variant="outlined" className="self-center">
            + see more
          </Button>
        </div>
      </div>

      {/* Friends Recipes */}
      <div>
        <Typography variant="h6" className="text-gray-400 mb-2">
          friends recipes
        </Typography>
        <div className="flex flex-wrap gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-gray-300 w-64 h-24" />
          ))}
          <Button variant="outlined" className="self-center" disabled>
            + see more
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
