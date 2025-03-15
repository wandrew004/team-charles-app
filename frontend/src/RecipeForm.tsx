import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { TextField, Button, Container, Typography, Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Grid from "@mui/material/Grid2";

type RecipeFormData = {
    name: string;
    description: string;
    ingredients: { name: string; quantity: string; unit: string }[];
    steps: { stepNumber: number; stepText: string }[];
};

const API_ENDPOINT = "";

// handles form submission
const useSubmitRecipe = () => {
    return useMutation({
        mutationFn: async (data: RecipeFormData) => {
            const response = await fetch(API_ENDPOINT, {
                method: "POST",
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            return response.json();
        },
    });
};

const RecipeForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, control, reset } = useForm<RecipeFormData>({
        defaultValues: {
            name: "",
            description: "",
            ingredients: [],
            steps: [],
        },
    });

    const { fields: ingredientFields, append: addIngredient, remove: removeIngredient } = useFieldArray({ 
        control, 
        name: "ingredients" 
    });

    const { fields: stepFields, append: addStep, remove: removeStep } = useFieldArray({
        control,
        name: "steps",
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
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                Submit a Recipe
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Recipe Name */}
                <TextField
                    label="Recipe Name"
                    fullWidth
                    margin="normal"
                    {...register("name", { required: true })}
                />

                {/* Recipe Description */}
                <TextField
                    label="Recipe Description"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={2}
                    {...register("description")}
                />

                {/* Ingredients Section */}
                <Typography variant="h6" marginTop={3} gutterBottom >
                    Ingredients
                </Typography>
                {ingredientFields.map((ingredient, index) => (
                    <Grid container spacing={2} key={ingredient.id}>
                        <Grid size={4}>
                            <TextField
                                label="Ingredient Name"
                                fullWidth
                                {...register(`ingredients.${index}.name`)}
                            />
                        </Grid>
                        <Grid size={3}>
                            <TextField
                                label="Quantity"
                                fullWidth
                                {...register(`ingredients.${index}.quantity`)}
                            />
                        </Grid>
                        <Grid size={3}>
                            <TextField
                                label="Unit"
                                variant="outlined"
                                fullWidth
                                {...register(`ingredients.${index}.unit`)}
                            />
                        </Grid>
                        <Grid size={2}>
                            <IconButton onClick={() => removeIngredient(index)} color="error">
                                <RemoveIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}
                <Button
                    onClick={() => addIngredient({ name: "", quantity: "", unit: "" })}
                    startIcon={<AddIcon />}
                    color="primary"
                    sx={{ marginTop: 1 }}
                >
                    Add Ingredient
                </Button>

                {/* Steps Section */}
                <Typography variant="h6" marginTop={3} gutterBottom>
                    Steps
                </Typography>
                {stepFields.map((step, index) => (
                    <Grid container spacing={2} key={step.id}>
                        <Grid size={10}>
                            <TextField
                                label={`Step ${index + 1}`}
                                fullWidth
                                multiline
                                rows={2}
                                {...register(`steps.${index}.stepText`)}
                            />
                        </Grid>
                        <Grid size={2}>
                            <IconButton onClick={() => removeStep(index)} color="error">
                                <RemoveIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}
                <Button
                    onClick={() => addStep({ stepNumber: stepFields.length + 1, stepText: "" })}
                    startIcon={<AddIcon />}
                    color="primary"
                    sx={{ marginTop: 1 }}
                >
                    Add Step
                </Button>

                {/* Submit Button */}
                <Box mt={4}>
                    <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
                        {"Submit Recipe"}
                    </Button>
                </Box>
            </form>
        </Container>
    );
};

export default RecipeForm;
