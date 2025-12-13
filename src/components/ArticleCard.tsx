import { motion } from "framer-motion";
import { Clock, Tag, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  title: string;
  thumbnail: string;
  category: string;
  publishTime: string;
  selected?: boolean;
  onClick: () => void;
  delay?: number;
}

export function ArticleCard({
  title,
  thumbnail,
  category,
  publishTime,
  selected = false,
  onClick,
  delay = 0,
}: ArticleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <button
        onClick={onClick}
        className={cn(
          "group relative w-full rounded-xl border overflow-hidden text-left",
          "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50",
          selected
            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
            : "border-border bg-card hover:border-primary/50 hover:shadow-md"
        )}
      >
        {/* Selection indicator */}
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
          >
            <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}

        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
          
          {/* Category badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/90 backdrop-blur-sm">
            <Tag className="w-3 h-3 text-primary-foreground" />
            <span className="text-xs font-medium text-primary-foreground">{category}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{publishTime}</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </button>
    </motion.div>
  );
}
