import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Moon, Sun, RefreshCw, TrendingUp, Twitter, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/ThemeProvider";
import { Switch } from "@/components/ui/switch";
import { TrendingTopicCard } from "@/components/TrendingTopicCard";

interface TrendingTopicsSelectionProps {
  onBack: () => void;
  onContinue: (selectedTopics: string[]) => void;
}

type PlatformFilter = "all" | "twitter" | "google";

// Mock trending topics data
const mockTrendingTopics = [
  {
    id: "1",
    title: "AI Revolution in Healthcare",
    description: "Breaking news about AI transforming healthcare industry",
    source: "twitter" as const,
    hashtag: "#AIHealthcare",
    engagement: "125K engagements",
    searches: null,
  },
  {
    id: "2",
    title: "Climate Action Summit 2025",
    description: "Global leaders discuss climate change solutions",
    source: "google" as const,
    hashtag: null,
    engagement: null,
    searches: "2.5M searches",
  },
  {
    id: "3",
    title: "Tech Stock Surge",
    description: "Major tech companies see record growth",
    source: "twitter" as const,
    hashtag: "#TechStocks",
    engagement: "89K engagements",
    searches: null,
  },
  {
    id: "4",
    title: "Space Exploration Milestone",
    description: "Historic achievement in space exploration",
    source: "google" as const,
    hashtag: null,
    engagement: null,
    searches: "1.8M searches",
  },
  {
    id: "5",
    title: "Renewable Energy Breakthrough",
    description: "New solar technology promises to revolutionize energy sector",
    source: "twitter" as const,
    hashtag: "#RenewableEnergy",
    engagement: "156K engagements",
    searches: null,
  },
  {
    id: "6",
    title: "Global Economic Recovery",
    description: "World economies show signs of strong recovery post-pandemic",
    source: "google" as const,
    hashtag: null,
    engagement: null,
    searches: "3.2M searches",
  },
];

export function TrendingTopicsSelection({ onBack, onContinue }: TrendingTopicsSelectionProps) {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const handleTopicClick = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((topicId) => topicId !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selectedTopics.length > 0) {
      onContinue(selectedTopics);
    }
  };

  const filteredTopics = mockTrendingTopics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (topic.hashtag && topic.hashtag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesPlatform =
      platformFilter === "all" || topic.source === platformFilter;

    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-black dark:text-white">Trending Topics</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <RefreshCw className="w-4 h-4" />
            </Button>
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
      <main className="relative z-10 container mx-auto px-6 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search trending topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {/* Platform Filters */}
          <div className="flex items-center gap-2">
            <Button
              variant={platformFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setPlatformFilter("all")}
              className={platformFilter === "all" ? "bg-primary text-primary-foreground" : ""}
            >
              All
            </Button>
            <Button
              variant={platformFilter === "twitter" ? "default" : "outline"}
              size="sm"
              onClick={() => setPlatformFilter("twitter")}
              className={platformFilter === "twitter" ? "bg-primary text-primary-foreground" : ""}
            >
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
            <Button
              variant={platformFilter === "google" ? "default" : "outline"}
              size="sm"
              onClick={() => setPlatformFilter("google")}
              className={platformFilter === "google" ? "bg-primary text-primary-foreground" : ""}
            >
              <Globe className="w-4 h-4 mr-2" />
              Google
            </Button>
          </div>
        </div>

        {/* Trending Topics Grid */}
        {filteredTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {filteredTopics.map((topic, index) => (
              <TrendingTopicCard
                key={topic.id}
                topic={topic.title}
                description={topic.description}
                source={topic.source}
                hashtag={topic.hashtag}
                engagement={topic.engagement}
                searches={topic.searches}
                selected={selectedTopics.includes(topic.id)}
                onClick={() => handleTopicClick(topic.id)}
                delay={index * 0.05}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No trending topics found matching your search.</p>
          </div>
        )}

        {/* Continue Button */}
        {selectedTopics.length > 0 && (
          <div className="fixed bottom-6 right-6">
            <Button
              onClick={handleContinue}
              size="lg"
              className="shadow-lg"
            >
              Continue with {selectedTopics.length} {selectedTopics.length === 1 ? "topic" : "topics"}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
