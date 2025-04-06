import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
} from "@mui/material";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
import theme from "../../theme";

type RecipeFormData = {
  name: string;
  description: string;
  standardUnit: string;
  density: string;
  quantity: number;
};

const API_ENDPOINT = `${import.meta.env.VITE_BACKEND_HOST || 'http://localhost:3001'}/ingredients`;

const useSubmitRecipe = () => {
  return useMutation({
    mutationFn: async (data: RecipeFormData) => {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
};

const PantryForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<RecipeFormData>({
    defaultValues: {
      name: "",
      description: "",
      standardUnit: "",
      density: "",
      quantity: 0,
    },
  });

  const mutation = useSubmitRecipe();

  const onSubmit = async (data: RecipeFormData) => {
    setIsSubmitting(true);
    mutation.mutate(data, {
      onSuccess: () => {
        reset();
      },
      onError: (error) => {
        console.error("Error submitting recipe:", error);
      },
      onSettled: () => {
        setIsSubmitting(false);
      },
    });
  };

  return (
    
    <Container maxWidth="md">
      {/* Back Button */}
      <Box mb={4}>
        <Button
          variant="contained"
          color="primary"
          className="!text-lg py-2 px-4"
          component={Link}
          to="/pantry"
        >
          ← Back to Pantry
        </Button>
      </Box>

      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        textAlign="center"
        className="text-[#7B8A64]"
      >
        Submit a Ingredient
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Ingredient Name"
          fullWidth
          margin="normal"
          {...register("name", { required: true })}
        />

        <TextField
          label="Ingredient Description"
          fullWidth
          margin="normal"
          multiline
          rows={2}
          {...register("description")}
        />

        <TextField
          label="Units"
          fullWidth
          margin="normal"
          multiline
          rows={2}
          {...register("standardUnit")}
        />

        <TextField
          label="Density"
          fullWidth
          margin="normal"
          multiline
          rows={2}
          {...register("density")}
        />

        <TextField
          label="Quantity"
          type="number"
          fullWidth
          margin="normal"
          {...register("quantity", { valueAsNumber: true })}
        />

        <Box mt={4}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
          >
            Submit Recipe
          </Button>
        </Box>
      </form>
    </Container>
  );
};

const FormPage = () => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <div className="min-h-screen bg-gray-100 px-8 py-12 font-sans">
          <PantryForm />
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default FormPage;
