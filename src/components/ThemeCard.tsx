import { motion } from "framer-motion";
import { Play, Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeCardProps {
  name: string;
  preview: string;
  format: "16:9" | "9:16";
  selected?: boolean;
  onClick: () => void;
  delay?: number;
}

export function ThemeCard({
  name,
  preview,
  format,
  selected = false,
  onClick,
  delay = 0,
}: ThemeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <button
        onClick={onClick}
        className={cn(
          "group relative w-full rounded-xl border overflow-hidden text-left",
          "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50",
          selected
            ? "border-primary ring-2 ring-primary/30 shadow-lg shadow-primary/20"
            : "border-border bg-card hover:border-primary/50"
        )}
      >
        {/* Preview */}
        <div className={cn(
          "relative overflow-hidden bg-gradient-to-br from-secondary to-card",
          format === "9:16" ? "aspect-[9/16] max-h-48" : "aspect-video"
        )}>
          <img
            src={preview}
            alt={name}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
          
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/40 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
              <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
            </div>
          </div>

          {/* Format badge */}
          <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm">
            {format === "9:16" ? (
              <Smartphone className="w-3 h-3 text-muted-foreground" />
            ) : (
              <Monitor className="w-3 h-3 text-muted-foreground" />
            )}
            <span className="text-xs font-medium text-muted-foreground">{format}</span>
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
      </button>
    </motion.div>
  );
}
