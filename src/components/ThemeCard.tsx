import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ThemeCardProps {
  name: string;
  preview: string;
  format: "16:9" | "9:16";
  selected?: boolean;
  onClick: () => void;
  delay?: number;
  category?: string;
}

export function ThemeCard({
  name,
  preview,
  format,
  selected = false,
  onClick,
  delay = 0,
  category,
}: ThemeCardProps) {
  const [showPreview, setShowPreview] = useState(false);

  // Dummy scenes for preview
  const dummyScenes = [
    { id: 1, title: "Scene 1", content: "Introduction to the topic" },
    { id: 2, title: "Scene 2", content: "Key points and highlights" },
    { id: 3, title: "Scene 3", content: "Detailed information" },
    { id: 4, title: "Scene 4", content: "Supporting data and facts" },
    { id: 5, title: "Scene 5", content: "Conclusion and summary" },
  ];

  const renderSceneContent = (scene: typeof dummyScenes[0], index: number) => {
    if (format === "9:16") {
      // Vertical format with gradient/visual on left 2/3 and white space on right 1/3
      return (
        <div className="h-full flex">
          <div className="w-2/3 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 relative overflow-hidden">
            {/* Decorative elements to make it look like a template preview */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Eye className="w-8 h-8 text-white/80" />
              </div>
            </div>
            {/* Optional: Add some abstract shapes */}
            <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-white/10 blur-xl"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-white/10 blur-xl"></div>
          </div>
          <div className="w-1/3 bg-white"></div>
        </div>
      );
    } else {
      // Horizontal format - centered with gradient background
      return (
        <div className="h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-2 left-2 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute bottom-2 right-2 w-20 h-20 rounded-full bg-white/10 blur-xl"></div>
          <div className="relative z-10">
            <h3 className="text-base font-semibold mb-1 text-white">{scene.title}</h3>
            <p className="text-xs text-white/90 text-center">{scene.content}</p>
            <div className="mt-2 text-[10px] text-white/80">
              {index + 1} / {dummyScenes.length}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div
          onClick={onClick}
          className={cn(
            "group relative w-full rounded-xl border overflow-hidden text-left cursor-pointer",
            "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50",
            selected
              ? "border-primary ring-2 ring-primary/30 shadow-lg shadow-primary/20"
              : "border-border bg-card hover:border-primary/50"
          )}
        >
          {/* Preview */}
          <div 
            className={cn(
              "relative overflow-hidden flex items-center justify-center",
              format === "9:16" ? "aspect-[9/16] bg-white" : "aspect-video bg-gradient-to-br from-secondary to-card"
            )}
          >
            <img
              src={preview}
              alt={name}
              className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity object-cover object-center"
            />
            {/* Category label - appears at top right of thumbnail (only show if not "All") */}
            {category && category !== "All" && (
              <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-1.5 py-0.5 rounded z-30 pointer-events-none">
                <p className="text-[10px] text-foreground font-medium">{category}</p>
              </div>
            )}
            {/* Eye icon button - only shows preview, doesn't select */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background/40 backdrop-blur-sm flex items-center justify-center pointer-events-none z-10"
            >
              <button
                className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center hover:bg-primary transition-colors shrink-0 cursor-pointer focus:outline-none pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowPreview(true);
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
              >
                <Eye className="w-5 h-5 text-primary-foreground" />
              </button>
            </div>
          </div>

          {/* Name */}
          <div className="p-3 border-t border-border">
            <h4 className="font-medium text-sm text-foreground text-center">{name}</h4>
          </div>

          {/* Selection indicator */}
          {selected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 left-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg"
            >
              <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
        </div>
    </motion.div>

    {/* Preview Dialog */}
    <Dialog open={showPreview} onOpenChange={setShowPreview}>
      <DialogContent className={cn(
        "max-h-[90vh] overflow-hidden",
        format === "9:16" ? "max-w-6xl" : "max-w-5xl"
      )}>
        <DialogHeader>
          <DialogTitle>{name} - Template Preview</DialogTitle>
        </DialogHeader>
        <div className={cn(
          "mt-4 gap-3 overflow-y-auto max-h-[calc(90vh-120px)]",
          format === "9:16" 
            ? "grid grid-cols-5 auto-rows-max" 
            : "grid grid-cols-3"
        )}>
          {dummyScenes.map((scene, index) => (
            <div
              key={scene.id}
              className="relative rounded-lg border border-border overflow-hidden group w-full"
            >
              {/* Thumbnail with image */}
              <div 
                className={cn(
                  "relative overflow-hidden flex items-center justify-center w-full",
                  format === "9:16" ? "aspect-[9/16] bg-white" : "aspect-video bg-gradient-to-br from-secondary to-card"
                )}
                style={format === "9:16" ? { aspectRatio: "9/16" } : undefined}
              >
                <img
                  src={preview}
                  alt={scene.title}
                  className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity object-cover object-center"
                />
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
