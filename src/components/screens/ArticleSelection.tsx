import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Clock, RefreshCw, Moon, Sun, Calendar, User, Tag, ExternalLink } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
m
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
    author: "Rajesh Kumar",
    customExcerpt: "India's economy demonstrates exceptional resilience with Q3 GDP growth exceeding all forecasts, driven by robust manufacturing and strong service sector performance.",
    description: "India's economy has demonstrated remarkable resilience in the third quarter, with GDP growth exceeding all expectations. The comprehensive economic recovery can be attributed to several key factors including robust manufacturing output and strong service sector performance. The manufacturing sector, in particular, has shown unprecedented growth, with production indices reaching new heights. This surge in manufacturing activity has been complemented by a strong performance in the services sector, which continues to be a major driver of economic growth. The agricultural sector has also contributed significantly to this positive trend, with favorable monsoon conditions supporting crop yields. Government initiatives and policy reforms have played a crucial role in stimulating economic activity across various sectors. Infrastructure development projects have gained momentum, creating employment opportunities and boosting consumer confidence. Foreign direct investment has also seen an upward trend, reflecting international confidence in India's economic prospects. The positive momentum is expected to continue in the coming quarters, with analysts predicting sustained growth. This economic recovery has had a positive impact on employment rates and consumer spending, further fueling the growth cycle. The Reserve Bank of India's monetary policies have been instrumental in maintaining economic stability while supporting growth. International trade has also shown signs of recovery, with exports reaching new milestones. The technology sector continues to be a bright spot, with digital transformation initiatives driving innovation and efficiency across industries.",
  },
  {
    id: "2",
    title: "Supreme Court Delivers Landmark Verdict on Digital Privacy Rights",
    thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=450&fit=crop",
    category: "Legal",
    publishTime: "4 hours ago",
    author: "Priya Sharma",
    customExcerpt: "Historic Supreme Court ruling establishes new digital privacy precedents, setting comprehensive guidelines for tech companies and government surveillance practices.",
    description: "In a historic ruling, the Supreme Court has established new precedents for digital privacy, setting guidelines that will impact how tech companies handle user data and government surveillance practices. The landmark judgment addresses critical concerns about data protection and individual privacy rights in the digital age. The court's decision emphasizes the fundamental right to privacy as enshrined in the Constitution, extending its protection to digital spaces. This ruling will require tech companies to implement stricter data protection measures and provide greater transparency about how user data is collected and used. Government agencies will also need to follow more stringent protocols when accessing personal information for surveillance purposes. The judgment establishes a framework for balancing national security concerns with individual privacy rights. Legal experts believe this decision will have far-reaching implications for data protection laws and regulations. The ruling also addresses concerns about data localization and cross-border data transfers. Companies operating in India will need to review and update their privacy policies to comply with the new guidelines. The decision has been welcomed by privacy advocates who have long called for stronger protections. The court's emphasis on informed consent and data minimization principles sets a new standard for data handling practices. This judgment is expected to influence future legislation on data protection and cybersecurity.",
  },
  {
    id: "3",
    title: "ISRO Successfully Launches Next-Gen Communication Satellite",
    thumbnail: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800&h=450&fit=crop",
    category: "Science",
    publishTime: "5 hours ago",
    author: "Dr. Anil Patel",
    customExcerpt: "ISRO achieves another milestone with successful launch of advanced communication satellite, enhancing connectivity and communication infrastructure nationwide.",
    description: "The Indian Space Research Organisation has achieved another milestone with the successful launch of its advanced communication satellite, enhancing connectivity and communication infrastructure across the nation. The satellite, equipped with state-of-the-art technology, will significantly improve communication capabilities in remote and rural areas. This launch represents a major step forward in India's space program, demonstrating the country's growing capabilities in space technology. The satellite features advanced transponders and communication systems that will provide high-speed internet and communication services. The successful deployment into geostationary orbit marks a significant achievement for ISRO's engineering and mission control teams. This satellite will support various applications including telemedicine, distance education, and emergency communication services. The launch vehicle performed flawlessly, placing the satellite in its intended orbit with precision. The mission's success reinforces India's position as a leading space-faring nation. The satellite's advanced capabilities will enable better connectivity for government services and commercial applications. This achievement comes as part of ISRO's broader mission to enhance India's space-based infrastructure. The organization continues to push the boundaries of space technology, with several more ambitious missions planned for the future. The successful launch has been celebrated by the scientific community and the nation as a whole.",
  },
  {
    id: "4",
    title: "Mumbai Metro Line 3 Set to Transform Urban Commuting Experience",
    thumbnail: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=450&fit=crop",
    category: "Infrastructure",
    publishTime: "6 hours ago",
    author: "Meera Desai",
    customExcerpt: "New metro line promises to revolutionize daily commuting for millions, reducing travel time and providing modern, efficient transportation solutions.",
    description: "The new metro line promises to revolutionize daily commuting for millions of Mumbaikars, reducing travel time significantly and providing a modern, efficient transportation solution for the bustling metropolis. Metro Line 3 will connect key business districts, residential areas, and transportation hubs, creating a seamless commuting experience. The line features state-of-the-art trains with modern amenities including air conditioning, comfortable seating, and real-time information displays. The underground and elevated sections of the metro will help reduce traffic congestion on Mumbai's already crowded roads. The project includes multiple stations strategically located to serve high-density areas and provide easy access to major landmarks. The metro system will integrate with existing transportation networks, making it easier for commuters to reach their destinations. The construction has involved advanced engineering techniques to navigate Mumbai's challenging terrain and dense urban environment. The metro line is expected to significantly reduce carbon emissions by encouraging public transportation use. The project represents a major investment in Mumbai's infrastructure and quality of life. The modern signaling and safety systems ensure reliable and safe operations. The metro line will operate with high frequency during peak hours to accommodate the large number of commuters. This infrastructure project is part of a larger vision to transform Mumbai into a more sustainable and livable city.",
  },
  {
    id: "5",
    title: "India Clinches Historic Test Series Victory in Australia",
    thumbnail: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=450&fit=crop",
    category: "Sports",
    publishTime: "8 hours ago",
    author: "Vikram Singh",
    customExcerpt: "Indian cricket team secures memorable test series win in Australia, marking one of the greatest achievements in the nation's cricketing history.",
    description: "In a stunning display of skill and determination, the Indian cricket team has secured a memorable test series win down under, marking one of the greatest achievements in the nation's cricketing history. The victory came after a hard-fought series that tested the team's resilience and character. The team's performance throughout the series demonstrated exceptional skill, teamwork, and mental fortitude. Key players stepped up at crucial moments, delivering match-winning performances that will be remembered for years to come. The bowling attack showed remarkable consistency, taking wickets at regular intervals and maintaining pressure on the opposition. The batting lineup displayed great technique and patience, building partnerships that laid the foundation for victories. The fielding was sharp and energetic, with spectacular catches and run-outs that turned the momentum in India's favor. The team's ability to adapt to different conditions and situations was particularly impressive. This series win represents the culmination of years of hard work and strategic planning. The victory has been celebrated across the nation, with fans expressing their pride and joy. The team's success has inspired a new generation of cricketers and fans. This achievement adds another glorious chapter to India's rich cricketing legacy.",
  },
  {
    id: "6",
    title: "Tech Giants Announce Major AI Investment Plans for India",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
    category: "Technology",
    publishTime: "10 hours ago",
    author: "Arjun Mehta",
    customExcerpt: "Leading technology companies unveil ambitious AI investment strategies for India, signaling the country's growing importance in global tech landscape.",
    description: "Leading technology companies have unveiled ambitious investment strategies focused on artificial intelligence development in India, signaling the country's growing importance in the global tech landscape. These investments will support the development of AI research centers, training programs, and infrastructure. The announcements come at a time when India is positioning itself as a major hub for AI innovation and development. The investments will create thousands of job opportunities for skilled professionals in the AI and machine learning fields. Companies are recognizing India's potential as both a market and a talent pool for AI technologies. The investment plans include partnerships with educational institutions to develop AI curricula and research programs. These initiatives will help build a strong ecosystem for AI innovation in India. The focus areas include healthcare AI, financial technology, agricultural technology, and smart city solutions. The investments are expected to drive innovation and create solutions tailored to India's unique challenges and opportunities. The government has welcomed these investments, seeing them as aligned with its vision of a digitally empowered India. The AI sector is expected to contribute significantly to India's economic growth in the coming years. These developments position India as a key player in the global AI revolution.",
  },
];

