import { Scan, Sparkles } from "lucide-react";

interface ScanningLoaderProps {
  imageUrl?: string;
}

export const ScanningLoader = ({ imageUrl }: ScanningLoaderProps) => {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-card shadow-card">
      {/* Image preview with overlay */}
      {imageUrl && (
        <div className="relative aspect-[4/3] md:aspect-video">
          <img
            src={imageUrl}
            alt="Fridge contents"
            className="w-full h-full object-cover"
          />
          
          {/* Scanning overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-sage-500/30 via-transparent to-sage-500/30">
            {/* Scan line animation */}
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" 
                 style={{ top: '50%' }} />
          </div>
          
          {/* Corner brackets */}
          <div className="absolute inset-4">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br" />
          </div>
        </div>
      )}
      
      {/* Loading indicator */}
      <div className="p-6 flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg pulse-ring" />
          <div className="relative w-14 h-14 rounded-full bg-accent flex items-center justify-center">
            <Scan className="w-7 h-7 text-primary animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <h3 className="font-display text-lg font-semibold text-foreground">
              AI is identifying ingredients...
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            This usually takes a few seconds
          </p>
        </div>
        
        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
