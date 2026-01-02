import { Package, RefreshCw } from "lucide-react";
import { IngredientBadge } from "./IngredientBadge";
import { Button } from "./ui/button";

interface PantryInventoryProps {
  ingredients: string[];
  onRemoveIngredient: (ingredient: string) => void;
  onGenerateRecipe: () => void;
  onReset: () => void;
  isGenerating: boolean;
}

export const PantryInventory = ({
  ingredients,
  onRemoveIngredient,
  onGenerateRecipe,
  onReset,
  isGenerating,
}: PantryInventoryProps) => {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">
              Pantry Inventory
            </h2>
            <p className="text-sm text-muted-foreground">
              {ingredients.length} items found
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Scan Again
        </Button>
      </div>
      
      {/* Ingredients grid */}
      <div className="flex flex-wrap gap-2">
        {ingredients.map((ingredient) => (
          <IngredientBadge
            key={ingredient}
            ingredient={ingredient}
            onRemove={() => onRemoveIngredient(ingredient)}
          />
        ))}
      </div>
      
      {/* Tip */}
      <p className="text-sm text-muted-foreground italic">
        💡 Tap the X to remove any incorrectly identified items
      </p>
      
      {/* Generate button */}
      <Button
        variant="hero"
        size="xl"
        onClick={onGenerateRecipe}
        disabled={ingredients.length === 0 || isGenerating}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Chef AI is cooking up an idea...
          </>
        ) : (
          <>
            ✨ Generate Recipe
          </>
        )}
      </Button>
    </div>
  );
};
