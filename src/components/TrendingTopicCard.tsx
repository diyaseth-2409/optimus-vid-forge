import { motion } from "framer-motion";
import { TrendingUp, Twitter, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendingTopicCardProps {
  topic: string;
  description: string;
  source: "twitter" | "google";
  hashtag?: string | null;
  engagement?: string | null;
  searches?: string | null;
  selected?: boolean;
  onClick: () => void;
  delay?: number;
}

export function TrendingTopicCard({
  topic,
  description,
  source,
  hashtag,
  engagement,
  searches,
  selected = false,
  onClick,
  delay = 0,
}: TrendingTopicCardProps) {
  const SourceIcon = source === "twitter" ? Twitter : Globe;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <button
        onClick={onClick}
        className={cn(
          "group relative w-full h-full p-5 rounded-lg border text-left flex flex-col",
          "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50",
          "bg-card hover:shadow-lg",
          selected
            ? "border-primary bg-primary/5 shadow-md"
            : "border-border hover:border-primary/50"
        )}
      >
        {/* Top Section: Source Badge and Growth Indicator */}
        <div className="flex items-start justify-between mb-3">
          {/* Source Badge */}
          <div className="flex items-center gap-1.5 bg-black text-white px-2.5 py-1 rounded-full text-xs font-medium">
            <SourceIcon className="w-3 h-3" />
            <span className="capitalize">{source}</span>
          </div>

          {/* Growth Indicator */}
          <div className="flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {topic}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-shrink-0">
          {description}
        </p>

        {/* Hashtag (if available) */}
        {hashtag && (
          <div className="mb-3 flex-shrink-0">
            <span className="inline-block bg-muted text-foreground px-2.5 py-1 rounded-full text-xs font-medium">
              {hashtag}
            </span>
          </div>
        )}

        {/* Bottom Section: Engagement/Search Count */}
        <div className="flex items-center justify-end mt-auto pt-2">
          <span className="text-xs text-muted-foreground">
            {engagement || searches}
          </span>
        </div>

        {/* Selection indicator */}
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
          >
            <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </button>
    </motion.div>
  );
}
