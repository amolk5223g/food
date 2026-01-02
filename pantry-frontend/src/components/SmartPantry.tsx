import { useState, useCallback } from "react";
import { Leaf, Sparkles, LogOut, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { UploadZone } from "./UploadZone";
import { ScanningLoader } from "./ScanningLoader";
import { PantryInventory } from "./PantryInventory";
import { RecipeCard, Recipe } from "./RecipeCard";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type AppState = "upload" | "scanning" | "inventory" | "generating" | "recipe";

const BACKEND_URL = "http://localhost:8000";

export const SmartPantry = () => {
  const { signOut } = useAuth();
  const [state, setState] = useState<AppState>("upload");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('pantry-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Use signed URL to ensure access even if bucket is private
      const { data, error: urlError } = await supabase.storage
        .from('pantry-images')
        .createSignedUrl(filePath, 60); // Valid for 60 seconds

      if (urlError) {
        throw urlError;
      }

      return data.signedUrl;
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image: " + error.message);
      return null;
    }
  };

  const handleUpload = useCallback(async (file: File) => {
    // Show local preview immediately
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setState("scanning");

    // 1. Upload to Supabase Storage
    const publicUrl = await uploadImageToSupabase(file);
    if (!publicUrl) {
      setState("upload");
      return;
    }

    // 2. Call Backend to Analyze
    try {
      const response = await fetch(`${BACKEND_URL}/analyze-fridge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_url: publicUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const data = await response.json();
      if (data.ingredients) {
        setIngredients(data.ingredients);
        setState("inventory");
      } else {
        toast.error("No ingredients found.");
        setState("upload");
      }
    } catch (error: any) {
      console.error("Backend error:", error);
      toast.error("Error analyzing image. Ensure backend is running.");
      setState("upload");
    }
  }, []);

  const handleRemoveIngredient = useCallback((ingredient: string) => {
    setIngredients((prev) => prev.filter((i) => i !== ingredient));
  }, []);

  const handleGenerateRecipe = useCallback(async () => {
    setState("generating");

    try {
      const response = await fetch(`${BACKEND_URL}/generate-recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate recipe");
      }

      const data = await response.json();
      // Map backend response to frontend Recipe type if necessary
      // Backend: title, time, difficulty, ingredients (list), instructions (list)
      // Frontend Recipe: title, cookTime, difficulty, servings (missing in backend), ingredients, instructions

      const newRecipe: Recipe = {
        title: data.title,
        cookTime: data.time || "Unknown",
        difficulty: data.difficulty || "Medium",
        servings: 2, // Default or need backend update
        ingredients: data.ingredients || [],
        instructions: data.instructions || [],
      };

      setRecipe(newRecipe);
      setState("recipe");
    } catch (error: any) {
      console.error("Recipe generation error:", error);
      toast.error("Failed to generate recipe.");
      setState("inventory");
    }
  }, [ingredients]);

  const handleReset = useCallback(() => {
    setState("upload");
    setImageUrl("");
    setIngredients([]);
    setRecipe(null);
  }, []);

  const handleNewRecipe = useCallback(() => {
    setState("inventory");
    setRecipe(null);
  }, []);

  return (
    <div className="min-h-screen gradient-hero relative">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Link to="/history">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Clock className="w-4 h-4 mr-2" />
            History
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => signOut()}
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      <div className="container max-w-lg mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/80 backdrop-blur-sm text-accent-foreground text-sm font-medium mb-4">
            <Leaf className="w-4 h-4" />
            AI-Powered
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            Smart Pantry
          </h1>

          <p className="text-lg text-muted-foreground max-w-sm mx-auto">
            Snap a photo of your fridge.
            <br />
            <span className="text-primary font-medium">Cook something delicious.</span>
          </p>
        </header>

        {/* Main content area */}
        <main className="space-y-8">
          {state === "upload" && <UploadZone onUpload={handleUpload} />}

          {state === "scanning" && <ScanningLoader imageUrl={imageUrl} />}

          {(state === "inventory" || state === "generating") && (
            <PantryInventory
              ingredients={ingredients}
              onRemoveIngredient={handleRemoveIngredient}
              onGenerateRecipe={handleGenerateRecipe}
              onReset={handleReset}
              isGenerating={state === "generating"}
            />
          )}

          {state === "recipe" && recipe && (
            <RecipeCard recipe={recipe} onNewRecipe={handleNewRecipe} />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
            Made with <Sparkles className="w-4 h-4 text-primary" /> by Smart Pantry AI
          </p>
        </footer>
      </div>
    </div>
  );
};
