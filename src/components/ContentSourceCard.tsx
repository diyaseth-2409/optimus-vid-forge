import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentSourceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  delay?: number;
  accentColor?: "primary" | "accent" | "success" | "warning";
}

const accentColors = {
  primary: "group-hover:text-primary group-hover:shadow-primary/20",
  accent: "group-hover:text-accent group-hover:shadow-accent/20",
  success: "group-hover:text-success group-hover:shadow-success/20",
  warning: "group-hover:text-warning group-hover:shadow-warning/20",
};

const iconBgColors = {
  primary: "group-hover:bg-primary/10",
  accent: "group-hover:bg-accent/10",
  success: "group-hover:bg-success/10",
  warning: "group-hover:bg-warning/10",
};

export function ContentSourceCard({
  icon: Icon,
  title,
  description,
  onClick,
  delay = 0,
  accentColor = "primary",
}: ContentSourceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <button
        onClick={onClick}
        className={cn(
          "group relative w-full p-6 rounded-xl border border-border bg-card",
          "hover:border-primary/50 hover:shadow-lg transition-all duration-300",
          "text-left focus:outline-none focus:ring-2 focus:ring-primary/50",
          accentColors[accentColor]
        )}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative flex items-start gap-4">
          <div
            className={cn(
              "flex-shrink-0 w-12 h-12 rounded-lg bg-secondary flex items-center justify-center",
              "transition-all duration-300",
              iconBgColors[accentColor]
            )}
          >
            <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-lg text-foreground mb-1">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>

          {/* Arrow indicator */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </button>
    </motion.div>
  );
}
