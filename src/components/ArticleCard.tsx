import { motion } from "framer-motion";
import { Clock, Tag, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  title: string;
  thumbnail: string;
  category: string;
  publishTime: string;
  description?: string;
  selected?: boolean;
  onClick: () => void;
  delay?: number;
}

export function ArticleCard({
  title,
  thumbnail,
  category,
  publishTime,
  description,
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
          "group relative w-full rounded-lg border overflow-hidden text-left flex gap-4 p-4",
          "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50",
          selected
            ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
            : "border-border bg-card hover:border-primary/50 hover:shadow-sm"
        )}
      >
        {/* Selection indicator */}
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 right-4 z-10 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
          >
            <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}

        {/* Small Thumbnail */}
        <div className="relative w-32 h-24 flex-shrink-0 rounded-md overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Content - Text Focused */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* Title with Redirection Icon */}
          <div className="flex items-start gap-2 mb-1.5">
            <h3 className="font-semibold text-base text-foreground flex-1 group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
            <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 opacity-70 group-hover:opacity-100 group-hover:text-primary transition-all" />
          </div>
          
          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {description}
            </p>
          )}
          
          {/* Metadata with Category inline */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{publishTime}</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10">
              <Tag className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium text-primary">{category}</span>
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  );
}
