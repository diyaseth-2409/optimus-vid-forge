import { useState } from "react";
import { ArrowLeft, Moon, Sun, PenTool, Mic, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/components/ThemeProvider";
import { Switch } from "@/components/ui/switch";

interface TextToVideoSelectionProps {
  onBack: () => void;
  onContinue: (content: string) => void;
}

export function TextToVideoSelection({ onBack, onContinue }: TextToVideoSelectionProps) {
  const { theme, setTheme } = useTheme();
  const [content, setContent] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhance = async () => {
    if (!content.trim()) return;
    
    setIsEnhancing(true);
    // Simulate AI enhancement
    setTimeout(() => {
      // In a real app, this would call an AI API to enhance the content
      setIsEnhancing(false);
    }, 2000);
  };

  const handleCreateVideo = () => {
    if (content.trim()) {
      onContinue(content);
    }
  };

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
            <h1 className="text-xl font-bold text-black dark:text-white">Writing</h1>
          </div>
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
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-6 py-8 max-w-4xl">
        {/* Instructional text */}
        <div className="text-center mb-8">
          <p className="text-lg text-muted-foreground">
            Write your content and let AI enhance it with creative twists and improvements
          </p>
        </div>

        {/* Writing Card */}
        <div className="bg-card border border-border rounded-lg shadow-md p-6">
          {/* Card Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PenTool className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold text-foreground">Your Writing</h2>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Mic className="w-4 h-4" />
              Speak
            </Button>
          </div>

          {/* Textarea */}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your content here... The AI will help enhance and twist it for better video storytelling."
            className="min-h-[300px] resize-y bg-muted/50 text-base"
          />

          {/* Enhance with AI Button */}
          <div className="mt-4">
            <Button
              onClick={handleEnhance}
              disabled={!content.trim() || isEnhancing}
              className="gap-2 bg-pink-500 hover:bg-pink-600 text-white"
            >
              <Sparkles className="w-4 h-4" />
              {isEnhancing ? "Enhancing..." : "Enhance with AI"}
            </Button>
          </div>
        </div>

        {/* Create Video Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleCreateVideo}
            disabled={!content.trim()}
            size="lg"
            className="bg-pink-500 hover:bg-pink-600 text-white px-8"
          >
            Create Video
          </Button>
        </div>
      </main>
    </div>
  );
}