export function ArticleSelection({ onBack, onContinue }: ArticleSelectionProps) {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [selectedArticle, setSelectedArticle] = useState<typeof mockArticles[0] | null>(null);

  const handleArticleClick = (id: string) => {
    const article = mockArticles.find(a => a.id === id);
    if (article) {
      setSelectedArticle(article);
    }
  };

  const handleContinue = () => {
    if (selectedArticle) {
      onContinue([selectedArticle.id]);
    }
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
      <header className="sticky top-0 z-50 border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-black dark:text-white">Optimus</h1>
          </div>
          <div className="flex items-center gap-3">
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
      <main className="relative z-10 container mx-auto px-6 py-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
              {/* Product Dropdown */}
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="product1">Product 1</SelectItem>
                  <SelectItem value="product2">Product 2</SelectItem>
                  <SelectItem value="product3">Product 3</SelectItem>
                </SelectContent>
              </Select>
              {/* Calendar Date Range */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Calendar className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => {
                      setDateRange({
                        from: range?.from,
                        to: range?.to,
                      });
                    }}
                    numberOfMonths={2}
                  />
                  {dateRange.from && dateRange.to && (
                    <div className="p-3 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </p>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
              <Button variant="ghost" size="icon">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Articles list */}
          <div className="flex flex-col gap-3">
            {filteredArticles.map((article, index) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                thumbnail={article.thumbnail}
                category={article.category}
                publishTime={article.publishTime}
                description={article.description}
                onClick={() => handleArticleClick(article.id)}
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

      {/* Article Details Modal */}
      <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold pr-8">
              {selectedArticle?.title}
            </DialogTitle>
            <DialogDescription className="space-y-3 pt-2">
              {/* Custom Excerpt */}
              {selectedArticle?.customExcerpt && (
                <p className="text-base font-medium text-foreground leading-relaxed">
                  {selectedArticle.customExcerpt}
                </p>
              )}
              
              {/* Metadata */}
              <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
                {selectedArticle?.author && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{selectedArticle.author}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{selectedArticle?.publishTime}</span>
                </div>
                {selectedArticle?.category && (
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10">
                    <Tag className="w-3 h-3 text-primary" />
                    <span className="text-xs font-medium text-primary">{selectedArticle.category}</span>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>

          {/* Full Description with Scroll */}
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="prose prose-sm max-w-none">
              <p className="text-base text-foreground leading-relaxed whitespace-pre-line">
                {selectedArticle?.description}
              </p>
            </div>
          </div>

          <DialogFooter className="mt-4 justify-start">
            <Button 
              variant="outline" 
              onClick={() => {
                if (selectedArticle) {
                  // Open article in new tab for preview
                  window.open(`/article/${selectedArticle.id}`, '_blank');
                }
              }}
              className="flex items-center gap-2 ml-0"
            >
              <ExternalLink className="w-4 h-4" />
              Read on Website
            </Button>
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" onClick={() => setSelectedArticle(null)}>
                Cancel
              </Button>
              <Button onClick={handleContinue}>
                Continue with this Article
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
