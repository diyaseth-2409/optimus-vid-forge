import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Newspaper,
  TrendingUp,
  PenTool,
  Image,
  Folder,
  Moon,
  Sun,
} from "lucide-react";
import { ContentSourceCard } from "@/components/ContentSourceCard";
import { useTheme } from "@/components/ThemeProvider";
import { Switch } from "@/components/ui/switch";

type ContentSource = "article" | "trending" | "text" | "visual" | null;

interface ContentSourceSelectionProps {
  onSelect: (source: ContentSource) => void;
}

const contentSources = [
  {
    id: "article" as const,
    icon: Newspaper,
    title: "Article to Video",
    description: "Convert articles into engaging video content",
    accentColor: "primary" as const,
  },
  {
    id: "trending" as const,
    icon: TrendingUp,
    title: "Trending Topics",
    description: "Create videos from trending topics on Twitter/Google",
    accentColor: "accent" as const,
  },
  {
    id: "text" as const,
    icon: PenTool,
    title: "Text to Video",
    description: "Convert text into videos with smart AI enhancements",
    accentColor: "primary" as const,
  },
  {
    id: "visual" as const,
    icon: Image,
    title: "Webstories & Photogallery",
    description: "Transform webstories and photo galleries into videos",
    accentColor: "success" as const,
  },
];

export function ContentSourceSelection({ onSelect }: ContentSourceSelectionProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-xl font-semibold">
            Slike <span className="text-black dark:text-white font-bold">Optimus</span> Video Creation Platform
          </h1>
          <div className="flex items-center gap-3">
            <Link
              to="/projects"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary transition-colors"
            >
              <Folder className="w-4 h-4" />
              <span className="text-sm font-medium">My Projects</span>
            </Link>
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-muted-foreground" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                aria-label="Toggle theme"
              />
              <Sun className="w-4 h-4 text-muted-foreground" />
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
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Create Your Video
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose a method to start creating engaging video content
          </p>
        </motion.div>

        {/* Content source cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
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
      </main>
    </div>
  );
}
