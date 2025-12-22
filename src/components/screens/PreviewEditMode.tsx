import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Pause,
  Download,
  Upload,
  Wand2,
  Volume2,
  Monitor,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Type,
  Minus,
  Plus,
  AlignLeft,
  Music,
  Clock,
  ChevronDown,
  Palette,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Switch } from "@/components/ui/switch";
import { ScenePreview } from "@/components/SlidePreview";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ColorPicker } from "@/components/ui/color-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ThemeCard } from "@/components/ThemeCard";
import { cn } from "@/lib/utils";

interface PreviewEditModeProps {
  onBack: () => void;
  onAdvancedEdit: () => void;
}

interface SceneTextStyle {
  font: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  textColor: string;
  backgroundColor: string;
  x?: number; // Position as percentage
  y?: number; // Position as percentage
  width?: number; // Width as percentage
  height?: number; // Height as percentage
}

interface Scene {
  id: number;
  thumbnail: string;
  duration: string;
  text: string;
  voiceover?: string;
  textStyle16x9: SceneTextStyle;
  textStyle9x16: SceneTextStyle;
}

const defaultTextStyle16x9: SceneTextStyle = {
  font: "Bebas Neue",
  fontSize: 48,
  bold: false,
  italic: false,
  textColor: "#000000",
  backgroundColor: "rgba(255, 182, 193, 0.3)",
  x: 50, // Center horizontally
  y: 85, // Near bottom for 16:9
  width: 90, // 90% width
  height: undefined // Auto height
};

const defaultTextStyle9x16: SceneTextStyle = {
  font: "Bebas Neue",
  fontSize: 48,
  bold: false,
  italic: false,
  textColor: "#000000",
  backgroundColor: "rgba(255, 182, 193, 0.3)",
  x: 50, // Center horizontally
  y: 50, // Center vertically for 9:16
  width: 90, // 90% width
  height: undefined // Auto height
};

const mockScenes: Scene[] = [
  { 
    id: 1, 
    thumbnail: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=225&fit=crop", 
    duration: "5s", 
    text: "India's GDP Growth Surpasses Expectations in Q3",
    voiceover: "India's economy has shown exceptional growth in the third quarter, surpassing all expectations.",
    textStyle16x9: { ...defaultTextStyle16x9 },
    textStyle9x16: { ...defaultTextStyle9x16 }
  },
  { 
    id: 2, 
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop", 
    duration: "5s", 
    text: "Q3 Shows Strong Recovery",
    voiceover: "The third quarter demonstrates remarkable economic recovery across multiple sectors.",
    textStyle16x9: { ...defaultTextStyle16x9 },
    textStyle9x16: { ...defaultTextStyle9x16 }
  },
  { 
    id: 3, 
    thumbnail: "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=225&fit=crop", 
    duration: "5s", 
    text: "Manufacturing Sector Leads Growth",
    voiceover: "Manufacturing industries have emerged as the primary driver of economic expansion.",
    textStyle16x9: { ...defaultTextStyle16x9 },
    textStyle9x16: { ...defaultTextStyle9x16 }
  },
  { 
    id: 4, 
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=225&fit=crop", 
    duration: "5s", 
    text: "Experts Predict Continued Momentum",
    voiceover: "Economic analysts forecast sustained growth momentum in the coming quarters.",
    textStyle16x9: { ...defaultTextStyle16x9 },
    textStyle9x16: { ...defaultTextStyle9x16 }
  },
  { 
    id: 5, 
    thumbnail: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=400&h=225&fit=crop", 
    duration: "5s", 
    text: "Investment Inflows at Record High",
    voiceover: "Foreign and domestic investments have reached unprecedented levels this quarter.",
    textStyle16x9: { ...defaultTextStyle16x9 },
    textStyle9x16: { ...defaultTextStyle9x16 }
  },
  { 
    id: 6, 
    thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=225&fit=crop", 
    duration: "5s", 
    text: "Future Outlook Remains Positive",
    voiceover: "The economic outlook for the next fiscal year remains optimistic and promising.",
    textStyle16x9: { ...defaultTextStyle16x9 },
    textStyle9x16: { ...defaultTextStyle9x16 }
  },
];

const fonts = [
  "Bebas Neue",
  "Inter",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Poppins",
  "Lato",
  "Playfair Display",
];

