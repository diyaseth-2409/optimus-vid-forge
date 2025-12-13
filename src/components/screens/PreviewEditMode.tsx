import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Pause,
  Download,
  Upload,
  Settings,
  Wand2,
  Clock,
  Image,
  Type,
  Volume2,
  Monitor,
  Smartphone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { OptimusLogo } from "@/components/OptimusLogo";
import { SlidePreview } from "@/components/SlidePreview";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PreviewEditModeProps {
  onBack: () => void;
  onAdvancedEdit: () => void;
}

const mockSlides = [
  { id: 1, thumbnail: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=225&fit=crop", duration: "5s", text: "India's GDP Growth Surpasses Expectations" },
  { id: 2, thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop", duration: "5s", text: "Q3 Shows Strong Recovery" },
  { id: 3, thumbnail: "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=225&fit=crop", duration: "5s", text: "Manufacturing Sector Leads Growth" },
  { id: 4, thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=225&fit=crop", duration: "5s", text: "Experts Predict Continued Momentum" },
  { id: 5, thumbnail: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=400&h=225&fit=crop", duration: "5s", text: "Investment Inflows at Record High" },
  { id: 6, thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=225&fit=crop", duration: "5s", text: "Future Outlook Remains Positive" },
];

export function PreviewEditMode({ onBack, onAdvancedEdit }: PreviewEditModeProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFormat, setCurrentFormat] = useState<"16:9" | "9:16">("16:9");
  const [progress, setProgress] = useState([0]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="relative z-10 border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <OptimusLogo />
            <span className="text-sm text-muted-foreground hidden md:block">
              Preview & Quick Edit
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload to Flike</span>
            </Button>
            <Button variant="glow" size="sm" onClick={onAdvancedEdit} className="gap-2">
              <Wand2 className="w-4 h-4" />
              <span className="hidden sm:inline">Advanced Edit</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex">
        {/* Left panel - Slide thumbnails */}
        <div className="w-64 border-r border-border bg-card/50 p-4 overflow-y-auto">
          {/* Format tabs */}
          <Tabs value={currentFormat} onValueChange={(v) => setCurrentFormat(v as "16:9" | "9:16")}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="16:9" className="flex-1 gap-1.5">
                <Monitor className="w-3.5 h-3.5" />
                16:9
              </TabsTrigger>
              <TabsTrigger value="9:16" className="flex-1 gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                9:16
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Slides */}
          <div className="space-y-3">
            {mockSlides.map((slide, index) => (
              <SlidePreview
                key={slide.id}
                slideNumber={slide.id}
                thumbnail={slide.thumbnail}
                duration={slide.duration}
                active={activeSlide === index}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>

          {/* Add slide button */}
          <Button variant="outline" className="w-full mt-4 border-dashed">
            + Add Slide
          </Button>
        </div>

        {/* Main preview area */}
        <div className="flex-1 flex flex-col">
          {/* Preview */}
          <div className="flex-1 flex items-center justify-center p-8 bg-gradient-radial from-secondary/30 to-transparent">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`relative rounded-xl overflow-hidden shadow-2xl border border-border ${
                currentFormat === "9:16" ? "aspect-[9/16] h-[70vh]" : "aspect-video w-full max-w-3xl"
              }`}
            >
              <img
                src={mockSlides[activeSlide].thumbnail}
                alt={`Slide ${activeSlide + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Text overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent flex items-end">
                <div className="p-8">
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    {mockSlides[activeSlide].text}
                  </h2>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Timeline and controls */}
          <div className="border-t border-border bg-card/80 backdrop-blur-xl p-4">
            {/* Progress bar */}
            <div className="mb-4">
              <Slider
                value={progress}
                onValueChange={setProgress}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-full"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setActiveSlide(Math.min(mockSlides.length - 1, activeSlide + 1))}>
                  <ChevronRight className="w-5 h-5" />
                </Button>
                <span className="text-sm text-muted-foreground ml-2">
                  {activeSlide + 1} / {mockSlides.length}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">0:00 / 0:30</span>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <Slider value={[80]} max={100} className="w-20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - Quick edit controls */}
        <div className="w-72 border-l border-border bg-card/50 p-4 overflow-y-auto">
          <h3 className="font-display font-semibold text-foreground mb-4">
            Quick Edit
          </h3>

          <div className="space-y-6">
            {/* Slide duration */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Slide Duration</span>
              </div>
              <div className="flex gap-2">
                {["3s", "5s", "7s", "10s"].map((duration) => (
                  <Button
                    key={duration}
                    variant={mockSlides[activeSlide].duration === duration ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                  >
                    {duration}
                  </Button>
                ))}
              </div>
            </div>

            {/* Replace image */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Image className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Background</span>
              </div>
              <Button variant="outline" className="w-full">
                Replace Image/Video
              </Button>
            </div>

            {/* Edit text */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Type className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Text</span>
              </div>
              <textarea
                value={mockSlides[activeSlide].text}
                className="w-full p-3 rounded-lg border border-border bg-secondary/50 text-foreground resize-none h-20"
                placeholder="Edit slide text..."
              />
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Aa
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  B
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  I
                </Button>
              </div>
            </div>

            {/* Music */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Background Music</span>
              </div>
              <div className="p-3 rounded-lg border border-border bg-secondary/30">
                <p className="text-sm text-foreground">News Upbeat Modern</p>
                <p className="text-xs text-muted-foreground">2:34</p>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2">
                Change Music
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
