import { useEffect, useState } from "react";
import { Clock, ChefHat } from "lucide-react";
import { type Recipe } from "./RecipeCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface HistoryRecipe extends Recipe {
    id: number;
    created_at: string;
}

export const RecipeHistory = () => {
    const [history, setHistory] = useState<HistoryRecipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await fetch("http://localhost:8000/history", {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error("Failed to fetch history");
            const data = await response.json();

            // Adapt backend data to frontend Recipe type
            // Backend returns: { title, cooking_time, difficulty, ingredients_used, instructions, created_at }
            const adaptedData = data.map((item: any) => ({
                id: item.id,
                title: item.title,
                cookTime: item.cooking_time,
                difficulty: item.difficulty,
                servings: 2, // Default
                ingredients: item.ingredients_used || [],
                instructions: item.instructions || [],
                created_at: item.created_at
            }));

            setHistory(adaptedData);
        } catch (error) {
            console.error("History fetch error:", error);
            toast.error("Could not load recipe history");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <ChefHat className="w-12 h-12 text-muted-foreground/50" />
                    <p className="text-muted-foreground">Loading your culinary journey...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <Clock className="w-8 h-8 text-primary" />
                <h2 className="font-display text-3xl font-bold text-foreground">Recipe History</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {history.map((recipe) => (
                    <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                        <CardHeader className="bg-muted/50 pb-4">
                            <CardTitle className="font-display text-xl line-clamp-2">{recipe.title}</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                                <Clock className="w-4 h-4" />
                                <span>{new Date(recipe.created_at).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{recipe.cookTime}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Ingredients</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {recipe.ingredients.slice(0, 5).map((ing, i) => (
                                            <span key={i} className="text-xs bg-secondary/50 px-2 py-1 rounded-md">
                                                {ing}
                                            </span>
                                        ))}
                                        {recipe.ingredients.length > 5 && (
                                            <span className="text-xs text-muted-foreground self-center">
                                                +{recipe.ingredients.length - 5} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {history.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <ChefHat className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No recipes generated yet. Start cooking!</p>
                </div>
            )}
        </div>
    );
};
