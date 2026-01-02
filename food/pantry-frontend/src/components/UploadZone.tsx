import { Camera, Upload, Image } from "lucide-react";
import { useCallback } from "react";

interface UploadZoneProps {
  onUpload: (file: File) => void;
}

export const UploadZone = ({ onUpload }: UploadZoneProps) => {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onUpload(file);
      }
    },
    [onUpload]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onUpload(file);
      }
    },
    [onUpload]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="relative group"
    >
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      
      {/* Main upload area */}
      <div className="relative border-2 border-dashed border-sage-300 rounded-2xl p-8 md:p-12 bg-card/50 backdrop-blur-sm transition-all duration-300 group-hover:border-primary group-hover:bg-accent/50 group-hover:shadow-soft">
        {/* Decorative corners */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-sage-400 rounded-tl-lg opacity-60" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-sage-400 rounded-tr-lg opacity-60" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-sage-400 rounded-bl-lg opacity-60" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-sage-400 rounded-br-lg opacity-60" />
        
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Icon container with animation */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-20 h-20 rounded-full bg-accent flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Camera className="w-10 h-10 text-primary transition-all duration-300 group-hover:scale-110" />
            </div>
          </div>
          
          {/* Text content */}
          <div className="space-y-2">
            <h3 className="font-display text-xl font-semibold text-foreground">
              Snap Your Fridge
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Take a photo or drag & drop an image of your fridge contents
            </p>
          </div>
          
          {/* Action hints */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Camera className="w-4 h-4" />
              Camera
            </span>
            <span className="text-sage-300">•</span>
            <span className="flex items-center gap-1.5">
              <Upload className="w-4 h-4" />
              Upload
            </span>
            <span className="text-sage-300">•</span>
            <span className="flex items-center gap-1.5">
              <Image className="w-4 h-4" />
              Gallery
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
