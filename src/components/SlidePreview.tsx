import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScenePreviewProps {
  sceneNumber: number;
  thumbnail: string;
  duration: string;
  active?: boolean;
  onClick: () => void;
  format?: "16:9" | "9:16";
}

export function ScenePreview({
  sceneNumber,
  thumbnail,
  duration,
  active = false,
  onClick,
  format = "16:9",
}: ScenePreviewProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative w-full rounded-lg overflow-hidden border transition-all duration-200",
        active
          ? "border-primary ring-2 ring-primary/30 shadow-md"
          : "border-border hover:border-primary/50"
      )}
    >
      <div className={cn(
        "relative",
        format === "9:16" ? "aspect-[9/16]" : "aspect-video"
      )}>
        <img
          src={thumbnail}
          alt={`Scene ${sceneNumber}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        
        {/* Scene number */}
        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-background/80 backdrop-blur-sm">
          <span className="text-xs font-medium text-foreground">{sceneNumber}</span>
        </div>

        {/* Duration */}
        <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-background/80 backdrop-blur-sm">
          <span className="text-xs text-muted-foreground">{duration}</span>
        </div>
      </div>
    </motion.button>
  );
}
