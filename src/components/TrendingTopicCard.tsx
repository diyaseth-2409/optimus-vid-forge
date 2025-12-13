import { motion } from "framer-motion";
import { TrendingUp, Instagram, Twitter, Facebook } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendingTopicCardProps {
  topic: string;
  source: "instagram" | "twitter" | "facebook";
  rank: number;
  engagement: string;
  selected?: boolean;
  onClick: () => void;
  delay?: number;
}

const sourceIcons = {
  instagram: Instagram,
  twitter: Twitter,
  facebook: Facebook,
};

const sourceColors = {
  instagram: "from-pink-500 to-purple-600",
  twitter: "from-blue-400 to-blue-600",
  facebook: "from-blue-600 to-blue-800",
};

export function TrendingTopicCard({
  topic,
  source,
  rank,
  engagement,
  selected = false,
  onClick,
  delay = 0,
}: TrendingTopicCardProps) {
  const SourceIcon = sourceIcons[source];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <button
        onClick={onClick}
        className={cn(
          "group relative w-full p-4 rounded-xl border text-left",
          "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50",
          selected
            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
            : "border-border bg-card hover:border-primary/50"
        )}
      >
        <div className="flex items-center gap-4">
          {/* Rank */}
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <span className="font-display font-bold text-lg text-muted-foreground">#{rank}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {topic}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className="w-3.5 h-3.5 text-success" />
              <span className="text-xs text-muted-foreground">{engagement}</span>
            </div>
          </div>

          {/* Source badge */}
          <div className={cn(
            "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br",
            sourceColors[source]
          )}>
            <SourceIcon className="w-4 h-4 text-white" />
          </div>
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