// Template themes (matching VideoCreationForm)
const themes = [
  { id: "1", name: "Breaking News", preview: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=225&fit=crop", category: "Previously Used" },
  { id: "2", name: "Modern Clean", preview: "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=225&fit=crop", category: "AI Recommended" },
  { id: "3", name: "Bold Headlines", preview: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=225&fit=crop", category: "AI Recommended" },
  { id: "4", name: "Minimal Dark", preview: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&h=225&fit=crop", category: "All" },
  { id: "5", name: "Times of India", preview: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=225&fit=crop", category: "Previously Used" },
  { id: "6", name: "Economic Times", preview: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=225&fit=crop", category: "All" },
  { id: "7", name: "News Classic", preview: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&h=225&fit=crop", category: "Previously Used" },
  { id: "8", name: "Business News", preview: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop", category: "AI Recommended" },
  { id: "9", name: "Editorial Style", preview: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=225&fit=crop", category: "All" },
  { id: "10", name: "Newsroom Pro", preview: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=225&fit=crop", category: "All" },
];

const verticalThemes = [
  { id: "v1", name: "Story Pop", preview: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=1067&fit=crop&crop=center&q=90&auto=format", category: "Previously Used" },
  { id: "v2", name: "Neon Vibes", preview: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=1067&fit=crop&crop=center&q=90&auto=format", category: "AI Recommended" },
  { id: "v3", name: "Classic Serif", preview: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=600&h=1067&fit=crop&crop=center&q=90&auto=format", category: "All" },
  { id: "v4", name: "Modern Minimal", preview: "https://images.unsplash.com/photo-1557683316-973673baf926?w=600&h=1067&fit=crop&crop=center&q=90&auto=format", category: "AI Recommended" },
  { id: "v5", name: "Bold Colors", preview: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&h=1067&fit=crop&crop=center&q=90&auto=format", category: "All" },
  { id: "v6", name: "Times of India", preview: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=1067&fit=crop&crop=center&q=90&auto=format", category: "Previously Used" },
  { id: "v7", name: "Economic Times", preview: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=1067&fit=crop&crop=center&q=90&auto=format", category: "All" },
  { id: "v8", name: "News Story", preview: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&h=1067&fit=crop&crop=center&q=90&auto=format", category: "Previously Used" },
  { id: "v9", name: "Business Vertical", preview: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=1067&fit=crop&crop=center&q=90&auto=format", category: "AI Recommended" },
  { id: "v10", name: "Editorial Vertical", preview: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=1067&fit=crop&crop=center&q=90&auto=format", category: "All" },
  { id: "v11", name: "Newsroom Mobile", preview: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=1067&fit=crop&crop=center&q=90&auto=format", category: "All" },
];

export function PreviewEditMode({ onBack, onAdvancedEdit }: PreviewEditModeProps) {
  const { theme, setTheme } = useTheme();
  const [activeScene, setActiveScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFormat, setCurrentFormat] = useState<"16:9" | "9:16">("16:9");
  const [progress, setProgress] = useState([0]);
  const [scenes, setScenes] = useState<Scene[]>(mockScenes);
  const [selectedAudio, setSelectedAudio] = useState("Background Music 1");
  const [isTextEditing, setIsTextEditing] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mouseDownPos, setMouseDownPos] = useState({ x: 0, y: 0 });
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [selectedTemplate16x9, setSelectedTemplate16x9] = useState<string>("1");
  const [selectedTemplate9x16, setSelectedTemplate9x16] = useState<string>("v1");
  const textRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const currentScene = scenes[activeScene];
  const currentTextStyle = currentFormat === "16:9" 
    ? currentScene.textStyle16x9 
    : currentScene.textStyle9x16;

  const handleTextClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't trigger if clicking on resize handles
    if ((e.target as HTMLElement).closest('[class*="resize"]')) {
      return;
    }
    e.stopPropagation();
    const textElement = e.currentTarget;
    const rect = textElement.getBoundingClientRect();
    const previewContainer = textElement.closest('.relative.rounded-xl') as HTMLElement;
    if (previewContainer) {
      const containerRect = previewContainer.getBoundingClientRect();
      // Position toolbar centered above the text element
      // For vertical format, ensure toolbar doesn't get cut off at top
      const topPosition = currentFormat === "9:16" 
        ? Math.max(80, rect.top - containerRect.top - 10)
        : rect.top - containerRect.top - 10;
      setToolbarPosition({
        x: (rect.left + rect.width / 2 - containerRect.left) / containerRect.width * 100,
        y: topPosition,
      });
    }
    setIsTextEditing(true);
    // Focus the textarea if it exists
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  const updateSceneText = (text: string) => {
    const updatedScenes = [...scenes];
    updatedScenes[activeScene] = { ...updatedScenes[activeScene], text };
    setScenes(updatedScenes);
  };

  const updateSceneDuration = (duration: string) => {
    const updatedScenes = [...scenes];
    updatedScenes[activeScene] = { ...updatedScenes[activeScene], duration };
    setScenes(updatedScenes);
  };

  const updateSceneVoiceover = (voiceover: string) => {
    const updatedScenes = [...scenes];
    updatedScenes[activeScene] = { ...updatedScenes[activeScene], voiceover };
    setScenes(updatedScenes);
  };

  const updateTextStyle = useCallback((style: Partial<SceneTextStyle>) => {
    setScenes((prevScenes) => {
      const updatedScenes = [...prevScenes];
      const scene = updatedScenes[activeScene];
      if (currentFormat === "16:9") {
        updatedScenes[activeScene] = {
          ...scene,
          textStyle16x9: { ...scene.textStyle16x9, ...style },
        };
      } else {
        updatedScenes[activeScene] = {
          ...scene,
          textStyle9x16: { ...scene.textStyle9x16, ...style },
        };
      }
      return updatedScenes;
    });
  }, [activeScene, currentFormat]);

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTextEditing && !isResizing) {
      // Don't start drag if clicking on textarea or resize handles
      const target = e.target as HTMLElement;
      if (target.tagName === 'TEXTAREA' || target.closest('[class*="resize"]')) {
        return;
      }
      // Only start drag if clicking on the background/padding area, not the text content
      if (target.tagName === 'H2' || target.closest('h2')) {
        return;
      }
      e.stopPropagation();
      const textBox = e.currentTarget;
      const previewContainer = textBox.closest('.relative.rounded-xl') as HTMLElement;
      if (previewContainer) {
        const textRect = textBox.getBoundingClientRect();
        setMouseDownPos({ x: e.clientX, y: e.clientY });
        setDragStart({
          x: e.clientX - textRect.left,
          y: e.clientY - textRect.top,
        });
      }
    }
  };

  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>, handle: string) => {
    if (isTextEditing) {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      setResizeHandle(handle);
      const previewContainer = e.currentTarget.closest('.relative.rounded-xl') as HTMLElement;
      if (previewContainer && textRef.current) {
        const containerRect = previewContainer.getBoundingClientRect();
        const textRect = textRef.current.getBoundingClientRect();
        setDragStart({
          x: e.clientX - containerRect.left,
          y: e.clientY - containerRect.top,
        });
      }
    }
  };

  useEffect(() => {
    if (isTextEditing && mouseDownPos.x !== 0 && mouseDownPos.y !== 0) {
      let dragStarted = false;
      const handleMouseMove = (e: MouseEvent) => {
        if (!textRef.current) return;
        
        // Check if mouse has moved enough to start dragging (5px threshold)
        const moveDistance = Math.sqrt(
          Math.pow(e.clientX - mouseDownPos.x, 2) + Math.pow(e.clientY - mouseDownPos.y, 2)
        );
        
        if (!dragStarted && moveDistance > 5) {
          dragStarted = true;
          setIsDragging(true);
        }
        
        if (dragStarted || moveDistance > 5) {
          e.preventDefault();
          const previewContainer = textRef.current.closest('.relative.rounded-xl') as HTMLElement;
          if (previewContainer) {
            const containerRect = previewContainer.getBoundingClientRect();
            
            // Calculate new position based on mouse position minus the offset
            const newX = ((e.clientX - containerRect.left - dragStart.x) / containerRect.width) * 100;
            const newY = ((e.clientY - containerRect.top - dragStart.y) / containerRect.height) * 100;
            
            updateTextStyle({
              x: Math.max(0, Math.min(100, newX)),
              y: Math.max(0, Math.min(100, newY)),
            });
          }
        }
      };
      const handleMouseUp = () => {
        setIsDragging(false);
        setMouseDownPos({ x: 0, y: 0 });
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isTextEditing, dragStart, mouseDownPos, updateTextStyle]);

  useEffect(() => {
    if (isResizing && resizeHandle) {
      const handleMouseMove = (e: MouseEvent) => {
        if (!textRef.current || !resizeHandle) return;
        const previewContainer = textRef.current.closest('.relative.rounded-xl') as HTMLElement;
        if (previewContainer) {
          const containerRect = previewContainer.getBoundingClientRect();
          
          // Get current style from latest scenes state using functional update
          setScenes((prevScenes) => {
            const currentScene = prevScenes[activeScene];
            const currentStyle = currentFormat === "16:9" 
              ? currentScene.textStyle16x9 
              : currentScene.textStyle9x16;
            const currentXPercent = currentStyle.x || 50;
            const currentYPercent = currentStyle.y || (currentFormat === "9:16" ? 50 : 85);
            const currentWidthPercent = currentStyle.width || 90;
            const currentHeightPercent = currentStyle.height || 15;

            const mouseX = e.clientX - containerRect.left;
            const mouseY = e.clientY - containerRect.top;
            const startX = dragStart.x;
            const startY = dragStart.y;
            
            let newX = currentXPercent;
            let newY = currentYPercent;
            let newWidth = currentWidthPercent;
            let newHeight = currentHeightPercent;

            const deltaX = ((mouseX - startX) / containerRect.width) * 100;
            const deltaY = ((mouseY - startY) / containerRect.height) * 100;

            if (resizeHandle === 'right') {
              newWidth = Math.max(10, Math.min(95, currentWidthPercent + deltaX));
            } else if (resizeHandle === 'left') {
              newX = Math.max(5, Math.min(95, currentXPercent + deltaX / 2));
              newWidth = Math.max(10, Math.min(95, currentWidthPercent - deltaX));
            } else if (resizeHandle === 'bottom') {
              newHeight = Math.max(5, Math.min(50, currentHeightPercent + deltaY));
            } else if (resizeHandle === 'top') {
              newY = Math.max(5, Math.min(95, currentYPercent + deltaY / 2));
              newHeight = Math.max(5, Math.min(50, currentHeightPercent - deltaY));
            } else if (resizeHandle === 'top-left') {
              newX = Math.max(5, Math.min(95, currentXPercent + deltaX / 2));
              newY = Math.max(5, Math.min(95, currentYPercent + deltaY / 2));
              newWidth = Math.max(10, Math.min(95, currentWidthPercent - deltaX));
              newHeight = Math.max(5, Math.min(50, currentHeightPercent - deltaY));
            } else if (resizeHandle === 'top-right') {
              newY = Math.max(5, Math.min(95, currentYPercent + deltaY / 2));
              newWidth = Math.max(10, Math.min(95, currentWidthPercent + deltaX));
              newHeight = Math.max(5, Math.min(50, currentHeightPercent - deltaY));
            } else if (resizeHandle === 'bottom-left') {
              newX = Math.max(5, Math.min(95, currentXPercent + deltaX / 2));
              newWidth = Math.max(10, Math.min(95, currentWidthPercent - deltaX));
              newHeight = Math.max(5, Math.min(50, currentHeightPercent + deltaY));
            } else if (resizeHandle === 'bottom-right') {
              newWidth = Math.max(10, Math.min(95, currentWidthPercent + deltaX));
              newHeight = Math.max(5, Math.min(50, currentHeightPercent + deltaY));
            }

            // Update the scene with new style
            const updatedScenes = [...prevScenes];
            if (currentFormat === "16:9") {
              updatedScenes[activeScene] = {
                ...currentScene,
                textStyle16x9: { ...currentScene.textStyle16x9, x: newX, y: newY, width: newWidth, height: newHeight },
              };
            } else {
              updatedScenes[activeScene] = {
                ...currentScene,
                textStyle9x16: { ...currentScene.textStyle9x16, x: newX, y: newY, width: newWidth, height: newHeight },
              };
            }
            return updatedScenes;
          });
        }
      };
      const handleMouseUp = () => {
        setIsResizing(false);
        setResizeHandle(null);
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, resizeHandle, dragStart, activeScene, currentFormat]);

  useEffect(() => {
    setIsTextEditing(false);
  }, [activeScene]);

  useEffect(() => {
    // Close text editing when format changes to ensure toolbar shows correct format's values
    setIsTextEditing(false);
  }, [currentFormat]);

  useEffect(() => {
    if (isTextEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isTextEditing, currentScene.text]);

  // Synchronized scrolling between left and right panels
  useEffect(() => {
    const leftContainer = leftScrollRef.current;
    const rightContainer = rightScrollRef.current;

    if (!leftContainer || !rightContainer) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleLeftScroll = () => {
      if (!isScrollingRef.current) {
        isScrollingRef.current = true;
        rightContainer.scrollTop = leftContainer.scrollTop;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          isScrollingRef.current = false;
        }, 50);
      }
    };

    const handleRightScroll = () => {
      if (!isScrollingRef.current) {
        isScrollingRef.current = true;
        leftContainer.scrollTop = rightContainer.scrollTop;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          isScrollingRef.current = false;
        }, 50);
      }
    };

    leftContainer.addEventListener('scroll', handleLeftScroll, { passive: true });
    rightContainer.addEventListener('scroll', handleRightScroll, { passive: true });

    return () => {
      clearTimeout(scrollTimeout);
      leftContainer.removeEventListener('scroll', handleLeftScroll);
      rightContainer.removeEventListener('scroll', handleRightScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Don't close if clicking inside the toolbar or its children
      if (toolbarRef.current?.contains(target)) {
        return;
      }
      
      // Don't close if clicking on interactive elements (buttons, inputs, selects, labels)
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'LABEL' ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('label') ||
        target.closest('[role="button"]') ||
        target.closest('[role="combobox"]') ||
        target.closest('[role="option"]')
      ) {
        return;
      }
      
      // Check if any Radix UI dropdown/popover is open
      const openDropdowns = document.querySelectorAll('[data-state="open"]');
      if (openDropdowns.length > 0) {
        // Check if click is inside any open dropdown
        for (const dropdown of openDropdowns) {
          if (dropdown.contains(target)) {
            return;
          }
        }
        // If any dropdown is open, don't close the toolbar
        return;
      }
      
      // Check if target is inside any Radix UI portal or content
      let element: HTMLElement | null = target;
      while (element && element !== document.body) {
        // Check for Radix UI attributes and classes
        const id = element.id || '';
        const className = element.className || '';
        if (
          element.hasAttribute('data-radix-portal') ||
          element.hasAttribute('data-radix-popper-content-wrapper') ||
          element.hasAttribute('data-radix-select-content') ||
          element.hasAttribute('data-radix-popover-content') ||
          element.getAttribute('role') === 'dialog' ||
          element.getAttribute('role') === 'listbox' ||
          element.getAttribute('role') === 'option' ||
          className.includes('radix') ||
          id.includes('radix') ||
          className.includes('select-content') ||
          className.includes('popover-content')
        ) {
          return;
        }
        element = element.parentElement;
      }
      
      // Don't close if clicking inside the text area or text container
      if (textRef.current?.contains(target) || textareaRef.current?.contains(target)) {
        return;
      }
      
      // Only close if clicking outside all these elements
      setIsTextEditing(false);
    };

    if (isTextEditing) {
      // Use click event instead of mousedown to allow button clicks to complete first
      const timeoutId = setTimeout(() => {
        document.addEventListener("click", handleClickOutside, true);
      }, 300);
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("click", handleClickOutside, true);
      };
    }
  }, [isTextEditing]);

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="relative z-10 border-b border-border bg-card/50 backdrop-blur-xl flex-shrink-0">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div>
                <h1 className="font-display text-xl font-bold tracking-tight">
                  <span className="text-black dark:text-white">OPTIMUS</span>
                </h1>
                <p className="text-xs text-muted-foreground -mt-0.5">Preview & Quick Edit</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-muted-foreground" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                aria-label="Toggle theme"
              />
              <Sun className="w-4 h-4 text-muted-foreground" />
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsTemplateDialogOpen(true)} className="gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Change Template</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </Button>
            <Button variant="glow" size="sm" onClick={onAdvancedEdit} className="gap-2">
              <Wand2 className="w-4 h-4" />
              <span className="hidden sm:inline">Advanced Edit</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left panel - Slide thumbnails */}
        <div className="w-64 border-r border-border bg-card/50 flex flex-col min-h-0">
          {/* Format tabs */}
          <div className="p-4 pb-3 flex-shrink-0">
            <Tabs value={currentFormat} onValueChange={(v) => setCurrentFormat(v as "16:9" | "9:16")}>
              <TabsList className="w-full">
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
          </div>

          {/* Slides - Scrollable */}
          <div 
            ref={leftScrollRef}
            className="flex-1 px-4 space-y-2 min-h-0 overflow-y-auto"
          >
            {scenes.map((scene, index) => (
              <ScenePreview
                key={scene.id}
                sceneNumber={scene.id}
                thumbnail={scene.thumbnail}
                duration={scene.duration}
                active={activeScene === index}
                onClick={() => setActiveScene(index)}
                format={currentFormat}
              />
            ))}
          </div>

          {/* Add scene button */}
          <div className="p-4 pt-3 flex-shrink-0">
            <Button variant="outline" className="w-full border-dashed">
              + Add Scene
            </Button>
          </div>
        </div>

        {/* Main preview area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Preview */}
          <div className="flex-1 flex items-center justify-center p-8 bg-gradient-radial from-secondary/30 to-transparent min-h-0 overflow-hidden">
            <motion.div
              key={activeScene}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "relative rounded-xl shadow-2xl border border-border",
                currentFormat === "9:16" ? "aspect-[9/16] h-[70vh] overflow-visible" : "aspect-video w-full max-w-3xl overflow-hidden"
              )}
            >
              <div className="absolute inset-0 overflow-hidden rounded-xl">
              <img
                src={scenes[activeScene].thumbnail}
                alt={`Scene ${activeScene + 1}`}
                className="w-full h-full object-cover"
              />
              </div>
              {/* Text overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent overflow-visible pointer-events-none">
                <div
                  ref={textRef}
                  onClick={handleTextClick}
                  onMouseDown={handleDragStart}
                  className={cn(
                    "absolute rounded-lg p-3 transition-all overflow-visible",
                    isTextEditing ? "ring-2 ring-primary pointer-events-auto cursor-move" : "pointer-events-auto hover:opacity-90 cursor-text"
                  )}
                  style={{
                    backgroundColor: currentTextStyle.backgroundColor,
                    left: `${currentTextStyle.x || 50}%`,
                    top: `${currentTextStyle.y || (currentFormat === "9:16" ? 50 : 85)}%`,
                    transform: "translate(-50%, -50%)",
                    width: currentTextStyle.width ? `${currentTextStyle.width}%` : "90%",
                    height: currentTextStyle.height ? `${currentTextStyle.height}%` : "auto",
                    minWidth: "100px",
                    maxWidth: "95%",
                  }}
                >
                  {/* Resize Handles */}
                  {isTextEditing && (
                    <>
                      {/* Corner handles */}
                      <div
                        className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-white border-2 border-primary cursor-nwse-resize z-10"
                        onMouseDown={(e) => handleResizeStart(e, "top-left")}
                      />
                      <div
                        className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-white border-2 border-primary cursor-nesw-resize z-10"
                        onMouseDown={(e) => handleResizeStart(e, "top-right")}
                      />
                      <div
                        className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-white border-2 border-primary cursor-nesw-resize z-10"
                        onMouseDown={(e) => handleResizeStart(e, "bottom-left")}
                      />
                      <div
                        className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-white border-2 border-primary cursor-nwse-resize z-10"
                        onMouseDown={(e) => handleResizeStart(e, "bottom-right")}
                      />
                      {/* Edge handles */}
                      <div
                        className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-white border border-primary cursor-ns-resize z-10 rounded"
                        onMouseDown={(e) => handleResizeStart(e, "top")}
                      />
                      <div
                        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-white border border-primary cursor-ns-resize z-10 rounded"
                        onMouseDown={(e) => handleResizeStart(e, "bottom")}
                      />
                      <div
                        className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white border border-primary cursor-ew-resize z-10 rounded"
                        onMouseDown={(e) => handleResizeStart(e, "left")}
                      />
                      <div
                        className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white border border-primary cursor-ew-resize z-10 rounded"
                        onMouseDown={(e) => handleResizeStart(e, "right")}
                      />
                    </>
                  )}
                    {isTextEditing ? (
                      <textarea
                        ref={textareaRef}
                        value={currentScene.text}
                        onChange={(e) => {
                          updateSceneText(e.target.value);
                          if (textareaRef.current) {
                            textareaRef.current.style.height = 'auto';
                            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                          }
                        }}
                        onBlur={(e) => {
                          // Don't close immediately - let the click-outside handler manage it
                          // This prevents closing when clicking toolbar elements
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setIsDragging(false);
                        }}
                        className="w-full bg-transparent border-none outline-none resize-none overflow-hidden pointer-events-auto"
                        style={{
                          fontFamily: currentTextStyle.font,
                          fontSize: `${currentTextStyle.fontSize}px`,
                          fontWeight: currentTextStyle.bold ? "bold" : "normal",
                          fontStyle: currentTextStyle.italic ? "italic" : "normal",
                          color: currentTextStyle.textColor,
                          minHeight: `${currentTextStyle.fontSize * 1.5}px`,
                          lineHeight: '1.5',
                        }}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") {
                            setIsTextEditing(false);
                          }
                          e.stopPropagation();
                        }}
                      />
                    ) : (
                      <h2
                        className="font-display text-foreground select-none pointer-events-none"
                        style={{
                          fontFamily: currentTextStyle.font,
                          fontSize: `${currentTextStyle.fontSize}px`,
                          fontWeight: currentTextStyle.bold ? "bold" : "normal",
                          fontStyle: currentTextStyle.italic ? "italic" : "normal",
                          color: currentTextStyle.textColor,
                        }}
                      >
                        {currentScene.text}
                  </h2>
                    )}
                  </div>
                </div>
              
              {/* Text Editing Toolbar */}
              {isTextEditing && (
                <div
                  ref={toolbarRef}
                  className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-xl px-4 py-2.5 flex items-center gap-3 flex-nowrap"
                  style={{
                    left: `${toolbarPosition.x}%`,
                    top: `${Math.max(currentFormat === "9:16" ? 10 : toolbarPosition.y - 65, 10)}px`,
                    transform: "translateX(-50%)",
                    minWidth: "fit-content",
                    maxWidth: "95%",
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {/* Font Selector */}
                  <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                    <Select
                      value={currentTextStyle.font}
                      onValueChange={(value) => updateTextStyle({ font: value })}
                    >
                      <SelectTrigger className="w-[140px] h-8 text-xs" onClick={(e) => e.stopPropagation()}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fonts.map((font) => (
                          <SelectItem key={font} value={font}>
                            {font}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Font Size Controls */}
                  <div className="flex items-center gap-1 border border-gray-300 rounded-md px-2 h-8 bg-white">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-gray-100"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        updateTextStyle({ fontSize: Math.max(12, currentTextStyle.fontSize - 4) });
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Input
                      type="number"
                      value={currentTextStyle.fontSize}
                      onChange={(e) => {
                        e.stopPropagation();
                        const newSize = parseInt(e.target.value) || 12;
                        updateTextStyle({ fontSize: newSize });
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="w-12 h-6 text-xs text-center border-0 p-0 bg-transparent focus-visible:ring-0"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-gray-100"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        updateTextStyle({ fontSize: Math.min(200, currentTextStyle.fontSize + 4) });
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Text Color */}
                  <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <Type className="w-4 h-4" style={{ color: currentTextStyle.textColor }} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-4" onClick={(e) => e.stopPropagation()}>
                        <ColorPicker
                          value={currentTextStyle.textColor}
                          onChange={(color) => updateTextStyle({ textColor: color })}
                          type="text"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Background Color */}
                  <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          {currentTextStyle.backgroundColor === "transparent" || 
                           currentTextStyle.backgroundColor === "rgba(0,0,0,0)" ||
                           currentTextStyle.backgroundColor.includes("rgba(0, 0, 0, 0)") ? (
                            <div className="w-4 h-4 rounded border border-border bg-[linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc_100%),linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc_100%)] bg-[length:8px_8px] bg-[0_0,4px_4px]" />
                          ) : (
                            <div
                              className="w-4 h-4 rounded border border-border"
                              style={{ backgroundColor: currentTextStyle.backgroundColor }}
                            />
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-4" onClick={(e) => e.stopPropagation()}>
                      <ColorPicker
                        value={(() => {
                          const bg = currentTextStyle.backgroundColor;
                          if (bg === "transparent" || bg === "rgba(0,0,0,0)" || bg.includes("rgba(0, 0, 0, 0)")) {
                            return "transparent";
                          }
                          if (bg.startsWith('rgba') || bg.startsWith('rgb')) {
                            const match = bg.match(/\d+/g);
                            if (match && match.length >= 3) {
                              const r = parseInt(match[0]).toString(16).padStart(2, '0');
                              const g = parseInt(match[1]).toString(16).padStart(2, '0');
                              const b = parseInt(match[2]).toString(16).padStart(2, '0');
                              return `#${r}${g}${b}`;
                            }
                          }
                          return bg.startsWith('#') ? bg : '#FFB6C1';
                        })()}
                        onChange={(color) => {
                          if (color === "transparent") {
                            updateTextStyle({ backgroundColor: "transparent" });
                          } else {
                            const hex = color;
                            const r = parseInt(hex.slice(1, 3), 16);
                            const g = parseInt(hex.slice(3, 5), 16);
                            const b = parseInt(hex.slice(5, 7), 16);
                            const alpha = currentTextStyle.backgroundColor.includes('rgba') && 
                                        currentTextStyle.backgroundColor !== "transparent"
                              ? currentTextStyle.backgroundColor.match(/[\d.]+$/)?.[0] || '0.3'
                              : '0.3';
                            updateTextStyle({ backgroundColor: `rgba(${r}, ${g}, ${b}, ${alpha})` });
                          }
                        }}
                        type="background"
                      />
                    </PopoverContent>
                  </Popover>
                  </div>

                  {/* Bold */}
                  <Button
                    type="button"
                    variant={currentTextStyle.bold ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      updateTextStyle({ bold: !currentTextStyle.bold });
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <Bold className="w-4 h-4" />
                  </Button>

                  {/* Italic */}
                  <Button
                    type="button"
                    variant={currentTextStyle.italic ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      updateTextStyle({ italic: !currentTextStyle.italic });
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
              </div>
              )}
            </motion.div>
          </div>

          {/* Sleeker Timeline and controls */}
          <div className="border-t border-border bg-gradient-to-b from-card/95 to-card/90 backdrop-blur-xl flex-shrink-0">
            <div className="px-6 py-3">
              {/* Progress bar with integrated controls */}
              <div className="flex items-center gap-4 mb-3">
                {/* Slide duration indicator */}
                <div className="flex items-center justify-center w-10 h-8 rounded-md bg-secondary/50 text-xs font-medium text-muted-foreground">
                  {currentScene.duration}
                </div>
                
            {/* Progress bar */}
                <div className="flex-1 relative">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span className="font-medium">0:00</span>
                    <span className="font-medium">0:30</span>
                  </div>
              <Slider
                value={progress}
                onValueChange={setProgress}
                max={100}
                step={1}
                className="w-full"
              />
                </div>
            </div>

              {/* Controls Row */}
            <div className="flex items-center justify-between">
                {/* Left: Playback Controls */}
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 hover:bg-secondary/50"
                    onClick={() => setActiveScene(Math.max(0, activeScene - 1))}
                  >
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 shadow-md"
                >
                    {isPlaying ? <Pause className="w-4 h-4 text-primary-foreground" /> : <Play className="w-4 h-4 ml-0.5 text-primary-foreground" />}
                </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 hover:bg-secondary/50"
                    onClick={() => setActiveScene(Math.min(scenes.length - 1, activeScene + 1))}
                  >
                    <ChevronRight className="w-4 h-4" />
                </Button>
                  <div className="ml-3 px-2.5 py-1 rounded-md bg-secondary/30 text-xs font-medium text-muted-foreground">
                    {activeScene + 1} / {scenes.length}
              </div>
                </div>

                {/* Center: Audio and Duration Controls */}
                <div className="flex items-center gap-3">
                  {/* Audio Track Selector */}
                  <Select value={selectedAudio} onValueChange={setSelectedAudio}>
                    <SelectTrigger className="h-9 w-[160px] bg-background/50 border-border/50 hover:bg-background/80 transition-colors">
                      <div className="flex items-center gap-2">
                        <Music className="w-3.5 h-3.5 text-muted-foreground" />
                        <SelectValue className="text-sm" />
              </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Background Music 1">Background Music 1</SelectItem>
                      <SelectItem value="Background Music 2">Background Music 2</SelectItem>
                      <SelectItem value="Upbeat Track">Upbeat Track</SelectItem>
                      <SelectItem value="Calm Ambient">Calm Ambient</SelectItem>
                      <SelectItem value="Corporate Theme">Corporate Theme</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Slide Duration Editor */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 px-3 bg-background/50 border-border/50 hover:bg-background/80 transition-colors">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground mr-2" />
                        <span className="text-sm font-medium">{currentScene.duration}</span>
                        <ChevronDown className="w-3 h-3 text-muted-foreground ml-2" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-4">
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Slide Duration</label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="text"
                            value={currentScene.duration}
                            onChange={(e) => updateSceneDuration(e.target.value)}
                            placeholder="5s"
                            className="flex-1"
                          />
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => {
                                const current = parseInt(currentScene.duration) || 5;
                                updateSceneDuration(`${Math.max(1, current - 1)}s`);
                              }}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => {
                                const current = parseInt(currentScene.duration) || 5;
                                updateSceneDuration(`${current + 1}s`);
                              }}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
          </div>
              </div>
              <div className="flex gap-2">
                          {["3s", "5s", "7s", "10s"].map((dur) => (
                  <Button
                              key={dur}
                              variant={currentScene.duration === dur ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                              onClick={() => updateSceneDuration(dur)}
                  >
                              {dur}
                  </Button>
                ))}
              </div>
            </div>
                    </PopoverContent>
                  </Popover>
            </div>

                {/* Right: Volume Control */}
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <Slider value={[80]} max={100} className="w-24" />
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - Scene Details */}
        <div className="w-80 border-l border-border bg-card/50 flex flex-col min-h-0">
          <div className="p-4 pb-3 flex-shrink-0 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Details</h2>
          </div>

          {/* Details - Scrollable */}
          <div 
            ref={rightScrollRef}
            className="flex-1 px-4 space-y-4 min-h-0 overflow-y-auto py-4"
          >
            {scenes.map((scene, index) => (
              <div
                key={scene.id}
                className={cn(
                  "space-y-4 pb-4",
                  index < scenes.length - 1 && "border-b border-border"
                )}
              >
                {/* Caption */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Caption</Label>
                  <Input
                    value={scene.text}
                    onChange={(e) => {
                      const updatedScenes = [...scenes];
                      updatedScenes[index] = { ...updatedScenes[index], text: e.target.value };
                      setScenes(updatedScenes);
                      if (index === activeScene) {
                        updateSceneText(e.target.value);
                      }
                    }}
                    placeholder="Enter caption text..."
                    className="text-sm"
                  />
                </div>

                {/* Voiceover */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">Voiceover</Label>
                    <Select
                      value="custom"
                      onValueChange={() => {}}
                    >
                      <SelectTrigger className="h-7 w-[100px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom">Custom</SelectItem>
                        <SelectItem value="noCaption">No Caption</SelectItem>
                        <SelectItem value="sameAsCaption">Same as Caption</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    value={scene.voiceover || ""}
                    onChange={(e) => {
                      const updatedScenes = [...scenes];
                      updatedScenes[index] = { ...updatedScenes[index], voiceover: e.target.value };
                      setScenes(updatedScenes);
                      if (index === activeScene) {
                        updateSceneVoiceover(e.target.value);
                      }
                    }}
                    placeholder="Enter voiceover text..."
                    className="text-sm min-h-[80px] resize-none"
                  />
                </div>

                {/* Slide Duration */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">SLIDE DURATION</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        const current = parseInt(scene.duration) || 5;
                        const updatedScenes = [...scenes];
                        updatedScenes[index] = { ...updatedScenes[index], duration: `${Math.max(1, current - 1)}s` };
                        setScenes(updatedScenes);
                        if (index === activeScene) {
                          updateSceneDuration(updatedScenes[index].duration);
                        }
                      }}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <div className="flex-1 text-center text-sm font-medium">
                      {scene.duration}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        const current = parseInt(scene.duration) || 5;
                        const updatedScenes = [...scenes];
                        updatedScenes[index] = { ...updatedScenes[index], duration: `${current + 1}s` };
                        setScenes(updatedScenes);
                        if (index === activeScene) {
                          updateSceneDuration(updatedScenes[index].duration);
                        }
                      }}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Template Selection Dialog */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Change Template</DialogTitle>
            <DialogDescription>
              Select a template for your {currentFormat === "16:9" ? "horizontal" : "vertical"} video format
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {currentFormat === "16:9" ? (
              <div className="grid grid-cols-4 gap-4">
                {themes.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    name={theme.name}
                    preview={theme.preview}
                    format="16:9"
                    selected={selectedTemplate16x9 === theme.id}
                    onClick={() => {
                      setSelectedTemplate16x9(theme.id);
                      setIsTemplateDialogOpen(false);
                    }}
                    delay={0}
                    category={theme.category}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-4">
                {verticalThemes.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    name={theme.name}
                    preview={theme.preview}
                    format="9:16"
                    selected={selectedTemplate9x16 === theme.id}
                    onClick={() => {
                      setSelectedTemplate9x16(theme.id);
                      setIsTemplateDialogOpen(false);
                    }}
                    delay={0}
                    category={theme.category}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
