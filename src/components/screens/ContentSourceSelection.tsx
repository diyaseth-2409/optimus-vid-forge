import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Newspaper,
  TrendingUp,
  Type,
  Layers,
  Image,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { OptimusLogo } from "@/components/OptimusLogo";
import { ContentSourceCard } from "@/components/ContentSourceCard";
import { Button } from "@/components/ui/button";

type ContentSource = "article" | "trending" | "text" | "webstory" | "photos" | null;

interface ContentSourceSelectionProps {
  onSelect: (source: ContentSource) => void;
}

const contentSources = [
  {
    id: "article" as const,
    icon: Newspaper,
    title: "Article → Video",
    description: "Convert Times of India articles into engaging videos with AI-extracted key points",
    accentColor: "primary" as const,
  },
  {
    id: "trending" as const,
    icon: TrendingUp,
    title: "Trending Topics → Video",
    description: "Create videos from trending topics on Instagram, X, and Facebook",
    accentColor: "accent" as const,
  },
  {
    id: "text" as const,
    icon: Type,
    title: "Text → Video",
    description: "Transform any text into a slide-wise video with AI rewriting and tone options",
    accentColor: "primary" as const,
  },
  {
    id: "webstory" as const,
    icon: Layers,
    title: "Web Stories → Video",
    description: "Convert existing web stories into video format with smooth transitions",
    accentColor: "success" as const,
  },
  {
    id: "photos" as const,
    icon: Image,
    title: "Photos / Gallery → Video",
    description: "Create videos from photo galleries with AI-suggested captions and transitions",
    accentColor: "warning" as const,
  },
];

export function ContentSourceSelection({ onSelect }: ContentSourceSelectionProps) {
  const [hoveredSource, setHoveredSource] = useState<ContentSource>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <OptimusLogo />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="text-sm text-muted-foreground hidden sm:block">Times of India</span>
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-xs font-medium text-secondary-foreground">TI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Video Creation</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            How would you like to create your video?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose a content source and let AI transform it into a stunning video in minutes.
          </p>
        </motion.div>

        {/* Content source cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {contentSources.map((source, index) => (
            <ContentSourceCard
              key={source.id}
              icon={source.icon}
              title={source.title}
              description={source.description}
              accentColor={source.accentColor}
              delay={index * 0.1}
              onClick={() => onSelect(source.id)}
            />
          ))}
        </div>

        {/* Quick tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground">
            <span className="text-primary">Pro tip:</span> Start with Article → Video for the fastest results
          </p>
        </motion.div>
      </main>
    </div>
  );
}
