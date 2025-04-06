import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
import theme from "../../theme";

const BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST || "http://localhost:3001";
const INGREDIENTS_ENDPOINT = `${BACKEND_HOST}/ingredients`;
const OWNED_INGREDIENTS_ENDPOINT = `${BACKEND_HOST}/ownedIngredients`;

interface Ingredient {
  id: number;
  name: string;
}

interface OwnedIngredientFormData {
  ingredientId?: number;
  quantity: number;
  name?: string;
  description?: string;
  standardUnit?: string;
  density?: string;
}

interface Unit {
  id: number;
  name: string;
  type: string;
}

const useUnits = () =>
  useQuery<Unit[]>({
    queryKey: ["units"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_HOST || "http://localhost:3001"}/units`);
      if (!res.ok) throw new Error("Failed to fetch units");
      return res.json();
    },
  });

const useIngredients = () =>
  useQuery<Ingredient[]>({
    queryKey: ["ingredients"],
    queryFn: async () => {
      const res = await fetch(INGREDIENTS_ENDPOINT);
      if (!res.ok) throw new Error("Failed to fetch ingredients");
      return res.json();
    },
  });

const useCreateIngredient = () =>
  useMutation({
    mutationFn: async ({
      name,
      description,
      standardUnit,
      density,
    }: {
      name: string;
      description?: string;
      standardUnit?: string;
      density?: string;
    }) => {
      const res = await fetch(INGREDIENTS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, standardUnit, density }),
      });
      if (!res.ok) throw new Error("Failed to create ingredient");
      return res.json(); // should return new ingredient with id
    },
  });

const useSubmitOwnedIngredient = () =>
  useMutation({
    mutationFn: async (data: { ingredientId: number; quantity: number }) => {
      const res = await fetch(OWNED_INGREDIENTS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit owned ingredient");
      return res.json();
    },
  });

const PantryForm = () => {
  const { data: ingredients = [], isLoading, isError } = useIngredients();
  const { data: units = [], isLoading: unitsLoading } = useUnits();
  const { register, handleSubmit, reset, setValue, watch } = useForm<OwnedIngredientFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addingNew, setAddingNew] = useState(false);

  const createIngredient = useCreateIngredient();
  const submitOwnedIngredient = useSubmitOwnedIngredient();

  const onSubmit = async (data: OwnedIngredientFormData) => {
    setIsSubmitting(true);
    try {
      let ingredientId = data.ingredientId;

      if (addingNew && data.name) {
        const newIngredient = await createIngredient.mutateAsync({
          name: data.name,
          description: data.description,
          standardUnit: data.standardUnit,
          density: data.density,
        });
        ingredientId = newIngredient.id;
      }

      if (!ingredientId) throw new Error("No ingredient ID found");

      await submitOwnedIngredient.mutateAsync({
        ingredientId,
        quantity: data.quantity,
      });

      reset();
      setAddingNew(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mb={4}>
        <Button variant="contained" component={Link} to="/pantry">
          ← Back to Pantry
        </Button>
      </Box>

      <Typography variant="h4" component="h1" gutterBottom>
        Add Ingredient to Pantry
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControlLabel
          control={
            <Checkbox
              checked={addingNew}
              onChange={() => setAddingNew((prev) => !prev)}
            />
          }
          label="Add a New Ingredient"
        />

        {addingNew ? (
          <>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              {...register("name", { required: true })}
            />
            <TextField
              label="Description"
              fullWidth
              margin="normal"
              {...register("description")}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="unit-label">Standard Unit</InputLabel>
              <Select
                labelId="unit-label"
                defaultValue=""
                {...register("standardUnit", { required: true })}
              >
                {units.map((unit) => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.name} {unit.type && `(${unit.type})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Density"
              type="number"
              fullWidth
              margin="normal"
              {...register("density", { valueAsNumber: true, required: true })}
            />
          </>
        ) : (
          <FormControl fullWidth margin="normal">
            <InputLabel id="ingredient-select-label">Ingredient</InputLabel>
            <Select
              labelId="ingredient-select-label"
              defaultValue=""
              {...register("ingredientId", { required: true })}
            >
              {ingredients.map((ingredient) => (
                <MenuItem key={ingredient.id} value={ingredient.id}>
                  {ingredient.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <TextField
          label="Quantity"
          type="number"
          fullWidth
          margin="normal"
          {...register("quantity", { valueAsNumber: true, required: true })}
        />

        <Box mt={3}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? "Submitting..." : "Add to Pantry"}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

const FormPage = () => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-gray-100 px-8 py-12 font-sans">
        <PantryForm />
      </div>
    </ThemeProvider>
  </StyledEngineProvider>
);

export default FormPage;
