import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Pause,
  Save,
  Download,
  Upload,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Type,
  Image,
  Video,
  Music,
  Square,
  Circle,
  Triangle,
  Layers,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Moon,
  Trash2,
  Copy,
  Scissors,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { OptimusLogo } from "@/components/OptimusLogo";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";

interface AdvancedEditorProps {
  onBack: () => void;
}

const mockLayers = [
  { id: 1, type: "image", name: "Background", visible: true, locked: false },
  { id: 2, type: "text", name: "Headline", visible: true, locked: false },
  { id: 3, type: "text", name: "Subtitle", visible: true, locked: false },
  { id: 4, type: "video", name: "Video Clip 1", visible: true, locked: false },
];

const timelineItems = [
  { id: 1, name: "Slide 1", duration: 5, color: "bg-primary" },
  { id: 2, name: "Slide 2", duration: 5, color: "bg-accent" },
  { id: 3, name: "Slide 3", duration: 5, color: "bg-success" },
  { id: 4, name: "Slide 4", duration: 5, color: "bg-warning" },
  { id: 5, name: "Slide 5", duration: 5, color: "bg-primary" },
  { id: 6, name: "Slide 6", duration: 5, color: "bg-accent" },
];

export function AdvancedEditor({ onBack }: AdvancedEditorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState([100]);
  const [selectedTool, setSelectedTool] = useState("select");

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header / Toolbar */}
      <header className="border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <OptimusLogo />
            <span className="text-sm text-muted-foreground border-l border-border pl-4 ml-2">
              Advanced Editor
            </span>
          </div>

          {/* Center tools */}
          <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-secondary/50">
            <ThemeToggle />
            <div className="w-px h-6 bg-border mx-1" />
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Redo className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Scissors className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload to Flike
            </Button>
          </div>
        </div>
      </header>

      {/* Main editor area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Tools */}
        <div className="w-16 border-r border-border bg-card flex flex-col items-center py-4 gap-2">
          {[
            { id: "select", icon: Square, label: "Select" },
            { id: "text", icon: Type, label: "Text" },
            { id: "image", icon: Image, label: "Image" },
            { id: "video", icon: Video, label: "Video" },
            { id: "shapes", icon: Circle, label: "Shapes" },
            { id: "music", icon: Music, label: "Audio" },
          ].map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "default" : "ghost"}
              size="icon"
              className="w-10 h-10"
              onClick={() => setSelectedTool(tool.id)}
            >
              <tool.icon className="w-5 h-5" />
            </Button>
          ))}
        </div>

        {/* Left panel - Assets/Properties */}
        <div className="w-64 border-r border-border bg-card/50 flex flex-col">
          <Tabs defaultValue="layers" className="flex-1 flex flex-col">
            <TabsList className="m-2">
              <TabsTrigger value="layers" className="flex-1">Layers</TabsTrigger>
              <TabsTrigger value="assets" className="flex-1">Assets</TabsTrigger>
            </TabsList>

            <TabsContent value="layers" className="flex-1 m-0 p-2 overflow-y-auto">
              <div className="space-y-1">
                {mockLayers.map((layer) => (
                  <div
                    key={layer.id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center">
                      {layer.type === "image" && <Image className="w-4 h-4 text-muted-foreground" />}
                      {layer.type === "text" && <Type className="w-4 h-4 text-muted-foreground" />}
                      {layer.type === "video" && <Video className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <span className="text-sm text-foreground flex-1">{layer.name}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 border-dashed" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Layer
              </Button>
            </TabsContent>

            <TabsContent value="assets" className="flex-1 m-0 p-2 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-video rounded-lg bg-secondary overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                  >
                    <img
                      src={`https://images.unsplash.com/photo-${1526304640581 + i * 1000}-d334cdbbf45e?w=200&h=112&fit=crop`}
                      alt={`Asset ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main canvas area */}
        <div className="flex-1 flex flex-col bg-secondary/20">
          {/* Canvas toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <AlignRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground w-12 text-center">{zoom[0]}%</span>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="relative aspect-video w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl border border-border bg-card">
              <img
                src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=675&fit=crop"
                alt="Canvas"
                className="w-full h-full object-cover"
              />
              {/* Text overlay example */}
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background/90 to-transparent">
                <div className="border-2 border-dashed border-primary/50 p-4 rounded-lg">
                  <h2 className="font-display text-3xl font-bold text-foreground">
                    India's GDP Growth Surpasses Expectations
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - Properties */}
        <div className="w-72 border-l border-border bg-card/50 p-4 overflow-y-auto">
          <h3 className="font-display font-semibold text-foreground mb-4">Properties</h3>

          <div className="space-y-6">
            {/* Position */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Position</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">X</label>
                  <input
                    type="number"
                    value={100}
                    className="w-full mt-1 p-2 rounded-lg border border-border bg-secondary/50 text-foreground text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Y</label>
                  <input
                    type="number"
                    value={200}
                    className="w-full mt-1 p-2 rounded-lg border border-border bg-secondary/50 text-foreground text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Size */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Size</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">Width</label>
                  <input
                    type="number"
                    value={800}
                    className="w-full mt-1 p-2 rounded-lg border border-border bg-secondary/50 text-foreground text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Height</label>
                  <input
                    type="number"
                    value={100}
                    className="w-full mt-1 p-2 rounded-lg border border-border bg-secondary/50 text-foreground text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Opacity */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Opacity</h4>
              <Slider value={[100]} max={100} className="w-full" />
            </div>

            {/* Animation */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Animation</h4>
              <select className="w-full p-2 rounded-lg border border-border bg-secondary/50 text-foreground text-sm">
                <option>Fade In</option>
                <option>Slide Up</option>
                <option>Slide Left</option>
                <option>Scale</option>
                <option>None</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="h-32 border-t border-border bg-card">
        {/* Timeline controls */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            className="w-10 h-10 rounded-full"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <ChevronRight className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground ml-2">0:00 / 0:30</span>
        </div>

        {/* Timeline tracks */}
        <div className="flex-1 p-2 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {timelineItems.map((item) => (
              <div
                key={item.id}
                className={`h-12 rounded-lg ${item.color} flex items-center px-3 cursor-pointer hover:opacity-90 transition-opacity`}
                style={{ width: `${item.duration * 20}px` }}
              >
                <span className="text-xs font-medium text-primary-foreground truncate">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
          {/* Audio track */}
          <div className="mt-2 h-8 rounded-lg bg-secondary/50 flex items-center px-3">
            <Music className="w-4 h-4 text-muted-foreground mr-2" />
            <span className="text-xs text-muted-foreground">Background Music - News Upbeat Modern</span>
          </div>
        </div>
      </div>
    </div>
  );
}
