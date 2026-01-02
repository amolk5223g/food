import { RecipeHistory } from "@/components/RecipeHistory";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const History = () => {
    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-6xl mx-auto px-4 py-8">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Pantry
                </Link>
                <RecipeHistory />
            </div>
        </div>
    );
};

export default History;
