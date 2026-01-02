import { Clock, ChefHat, Flame, Check, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

export interface Recipe {
  title: string;
  cookTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
  servings: number;
  ingredients: string[];
  instructions: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
  onNewRecipe: () => void;
}

const difficultyColor = {
  Easy: "text-sage-500 bg-sage-100",
  Medium: "text-amber-600 bg-amber-100",
  Hard: "text-red-500 bg-red-100",
};

export const RecipeCard = ({ recipe, onNewRecipe }: RecipeCardProps) => {
  return (
    <div className="bg-card rounded-2xl shadow-card overflow-hidden animate-fade-up">
      {/* Header */}
      <div className="gradient-button p-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-sm mb-3">
          <Sparkles className="w-4 h-4" />
          AI Generated Recipe
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground">
          {recipe.title}
        </h2>
      </div>
      
      {/* Quick stats */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
            <Clock className="w-4 h-4" />
          </div>
          <p className="font-semibold text-foreground">{recipe.cookTime}</p>
          <p className="text-xs text-muted-foreground">Cook Time</p>
        </div>
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
            <Flame className="w-4 h-4" />
          </div>
          <p className={`font-semibold inline-block px-2 py-0.5 rounded-full text-sm ${difficultyColor[recipe.difficulty]}`}>
            {recipe.difficulty}
          </p>
          <p className="text-xs text-muted-foreground">Difficulty</p>
        </div>
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
            <ChefHat className="w-4 h-4" />
          </div>
          <p className="font-semibold text-foreground">{recipe.servings}</p>
          <p className="text-xs text-muted-foreground">Servings</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Ingredients */}
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-accent text-primary text-sm flex items-center justify-center">
              🥗
            </span>
            Ingredients
          </h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, i) => (
              <li key={i} className="flex items-start gap-3 text-foreground">
                <div className="w-5 h-5 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Instructions */}
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-accent text-primary text-sm flex items-center justify-center">
              📋
            </span>
            Instructions
          </h3>
          <ol className="space-y-4">
            {recipe.instructions.map((instruction, i) => (
              <li key={i} className="flex gap-4">
                <span className="w-7 h-7 rounded-full gradient-button text-primary-foreground text-sm font-semibold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-foreground pt-0.5">{instruction}</p>
              </li>
            ))}
          </ol>
        </div>
        
        {/* Action */}
        <Button
          variant="outline"
          size="lg"
          onClick={onNewRecipe}
          className="w-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Generate Another Recipe
        </Button>
      </div>
    </div>
  );
};
