import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  Monitor,
  Smartphone,
  Music,
  Upload,
  Wand2,
  Video,
} from "lucide-react";
import { OptimusLogo } from "@/components/OptimusLogo";
import { ThemeCard } from "@/components/ThemeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VideoCreationFormProps {
  onBack: () => void;
  onPreview: () => void;
  onAdvancedEdit: () => void;
}

type FormatOption = "16:9" | "9:16" | "both";

const themes = [
  { id: "1", name: "Breaking News", preview: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=225&fit=crop" },
  { id: "2", name: "Modern Clean", preview: "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=225&fit=crop" },
  { id: "3", name: "Bold Headlines", preview: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=225&fit=crop" },
  { id: "4", name: "Minimal Dark", preview: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&h=225&fit=crop" },
];

const verticalThemes = [
  { id: "v1", name: "Story Pop", preview: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=225&h=400&fit=crop" },
  { id: "v2", name: "Neon Vibes", preview: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=225&h=400&fit=crop" },
  { id: "v3", name: "Classic Serif", preview: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=225&h=400&fit=crop" },
];

export function VideoCreationForm({
  onBack,
  onPreview,
  onAdvancedEdit,
}: VideoCreationFormProps) {
  const [title, setTitle] = useState("India's GDP Growth Surpasses Expectations in Q3");
  const [description, setDescription] = useState("A comprehensive look at India's economic recovery and the factors driving growth in the third quarter.");
  const [keywords, setKeywords] = useState("GDP, Economy, India, Growth, Q3");
  const [category, setCategory] = useState("Economy");
  const [slides, setSlides] = useState("6");
  const [videoType, setVideoType] = useState("news");
  const [format, setFormat] = useState<FormatOption>("both");
  const [selectedTheme16x9, setSelectedTheme16x9] = useState("1");
  const [selectedTheme9x16, setSelectedTheme9x16] = useState("v1");

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
            <Button variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={onPreview} className="gap-2">
              <Video className="w-4 h-4" />
              Preview & Quick Edit
            </Button>
            <Button variant="glow" onClick={onAdvancedEdit} className="gap-2">
              <Wand2 className="w-4 h-4" />
              Edit (Advanced)
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
          className="max-w-5xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Create Video
              </h1>
              <p className="text-sm text-muted-foreground">
                AI has pre-filled the details. Review and customize as needed.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Metadata */}
            <div className="lg:col-span-2 space-y-6">
              {/* Section A: Video Metadata */}
              <div className="p-6 rounded-xl border border-border bg-card">
                <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                    A
                  </span>
                  Video Metadata
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Video Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Video Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1.5 min-h-[80px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="keywords">Keywords / Tags</Label>
                      <Input
                        id="keywords"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Economy">Economy</SelectItem>
                          <SelectItem value="Politics">Politics</SelectItem>
                          <SelectItem value="Sports">Sports</SelectItem>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Entertainment">Entertainment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="slides">Number of Slides</Label>
                      <Select value={slides} onValueChange={setSlides}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[4, 5, 6, 7, 8, 9, 10].map((n) => (
                            <SelectItem key={n} value={n.toString()}>
                              {n} slides
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="videoType">Video Type</Label>
                      <Select value={videoType} onValueChange={setVideoType}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="news">News</SelectItem>
                          <SelectItem value="explainer">Explainer</SelectItem>
                          <SelectItem value="shorts">Shorts</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                          <SelectItem value="promo">Promo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section C: Theme Selection */}
              <div className="p-6 rounded-xl border border-border bg-card">
                <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                    C
                  </span>
                  Theme Selection
                  <span className="ml-2 text-xs text-muted-foreground font-normal">
                    (AI Recommended)
                  </span>
                </h2>

                {(format === "16:9" || format === "both") && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Monitor className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">16:9 Horizontal</span>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {themes.map((theme, index) => (
                        <ThemeCard
                          key={theme.id}
                          name={theme.name}
                          preview={theme.preview}
                          format="16:9"
                          selected={selectedTheme16x9 === theme.id}
                          onClick={() => setSelectedTheme16x9(theme.id)}
                          delay={index * 0.05}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {(format === "9:16" || format === "both") && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">9:16 Vertical</span>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      {verticalThemes.map((theme, index) => (
                        <ThemeCard
                          key={theme.id}
                          name={theme.name}
                          preview={theme.preview}
                          format="9:16"
                          selected={selectedTheme9x16 === theme.id}
                          onClick={() => setSelectedTheme9x16(theme.id)}
                          delay={index * 0.05}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right column - Format & Media */}
            <div className="space-y-6">
              {/* Section B: Format Selection */}
              <div className="p-6 rounded-xl border border-border bg-card">
                <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                    B
                  </span>
                  Format
                </h2>

                <div className="space-y-3">
                  {[
                    { value: "16:9", label: "16:9 Horizontal", icon: Monitor, desc: "YouTube, Website" },
                    { value: "9:16", label: "9:16 Vertical", icon: Smartphone, desc: "Reels, Shorts, Stories" },
                    { value: "both", label: "Both Formats", icon: null, desc: "Generate both versions" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormat(option.value as FormatOption)}
                      className={`w-full p-4 rounded-lg border transition-all duration-200 text-left ${
                        format === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {option.icon ? (
                          <option.icon className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <div className="flex -space-x-1">
                            <Monitor className="w-4 h-4 text-muted-foreground" />
                            <Smartphone className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">{option.label}</p>
                          <p className="text-xs text-muted-foreground">{option.desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section D: Media Inputs */}
              <div className="p-6 rounded-xl border border-border bg-card">
                <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                    D
                  </span>
                  Media
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Video Bytes</Label>
                    <Button variant="outline" className="w-full gap-2 h-auto py-3">
                      <Upload className="w-4 h-4" />
                      <span>Upload from Flike CMS</span>
                    </Button>
                  </div>

                  <div>
                    <Label className="mb-2 block">Background Music</Label>
                    <div className="p-3 rounded-lg border border-border bg-secondary/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Music className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            News Upbeat Modern
                          </p>
                          <p className="text-xs text-muted-foreground">AI Selected • 2:34</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Change
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
