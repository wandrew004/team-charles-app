import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Alert,
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
import { Link, useNavigate } from "react-router-dom";
import theme from "../../theme";

const BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST || "http://localhost:3001";
const INGREDIENTS_ENDPOINT = `${BACKEND_HOST}/ingredients`;
const OWNED_INGREDIENTS_ENDPOINT = `${BACKEND_HOST}/owned-ingredients`;

interface Ingredient {
  id: number;
  name: string;
  standardUnitUnit?: {
    id: number;
    name: string;
    type: string;
  };
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
      const res = await fetch(`${BACKEND_HOST}/units`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error("Failed to fetch units");
      return res.json();
    },
  });

const useIngredients = () =>
  useQuery<Ingredient[]>({
    queryKey: ["ingredients"],
    queryFn: async () => {
      const res = await fetch(INGREDIENTS_ENDPOINT, {
        credentials: 'include',
      });
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
        credentials: 'include',
        body: JSON.stringify({ name, description, standardUnit, density }),
      });
      if (!res.ok) throw new Error("Failed to create ingredient");
      return res.json();
    },
  });

const useSubmitOwnedIngredient = () =>
  useMutation({
    mutationFn: async (data: OwnedIngredientFormData) => {
      const res = await fetch(OWNED_INGREDIENTS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit owned ingredient");
      return res.json();
    },
  });

const PantryForm = () => {
  const { data: ingredients = [], isLoading } = useIngredients();
  const { data: units = [] } = useUnits();
  const { register, handleSubmit, reset, watch } = useForm<OwnedIngredientFormData>();
  const selectedIngredientId = watch("ingredientId");
  const selectedIngredient = ingredients.find(
    (ing) => ing.id === Number(selectedIngredientId)
  );
  const selectedUnit = selectedIngredient?.standardUnitUnit?.name;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addingNew, setAddingNew] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const createIngredient = useCreateIngredient();
  const submitOwnedIngredient = useSubmitOwnedIngredient();
  const navigate = useNavigate();

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
      setFeedback("Ingredient successfully added to pantry!");
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        setError(err.message);
      } else {
        console.error("Unknown error", err);
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mb={4} sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={() => navigate(-1)}>
          ← Back
        </Button>
        <Button variant="contained" component={Link} to="/pantry">
          Go to Pantry
        </Button>
      </Box>

      <Typography variant="h4" component="h1" gutterBottom>
        Add Ingredient to Pantry
      </Typography>

      {feedback && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {feedback}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
              label="Density (g/cm³)"
              type="number"
              fullWidth
              margin="normal"
              inputProps={{ step: "0.01" }}
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
          label={`Quantity${selectedUnit ? ` (${selectedUnit})` : ""}`}
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
