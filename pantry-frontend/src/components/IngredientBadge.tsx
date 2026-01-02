import { X } from "lucide-react";

interface IngredientBadgeProps {
  ingredient: string;
  onRemove: () => void;
}

export const IngredientBadge = ({ ingredient, onRemove }: IngredientBadgeProps) => {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-sage-200 text-accent-foreground font-medium text-sm transition-all duration-200 hover:shadow-soft hover:border-primary/50 animate-fade-up">
      <span>{ingredient}</span>
      <button
        onClick={onRemove}
        className="w-5 h-5 rounded-full bg-sage-200 hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition-all duration-200"
        aria-label={`Remove ${ingredient}`}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};
