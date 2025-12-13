import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Filter, Clock, RefreshCw } from "lucide-react";
import { OptimusLogo } from "@/components/OptimusLogo";
import { ArticleCard } from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ArticleSelectionProps {
  onBack: () => void;
  onContinue: (selectedArticles: string[]) => void;
}

// Mock articles data
const mockArticles = [
  {
    id: "1",
    title: "India's GDP Growth Surpasses Expectations in Q3, Economy Shows Strong Recovery",
    thumbnail: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=450&fit=crop",
    category: "Economy",
    publishTime: "2 hours ago",
  },
  {
    id: "2",
    title: "Supreme Court Delivers Landmark Verdict on Digital Privacy Rights",
    thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=450&fit=crop",
    category: "Legal",
    publishTime: "4 hours ago",
  },
  {
    id: "3",
    title: "ISRO Successfully Launches Next-Gen Communication Satellite",
    thumbnail: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800&h=450&fit=crop",
    category: "Science",
    publishTime: "5 hours ago",
  },
  {
    id: "4",
    title: "Mumbai Metro Line 3 Set to Transform Urban Commuting Experience",
    thumbnail: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=450&fit=crop",
    category: "Infrastructure",
    publishTime: "6 hours ago",
  },
  {
    id: "5",
    title: "India Clinches Historic Test Series Victory in Australia",
    thumbnail: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=450&fit=crop",
    category: "Sports",
    publishTime: "8 hours ago",
  },
  {
    id: "6",
    title: "Tech Giants Announce Major AI Investment Plans for India",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
    category: "Technology",
    publishTime: "10 hours ago",
  },
];

export function ArticleSelection({ onBack, onContinue }: ArticleSelectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleArticle = (id: string) => {
    setSelectedArticles((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const filteredArticles = mockArticles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <OptimusLogo />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {selectedArticles.length} selected
            </span>
            <Button
              onClick={() => onContinue(selectedArticles)}
              disabled={selectedArticles.length === 0}
              className="gap-2"
            >
              Continue to Create
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Select Articles
          </h1>
          <p className="text-muted-foreground mb-8">
            Choose one or more articles to convert into video
          </p>

          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search articles by title or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              <Button variant="outline" className="gap-2">
                <Clock className="w-4 h-4" />
                Recent
              </Button>
              <Button variant="ghost" size="icon">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Articles grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, index) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                thumbnail={article.thumbnail}
                category={article.category}
                publishTime={article.publishTime}
                selected={selectedArticles.includes(article.id)}
                onClick={() => toggleArticle(article.id)}
                delay={index * 0.05}
              />
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No articles found matching your search.</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
