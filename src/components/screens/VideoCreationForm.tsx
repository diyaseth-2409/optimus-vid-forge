import { useState, useEffect, useRef, useCallback } from "react";
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
  Sun,
  Moon,
  Check,
  Search,
  Send,
  Edit2,
  Save,
  X,
  Plus,
  Minus,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Volume2,
  VolumeX,
  ArrowDown,
  ArrowUp,
  Settings,
  Maximize,
  Scissors,
  Calendar,
  RotateCcw,
  GripVertical,
  Palette,
  MoreVertical,
  Trash2,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { ThemeCard } from "@/components/ThemeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/components/ThemeProvider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ColorPicker } from "@/components/ui/color-picker";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VideoCreationFormProps {
  onBack: () => void;
  onPreview: () => void;
  onAdvancedEdit: () => void;
}

type FormatOption = "16:9" | "9:16" | "both";

const steps = [
  { id: 1, label: "METADATA", key: "metadata" },
  { id: 2, label: "TEMPLATE", key: "template" },
  { id: 3, label: "Configuration", key: "configuration" },
  { id: 4, label: "Preview and Quick Edits", key: "horizontalPreview" },
  { id: 5, label: "Final Output", key: "finalOutput" },
];

// Predefined caption styles
const captionStyles = [
  { 
    id: "default", 
    name: "Default", 
    backgroundColor: "rgba(0, 0, 0, 0.7)", 
    textColor: "#FFFFFF", 
    fontFamily: "Inter",
    description: "Dark background, white text"
  },
  { 
    id: "news-bold", 
    name: "News Bold", 
    backgroundColor: "#000000", 
    textColor: "#FFFFFF", 
    fontFamily: "Times New Roman",
    description: "Black background, bold white text"
  },
  { 
    id: "elegant", 
    name: "Elegant", 
    backgroundColor: "rgba(255, 255, 255, 0.9)", 
    textColor: "#1a1a1a", 
    fontFamily: "Georgia",
    description: "White background, dark text"
  },
  { 
    id: "modern", 
    name: "Modern", 
    backgroundColor: "rgba(59, 130, 246, 0.9)", 
    textColor: "#FFFFFF", 
    fontFamily: "Roboto",
    description: "Blue background, white text"
  },
  { 
    id: "minimal", 
    name: "Minimal", 
    backgroundColor: "transparent", 
    textColor: "#FFFFFF", 
    fontFamily: "Inter",
    description: "No background, white text"
  },
  { 
    id: "vibrant", 
    name: "Vibrant", 
    backgroundColor: "rgba(139, 92, 246, 0.9)", 
    textColor: "#FFFFFF", 
    fontFamily: "Poppins",
    description: "Purple background, white text"
  },
  { 
    id: "classic", 
    name: "Classic", 
    backgroundColor: "rgba(0, 0, 0, 0.85)", 
    textColor: "#FFD700", 
    fontFamily: "Playfair Display",
    description: "Dark background, gold text"
  },
  { 
    id: "clean", 
    name: "Clean", 
    backgroundColor: "rgba(255, 255, 255, 0.95)", 
    textColor: "#000000", 
    fontFamily: "Helvetica",
    description: "White background, black text"
  },
];

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

// Sortable Scene Item Component
interface SortableSceneItemProps {
  scene: { id: number; caption: string; voiceover: string; mediaUrl?: string; mediaType?: 'image' | 'video'; thumbnail?: string; sameAsCaption?: boolean; captionColor?: string; captionFontSize?: number; captionFontFamily?: string; captionX?: number; captionY?: number; captionWidth?: number; captionHeight?: number; captionBackgroundColor?: string; captionStyle?: string };
  index: number;
  activeSceneIndex: number;
  selectedCaptionIndex: number | null;
  setActiveSceneIndex: (index: number) => void;
  setSelectedCaptionIndex: (index: number | null) => void;
  format: "16:9" | "9:16";
  renderPreview: (format: "16:9" | "9:16", label: string) => React.ReactNode;
  sceneRef?: (node: HTMLElement | null) => void;
}

type MediaItem = {
  id: string;
  url: string;
  type: 'image' | 'video';
  thumbnail?: string;
};

type SceneType = {
  id: number;
  caption: string;
  voiceover: string;
  mediaUrl?: string; // Deprecated: use mediaItems instead, kept for backward compatibility
  mediaType?: 'image' | 'video'; // Deprecated: use mediaItems instead
  mediaItems?: MediaItem[]; // Array of media items (images/videos)
  activeMediaIndex?: number; // Index of currently active media item
  thumbnail?: string;
  sameAsCaption?: boolean;
  voiceoverMode?: 'noCaption' | 'custom' | 'sameAsCaption';
  captionColor?: string;
  captionFontSize?: number;
  captionFontFamily?: string;
  captionX?: number;
  captionY?: number;
  captionWidth?: number;
  captionHeight?: number;
  captionBackgroundColor?: string;
  captionStyle?: string;
  duration?: string;
};

interface UnifiedSceneCardProps {
  scene: SceneType;
  index: number;
  activeSceneIndex: number;
  selectedCaptionIndex: number | null;
  setActiveSceneIndex: (index: number) => void;
  setSelectedCaptionIndex: (index: number | null) => void;
  scenesData: SceneType[];
  setScenesData: React.Dispatch<React.SetStateAction<SceneType[]>>;
  format: "16:9" | "9:16";
  isDraggingCaption: boolean;
  setIsDraggingCaption: (value: boolean) => void;
  isResizingCaption: boolean;
  setIsResizingCaption: (value: boolean) => void;
  setDragStart: (value: { x: number; y: number }) => void;
  setResizeHandle: (value: string) => void;
  setResizeStart: (value: { x: number; y: number; width: number; height: number | undefined }) => void;
  setReplaceVideoSceneIndex: (index: number | null) => void;
  setIsReplaceVideoDialogOpen: (value: boolean) => void;
  captionStyles: Array<{ id: string; name: string; backgroundColor: string; textColor: string; fontFamily: string; description: string }>;
}

function UnifiedSceneCard({
  scene,
  index,
  activeSceneIndex,
  selectedCaptionIndex,
  setActiveSceneIndex,
  setSelectedCaptionIndex,
  scenesData,
  setScenesData,
  format,
  isDraggingCaption,
  setIsDraggingCaption,
  isResizingCaption,
  setIsResizingCaption,
  setDragStart,
  setResizeHandle,
  setResizeStart,
  setReplaceVideoSceneIndex,
  setIsReplaceVideoDialogOpen,
  captionStyles,
}: UnifiedSceneCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: scene.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const voiceoverMode = scene.voiceoverMode || (scene.sameAsCaption ? 'sameAsCaption' : 'custom');

  const renderPreview = (previewFormat: "16:9" | "9:16", label: string) => (
    <div
      key={`${scene.id}-${previewFormat}`}
      data-scene-preview={index}
      className={cn(
        "relative rounded-lg border overflow-hidden",
        previewFormat === "9:16" ? "aspect-[9/16]" : "aspect-video"
      )}
    >
      {scene.mediaUrl && scene.mediaType === 'video' ? (
        <video
          src={scene.mediaUrl}
          className="w-full h-full object-cover object-center"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          muted
          playsInline
        />
      ) : (
        <img
          src={scene.thumbnail || scene.mediaUrl || "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=225&fit=crop"}
          alt={`Scene ${scene.id} - ${label}`}
          className="w-full h-full object-cover object-center"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />

      {/* Caption overlay - Draggable and Resizable */}
      {scene.caption && (() => {
        const isCaptionSelected = selectedCaptionIndex === index;
        const x = scene.captionX || 0;
        const y = scene.captionY || 85;
        const width = scene.captionWidth || 100;
        const height = scene.captionHeight || undefined;
        
        const handleCaptionClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (isCaptionSelected) {
            setSelectedCaptionIndex(null);
          } else {
            setSelectedCaptionIndex(index);
          }
        };
        
        const handleMouseDown = (e: React.MouseEvent) => {
          if (isCaptionSelected && !isResizingCaption) {
            const container = e.currentTarget.closest('[data-scene-preview]');
            if (container) {
              const rect = container.getBoundingClientRect();
              const offsetX = ((e.clientX - rect.left) / rect.width) * 100 - x;
              const offsetY = ((e.clientY - rect.top) / rect.height) * 100 - y;
              setDragStart({ x: offsetX, y: offsetY });
              setIsDraggingCaption(true);
            }
          }
        };
        
        const handleResizeStart = (e: React.MouseEvent, handle: string) => {
          e.stopPropagation();
          if (isCaptionSelected) {
            setResizeHandle(handle);
            setIsResizingCaption(true);
            const container = e.currentTarget.closest('[data-scene-preview]');
            if (container) {
              const rect = container.getBoundingClientRect();
              setResizeStart({
                x: e.clientX,
                y: e.clientY,
                width: width,
                height: height,
              });
            }
    }
  };
        
        const captionStyle: React.CSSProperties = {
          left: `${x}%`,
          top: `${y}%`,
          width: `${width}%`,
        };
        if (height !== undefined) {
          captionStyle.height = `${height}%`;
        }

  return (
    <div
            className={cn(
              "absolute z-20",
              isCaptionSelected && "cursor-move"
            )}
            style={captionStyle}
            onClick={handleCaptionClick}
            onMouseDown={handleMouseDown}
          >
            {isCaptionSelected && (
              <div className="absolute inset-0 border-2 border-primary rounded pointer-events-none" />
            )}
            {(() => {
              const selectedStyle = scene.captionStyle && scene.captionStyle !== "default" 
                ? captionStyles.find(s => s.id === scene.captionStyle)
                : null;
              const bgColor = selectedStyle 
                ? selectedStyle.backgroundColor 
                : (scene.captionBackgroundColor || "rgba(0, 0, 0, 0.7)");
              const textColor = selectedStyle 
                ? selectedStyle.textColor 
                : (scene.captionColor || "#FFFFFF");
              const fontFamily = selectedStyle 
                ? selectedStyle.fontFamily 
                : (scene.captionFontFamily || "Inter");
              
              return (
                <div
                  className={cn(
                    "p-2 rounded cursor-pointer",
                    height === undefined ? "min-h-fit" : "h-full",
                    isCaptionSelected && bgColor === "transparent" && "border border-primary/30"
                  )}
                  style={{
                    backgroundColor: bgColor === "transparent" ? "transparent" : bgColor,
                  }}
                >
                  <p
                    className="font-semibold break-words"
                    style={{
                      color: textColor,
                      fontSize: `${scene.captionFontSize || 16}px`,
                      fontFamily: fontFamily,
                    }}
                  >
                    {scene.caption}
                  </p>
                </div>
              );
            })()}
            {isCaptionSelected && (
              <>
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary border border-white rounded-full cursor-nwse-resize z-30" onMouseDown={(e) => handleResizeStart(e, 'top-left')} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary border border-white rounded-full cursor-nesw-resize z-30" onMouseDown={(e) => handleResizeStart(e, 'top-right')} />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary border border-white rounded-full cursor-nesw-resize z-30" onMouseDown={(e) => handleResizeStart(e, 'bottom-left')} />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary border border-white rounded-full cursor-nwse-resize z-30" onMouseDown={(e) => handleResizeStart(e, 'bottom-right')} />
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-primary border border-white rounded cursor-ns-resize z-30" onMouseDown={(e) => handleResizeStart(e, 'top')} />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-primary border border-white rounded cursor-ns-resize z-30" onMouseDown={(e) => handleResizeStart(e, 'bottom')} />
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary border border-white rounded cursor-ew-resize z-30" onMouseDown={(e) => handleResizeStart(e, 'left')} />
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary border border-white rounded cursor-ew-resize z-30" onMouseDown={(e) => handleResizeStart(e, 'right')} />
              </>
            )}
          </div>
        );
      })()}
      
      <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 hover:opacity-100 transition-opacity">
        <Button
          variant="secondary"
          size="sm"
          className="gap-2"
          onClick={(e) => {
            e.stopPropagation();
            setReplaceVideoSceneIndex(index);
            setIsReplaceVideoDialogOpen(true);
          }}
        >
          <Upload className="w-4 h-4" />
          Replace Media
        </Button>
      </div>
    </div>
  );

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border p-4 space-y-4 relative",
        activeSceneIndex === index
          ? "border-primary ring-2 ring-primary/30 shadow-md bg-primary/5" 
          : "border-border"
      )}
      onClick={() => {
          setActiveSceneIndex(index);
          setSelectedCaptionIndex(null);
      }}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 z-20 p-1.5 rounded bg-background/90 backdrop-blur-sm border border-border/50 hover:bg-background cursor-grab active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      
      {/* Preview Section */}
      <div className="w-full">
        {renderPreview(format, format === "9:16" ? "Vertical" : "Horizontal")}
      </div>
      
      {/* Details Section */}
      <div className="flex flex-col space-y-3">
        {/* Caption Section */}
        <div>
          <Label className="text-xs font-semibold mb-1 block">Caption</Label>
          <Textarea
            value={scene.caption}
            onChange={(e) => {
              const updated = [...scenesData];
              updated[index].caption = e.target.value;
              const mode = updated[index].voiceoverMode || (updated[index].sameAsCaption ? 'sameAsCaption' : 'custom');
              if (mode === 'sameAsCaption') {
                updated[index].voiceover = e.target.value;
              }
              setScenesData(updated);
            }}
            className="min-h-[32px] text-sm"
            placeholder="Enter caption text..."
          />
        </div>

        {/* Voiceover Section */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label className="text-xs font-semibold shrink-0">Voiceover</Label>
            <div className="flex-1 flex justify-end">
              <Select
                value={voiceoverMode}
                onValueChange={(value: 'noCaption' | 'custom' | 'sameAsCaption') => {
                  const updated = [...scenesData];
                  updated[index].voiceoverMode = value;
                  updated[index].sameAsCaption = value === 'sameAsCaption';
                  if (value === 'sameAsCaption') {
                    updated[index].voiceover = updated[index].caption;
                  } else if (value === 'noCaption') {
                    updated[index].voiceover = '';
                  }
                  setScenesData(updated);
                }}
              >
                <SelectTrigger className="w-[140px] h-6 text-xs shrink-0 py-0 px-2 rounded-none">
                  <SelectValue placeholder="Select voiceover option" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="noCaption" className="text-xs rounded-none">No Voiceover</SelectItem>
                  <SelectItem value="custom" className="text-xs rounded-none">Custom</SelectItem>
                  <SelectItem value="sameAsCaption" className="text-xs rounded-none">Same as Caption</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {(voiceoverMode === 'custom' || voiceoverMode === 'sameAsCaption') && (
            <Textarea
              value={scene.voiceover || ""}
              onChange={(e) => {
                const updated = [...scenesData];
                const mode = updated[index].voiceoverMode || (updated[index].sameAsCaption ? 'sameAsCaption' : 'custom');
                if (mode === 'custom') {
                  updated[index].voiceover = e.target.value;
                  setScenesData(updated);
                }
              }}
              className="min-h-[36px] text-xs w-full"
              placeholder={voiceoverMode === 'sameAsCaption' ? "Same as caption (synced automatically)" : "Enter voiceover text..."}
              disabled={voiceoverMode === 'sameAsCaption'}
            />
          )}
        </div>

        {/* Scene Duration Selection */}
        <div className="pt-2 border-t border-border/50">
          <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">SCENE DURATION</Label>
          <div className="flex items-center gap-1 border border-border rounded-md px-2 h-9 bg-background">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-secondary"
              onClick={() => {
                const currentDuration = scene.duration || "5s";
                const numericValue = parseInt(currentDuration.replace('s', '')) || 5;
                const newValue = Math.max(1, numericValue - 1);
                const updated = [...scenesData];
                updated[index].duration = `${newValue}s`;
                setScenesData(updated);
              }}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <Input
              type="text"
              value={scene.duration || "5s"}
              onChange={(e) => {
                const updated = [...scenesData];
                updated[index].duration = e.target.value;
                setScenesData(updated);
              }}
              className="flex-1 h-6 text-center border-0 p-0 bg-transparent focus-visible:ring-0"
              placeholder="5s"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-secondary"
              onClick={() => {
                const currentDuration = scene.duration || "5s";
                const numericValue = parseInt(currentDuration.replace('s', '')) || 5;
                const newValue = numericValue + 1;
                const updated = [...scenesData];
                updated[index].duration = `${newValue}s`;
                setScenesData(updated);
              }}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component to get sortable attributes for a scene row
function SortableSceneRow({
  sceneId,
  children,
}: {
  sceneId: number;
  children: (props: {
    attributes: any;
    listeners: any;
    setNodeRef: (node: HTMLElement | null) => void;
    style: React.CSSProperties;
  }) => React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sceneId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return <>{children({ attributes, listeners, setNodeRef, style })}</>;
}

function SortableSceneItem({
  scene,
  index,
  activeSceneIndex,
  selectedCaptionIndex,
  setActiveSceneIndex,
  setSelectedCaptionIndex,
  format,
  renderPreview,
  sceneRef,
}: SortableSceneItemProps) {
  // This component is now just for the thumbnail preview, not sortable
  return (
    <div
      data-scene-index={index}
      className={cn(
        "relative rounded-lg border-2 overflow-hidden transition-all cursor-pointer",
        activeSceneIndex === index
          ? "border-primary ring-2 ring-primary/30 shadow-md"
          : "border-border hover:border-primary/50"
      )}
      onClick={(e) => {
        // Only set active scene if not clicking on caption
        if (!(e.target as HTMLElement).closest('[data-caption-overlay]')) {
          setActiveSceneIndex(index);
          setSelectedCaptionIndex(null);
        }
      }}
    >
      <div className={format === "9:16" ? "max-w-[200px] mx-auto" : ""}>
        <div className="p-2">
          {renderPreview(format, format)}
        </div>
      </div>
    </div>
  );
}

interface SortableMediaItemProps {
  mediaItem: MediaItem;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  canDelete?: boolean; // Allow deletion if there's more than one item
  onReplace?: () => void; // Optional replace functionality
}

function SortableMediaItem({
  mediaItem,
  index,
  isActive,
  onSelect,
  onDelete,
  canDelete = true,
  onReplace,
}: SortableMediaItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: mediaItem.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "relative rounded border overflow-hidden cursor-move transition-all group",
        isActive
          ? "ring-2 ring-primary border-primary"
          : "border-border hover:border-primary/50"
      )}
      onClick={onSelect}
    >
      <div className="aspect-video w-full">
        {mediaItem.type === 'video' ? (
          <video
            src={mediaItem.url}
            className="w-full h-full object-cover"
            muted
            playsInline
          />
        ) : (
          <img
            src={mediaItem.thumbnail || mediaItem.url}
            alt={`Media ${index + 1}`}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      {/* 3-dots menu for media options - always visible */}
      <div className="absolute top-1 right-1 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-0.5 rounded bg-background/90 backdrop-blur-sm border border-border/50 hover:bg-background"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-3 h-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {onReplace && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onReplace();
                }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Replace
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                if (canDelete) {
                  onDelete();
                }
              }}
              disabled={!canDelete}
              className="text-red-600 focus:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {mediaItem.type === 'video' && (
        <div className="absolute bottom-1 left-1 p-0.5 rounded bg-black/60 backdrop-blur-sm">
          <Video className="w-2.5 h-2.5 text-white" />
        </div>
      )}
    </div>
  );
}

export function VideoCreationForm({
  onBack,
  onPreview,
  onAdvancedEdit,
}: VideoCreationFormProps) {
  const { theme, setTheme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedSearchQuery, setUploadedSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [videoTab, setVideoTab] = useState("videos");
  const [videoFormatTab, setVideoFormatTab] = useState("horizontal");
  const [uploadedVideoFormatTab, setUploadedVideoFormatTab] = useState("horizontal");
  const [templateFormatTab, setTemplateFormatTab] = useState("horizontal");
  const [musicSearchQuery, setMusicSearchQuery] = useState("");
  const [musicFilter, setMusicFilter] = useState<"all" | "my-uploads" | "previously-used" | "ai-recommended">("all");
  const [uploadedMusic, setUploadedMusic] = useState<Array<{ id: string; name: string; duration: string; source: string; category?: string }>>([]);
  const [scenesData, setScenesData] = useState<SceneType[]>([]);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [originalValues, setOriginalValues] = useState<{ caption: string; voiceover: string; sameAsCaption: boolean; voiceoverMode?: 'noCaption' | 'custom' | 'sameAsCaption'; captionColor?: string; captionFontSize?: number; captionFontFamily?: string; captionX?: number; captionY?: number; captionWidth?: number; captionHeight?: number; captionBackgroundColor?: string; captionStyle?: string } | null>(null);
  const [isDraggingCaption, setIsDraggingCaption] = useState(false);
  const [isResizingCaption, setIsResizingCaption] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [selectedCaptionIndex, setSelectedCaptionIndex] = useState<number | null>(null);
  const [selectedAiVoice, setSelectedAiVoice] = useState("voice2");
  const [selectedVideoForEdit, setSelectedVideoForEdit] = useState<{ id: string; title: string; thumbnail: string; duration: string; isVertical?: boolean } | null>(null);
  const [videoStartTime, setVideoStartTime] = useState("00:00");
  const [videoEndTime, setVideoEndTime] = useState("00:00");
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  const [isDraggingCurrent, setIsDraggingCurrent] = useState(false);
  const [isHoveringVideo, setIsHoveringVideo] = useState(false);
  const [selectedSceneForVideo, setSelectedSceneForVideo] = useState("ai");
  const [selectedMusicForEdit, setSelectedMusicForEdit] = useState<{ id: string; name: string; duration: string; source: string; category?: string } | null>(null);
  const [musicStartTime, setMusicStartTime] = useState("00:00");
  const [musicEndTime, setMusicEndTime] = useState("00:00");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicCurrentTime, setMusicCurrentTime] = useState(0);
  const [isDraggingMusicStart, setIsDraggingMusicStart] = useState(false);
  const [isDraggingMusicEnd, setIsDraggingMusicEnd] = useState(false);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isAiVoicePlaying, setIsAiVoicePlaying] = useState(false);
  const [previewVoiceId, setPreviewVoiceId] = useState<string | null>(null);
  const aiVoiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const [aiRewriteMenuOpen, setAiRewriteMenuOpen] = useState<{ title: boolean; description: boolean; keywords: boolean }>({
    title: false,
    description: false,
    keywords: false,
  });
  const [panelResetKey, setPanelResetKey] = useState(0);
  const [horizontalPanelResetKey, setHorizontalPanelResetKey] = useState(0);
  const [verticalPanelResetKey, setVerticalPanelResetKey] = useState(0);
  const [horizontalPreviewTab, setHorizontalPreviewTab] = useState<"horizontal" | "vertical">("horizontal");
  const [finalOutputTab, setFinalOutputTab] = useState<"horizontal" | "vertical">("horizontal");
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isReplaceVideoDialogOpen, setIsReplaceVideoDialogOpen] = useState(false);
  const [replaceVideoSceneIndex, setReplaceVideoSceneIndex] = useState<number | null>(null);
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [addMediaSceneIndex, setAddMediaSceneIndex] = useState<number | null>(null);
  const [replaceVideoTab, setReplaceVideoTab] = useState<"upload" | "slike">("upload");
  const [replaceVideoSearchQuery, setReplaceVideoSearchQuery] = useState("");
  const [selectedVideoForTrim, setSelectedVideoForTrim] = useState<{ id: string; title: string; thumbnail: string; duration: string; file?: File; url?: string } | null>(null);
  const [isVideoTrimDialogOpen, setIsVideoTrimDialogOpen] = useState(false);
  const [videoTrimStartTime, setVideoTrimStartTime] = useState("00:00");
  const [videoTrimEndTime, setVideoTrimEndTime] = useState("00:00");
  const [videoTrimCurrentTime, setVideoTrimCurrentTime] = useState(0);
  const [isVideoTrimPlaying, setIsVideoTrimPlaying] = useState(false);
  const [isVideoTrimMuted, setIsVideoTrimMuted] = useState(true);
  const [videoTrimVolume, setVideoTrimVolume] = useState(100);
  const [isHoveringVideoTrim, setIsHoveringVideoTrim] = useState(false);
  const [isDraggingVideoTrimStart, setIsDraggingVideoTrimStart] = useState(false);
  const [isDraggingVideoTrimEnd, setIsDraggingVideoTrimEnd] = useState(false);
  const videoTrimRef = useRef<HTMLVideoElement | null>(null);
  
  // Logo configuration state
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [logoPlacement, setLogoPlacement] = useState<"top-left" | "top-right" | "bottom-left" | "bottom-right" | null>(null);
  const [logoToggle, setLogoToggle] = useState<"no-logo" | "upload-logo">("no-logo");
  const [isLogoUploadDialogOpen, setIsLogoUploadDialogOpen] = useState(false);
  
  // Pre and Post Slates state
  const [preSlate, setPreSlate] = useState<string | null>(null);
  const [postSlate, setPostSlate] = useState<string | null>(null);
  const [preSlateSearchQuery, setPreSlateSearchQuery] = useState("");
  const [postSlateSearchQuery, setPostSlateSearchQuery] = useState("");
  
  // Mock slate options
  const slateOptions = [
    { id: "slate1", name: "Intro Slate 1", type: "pre" },
    { id: "slate2", name: "Intro Slate 2", type: "pre" },
    { id: "slate3", name: "Outro Slate 1", type: "post" },
    { id: "slate4", name: "Outro Slate 2", type: "post" },
    { id: "slate5", name: "Brand Intro", type: "pre" },
    { id: "slate6", name: "Brand Outro", type: "post" },
  ];
  
  // Refs for scene sync (used in preview steps)
  const sceneRefsMap = useRef<Map<number, HTMLElement>>(new Map());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrolling = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const verticalSceneRefsMap = useRef<Map<number, HTMLElement>>(new Map());
  const verticalScrollContainerRef = useRef<HTMLDivElement>(null);
  const isVerticalUserScrolling = useRef(false);
  const verticalScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Refs for synchronized scrolling between left and right panels
  const leftPanelScrollRef = useRef<HTMLDivElement>(null);
  const rightPanelScrollRef = useRef<HTMLDivElement>(null);
  const verticalLeftPanelScrollRef = useRef<HTMLDivElement>(null);
  const sceneDetailsRefsMap = useRef<Map<number, HTMLElement>>(new Map());
  const sceneThumbnailHeights = useRef<Map<number, number>>(new Map());
  
  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Reset panels to default sizes when entering preview
  useEffect(() => {
    if (currentStep === 3) {
      // When entering preview, reset to 50/50 split
      setHorizontalPanelResetKey(prev => prev + 1);
    }
  }, [currentStep]);

  // Handle drag end for scene reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Check if this is a media item drag (string ID) or scene drag (number ID)
      const activeId = String(active.id);
      const overId = String(over.id);
      
      // Check if both IDs are media item IDs (they should be UUIDs or similar strings)
      const isMediaItemDrag = activeId.startsWith('media-') || overId.startsWith('media-');
      
      if (isMediaItemDrag) {
        // Handle media item reordering within a scene
        const sceneIndex = scenesData.findIndex(scene => 
          scene.mediaItems?.some(item => item.id === activeId || item.id === overId)
        );
        
        if (sceneIndex !== -1 && scenesData[sceneIndex].mediaItems) {
          setScenesData((items) => {
            const updated = [...items];
            const scene = updated[sceneIndex];
            if (scene.mediaItems) {
              const oldIndex = scene.mediaItems.findIndex(item => item.id === activeId);
              const newIndex = scene.mediaItems.findIndex(item => item.id === overId);
              
              if (oldIndex !== -1 && newIndex !== -1) {
                const newMediaItems = arrayMove(scene.mediaItems, oldIndex, newIndex);
                updated[sceneIndex] = {
                  ...scene,
                  mediaItems: newMediaItems,
                  // Update activeMediaIndex if needed
                  activeMediaIndex: scene.activeMediaIndex === oldIndex 
                    ? newIndex 
                    : scene.activeMediaIndex === newIndex 
                    ? oldIndex 
                    : scene.activeMediaIndex,
                };
              }
            }
            return updated;
          });
        }
      } else {
        // Handle scene reordering
      setScenesData((items) => {
        const oldIndex = items.findIndex((item) => item.id === Number(active.id));
        const newIndex = items.findIndex((item) => item.id === Number(over.id));
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        // Update scene IDs to match new order
        return newItems.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
      });
      
      // Update active scene index if needed
      const oldIndex = scenesData.findIndex((item) => item.id === Number(active.id));
      const newIndex = scenesData.findIndex((item) => item.id === Number(over.id));
      if (activeSceneIndex === oldIndex) {
        setActiveSceneIndex(newIndex);
      } else if (activeSceneIndex === newIndex) {
        setActiveSceneIndex(oldIndex);
      } else if (activeSceneIndex > oldIndex && activeSceneIndex <= newIndex) {
        setActiveSceneIndex(activeSceneIndex - 1);
      } else if (activeSceneIndex < oldIndex && activeSceneIndex >= newIndex) {
        setActiveSceneIndex(activeSceneIndex + 1);
        }
      }
    }
  };

  // Handle adding a new scene manually
  const handleAddScene = () => {
    const newSceneId = scenesData.length > 0 
      ? Math.max(...scenesData.map(s => s.id)) + 1 
      : 1;
    
    const newScene = {
      id: newSceneId,
      caption: `New Scene ${newSceneId}`,
      voiceover: `Voiceover text for scene ${newSceneId}`,
      thumbnail: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=225&fit=crop",
      captionColor: "#FFFFFF",
      captionFontSize: 16,
      captionFontFamily: "Inter",
      captionX: 0,
      captionY: 85,
      captionWidth: 100,
      captionHeight: 15,
      captionBackgroundColor: "rgba(0, 0, 0, 0.7)",
      captionStyle: "default",
      sameAsCaption: false,
      duration: "5s",
    };
    
    setScenesData([...scenesData, newScene]);
    setActiveSceneIndex(scenesData.length); // Set the new scene as active
  };
  const [uploadedVideos, setUploadedVideos] = useState<Array<{ id: string; title: string; thumbnail: string; duration: string }>>([
    {
      id: "u1",
      title: "My First Uploaded Video",
      thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop",
      duration: "01:23",
    },
    {
      id: "u2",
      title: "Project Presentation Video",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
      duration: "02:15",
    },
    {
      id: "u3",
      title: "Tutorial Recording",
      thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=225&fit=crop",
      duration: "03:42",
    },
    {
      id: "u4",
      title: "Product Demo Video",
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop",
      duration: "01:58",
    },
  ]);

  // Mock videos from Slike
  const slikeVideos = [
    {
      id: "1",
      title: "Shilpa Shetty Sets Fashion Goals In Latest Photoshoot",
      thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=225&fit=crop",
      duration: "00:34",
    },
    {
      id: "2",
      title: "Piyush Mishra To Perform Aarambh 2.0 In Pune",
      thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop",
      duration: "00:40",
    },
    {
      id: "3",
      title: "Mary Kom Shares Fitness Inspiration At Health Event",
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop",
      duration: "00:35",
    },
    {
      id: "4",
      title: "Dharmendra Remembered At Condolence Meet In ...",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop",
      duration: "00:42",
    },
    {
      id: "5",
      title: "Samantha Ruth Prabhu",
      thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=225&fit=crop",
      duration: "00:36",
    },
    {
      id: "6",
      title: "Ishaan Khatter Impresses",
      thumbnail: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=225&fit=crop",
      duration: "00:33",
    },
    {
      id: "7",
      title: "Rahul Gandhi Meets Lionel Messi During GOAT India ...",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop",
      duration: "00:38",
    },
    {
      id: "8",
      title: "Police Detain Organiser After Messi Event Chaos",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop",
      duration: "00:37",
    },
  ];

  // AI Voice options
  const aiVoices = [
    { id: "voice1", name: "Professional Male", gender: "Male", accent: "Neutral" },
    { id: "voice2", name: "Professional Female", gender: "Female", accent: "Neutral" },
    { id: "voice3", name: "News Anchor Male", gender: "Male", accent: "American" },
    { id: "voice4", name: "News Anchor Female", gender: "Female", accent: "American" },
    { id: "voice5", name: "Warm Female", gender: "Female", accent: "British" },
    { id: "voice6", name: "Authoritative Male", gender: "Male", accent: "British" },
  ];

  // Background music tracks
  const musicTracks = [
    { id: "m1", name: "News Upbeat Modern", duration: "2:34", source: "AI Selected", category: "AI Recommended" },
    { id: "m2", name: "Corporate Professional", duration: "3:12", source: "Library", category: "Previously Used" },
    { id: "m3", name: "Energetic Pop", duration: "2:58", source: "Library", category: "Library" },
    { id: "m4", name: "Calm Ambient", duration: "4:20", source: "Library", category: "Previously Used" },
    { id: "m5", name: "Tech Innovation", duration: "3:05", source: "Library", category: "AI Recommended" },
    { id: "m6", name: "Motivational Uplift", duration: "2:45", source: "Library", category: "Library" },
    { id: "m7", name: "Newsroom Background", duration: "3:30", source: "Library", category: "Previously Used" },
    { id: "m8", name: "Modern Cinematic", duration: "2:50", source: "Library", category: "Library" },
  ];

  // Form state
  const [formData, setFormData] = useState({
    title: "India's GDP Growth Surpasses Expectations in Q3",
    description: "India's economy has demonstrated remarkable resilience in the third quarter, with GDP growth exceeding all expectations. The comprehensive economic recovery can be attributed to several key factors including robust manufacturing output, strong service sector performance, and increased consumer spending. The agricultural sector has also contributed significantly to this growth trajectory. Government initiatives and policy reforms have played a crucial role in stimulating economic activity across various sectors. This positive trend indicates a promising outlook for the remainder of the fiscal year, with analysts predicting sustained growth momentum.",
    keywords: "GDP, Economy, India, Growth, Q3",
    category: "Economy",
    scenes: "6",
    videoType: "news",
    format: "both" as FormatOption,
    selectedTheme16x9: "",
    selectedTheme9x16: "",
    backgroundMusic: "",
    backgroundMusicVolumeType: "default" as "default" | "adaptive" | "custom",
    backgroundMusicVolume: 50,
    voiceoverVolumeType: "default" as "default" | "adaptive" | "custom",
    voiceoverVolume: 50,
  });

  // Initialize scenes data based on number of scenes
  useEffect(() => {
    const numScenes = parseInt(formData.scenes) || 6;
    if (scenesData.length !== numScenes) {
      const dummyCaptions = [
        "India's GDP Growth Surpasses Expectations in Q3",
        "The economy has demonstrated remarkable resilience",
        "Robust manufacturing output drives recovery",
        "Service sector performance exceeds expectations",
        "Government initiatives fuel economic growth",
        "Positive outlook for the remainder of the fiscal year",
      ];
      const dummyVoiceovers = [
        "India's economy has shown exceptional growth in the third quarter, surpassing all expectations.",
        "The comprehensive economic recovery can be attributed to several key factors.",
        "Manufacturing output has been particularly strong, contributing significantly to GDP growth.",
        "The service sector has also performed exceptionally well, exceeding previous forecasts.",
        "Government initiatives and policy reforms have played a crucial role in stimulating economic activity.",
        "This positive trend indicates a promising outlook for the remainder of the fiscal year.",
      ];
      
      const dummyThumbnails = [
        "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=225&fit=crop",
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop",
        "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=225&fit=crop",
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=225&fit=crop",
        "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=400&h=225&fit=crop",
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=225&fit=crop",
      ];
      
      setScenesData(
        Array.from({ length: numScenes }, (_, i) => ({
          id: i + 1,
          caption: dummyCaptions[i] || `Scene ${i + 1} caption`,
          voiceover: dummyVoiceovers[i] || `Scene ${i + 1} voiceover text`,
          thumbnail: dummyThumbnails[i] || "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=225&fit=crop",
          captionColor: "#FFFFFF",
          captionFontSize: 16,
          captionFontFamily: "Inter",
          captionX: 0,
          captionY: 85,
          captionWidth: 100,
          captionHeight: 15,
          captionBackgroundColor: "rgba(0, 0, 0, 0.7)",
          captionStyle: "default",
          duration: "5s",
        }))
      );
    }
  }, [formData.scenes]);

  // Track original values when active scene changes
  useEffect(() => {
    if (scenesData[activeSceneIndex]) {
      setOriginalValues({
        caption: scenesData[activeSceneIndex].caption,
        voiceover: scenesData[activeSceneIndex].voiceover,
        sameAsCaption: scenesData[activeSceneIndex].sameAsCaption || false,
        voiceoverMode: scenesData[activeSceneIndex].voiceoverMode || (scenesData[activeSceneIndex].sameAsCaption ? 'sameAsCaption' : 'custom'),
        captionColor: scenesData[activeSceneIndex].captionColor || "#FFFFFF",
        captionFontSize: scenesData[activeSceneIndex].captionFontSize || 16,
        captionFontFamily: scenesData[activeSceneIndex].captionFontFamily || "Inter",
        captionX: scenesData[activeSceneIndex].captionX || 0,
        captionY: scenesData[activeSceneIndex].captionY || 85,
        captionWidth: scenesData[activeSceneIndex].captionWidth || 100,
        captionHeight: scenesData[activeSceneIndex].captionHeight || 15,
        captionBackgroundColor: scenesData[activeSceneIndex].captionBackgroundColor || "rgba(0, 0, 0, 0.7)",
        captionStyle: scenesData[activeSceneIndex].captionStyle || "default",
      });
    }
  }, [activeSceneIndex, scenesData.length]);

  // Deselect caption when active scene changes
  useEffect(() => {
    setSelectedCaptionIndex(null);
  }, [activeSceneIndex]);

  // Handle caption dragging
  useEffect(() => {
    if (isDraggingCaption) {
      const handleMouseMove = (e: MouseEvent) => {
        const activeScene = scenesData[activeSceneIndex];
        if (!activeScene) return;
        
        const container = document.querySelector(`[data-scene-preview="${activeSceneIndex}"]`);
        if (!container) return;
        
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left - dragStart.x) / rect.width) * 100;
        const y = ((e.clientY - rect.top - dragStart.y) / rect.height) * 100;
        
        const updated = [...scenesData];
        updated[activeSceneIndex] = {
          ...updated[activeSceneIndex],
          captionX: Math.max(0, Math.min(100 - (updated[activeSceneIndex].captionWidth || 100), x)),
          captionY: Math.max(0, Math.min(100 - (updated[activeSceneIndex].captionHeight || 15), y)),
        };
        setScenesData(updated);
      };
      
      const handleMouseUp = () => {
        setIsDraggingCaption(false);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingCaption, dragStart, activeSceneIndex, scenesData]);

  // Handle caption resizing
  useEffect(() => {
    if (isResizingCaption && resizeHandle) {
      const handleMouseMove = (e: MouseEvent) => {
        const activeScene = scenesData[activeSceneIndex];
        if (!activeScene) return;
        
        const container = document.querySelector(`[data-scene-preview="${activeSceneIndex}"]`);
        if (!container) return;
        
        const rect = container.getBoundingClientRect();
        const deltaX = ((e.clientX - resizeStart.x) / rect.width) * 100;
        const deltaY = ((e.clientY - resizeStart.y) / rect.height) * 100;
        
        const updated = [...scenesData];
        let newX = activeScene.captionX || 0;
        let newY = activeScene.captionY || 85;
        let newWidth = activeScene.captionWidth || 100;
        let newHeight = activeScene.captionHeight || 15;
        
        if (resizeHandle.includes('right')) {
          newWidth = Math.max(10, Math.min(100 - newX, resizeStart.width + deltaX));
        }
        if (resizeHandle.includes('left')) {
          const widthChange = -deltaX;
          if (newX + widthChange >= 0 && newWidth - widthChange >= 10) {
            newX += widthChange;
            newWidth -= widthChange;
          }
        }
        if (resizeHandle.includes('bottom')) {
          newHeight = Math.max(5, Math.min(100 - newY, resizeStart.height + deltaY));
        }
        if (resizeHandle.includes('top')) {
          const heightChange = -deltaY;
          if (newY + heightChange >= 0 && newHeight - heightChange >= 5) {
            newY += heightChange;
            newHeight -= heightChange;
          }
        }
        
        updated[activeSceneIndex] = {
          ...updated[activeSceneIndex],
          captionX: newX,
          captionY: newY,
          captionWidth: newWidth,
          captionHeight: newHeight,
        };
        setScenesData(updated);
      };
      
      const handleMouseUp = () => {
        setIsResizingCaption(false);
        setResizeHandle(null);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizingCaption, resizeHandle, resizeStart, activeSceneIndex, scenesData]);

  // Cleanup audio when component unmounts or step changes
  useEffect(() => {
    return () => {
      if (aiVoiceAudioRef.current) {
        aiVoiceAudioRef.current.pause();
        aiVoiceAudioRef.current.currentTime = 0;
        setIsAiVoicePlaying(false);
      }
    };
  }, [currentStep]);

  // Intersection Observer for smooth scene sync in Horizontal Preview
  useEffect(() => {
    if (currentStep !== 3 || !scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    
    let updateTimeout: NodeJS.Timeout | null = null;
    let rafId: number | null = null;

    const findMostVisibleScene = () => {
      if (!container) return activeSceneIndex;
      
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;
      const containerHeight = containerRect.height;
      
      let bestIndex = activeSceneIndex;
      let bestScore = -Infinity;
      
      // Improved approach: consider both visibility and distance from center
      sceneRefsMap.current.forEach((element, index) => {
        if (!element) return;
        
        try {
          const rect = element.getBoundingClientRect();
          
          // Calculate how much of the element is visible in the container
          const visibleTop = Math.max(rect.top, containerRect.top);
          const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          const visibilityRatio = visibleHeight / rect.height;
          
          // Calculate distance from container center
          const elementCenter = rect.top + rect.height / 2;
          const distanceFromCenter = Math.abs(elementCenter - containerCenter);
          const normalizedDistance = Math.min(1, distanceFromCenter / (containerHeight / 2));
          
          // Combined score: visibility ratio weighted more, distance weighted less
          // Higher score = better (more visible and closer to center)
          const score = visibilityRatio * 0.85 + (1 - normalizedDistance) * 0.15;
          
          // Only consider elements that are at least 20% visible
          if (visibilityRatio > 0.2 && score > bestScore) {
            bestScore = score;
            bestIndex = index;
          }
        } catch (e) {
          // Skip if element is not in DOM
        }
      });
      
      // If we found a valid scene, return it; otherwise keep current
      return bestScore > -Infinity ? bestIndex : activeSceneIndex;
    };

    const updateActiveScene = (force = false) => {
      // Always allow updates during scroll - the scroll handler should always update
      // Only block if not forced and we're in a brief debounce period
      if (!force && isUserScrolling.current) {
        // Still allow updates if we're in the middle of scrolling (not just stopped)
        // This helps with slow scrolling
        return;
      }
      
      const mostVisible = findMostVisibleScene();
      // Always update if we found a different scene
      if (mostVisible !== activeSceneIndex && mostVisible >= 0 && mostVisible < scenesData.length) {
        setActiveSceneIndex(mostVisible);
      }
    };

    const handleScroll = () => {
      // Always update during scroll - don't block updates
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      rafId = requestAnimationFrame(() => {
        // Clear existing timeout
        if (updateTimeout) {
          clearTimeout(updateTimeout);
        }
        
        // Always update immediately during scroll (bypass the flag check)
        const mostVisible = findMostVisibleScene();
        if (mostVisible !== activeSceneIndex && mostVisible >= 0 && mostVisible < scenesData.length) {
          setActiveSceneIndex(mostVisible);
        }
        
        // Set flag only briefly to prevent IntersectionObserver conflicts
        // But scroll handler always updates directly
        isUserScrolling.current = true;
        updateTimeout = setTimeout(() => {
          isUserScrolling.current = false;
          // Final update after scroll stops
          const finalMostVisible = findMostVisibleScene();
          if (finalMostVisible !== activeSceneIndex && finalMostVisible >= 0 && finalMostVisible < scenesData.length) {
            setActiveSceneIndex(finalMostVisible);
          }
        }, 150); // Brief timeout for scroll end detection
      });
    };

    // Use IntersectionObserver as a fallback for more precise detection
    const observerOptions = {
      root: container,
      rootMargin: '0px',
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    };

    const observer = new IntersectionObserver((entries) => {
      // Don't block if user is scrolling - let scroll handler take precedence
      // But still process if scroll has been idle
      if (isUserScrolling.current) {
        // Still check but with a small delay to avoid conflicts
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
        rafId = requestAnimationFrame(() => {
          if (updateTimeout) {
            clearTimeout(updateTimeout);
          }
          updateTimeout = setTimeout(() => {
            const mostVisibleIndex = findMostVisibleScene();
            if (mostVisibleIndex !== activeSceneIndex && mostVisibleIndex >= 0 && mostVisibleIndex < scenesData.length) {
              setActiveSceneIndex(mostVisibleIndex);
            }
          }, 50);
        });
        return;
      }
      
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      rafId = requestAnimationFrame(() => {
        if (updateTimeout) {
          clearTimeout(updateTimeout);
        }
        
        updateTimeout = setTimeout(() => {
          // Always use distance-based method as primary (more reliable)
          const mostVisibleIndex = findMostVisibleScene();
          
          if (mostVisibleIndex !== activeSceneIndex && mostVisibleIndex >= 0 && mostVisibleIndex < scenesData.length) {
            setActiveSceneIndex(mostVisibleIndex);
          }
        }, 20); // Reduced delay for faster response
      });
    }, observerOptions);

    // Observe all scene elements
    const observeAll = () => {
      sceneRefsMap.current.forEach((element) => {
        if (element) observer.observe(element);
      });
    };

    // Initial observation
    observeAll();

    // Set up scroll listener
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also check periodically for any missed updates (more frequent for better sync)
    const intervalId = setInterval(() => {
      // Force update during interval to catch any missed changes
      // Always update, even during scroll, to catch slow scrolling
      updateActiveScene(true);
    }, 50); // More frequent checks for slow scrolling

    // Re-observe when scenes change
    const reobserveTimeout = setTimeout(() => {
      observeAll();
      // Also update after re-observing
      setTimeout(() => updateActiveScene(true), 50);
    }, 100);
    
    // Also re-observe after a longer delay to catch any late-rendered elements
    const delayedReobserve = setTimeout(() => {
      observeAll();
      updateActiveScene(true);
    }, 500);
    
    // Initial update check - multiple attempts to ensure it works
    const initialUpdate1 = setTimeout(() => {
      updateActiveScene(true);
    }, 50);
    const initialUpdate2 = setTimeout(() => {
      updateActiveScene(true);
    }, 200);
    const initialUpdate3 = setTimeout(() => {
      updateActiveScene(true);
    }, 500);

    return () => {
      observer.disconnect();
      container.removeEventListener('scroll', handleScroll);
      clearInterval(intervalId);
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      clearTimeout(reobserveTimeout);
      clearTimeout(delayedReobserve);
      clearTimeout(initialUpdate1);
      clearTimeout(initialUpdate2);
      clearTimeout(initialUpdate3);
    };
  }, [currentStep, scenesData.length, activeSceneIndex, horizontalPreviewTab]);

  // Scroll synchronization using refs to prevent infinite loops
  const isSyncingFromLeftRef = useRef(false);
  const isSyncingFromRightRef = useRef(false);

  // Scroll handler functions for inline use
  const handleLeftPanelScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (currentStep !== 3) return;
    
    const container = e.currentTarget;
    
    // Detect which scene is most visible and highlight it
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.top + containerRect.height / 2;
    const containerHeight = containerRect.height;
    
    let bestIndex = activeSceneIndex;
    let bestScore = -Infinity;
    
    sceneRefsMap.current.forEach((element, index) => {
      if (!element) return;
      
      try {
        const rect = element.getBoundingClientRect();
        
        // Calculate how much of the element is visible in the container
        const visibleTop = Math.max(rect.top, containerRect.top);
        const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibilityRatio = visibleHeight / rect.height;
        
        // Calculate distance from container center
        const elementCenter = rect.top + rect.height / 2;
        const distanceFromCenter = Math.abs(elementCenter - containerCenter);
        const normalizedDistance = Math.min(1, distanceFromCenter / (containerHeight / 2));
        
        // Combined score: visibility ratio weighted more, distance weighted less
        const score = visibilityRatio * 0.85 + (1 - normalizedDistance) * 0.15;
        
        // Only consider elements that are at least 30% visible
        if (visibilityRatio > 0.3 && score > bestScore) {
          bestScore = score;
          bestIndex = index;
        }
      } catch (e) {
        // Skip if element is not in DOM
      }
    });
    
    // Update active scene if we found a different one
    if (bestIndex !== activeSceneIndex && bestIndex >= 0 && bestIndex < scenesData.length) {
      // Temporarily disable auto-sync when updating from scroll
      isUserScrolling.current = true;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrolling.current = false;
      }, 300);
      
      setActiveSceneIndex(bestIndex);
    }
  }, [currentStep, activeSceneIndex, scenesData.length]);

  const handleRightPanelScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (currentStep !== 3 || isSyncingFromLeftRef.current) return;
    
    const rightContainer = e.currentTarget;
    const leftContainer = leftPanelScrollRef.current;
    
    if (!leftContainer) return;
    
    isSyncingFromRightRef.current = true;
    const leftMaxScroll = Math.max(0, leftContainer.scrollHeight - leftContainer.clientHeight);
    const rightMaxScroll = Math.max(0, rightContainer.scrollHeight - rightContainer.clientHeight);
    
    if (leftMaxScroll > 0 && rightMaxScroll > 0) {
      const rightScrollPercent = Math.min(1, Math.max(0, rightContainer.scrollTop / rightMaxScroll));
      leftContainer.scrollTop = rightScrollPercent * leftMaxScroll;
    } else if (rightMaxScroll > 0 && leftMaxScroll === 0) {
      // Left panel doesn't need to scroll, do nothing
    }
    
    setTimeout(() => {
      isSyncingFromRightRef.current = false;
    }, 10);
  }, [currentStep, horizontalPreviewTab]);

  const handleVerticalLeftPanelScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (currentStep !== 3 || horizontalPreviewTab !== 'vertical') return;
    
    const leftContainer = e.currentTarget;
    const rightContainer = rightPanelScrollRef.current;
    
    // Sync scroll with right panel
    if (!isSyncingFromRightRef.current && rightContainer) {
      isSyncingFromLeftRef.current = true;
      const leftMaxScroll = Math.max(0, leftContainer.scrollHeight - leftContainer.clientHeight);
      const rightMaxScroll = Math.max(0, rightContainer.scrollHeight - rightContainer.clientHeight);
      
      if (leftMaxScroll > 0 && rightMaxScroll > 0) {
        const leftScrollPercent = Math.min(1, Math.max(0, leftContainer.scrollTop / leftMaxScroll));
        rightContainer.scrollTop = leftScrollPercent * rightMaxScroll;
      }
      
      setTimeout(() => {
        isSyncingFromLeftRef.current = false;
      }, 10);
    }
    
    // Detect which scene is most visible and highlight it
    const containerRect = leftContainer.getBoundingClientRect();
    const containerCenter = containerRect.top + containerRect.height / 2;
    const containerHeight = containerRect.height;
    
    let bestIndex = activeSceneIndex;
    let bestScore = -Infinity;
    
    sceneRefsMap.current.forEach((element, index) => {
      if (!element) return;
      
      try {
        const rect = element.getBoundingClientRect();
        const visibleTop = Math.max(rect.top, containerRect.top);
        const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibilityRatio = visibleHeight / rect.height;
        const elementCenter = rect.top + rect.height / 2;
        const distanceFromCenter = Math.abs(elementCenter - containerCenter);
        const normalizedDistance = Math.min(1, distanceFromCenter / (containerHeight / 2));
        const score = visibilityRatio * 0.85 + (1 - normalizedDistance) * 0.15;
        
        if (visibilityRatio > 0.3 && score > bestScore) {
          bestScore = score;
          bestIndex = index;
        }
      } catch (e) {
        // Skip if element is not in DOM
      }
    });
    
    if (bestIndex !== activeSceneIndex && bestIndex >= 0 && bestIndex < scenesData.length) {
      isUserScrolling.current = true;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrolling.current = false;
      }, 300);
      setActiveSceneIndex(bestIndex);
    }
  }, [currentStep, activeSceneIndex, scenesData.length, horizontalPreviewTab]);

  // Auto-scroll RHS to active scene's details when activeSceneIndex changes
  useEffect(() => {
    if (currentStep !== 3) return;
    
    const activeSceneDetailsElement = sceneDetailsRefsMap.current.get(activeSceneIndex);
    const rightContainer = rightPanelScrollRef.current;
    
    if (activeSceneDetailsElement && rightContainer && !isSyncingFromRightRef.current) {
      // Temporarily disable sync to prevent feedback loop
      isSyncingFromRightRef.current = true;
      
      // Calculate scroll position to center the active scene's details
      const elementTop = activeSceneDetailsElement.offsetTop;
      const elementHeight = activeSceneDetailsElement.offsetHeight;
      const containerHeight = rightContainer.clientHeight;
      
      // Scroll to center the active scene's details in the viewport
      const scrollPosition = elementTop - (containerHeight / 2) + (elementHeight / 2);
      
      rightContainer.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
      
      setTimeout(() => {
        isSyncingFromRightRef.current = false;
      }, 500); // Wait for smooth scroll to complete
    }
  }, [activeSceneIndex, currentStep]);

  // Sync heights between LHS scene thumbnails and RHS details sections
  useEffect(() => {
    if (currentStep !== 3) return;

    const updateHeights = () => {
      sceneRefsMap.current.forEach((element, index) => {
        if (element) {
          const height = element.offsetHeight;
          sceneThumbnailHeights.current.set(index, height);
          
          // Apply height to corresponding details section
          const detailsElement = sceneDetailsRefsMap.current.get(index);
          if (detailsElement && height > 0) {
            detailsElement.style.minHeight = `${height}px`;
          }
        }
      });
    };

    // Initial measurement with a small delay to ensure DOM is ready
    const initialTimeout = setTimeout(() => {
      updateHeights();
    }, 100);

    // Use ResizeObserver to track height changes
    const resizeObserver = new ResizeObserver(() => {
      updateHeights();
    });

    // Observe all scene thumbnails
    sceneRefsMap.current.forEach((element) => {
      if (element) {
        resizeObserver.observe(element);
      }
    });

    // Also observe details elements for any changes
    sceneDetailsRefsMap.current.forEach((element) => {
      if (element) {
        resizeObserver.observe(element);
      }
    });

    // Also observe window resize
    window.addEventListener('resize', updateHeights);

    // Re-measure when scenes change
    const scenesChangeTimeout = setTimeout(() => {
      updateHeights();
    }, 200);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(scenesChangeTimeout);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeights);
    };
  }, [currentStep, scenesData.length, horizontalPreviewTab]);

  const filteredVideos = slikeVideos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUploadedVideos = uploadedVideos.filter((video) =>
    video.title.toLowerCase().includes(uploadedSearchQuery.toLowerCase())
  );

  const toggleVideo = (videoId: string) => {
    const video = [...slikeVideos, ...uploadedVideos].find(v => v.id === videoId);
    if (video) {
      // Determine if video is vertical based on current format tab
      const isVertical = videoTab === "videos" ? videoFormatTab === "vertical" : uploadedVideoFormatTab === "vertical";
      setSelectedVideoForEdit({ ...video, isVertical });
      // Parse duration to seconds for end time
      const durationParts = video.duration.split(":");
      const durationSeconds = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
      setVideoEndTime(video.duration);
      setVideoCurrentTime(0);
      setIsVideoPlaying(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const parseTime = (timeString: string): number => {
    const parts = timeString.split(":");
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  };

  const handleAddVideo = () => {
    if (selectedVideoForEdit) {
      // Add video to selected scene or let AI decide
      if (selectedSceneForVideo === "ai") {
        console.log(`Adding video ${selectedVideoForEdit.id} - AI will decide scene assignment with trim: ${videoStartTime} - ${videoEndTime}`);
      } else {
        const sceneNumber = parseInt(selectedSceneForVideo);
        console.log(`Adding video ${selectedVideoForEdit.id} to scene ${sceneNumber} with trim: ${videoStartTime} - ${videoEndTime}`);
      }
      
      if (!selectedVideos.includes(selectedVideoForEdit.id)) {
        setSelectedVideos([...selectedVideos, selectedVideoForEdit.id]);
      }
      setSelectedVideoForEdit(null);
      // Reset scene selection to AI decides
      setSelectedSceneForVideo("ai");
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // If we're on TEMPLATE step with "both" format and on horizontal tab, switch to vertical
    if (currentStep === 1 && formData.format === "both" && templateFormatTab === "horizontal") {
      setTemplateFormatTab("vertical");
      return;
    }
    
    // Skip steps based on format
    let nextStep = currentStep + 1;
    
    // No longer skipping preview step for 9:16 - it now has vertical preview
    
    if (nextStep < steps.length) {
      setCurrentStep(nextStep);
    } else {
      // Last step - proceed to preview
      setIsOpen(false);
      onPreview();
    }
  };

  const handleBack = () => {
    // If we're on TEMPLATE step with "both" format and on vertical tab, switch to horizontal
    if (currentStep === 1 && formData.format === "both" && templateFormatTab === "vertical") {
      setTemplateFormatTab("horizontal");
      return;
    }
    
    // Skip steps based on format when going back
    let prevStep = currentStep - 1;
    
    // No longer skipping preview step for 9:16 - it now has vertical preview
    
    if (prevStep >= 0) {
      setCurrentStep(prevStep);
    } else {
      setIsOpen(false);
      onBack();
    }
  };

  const handleResetPanels = () => {
    // Reset panels to default size by forcing a re-render with new key
    // For horizontal preview: 50/50 split
    if (currentStep === 3) {
      // Horizontal preview
      setHorizontalPanelResetKey(prev => prev + 1);
    }
    setPanelResetKey(prev => prev + 1);
  };

  const handleClose = () => {
    setIsOpen(false);
    onBack();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // METADATA
        return (
          <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="title">Video Title</Label>
                      <Popover open={aiRewriteMenuOpen.title} onOpenChange={(open) => setAiRewriteMenuOpen(prev => ({ ...prev, title: open }))}>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Sparkles className="w-4 h-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-1 bg-white border border-gray-200 shadow-lg" align="end">
                          <div className="space-y-0">
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm">
                              Short & Concise
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm">
                              Factual
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm">
                              Conversational
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm">
                              Dramatic
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm">
                              Viral
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm flex items-center justify-between">
                              <span>Translate</span>
                              <ChevronRight className="w-4 h-4 text-gray-500" />
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm">
                              Custom Prompt
                            </button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Input
                      id="title"
                value={formData.title}
                onChange={(e) => updateFormData("title", e.target.value)}
                className="mt-1"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="description">Video Description</Label>
                      <Popover open={aiRewriteMenuOpen.description} onOpenChange={(open) => setAiRewriteMenuOpen(prev => ({ ...prev, description: open }))}>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Sparkles className="w-4 h-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-1 bg-white border border-gray-200 shadow-lg" align="end">
                          <div className="space-y-0">
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm">
                              Short & Concise
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm">
                              Factual
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm">
                              Conversational
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm">
                              Dramatic
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm">
                              Viral
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm flex items-center justify-between">
                              <span>Translate</span>
                              <ChevronRight className="w-4 h-4 text-gray-500" />
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm">
                              Custom Prompt
                            </button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Textarea
                      id="description"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                className="mt-1 min-h-[120px]"
                    />
                  </div>
            {/* Keywords - Full width */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="keywords">Keywords / Tags</Label>
                <Popover open={aiRewriteMenuOpen.keywords} onOpenChange={(open) => setAiRewriteMenuOpen(prev => ({ ...prev, keywords: open }))}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Sparkles className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-1" align="end">
                    <div className="space-y-0.5">
                      <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-sm">
                        Short & Concise
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-sm">
                        Factual
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-sm">
                        Conversational
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-sm">
                        Dramatic
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-sm">
                        Viral
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-sm flex items-center justify-between">
                        <span>Translate</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-sm">
                        Custom Prompt
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => updateFormData("keywords", e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Category, Number of Scenes, and Video Format in one row */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
                  <SelectTrigger className="mt-1">
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
              
              <div>
                <Label htmlFor="scenes">Number of Scenes</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    onClick={() => {
                      const current = parseInt(formData.scenes) || 6;
                      if (current > 4) {
                        updateFormData("scenes", (current - 1).toString());
                      }
                    }}
                    disabled={parseInt(formData.scenes) <= 4}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    id="slides"
                    type="number"
                    min="4"
                    max="10"
                    value={formData.scenes}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || (parseInt(value) >= 4 && parseInt(value) <= 10)) {
                        updateFormData("scenes", value);
                      }
                    }}
                    className="text-center w-20"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    onClick={() => {
                      const current = parseInt(formData.scenes) || 6;
                      if (current < 10) {
                        updateFormData("scenes", (current + 1).toString());
                      }
                    }}
                    disabled={parseInt(formData.scenes) >= 10}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block text-sm font-medium">Video Format</Label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateFormData("format", "16:9")}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all duration-200 flex-1 ${
                      formData.format === "16:9"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">16:9</span>
                  </button>
                  <button
                    onClick={() => updateFormData("format", "9:16")}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all duration-200 flex-1 ${
                      formData.format === "9:16"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">9:16</span>
                  </button>
                  <button
                    onClick={() => updateFormData("format", "both")}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all duration-200 flex-1 ${
                      formData.format === "both"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-0.5">
                      <Monitor className="w-3.5 h-3.5 text-muted-foreground" />
                      <Smartphone className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <span className="text-xs font-medium">Both</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // TEMPLATE
        if (formData.format === "both") {
          return (
            <div className="space-y-6">
              <Tabs value={templateFormatTab} onValueChange={setTemplateFormatTab} className="w-full">
                <div className="relative mb-8">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="horizontal" className="flex-1 gap-2">
                      <Monitor className="w-4 h-4" />
                      Horizontal
                      {formData.selectedTheme16x9 && (
                        <Check className="w-4 h-4" />
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="vertical" className="flex-1 gap-2">
                      <Smartphone className="w-4 h-4" />
                      Vertical
                      {formData.selectedTheme9x16 && (
                        <Check className="w-4 h-4" />
                      )}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="horizontal" className="mt-0">
                  <div className="grid grid-cols-4 gap-4">
                    {themes.map((theme) => (
                      <ThemeCard
                        key={theme.id}
                        name={theme.name}
                        preview={theme.preview}
                        format="16:9"
                        selected={formData.selectedTheme16x9 === theme.id}
                        onClick={() => updateFormData("selectedTheme16x9", theme.id)}
                        delay={0}
                        category={theme.category}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="vertical" className="mt-0">
                  <div className="grid grid-cols-5 gap-4">
                    {verticalThemes.map((theme) => (
                      <ThemeCard
                        key={theme.id}
                        name={theme.name}
                        preview={theme.preview}
                        format="9:16"
                        selected={formData.selectedTheme9x16 === theme.id}
                        onClick={() => updateFormData("selectedTheme9x16", theme.id)}
                        delay={0}
                        category={theme.category}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          );
        }

        return (
          <div className="space-y-8">
            <div>
              {formData.format === "16:9" && (
                <div>
                  <div className="grid grid-cols-4 gap-4">
                    {themes.map((theme) => (
                      <ThemeCard
                        key={theme.id}
                        name={theme.name}
                        preview={theme.preview}
                        format="16:9"
                        selected={formData.selectedTheme16x9 === theme.id}
                        onClick={() => updateFormData("selectedTheme16x9", theme.id)}
                        delay={0}
                        category={theme.category}
                      />
                    ))}
                  </div>
                </div>
              )}

              {formData.format === "9:16" && (
                <div>
                  <div className="grid grid-cols-5 gap-4">
                    {verticalThemes.map((theme) => (
                      <ThemeCard
                        key={theme.id}
                        name={theme.name}
                        preview={theme.preview}
                        format="9:16"
                        selected={formData.selectedTheme9x16 === theme.id}
                        onClick={() => updateFormData("selectedTheme9x16", theme.id)}
                        delay={0}
                        category={theme.category}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 2: // Configuration
        // Get all available music tracks for dropdown
        const allMusicTracks = [...musicTracks, ...uploadedMusic, { id: "none", name: "No Background Music", duration: "0:00", source: "None" }];
        const selectedMusicTrack = allMusicTracks.find(track => track.name === formData.backgroundMusic) || allMusicTracks[allMusicTracks.length - 1];
        
        // Filter slates based on search
        const filteredPreSlates = slateOptions.filter(slate => 
          slate.type === "pre" && slate.name.toLowerCase().includes(preSlateSearchQuery.toLowerCase())
        );
        const filteredPostSlates = slateOptions.filter(slate => 
          slate.type === "post" && slate.name.toLowerCase().includes(postSlateSearchQuery.toLowerCase())
        );

        return (
          <div className="space-y-6">
            {/* Section 1: Background Audio */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              {/* Section Header with Dropdown */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Music className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-lg font-semibold">Background Audio</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">Select and customize background music for your video</p>
                    </div>
                    <Select
                      value={formData.backgroundMusic || "none"}
                      onValueChange={(value) => {
                        if (value === "none") {
                          setFormData({ ...formData, backgroundMusic: "none" });
                          setSelectedMusicForEdit(null);
                          if (musicAudioRef.current) {
                            musicAudioRef.current.pause();
                            musicAudioRef.current.currentTime = 0;
                          }
                          setIsMusicPlaying(false);
                        } else {
                          const track = allMusicTracks.find(t => t.id === value || t.name === value);
                          if (track && track.id !== "none") {
                            setFormData({ ...formData, backgroundMusic: track.name });
                            setSelectedMusicForEdit(track);
                            setMusicEndTime(track.duration);
                            setMusicStartTime("00:00");
                            setMusicCurrentTime(0);
                            if (musicAudioRef.current) {
                              musicAudioRef.current.pause();
                              musicAudioRef.current.currentTime = 0;
                            }
                            setIsMusicPlaying(false);
                          }
                        }
                      }}
                    >
                      <SelectTrigger className="w-[300px]">
                        <SelectValue placeholder="Select background audio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Background Music</SelectItem>
                        {musicTracks.map((track) => (
                          <SelectItem key={track.id} value={track.name}>
                            {track.name} ({track.duration})
                          </SelectItem>
                        ))}
                        {uploadedMusic.map((track) => (
                          <SelectItem key={track.id} value={track.name}>
                            {track.name} ({track.duration})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
                          
              {formData.backgroundMusic && formData.backgroundMusic !== "none" && selectedMusicTrack && selectedMusicTrack.id !== "none" && (
                <div className="space-y-4 pt-4 border-t border-border">
                    
                    {/* Play Button and Timeline Row */}
                    <div className="flex items-center gap-2">
                      {/* Play Button */}
                            <Button
                        variant="outline"
                              size="icon"
                        onClick={() => {
                                if (musicAudioRef.current) {
                                  if (isMusicPlaying) {
                                    musicAudioRef.current.pause();
                                  } else {
                              musicAudioRef.current.currentTime = parseTime(musicStartTime);
                                    musicAudioRef.current.play();
                                  }
                                  setIsMusicPlaying(!isMusicPlaying);
                                }
                              }}
                        className="h-10 w-10 flex-shrink-0"
                            >
                              {isMusicPlaying ? (
                                <Pause className="w-5 h-5" />
                              ) : (
                                <Play className="w-5 h-5 ml-0.5" />
                              )}
                            </Button>
                      
                      {/* Current Time */}
                      <span className="text-sm text-foreground font-medium min-w-[45px]">
                        {formatTime(musicCurrentTime)}
                      </span>
                      
                      {/* Timeline Bar */}
                      <div className="flex-1 relative">
                        {/* In and Out arrow icons above the bar */}
                        <div className="absolute -top-5 left-0 right-0 h-5 pointer-events-none z-20">
                          {/* In arrow (Start marker) */}
                              <div 
                            className="absolute top-0 cursor-move pointer-events-auto"
                            style={{
                              left: `${(parseTime(musicStartTime) / parseTime(selectedMusicTrack.duration)) * 100}%`,
                              transform: 'translateX(-50%)',
                            }}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              setIsDraggingMusicStart(true);
                            }}
                          >
                            <div className="flex flex-col items-center">
                              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white drop-shadow-md" />
                              <div className="w-0.5 h-2 bg-white mt-0.5 drop-shadow-md" />
                            </div>
                          </div>
                          {/* Out arrow (End marker) */}
                          <div
                            className="absolute top-0 cursor-move pointer-events-auto"
                            style={{
                              left: `${(parseTime(musicEndTime) / parseTime(selectedMusicTrack.duration)) * 100}%`,
                              transform: 'translateX(-50%)',
                            }}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              setIsDraggingMusicEnd(true);
                            }}
                          >
                            <div className="flex flex-col items-center">
                              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white drop-shadow-md" />
                              <div className="w-0.5 h-2 bg-white mt-0.5 drop-shadow-md" />
                            </div>
                          </div>
                        </div>
                        
                        <div 
                          className="relative h-4 bg-secondary/50 rounded-full overflow-visible cursor-pointer"
                                data-music-progress
                                onClick={(e) => {
                                  if (!isDraggingMusicStart && !isDraggingMusicEnd) {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const clickX = e.clientX - rect.left;
                                    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
                              const totalDuration = parseTime(selectedMusicTrack.duration);
                                    const newTime = Math.floor(percentage * totalDuration);
                                    setMusicCurrentTime(newTime);
                                    if (musicAudioRef.current) {
                                      musicAudioRef.current.currentTime = newTime;
                                    }
                                  }
                                }}
                              >
                                {/* Selected area (between start and end time) */}
                                <div
                                  className="absolute h-full bg-primary/30 rounded-full transition-all"
                                  style={{
                              left: `${(parseTime(musicStartTime) / parseTime(selectedMusicTrack.duration)) * 100}%`,
                              width: `${((parseTime(musicEndTime) - parseTime(musicStartTime)) / parseTime(selectedMusicTrack.duration)) * 100}%`,
                                  }}
                                />
                                {/* Played portion within selected area */}
                                {musicCurrentTime >= parseTime(musicStartTime) && musicCurrentTime <= parseTime(musicEndTime) && (
                                  <div
                                    className="absolute h-full bg-primary rounded-full transition-all"
                                    style={{
                                left: `${(parseTime(musicStartTime) / parseTime(selectedMusicTrack.duration)) * 100}%`,
                                width: `${((musicCurrentTime - parseTime(musicStartTime)) / parseTime(selectedMusicTrack.duration)) * 100}%`,
                                    }}
                                  />
                                )}
                                {/* Played portion before selected area */}
                                {musicCurrentTime < parseTime(musicStartTime) && (
                                  <div
                                    className="absolute h-full bg-primary/20 rounded-full transition-all"
                                    style={{
                                width: `${(musicCurrentTime / parseTime(selectedMusicTrack.duration)) * 100}%`,
                                    }}
                                  />
                                )}
                                {/* Current position scrubber */}
                                <div
                                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-primary shadow-md z-20 cursor-pointer"
                                  style={{
                              left: `calc(${(musicCurrentTime / parseTime(selectedMusicTrack.duration)) * 100}% - 8px)`,
                                  }}
                                />
                                {/* Start marker */}
                                <div
                                  className="absolute top-1/2 -translate-y-1/2 cursor-move z-10"
                                  style={{
                              left: `${(parseTime(musicStartTime) / parseTime(selectedMusicTrack.duration)) * 100}%`,
                                    transform: 'translateX(-50%) translateY(-50%)',
                                  }}
                                  onMouseDown={(e) => {
                                    e.stopPropagation();
                                    setIsDraggingMusicStart(true);
                                  }}
                                >
                            <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-md" />
                                </div>
                                {/* End marker */}
                                <div
                                  className="absolute top-1/2 -translate-y-1/2 cursor-move z-10"
                                  style={{
                              left: `${(parseTime(musicEndTime) / parseTime(selectedMusicTrack.duration)) * 100}%`,
                                    transform: 'translateX(-50%) translateY(-50%)',
                                  }}
                                  onMouseDown={(e) => {
                                    e.stopPropagation();
                                    setIsDraggingMusicEnd(true);
                                  }}
                                >
                            <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-md" />
                                </div>
                              </div>
                        
                            <audio
                              ref={musicAudioRef}
                              onTimeUpdate={(e) => {
                                const audio = e.currentTarget;
                                const currentTime = Math.floor(audio.currentTime);
                                setMusicCurrentTime(currentTime);
                                // Stop playback if we reach the end time
                                if (currentTime >= parseTime(musicEndTime)) {
                                  audio.pause();
                                  setIsMusicPlaying(false);
                                  audio.currentTime = parseTime(musicStartTime);
                                }
                              }}
                              onEnded={() => {
                                setIsMusicPlaying(false);
                                setMusicCurrentTime(parseTime(musicStartTime));
                                if (musicAudioRef.current) {
                                  musicAudioRef.current.currentTime = parseTime(musicStartTime);
                                }
                              }}
                          src={`https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${selectedMusicTrack.id.replace('m', '').replace('u', '') || '1'}.mp3`}
                            />
                      </div>
                      
                      {/* Total Duration */}
                      <span className="text-sm text-foreground font-medium min-w-[45px] text-right">
                        {selectedMusicTrack.duration}
                      </span>
                    </div>
                    
                    {/* Bottom Row: Volume Level on Left, Start/End Time on Right */}
                    <div className="flex items-start gap-6">
                      {/* Volume Level Controls */}
                      <div className="flex items-center gap-3 flex-1">
                        <Label className="text-xs font-medium w-24">Volume Level</Label>
                        <div className="flex items-center gap-2 flex-1">
                          <Select
                            value={formData.backgroundMusicVolumeType || "default"}
                            onValueChange={(value: "default" | "adaptive" | "custom") => {
                              setFormData({ ...formData, backgroundMusicVolumeType: value });
                            }}
                          >
                            <SelectTrigger className="w-[140px]" style={{ fontSize: '11px' }}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="adaptive">Adaptive Volume</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                          {formData.backgroundMusicVolumeType === "custom" && (
                            <div className="flex items-center gap-2 flex-1">
                              <Slider
                                value={[formData.backgroundMusicVolume || 50]}
                                onValueChange={(value) => {
                                  setFormData({ ...formData, backgroundMusicVolume: value[0] });
                                }}
                                min={0}
                                max={100}
                                step={1}
                                className="flex-1 max-w-[200px]"
                              />
                              <span className="text-xs text-muted-foreground w-10">{formData.backgroundMusicVolume || 50}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Start Time and End Time on Right */}
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <Label className="text-xs font-medium">Start Time</Label>
                          <Input
                            type="text"
                            value={musicStartTime}
                            onChange={(e) => setMusicStartTime(e.target.value)}
                            className="w-20 h-8 text-center text-xs"
                            placeholder="00:00"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs font-medium">End Time</Label>
                          <Input
                            type="text"
                            value={musicEndTime}
                            onChange={(e) => setMusicEndTime(e.target.value)}
                            className="w-20 h-8 text-center text-xs"
                            placeholder="00:00"
                          />
                        </div>
                      </div>
                          </div>
                          
                          {/* Mouse move handler for dragging */}
                          {(isDraggingMusicStart || isDraggingMusicEnd) && (
                            <div
                              className="fixed inset-0 z-50 cursor-move"
                              onMouseMove={(e) => {
                                const progressBar = document.querySelector('[data-music-progress]') as HTMLElement;
                                if (progressBar) {
                                  const rect = progressBar.getBoundingClientRect();
                                  const x = e.clientX - rect.left;
                                  const percentage = Math.max(0, Math.min(1, x / rect.width));
                            const totalDuration = parseTime(selectedMusicTrack.duration);
                                  const newTime = Math.floor(percentage * totalDuration);
                                  
                                  if (isDraggingMusicStart) {
                                    const endTime = parseTime(musicEndTime);
                                    if (newTime < endTime) {
                                      setMusicStartTime(formatTime(newTime));
                                      if (musicAudioRef.current) {
                                        musicAudioRef.current.currentTime = newTime;
                                        setMusicCurrentTime(newTime);
                                      }
                                    }
                                  } else if (isDraggingMusicEnd) {
                                    const startTime = parseTime(musicStartTime);
                                    if (newTime > startTime) {
                                      setMusicEndTime(formatTime(newTime));
                                      if (musicAudioRef.current && musicAudioRef.current.currentTime > newTime) {
                                        musicAudioRef.current.currentTime = newTime;
                                        setMusicCurrentTime(newTime);
                                      }
                                    }
                                  }
                                }
                              }}
                              onMouseUp={() => {
                                setIsDraggingMusicStart(false);
                                setIsDraggingMusicEnd(false);
                              }}
                            />
                          )}
                        </div>
                )}
            </div>
            
            {/* Section 2: Logo Upload and Placement */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              {/* Section Header with Dropdown */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-lg font-semibold">Logo</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">Upload and position your logo on the video</p>
                    </div>
                    {uploadedLogo && logoToggle === "upload-logo" ? (
                      /* Logo Preview and Placement Dropdown in same row */
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <img src={uploadedLogo} alt="Logo" className="h-12 w-auto object-contain border border-border rounded" />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-background border border-border"
                            onClick={() => {
                              setUploadedLogo(null);
                              setLogoToggle("no-logo");
                              setLogoPlacement(null);
                            }}
                          >
                            <X className="w-2.5 h-2.5" />
                          </Button>
                        </div>
                        <Select
                          value={logoPlacement || ""}
                          onValueChange={(value: "top-left" | "top-right" | "bottom-left" | "bottom-right") => {
                            setLogoPlacement(value);
                          }}
                        >
                          <SelectTrigger className="w-[200px] h-8 text-xs">
                            <SelectValue placeholder="Select logo placement" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="top-left">Top Left</SelectItem>
                            <SelectItem value="top-right">Top Right</SelectItem>
                            <SelectItem value="bottom-left">Bottom Left</SelectItem>
                            <SelectItem value="bottom-right">Bottom Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      /* Upload Logo Toggle */
                      <Select
                        value={logoToggle}
                        onValueChange={(value: "no-logo" | "upload-logo") => {
                          setLogoToggle(value);
                          if (value === "upload-logo" && !uploadedLogo) {
                            setIsLogoUploadDialogOpen(true);
                          } else if (value === "no-logo") {
                            setUploadedLogo(null);
                            setLogoPlacement(null);
                          }
                        }}
                      >
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-logo">No logo</SelectItem>
                          <SelectItem value="upload-logo">Upload Logo</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </div>

              <div>
                
                {/* Logo Upload Dialog */}
                <Dialog open={isLogoUploadDialogOpen} onOpenChange={setIsLogoUploadDialogOpen}>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Upload Logo</DialogTitle>
                      <DialogDescription>
                        Select an image file to use as your logo.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                      <Button
                        variant="outline"
                      onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              setUploadedLogo(url);
                              setIsLogoUploadDialogOpen(false);
                            }
                          };
                          input.click();
                        }}
                        className="gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Choose File
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            {/* Section 3: Pre and Post Slates */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Video className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <Label className="text-lg font-semibold">Slates</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Add intro and outro slates to your video</p>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-6">
                  {/* Pre Slate */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Pre Slate</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between h-10">
                          {preSlate ? slateOptions.find(s => s.id === preSlate)?.name || "No slate" : "No slate"}
                          <ChevronDown className="w-4 h-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0" align="start">
                        <div className="p-2 border-b">
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              placeholder="Search pre slates..."
                              value={preSlateSearchQuery}
                              onChange={(e) => setPreSlateSearchQuery(e.target.value)}
                              className="pl-8"
                            />
                          </div>
                        </div>
                        <div className="max-h-[200px] overflow-y-auto">
                          {/* No slate option */}
                          <div
                            onClick={() => {
                              setPreSlate(null);
                      }}
                      className={cn(
                              "p-2 cursor-pointer hover:bg-secondary transition-colors",
                              !preSlate && "bg-primary/10"
                            )}
                          >
                            <p className="text-sm">No slate</p>
                        </div>
                          {filteredPreSlates.length > 0 ? (
                            filteredPreSlates.map((slate) => (
                              <div
                                key={slate.id}
                                onClick={() => {
                                  setPreSlate(slate.id);
                                }}
                                className={cn(
                                  "p-2 cursor-pointer hover:bg-secondary transition-colors",
                                  preSlate === slate.id && "bg-primary/10"
                                )}
                              >
                                <p className="text-sm">{slate.name}</p>
                        </div>
                            ))
                          ) : (
                            preSlateSearchQuery && (
                              <div className="p-4 text-center text-sm text-muted-foreground">
                                No pre slates found
                          </div>
                            )
                        )}
                      </div>
                      </PopoverContent>
                    </Popover>
                    </div>
                  
                  {/* Post Slate */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Post Slate</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between h-10">
                          {postSlate ? slateOptions.find(s => s.id === postSlate)?.name || "No slate" : "No slate"}
                          <ChevronDown className="w-4 h-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0" align="start">
                        <div className="p-2 border-b">
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              placeholder="Search post slates..."
                              value={postSlateSearchQuery}
                              onChange={(e) => setPostSlateSearchQuery(e.target.value)}
                              className="pl-8"
                            />
                          </div>
                        </div>
                        <div className="max-h-[200px] overflow-y-auto">
                          {/* No slate option */}
                          <div
                            onClick={() => {
                              setPostSlate(null);
                            }}
                            className={cn(
                              "p-2 cursor-pointer hover:bg-secondary transition-colors",
                              !postSlate && "bg-primary/10"
                            )}
                          >
                            <p className="text-sm">No slate</p>
                          </div>
                          {filteredPostSlates.length > 0 ? (
                            filteredPostSlates.map((slate) => (
                              <div
                                key={slate.id}
                                onClick={() => {
                                  setPostSlate(slate.id);
                                }}
                                className={cn(
                                  "p-2 cursor-pointer hover:bg-secondary transition-colors",
                                  postSlate === slate.id && "bg-primary/10"
                                )}
                              >
                                <p className="text-sm">{slate.name}</p>
                              </div>
                            ))
                          ) : (
                            postSlateSearchQuery && (
                              <div className="p-4 text-center text-sm text-muted-foreground">
                                No post slates found
                  </div>
                            )
                )}
              </div>
                      </PopoverContent>
                    </Popover>
            </div>
          </div>
              </div>
              </div>
            </div>
          );

      case 3: // Preview and Quick Edits (Horizontal or Vertical)
        const activeScenePreview = scenesData[activeSceneIndex] || scenesData[0];
        
        // Show vertical preview for 9:16 format, horizontal preview for 16:9 or both
        const isVerticalFormat = formData.format === "9:16";
        
        return (
          <div className="h-full flex flex-col">
            {/* Single scrollable container with unified rows */}
            <div className="flex-1 min-h-0 overflow-hidden">
                      <div 
                        ref={leftPanelScrollRef} 
                className="h-full overflow-y-auto scrollbar-hide"
                        onScroll={handleLeftPanelScroll}
                      >
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={scenesData.map((s) => s.id)}
                        strategy={verticalListSortingStrategy}
                      >
                    <div className="space-y-4 p-4">
                    {scenesData.map((scene, index) => {
                        const voiceoverMode = scene.voiceoverMode || (scene.sameAsCaption ? 'sameAsCaption' : 'custom');
                        const isActiveScene = activeSceneIndex === index;
                        
                        // Initialize mediaItems if not present (backward compatibility)
                        // Always ensure at least one media item exists for display
                        const mediaItems = scene.mediaItems?.length > 0 
                          ? scene.mediaItems 
                          : (scene.mediaUrl ? [{
                              id: `media-${scene.id}-0`,
                              url: scene.mediaUrl,
                              type: (scene.mediaType || 'image') as 'image' | 'video',
                              thumbnail: scene.thumbnail,
                            }] : [{
                              id: `media-${scene.id}-0`,
                              url: scene.thumbnail || "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=225&fit=crop",
                              type: 'image' as const,
                              thumbnail: scene.thumbnail || "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=225&fit=crop",
                            }]);
                        
                        // Get active media item
                        const activeMediaIndex = scene.activeMediaIndex ?? 0;
                        const activeMedia = mediaItems[activeMediaIndex] || mediaItems[0];
                        
                        const renderPreview = (format: "16:9" | "9:16", label: string) => {
                          const previewFormat = isVerticalFormat ? "9:16" : "16:9";
                          return (
                    <div
                              key={`${scene.id}-${previewFormat}`}
                      data-scene-preview={index}
                      className={cn(
                                "relative rounded-lg border overflow-hidden w-full",
                                previewFormat === "9:16" ? "aspect-[9/16]" : "aspect-video"
                      )}
                    >
                            {activeMedia ? (
                              activeMedia.type === 'video' ? (
                        <video
                                  src={activeMedia.url}
                          className="w-full h-full object-cover object-center"
                          style={{ objectFit: 'cover', objectPosition: 'center' }}
                          muted
                          playsInline
                        />
                              ) : (
                                <img
                                  src={activeMedia.thumbnail || activeMedia.url || "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=225&fit=crop"}
                                  alt={`Scene ${scene.id} - ${label}`}
                                  className="w-full h-full object-cover object-center"
                                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                                />
                              )
                      ) : (
                        <img
                          src={scene.thumbnail || scene.mediaUrl || "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=225&fit=crop"}
                          alt={`Scene ${scene.id} - ${label}`}
                          className="w-full h-full object-cover object-center"
                          style={{ objectFit: 'cover', objectPosition: 'center' }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
                      
                      {/* Play button for videos */}
                      {(() => {
                        const activeMedia = mediaItems.length > 0 && activeMediaIndex !== undefined 
                          ? mediaItems[activeMediaIndex] 
                          : null;
                        const isVideo = activeMedia?.type === 'video' || scene.mediaType === 'video';
                        if (isVideo) {
                          return (
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                              <Button
                                variant="secondary"
                                size="icon"
                                className="h-12 w-12 rounded-full bg-background/90 hover:bg-background backdrop-blur-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // TODO: Implement video playback
                                }}
                              >
                                <Play className="w-6 h-6" />
                              </Button>
                            </div>
                          );
                        }
                        return null;
                      })()}

                            {/* Caption overlay - Read-only, follows template */}
                      {scene.caption && (() => {
                              // Use template defaults - don't allow user customization
                              const x = 50; // Center horizontally (template default)
                              const y = isVerticalFormat ? 50 : 85; // Template default positioning
                              const width = 90; // 90% width (template default)
                              
                              const selectedStyle = scene.captionStyle && scene.captionStyle !== "default" 
                                ? captionStyles.find(s => s.id === scene.captionStyle)
                                : null;
                              
                              // Use style values if style is selected, otherwise use template defaults
                              const bgColor = selectedStyle 
                                ? selectedStyle.backgroundColor 
                                : (scene.captionBackgroundColor || "rgba(0, 0, 0, 0.7)");
                              const textColor = selectedStyle 
                                ? selectedStyle.textColor 
                                : (scene.captionColor || "#FFFFFF");
                              const fontFamily = selectedStyle 
                                ? selectedStyle.fontFamily 
                                : (scene.captionFontFamily || "Inter");
                              
                              const captionStyle: React.CSSProperties = {
                                left: `${x}%`,
                                top: `${y}%`,
                                width: `${width}%`,
                                transform: 'translateX(-50%)', // Center horizontally
                                pointerEvents: 'none', // Disable all interactions
                              };
                              
                              return (
                                <div
                                  className="absolute z-20"
                                  style={captionStyle}
                                  data-caption-overlay
                                >
                                  {/* Caption content with bottom padding to prevent cropping */}
                                  <div
                                    className="p-2 pb-4 rounded"
                                  style={{
                                    backgroundColor: bgColor === "transparent" ? "transparent" : bgColor,
                                    marginBottom: '8px', // Extra margin to prevent cropping
                                  }}
                                >
                                  <p
                                    className="font-semibold break-words"
                                    style={{
                                      color: textColor,
                                      fontSize: `${scene.captionFontSize || 16}px`,
                                      fontFamily: fontFamily,
                                        lineHeight: '1.5', // Better line spacing
                                        marginBottom: '0', // Ensure no extra margin
                                        paddingBottom: '4px', // Small padding to prevent text cutoff
                                    }}
                                  >
                                    {scene.caption}
                                  </p>
                                </div>
                          </div>
                        );
                      })()}
                      
                            {/* Replace Media overlay button */}
                      <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setReplaceVideoSceneIndex(index);
                            setIsReplaceVideoDialogOpen(true);
                          }}
                        >
                          <Upload className="w-4 h-4" />
                                Replace Media
                        </Button>
                      </div>
                    </div>
                  );
                        };

                      return (
                          <SortableSceneRow key={scene.id} sceneId={scene.id}>
                            {({ attributes, listeners, setNodeRef, style }) => (
                              <div
                                ref={(node) => {
                                  setNodeRef(node);
                                  if (node) {
                                    sceneRefsMap.current.set(index, node);
                                    sceneDetailsRefsMap.current.set(index, node);
                                  } else {
                                    sceneRefsMap.current.delete(index);
                                    sceneDetailsRefsMap.current.delete(index);
                                  }
                                }}
                                style={style}
                                className={cn(
                                  "flex gap-4 rounded-lg p-4 transition-all border",
                                  isActiveScene 
                                    ? "border-2 border-primary ring-2 ring-primary/30 shadow-md bg-primary/5" 
                                    : "border-border",
                                  index < scenesData.length - 1 && "mb-4 pb-4 border-b"
                                )}
                              >
                            {/* Left Side - Scene Preview */}
                            <div className={cn(
                              "flex-shrink-0 flex flex-col gap-3",
                              isVerticalFormat ? "w-[200px]" : "w-[300px]"
                            )}>
                              {/* Non-sortable thumbnail preview - sorting is handled at row level */}
                              <div
                                className={cn(
                                  "relative rounded-lg border-2 overflow-hidden transition-all cursor-pointer",
                                  isActiveScene
                                    ? "border-primary ring-2 ring-primary/30 shadow-md"
                                    : "border-border hover:border-primary/50"
                                )}
                                onClick={(e) => {
                                  if (!(e.target as HTMLElement).closest('[data-caption-overlay]')) {
                            isUserScrolling.current = true;
                            if (scrollTimeoutRef.current) {
                              clearTimeout(scrollTimeoutRef.current);
                            }
                            scrollTimeoutRef.current = setTimeout(() => {
                              isUserScrolling.current = false;
                            }, 500);
                                    setActiveSceneIndex(index);
                                    setSelectedCaptionIndex(null);
                                  }
                                }}
                              >
                                <div className={isVerticalFormat ? "max-w-[200px] mx-auto" : ""}>
                                  <div className="p-2">
                                    {renderPreview(isVerticalFormat ? "9:16" : "16:9", isVerticalFormat ? "Vertical" : "Horizontal")}
                  </div>
                                </div>
                              </div>
                              
                              {/* Media Items Thumbnails - Always show all media items */}
                              {mediaItems.length > 0 && (
                                <div className="w-full">
                                  <div className="flex items-center justify-between mb-2">
                                    <Label className="text-xs font-semibold block text-muted-foreground">Media Items</Label>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 text-xs px-2"
                                      onClick={() => {
                                        setIsAddingMedia(true);
                                        setAddMediaSceneIndex(index);
                                        setReplaceVideoSceneIndex(index);
                                        setReplaceVideoTab("upload");
                                        setReplaceVideoSearchQuery("");
                                        setIsReplaceVideoDialogOpen(true);
                                      }}
                                    >
                                      <Plus className="w-3 h-3 mr-1" />
                                      Add
                                    </Button>
                                  </div>
                                  {mediaItems.length > 1 ? (
                          <SortableContext
                                      items={mediaItems.map(item => item.id)}
                            strategy={verticalListSortingStrategy}
                          >
                                      <div className="grid grid-cols-3 gap-2">
                                        {mediaItems.map((mediaItem, mediaIndex) => (
                                          <SortableMediaItem
                                            key={mediaItem.id}
                                            mediaItem={mediaItem}
                                            index={mediaIndex}
                                            isActive={mediaIndex === activeMediaIndex}
                                            canDelete={mediaItems.length > 1}
                                            onSelect={() => {
                                              const updated = [...scenesData];
                                              updated[index] = {
                                                ...updated[index],
                                                activeMediaIndex: mediaIndex,
                                                mediaItems: updated[index].mediaItems || mediaItems,
                                              };
                                              setScenesData(updated);
                                            }}
                                            onDelete={() => {
                                              const updated = [...scenesData];
                                              const currentMediaItems = updated[index].mediaItems || mediaItems;
                                              const newMediaItems = currentMediaItems.filter((_, i) => i !== mediaIndex);
                                              
                                              // Update activeMediaIndex if needed
                                              let newActiveIndex = updated[index].activeMediaIndex ?? 0;
                                              if (mediaIndex === newActiveIndex) {
                                                // If deleting the active item, switch to the first item
                                                newActiveIndex = newMediaItems.length > 0 ? 0 : undefined;
                                              } else if (mediaIndex < newActiveIndex) {
                                                // If deleting an item before the active one, adjust index
                                                newActiveIndex = newActiveIndex - 1;
                                              }
                                              
                                              updated[index] = {
                                                ...updated[index],
                                                mediaItems: newMediaItems.length > 0 ? newMediaItems : undefined,
                                                activeMediaIndex: newActiveIndex,
                                                // Fallback to mediaUrl if no mediaItems left
                                                ...(newMediaItems.length === 0 && {
                                                  mediaUrl: undefined,
                                                  mediaType: undefined,
                                                }),
                                              };
                                              setScenesData(updated);
                                            }}
                                          />
                                        ))}
                                      </div>
                                    </SortableContext>
                                  ) : (
                                    <div className="grid grid-cols-3 gap-2">
                                      {mediaItems.map((mediaItem, mediaIndex) => (
                                        <SortableMediaItem
                                          key={mediaItem.id}
                                          mediaItem={mediaItem}
                                          index={mediaIndex}
                                          isActive={mediaIndex === activeMediaIndex}
                                          canDelete={false}
                                          onSelect={() => {
                                            const updated = [...scenesData];
                                            updated[index] = {
                                              ...updated[index],
                                              activeMediaIndex: mediaIndex,
                                              mediaItems: updated[index].mediaItems || mediaItems,
                                            };
                                            setScenesData(updated);
                                          }}
                                          onDelete={() => {
                                            // Prevent deletion if only one item
                                          }}
                                        />
                                      ))}
                                            </div>
                                        )}
                                      </div>
                              )}
                            </div>

                            {/* Right Side - Scene Details */}
                            <div className="flex-1 flex flex-col space-y-3 min-w-0">
                              {/* Caption Section with Duration */}
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <Label className="text-xs font-semibold">Caption</Label>
                                  <div className="flex items-center gap-2">
                                    <Label className="text-xs font-semibold">Scene Duration</Label>
                                    <div className="flex items-center gap-1 border border-border rounded-md px-1.5 h-7 bg-background">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5 hover:bg-secondary"
                                        onClick={() => {
                                          const currentDuration = scene.duration || "5s";
                                          const numericValue = parseInt(currentDuration.replace('s', '')) || 5;
                                          const newValue = Math.max(1, numericValue - 1);
                                          const updated = [...scenesData];
                                          updated[index].duration = `${newValue}s`;
                                          setScenesData(updated);
                                      }}
                                    >
                                        <Minus className="w-3 h-3" />
                                    </Button>
                                      <Input
                                        type="text"
                                        value={scene.duration || "5s"}
                                        onChange={(e) => {
                                          const updated = [...scenesData];
                                          updated[index].duration = e.target.value;
                                          setScenesData(updated);
                                  }}
                                        className="h-5 w-10 text-xs text-center border-0 p-0 bg-transparent focus-visible:ring-0"
                                        placeholder="5s"
                                      />
                        <Button
                                        type="button"
                                        variant="ghost"
                      size="icon"
                                        className="h-5 w-5 hover:bg-secondary"
                                        onClick={() => {
                                          const currentDuration = scene.duration || "5s";
                                          const numericValue = parseInt(currentDuration.replace('s', '')) || 5;
                                          const newValue = numericValue + 1;
                                          const updated = [...scenesData];
                                          updated[index].duration = `${newValue}s`;
                                          setScenesData(updated);
                                        }}
                    >
                                        <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                                </div>
                            <Textarea
                              value={scene.caption}
                              onChange={(e) => {
                                const updated = [...scenesData];
                                updated[index].caption = e.target.value;
                                // If "Same as Caption" mode is enabled, sync voiceover
                                const mode = updated[index].voiceoverMode || (updated[index].sameAsCaption ? 'sameAsCaption' : 'custom');
                                if (mode === 'sameAsCaption') {
                                  updated[index].voiceover = e.target.value;
                                }
                                setScenesData(updated);
                              }}
                                  className="min-h-[32px] text-sm w-full"
                              placeholder="Enter caption text..."
                            />
                          </div>

                          {/* Voiceover Section */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Label className="text-xs font-semibold shrink-0">Voiceover</Label>
                              <div className="flex-1 flex justify-end">
                                <Select
                                  value={voiceoverMode}
                                  onValueChange={(value: 'noCaption' | 'custom' | 'sameAsCaption') => {
                                    const updated = [...scenesData];
                                    updated[index].voiceoverMode = value;
                                    updated[index].sameAsCaption = value === 'sameAsCaption';
                                    if (value === 'sameAsCaption') {
                                      updated[index].voiceover = updated[index].caption;
                                    } else if (value === 'noCaption') {
                                      updated[index].voiceover = '';
                                    }
                                    setScenesData(updated);
                                  }}
                                >
                                  <SelectTrigger className="w-[140px] h-6 text-xs shrink-0 py-0 px-2 rounded-none">
                                    <SelectValue placeholder="Select voiceover option" />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-none">
                                        <SelectItem value="noCaption" className="text-xs rounded-none">No Voiceover</SelectItem>
                                    <SelectItem value="custom" className="text-xs rounded-none">Custom</SelectItem>
                                    <SelectItem value="sameAsCaption" className="text-xs rounded-none">Same as Caption</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            {(voiceoverMode === 'custom' || voiceoverMode === 'sameAsCaption') && (
                              <Textarea
                                value={scene.voiceover || ""}
                                onChange={(e) => {
                                  const updated = [...scenesData];
                                  const mode = updated[index].voiceoverMode || (updated[index].sameAsCaption ? 'sameAsCaption' : 'custom');
                                  if (mode === 'custom') {
                                    updated[index].voiceover = e.target.value;
                                    setScenesData(updated);
                                  }
                                }}
                                className="min-h-[36px] text-xs w-full"
                                placeholder={voiceoverMode === 'sameAsCaption' ? "Same as caption (synced automatically)" : "Enter voiceover text..."}
                                disabled={voiceoverMode === 'sameAsCaption'}
                              />
                            )}
                              </div>
                          </div>

                        {/* Drag Handle - Right Side (outside the input box) */}
                        <div className="flex-shrink-0 flex items-center self-center">
                          <div
                            {...attributes}
                            {...listeners}
                            data-drag-handle
                            className="p-2 rounded bg-background/90 backdrop-blur-sm border border-border/50 hover:bg-background cursor-grab active:cursor-grabbing"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                        </div>
                            )}
                          </SortableSceneRow>
                      );
                    })}
                    </div>
                  </SortableContext>
                </DndContext>
                  </div>
              </div>
            </div>
          );

      case 4: // Final Output
        return (
          <div className="h-full flex flex-col p-0 m-0">
            {formData.format === "both" ? (
              // Show tabs for both formats
              <Tabs value={finalOutputTab} onValueChange={(v) => setFinalOutputTab(v as "horizontal" | "vertical")} className="w-full h-full flex flex-col">
                <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 shrink-0 py-1 px-2">
                  <TabsTrigger value="horizontal" className="flex-1 gap-2 text-xs py-1.5">
                    <Monitor className="w-3 h-3" />
                    Horizontal (16:9)
                  </TabsTrigger>
                  <TabsTrigger value="vertical" className="flex-1 gap-2 text-xs py-1.5">
                    <Smartphone className="w-3 h-3" />
                    Vertical (9:16)
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="horizontal" className="mt-0 flex-1 min-h-0 p-0 m-0 relative">
                  <div className="absolute inset-0 flex items-center justify-center p-1">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="relative bg-black rounded-lg overflow-hidden border-2 border-border" style={{ width: '100%', aspectRatio: '16/9', maxHeight: '100%' }}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-muted-foreground">Rendering video...</p>
                          </div>
                        </div>
                        {/* Video preview would go here */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                          <div className="text-center space-y-2">
                            <Play className="w-12 h-12 text-primary/50 mx-auto" />
                            <p className="text-sm text-muted-foreground">Video Preview</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-0 right-0 flex items-center justify-between text-[10px] text-muted-foreground px-4">
                      <span>Duration: {scenesData.length * 5}s</span>
                      <span>Scenes: {scenesData.length}</span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="vertical" className="mt-0 flex-1 min-h-0 p-0 m-0 relative">
                  <div className="absolute inset-0 flex items-center justify-center p-1">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="relative bg-black rounded-lg overflow-hidden border-2 border-border" style={{ height: '100%', aspectRatio: '9/16', maxWidth: '100%' }}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-muted-foreground">Rendering video...</p>
                          </div>
                        </div>
                        {/* Video preview would go here */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                          <div className="text-center space-y-2">
                            <Play className="w-12 h-12 text-primary/50 mx-auto" />
                            <p className="text-sm text-muted-foreground">Video Preview</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-0 right-0 flex items-center justify-between text-[10px] text-muted-foreground px-4">
                      <span>Duration: {scenesData.length * 5}s</span>
                      <span>Scenes: {scenesData.length}</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : formData.format === "16:9" ? (
              // Show only horizontal video
              <div className="h-full flex items-center justify-center p-0 m-0 relative">
                <div className="absolute inset-0 flex items-center justify-center p-1">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="relative bg-black rounded-lg overflow-hidden border-2 border-border" style={{ width: '100%', aspectRatio: '16/9', maxHeight: '100%' }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
                          <p className="text-muted-foreground">Rendering video...</p>
                        </div>
                      </div>
                      {/* Video preview would go here */}
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                        <div className="text-center space-y-2">
                          <Play className="w-12 h-12 text-primary/50 mx-auto" />
                          <p className="text-sm text-muted-foreground">Video Preview</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 flex items-center justify-between text-[10px] text-muted-foreground px-4">
                    <span>Duration: {scenesData.length * 5}s</span>
                    <span>Scenes: {scenesData.length}</span>
                  </div>
                </div>
              </div>
            ) : (
              // Show only vertical video
              <div className="h-full flex items-center justify-center p-0 m-0 relative">
                <div className="absolute inset-0 flex items-center justify-center p-1">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="relative bg-black rounded-lg overflow-hidden border-2 border-border" style={{ height: '100%', aspectRatio: '9/16', maxWidth: '100%' }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
                          <p className="text-muted-foreground">Rendering video...</p>
                        </div>
                      </div>
                      {/* Video preview would go here */}
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                        <div className="text-center space-y-2">
                          <Play className="w-12 h-12 text-primary/50 mx-auto" />
                          <p className="text-sm text-muted-foreground">Video Preview</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 flex items-center justify-between text-[10px] text-muted-foreground px-4">
                    <span>Duration: {scenesData.length * 5}s</span>
                    <span>Scenes: {scenesData.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">
                <span className="text-black dark:text-white">OPTIMUS</span>
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">AI Video Studio</p>
            </div>
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
            <Button variant="outline" onClick={handleClose}>
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
        </motion.div>
      </main>

      {/* Step Modal */}
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] max-h-[90vh] flex flex-col p-0" onInteractOutside={(e) => e.preventDefault()}>
          {/* Step Indicator Header */}
          <div className="px-6 pt-6 pb-3 border-b border-border">
            {/* Step Indicator */}
            <div className="flex items-center">
              {steps
                .filter((step, index) => {
                  // No longer filtering out preview step for 9:16 - it now supports vertical preview
                  return true;
                })
                .map((step, filteredIndex, filteredSteps) => {
                  // Map the filtered index back to original index for currentStep comparison
                  const originalIndex = steps.findIndex(s => s.id === step.id);
                  return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all ${
                            originalIndex < currentStep
                          ? "bg-success text-success-foreground"
                              : originalIndex === currentStep
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                          : "bg-secondary border border-border text-muted-foreground"
                      }`}
                    >
                          {originalIndex < currentStep ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-current" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-[10px] font-semibold uppercase tracking-wide ${
                            originalIndex === currentStep ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                    </div>
                      {filteredIndex < filteredSteps.length - 1 && (
                    <div className="flex-1 h-0.5 mx-3 bg-border relative">
                          {originalIndex < currentStep && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          className="absolute inset-0 bg-success"
                        />
                      )}
                  </div>
                )}
                    </div>
                  );
                })}
                    </div>
                  </div>

          {/* Modal Content */}
          <div className={`flex-1 min-h-0 ${currentStep === 4 ? 'overflow-hidden px-0 py-0' : currentStep === 3 ? 'overflow-hidden px-6 py-0' : 'overflow-y-auto px-6 py-2'}`}>
            <div className={`${currentStep === 3 ? 'h-full min-h-0 overflow-hidden' : currentStep === 1 || currentStep === 2 ? '' : 'h-full min-h-0 overflow-hidden'}`}>{renderStepContent()}</div>
              </div>

          <DialogFooter className="flex justify-between items-center px-6 py-4 border-t border-border">
            <div className="flex items-center gap-6">
              {/* AI Voice - Only shown in 4th tab (Horizontal Preview) and if voiceover is enabled */}
              {currentStep === 3 && scenesData.some(scene => {
                // Only show if voiceoverMode is explicitly set to 'custom' or 'sameAsCaption'
                // If voiceoverMode is 'noCaption' or undefined, don't show
                return scene.voiceoverMode === 'custom' || scene.voiceoverMode === 'sameAsCaption';
              }) && (
                <div className="flex items-center gap-2">
                  <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">AI Voice</Label>
                  <Select
                    value={selectedAiVoice}
                    onValueChange={(value) => {
                      setSelectedAiVoice(value);
                      if (aiVoiceAudioRef.current) {
                        aiVoiceAudioRef.current.pause();
                        aiVoiceAudioRef.current.currentTime = 0;
                        setIsAiVoicePlaying(false);
                        setPreviewVoiceId(null);
                      }
                    }}
                  >
                    <SelectTrigger className="w-[200px] h-9 text-xs">
                      <SelectValue>
                        {aiVoices.find(v => v.id === selectedAiVoice)?.name || "Select AI Voice"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {aiVoices.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          <div className="flex items-center justify-between w-full gap-2">
                            <div className="flex items-center gap-2">
                              <span>{voice.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({voice.gender} • {voice.accent})
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                if (previewVoiceId === voice.id && isAiVoicePlaying) {
                                  if (aiVoiceAudioRef.current) {
                                    aiVoiceAudioRef.current.pause();
                                    setIsAiVoicePlaying(false);
                                    setPreviewVoiceId(null);
                                  }
                                } else {
                                  setPreviewVoiceId(voice.id);
                                  if (aiVoiceAudioRef.current) {
                                    aiVoiceAudioRef.current.src = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${voice.id.replace('voice', '') || '2'}.mp3`;
                                    aiVoiceAudioRef.current.play();
                                    setIsAiVoicePlaying(true);
                                  }
                                }
                              }}
                              title="Preview voice"
                            >
                              {previewVoiceId === voice.id && isAiVoicePlaying ? (
                                <Pause className="w-3 h-3" />
                              ) : (
                                <Volume2 className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <audio
                    ref={aiVoiceAudioRef}
                    onEnded={() => {
                      setIsAiVoicePlaying(false);
                      setPreviewVoiceId(null);
                      if (aiVoiceAudioRef.current) {
                        aiVoiceAudioRef.current.currentTime = 0;
                      }
                    }}
                    onPause={() => setIsAiVoicePlaying(false)}
                    onPlay={() => setIsAiVoicePlaying(true)}
                    src={`https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(previewVoiceId || selectedAiVoice).replace('voice', '') || '2'}.mp3`}
                  />
                </div>
              )}
              {/* Voiceover Volume - Only shown if voiceover is enabled (not "No Voiceover") */}
              {currentStep === 3 && scenesData.some(scene => {
                // Only show if voiceoverMode is explicitly set to 'custom' or 'sameAsCaption'
                // If voiceoverMode is 'noCaption' or undefined, don't show
                return scene.voiceoverMode === 'custom' || scene.voiceoverMode === 'sameAsCaption';
              }) && (
                <div className="flex items-center gap-2">
                  <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">VO Volume</Label>
                  <Select
                    value={formData.voiceoverVolumeType}
                    onValueChange={(value: "default" | "adaptive" | "custom") => {
                      setFormData({ ...formData, voiceoverVolumeType: value });
                    }}
                  >
                    <SelectTrigger className="w-[160px] h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="adaptive">Adaptive Volume</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.voiceoverVolumeType === "custom" && (
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[formData.voiceoverVolume]}
                        onValueChange={(value) => {
                          setFormData({ ...formData, voiceoverVolume: value[0] });
                        }}
                        min={0}
                        max={100}
                        step={1}
                        className="w-24"
                      />
                      <span className="text-[10px] text-muted-foreground w-10">{formData.voiceoverVolume}%</span>
                    </div>
                  )}
                </div>
              )}
              {currentStep === 3 && (
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    <span className="font-medium text-foreground">Total Scenes:</span> {scenesData.length}
                  </span>
                    <span>
                    <span className="font-medium text-foreground">Video Duration:</span> {scenesData.length * 5}s
                  </span>
                </div>
              )}
              <Button variant="outline" onClick={handleBack}>
                {currentStep === 0 ? "Cancel" : "Back"}
              </Button>
            </div>
            <div className="flex gap-2">
              {currentStep === steps.length - 1 ? (
                <>
                  <Button onClick={() => {
                    setIsOpen(false);
                    onPreview();
                  }}>
                    Save as Draft
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setIsOpen(false);
                    onAdvancedEdit();
                  }}>
                    Edit
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && (
                      formData.format === "both" 
                        ? templateFormatTab === "horizontal"
                          ? !formData.selectedTheme16x9
                          : !formData.selectedTheme16x9 || !formData.selectedTheme9x16
                        : formData.format === "16:9"
                        ? !formData.selectedTheme16x9
                        : !formData.selectedTheme9x16
                    ))
                  }
                >
                  Next
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Replace Media Dialog */}
      <Dialog open={isReplaceVideoDialogOpen} onOpenChange={(open) => {
        setIsReplaceVideoDialogOpen(open);
        if (!open) {
          setReplaceVideoSceneIndex(null);
          setIsAddingMedia(false);
          setAddMediaSceneIndex(null);
          setReplaceVideoTab("upload");
          setReplaceVideoSearchQuery("");
          setSelectedVideoForTrim(null);
          setVideoTrimStartTime("00:00");
          setVideoTrimEndTime("00:00");
          setVideoTrimCurrentTime(0);
          setIsVideoTrimPlaying(false);
          if (videoTrimRef.current) {
            videoTrimRef.current.pause();
            videoTrimRef.current.currentTime = 0;
          }
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isAddingMedia ? "Add Media" : "Replace Media"}</DialogTitle>
            <DialogDescription>
              {isAddingMedia ? "Choose how you want to add media to this scene" : "Choose how you want to replace the media for this scene"}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Tabs value={replaceVideoTab} onValueChange={(v) => setReplaceVideoTab(v as "upload" | "slike")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="slike">Videos and Images</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-4">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && replaceVideoSceneIndex !== null) {
                            if (file.type.startsWith('video/')) {
                              // For video files, open trim dialog
                              const url = URL.createObjectURL(file);
                              // Create a video element to get duration
                              const video = document.createElement('video');
                              video.preload = 'metadata';
                              video.src = url;
                              video.onloadedmetadata = () => {
                                const duration = Math.floor(video.duration);
                                const durationString = formatTime(duration);
                                setSelectedVideoForTrim({
                                  id: `uploaded-${Date.now()}`,
                                  title: file.name,
                                  thumbnail: url,
                                  duration: durationString,
                                  file: file,
                                  url: url,
                                });
                                setVideoTrimStartTime("00:00");
                                setVideoTrimEndTime(durationString);
                                setVideoTrimCurrentTime(0);
                                setIsVideoTrimPlaying(false);
                                setIsReplaceVideoDialogOpen(false);
                                setIsVideoTrimDialogOpen(true);
                              };
                            } else {
                              // For image files
                            const url = URL.createObjectURL(file);
                            const updated = [...scenesData];
                              if (isAddingMedia) {
                                // Add to mediaItems array
                                const currentMediaItems = updated[replaceVideoSceneIndex].mediaItems || [];
                                const newMediaItem: MediaItem = {
                                  id: `media-${updated[replaceVideoSceneIndex].id}-${Date.now()}`,
                                  url: url,
                                  type: 'image',
                                  thumbnail: url,
                                };
                                updated[replaceVideoSceneIndex] = {
                                  ...updated[replaceVideoSceneIndex],
                                  mediaItems: [...currentMediaItems, newMediaItem],
                                  activeMediaIndex: currentMediaItems.length, // Set as active
                                };
                              } else {
                                // Replace existing media
                            updated[replaceVideoSceneIndex] = {
                              ...updated[replaceVideoSceneIndex],
                              mediaUrl: url,
                                  mediaType: 'image',
                                  thumbnail: url,
                            };
                              }
                            setScenesData(updated);
                            setIsReplaceVideoDialogOpen(false);
                            setReplaceVideoSceneIndex(null);
                              setIsAddingMedia(false);
                              setAddMediaSceneIndex(null);
                            }
                          }
                        }}
                      />
                      <div className="flex flex-col items-center gap-3">
                        <Upload className="w-12 h-12 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Click to upload or drag and drop</p>
                          <p className="text-xs text-muted-foreground mt-1">Image or Video files</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Select File
                        </Button>
                      </div>
                    </label>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="slike" className="mt-4">
                <div className="space-y-4">
                  {/* Search within Slike tab */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search Slike videos..."
                      value={replaceVideoSearchQuery}
                      onChange={(e) => setReplaceVideoSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {slikeVideos
                      .filter((video) =>
                        video.title.toLowerCase().includes(replaceVideoSearchQuery.toLowerCase())
                      )
                      .map((video) => (
                        <div
                          key={video.id}
                          className={cn(
                            "relative rounded-lg border overflow-hidden cursor-pointer hover:border-primary transition-colors",
                            selectedVideoForTrim?.id === video.id ? "border-primary ring-2 ring-primary/30" : "border-border"
                          )}
                          onClick={() => {
                            setSelectedVideoForTrim(video);
                            // Parse duration to set end time
                            const durationParts = video.duration.split(":");
                            const durationSeconds = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
                            setVideoTrimEndTime(video.duration);
                            setVideoTrimStartTime("00:00");
                            setVideoTrimCurrentTime(0);
                            setIsVideoTrimPlaying(false);
                            // Close Replace Media dialog and open Trim dialog
                            setIsReplaceVideoDialogOpen(false);
                            setIsVideoTrimDialogOpen(true);
                            // Keep isAddingMedia state so it's available in trim dialog
                          }}
                        >
                          <div className="aspect-video relative">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-background/90 px-2 py-1">
                              <p className="text-xs font-medium truncate">{video.title}</p>
                              <p className="text-[10px] text-muted-foreground">{video.duration}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  {replaceVideoSearchQuery && slikeVideos.filter((video) =>
                    video.title.toLowerCase().includes(replaceVideoSearchQuery.toLowerCase())
                  ).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No videos found matching "{replaceVideoSearchQuery}"</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Trimming Dialog */}
      <Dialog open={isVideoTrimDialogOpen} onOpenChange={(open) => {
        setIsVideoTrimDialogOpen(open);
        if (!open) {
          setSelectedVideoForTrim(null);
          setVideoTrimStartTime("00:00");
          setVideoTrimEndTime("00:00");
          setVideoTrimCurrentTime(0);
          setIsVideoTrimPlaying(false);
          setIsVideoTrimMuted(true);
          setVideoTrimVolume(100);
          setIsAddingMedia(false);
          setAddMediaSceneIndex(null);
          if (videoTrimRef.current) {
            videoTrimRef.current.pause();
            videoTrimRef.current.currentTime = 0;
            videoTrimRef.current.muted = true;
            videoTrimRef.current.volume = 1;
          }
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedVideoForTrim && (
            <div className="mt-4 space-y-4">
              {/* Video Player */}
              <div 
                className="relative rounded-lg border border-border overflow-hidden bg-black"
                onMouseEnter={() => setIsHoveringVideoTrim(true)}
                onMouseLeave={() => setIsHoveringVideoTrim(false)}
              >
                <video
                  ref={videoTrimRef}
                  src={selectedVideoForTrim.url || selectedVideoForTrim.thumbnail}
                  className="w-full aspect-video"
                  muted={isVideoTrimMuted}
                  onLoadedMetadata={(e) => {
                    const video = e.currentTarget;
                    video.volume = isVideoTrimMuted ? 0 : videoTrimVolume / 100;
                    if (video.duration && video.duration > 0) {
                      const durationString = formatTime(Math.floor(video.duration));
                      setVideoTrimEndTime(durationString);
                      // Update selectedVideoForTrim with actual duration
                      if (selectedVideoForTrim) {
                        setSelectedVideoForTrim({
                          ...selectedVideoForTrim,
                          duration: durationString,
                        });
                      }
                    } else {
                      // If video metadata not available, use the duration from the video object
                      const durationParts = selectedVideoForTrim.duration.split(":");
                      const durationSeconds = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
                      setVideoTrimEndTime(selectedVideoForTrim.duration);
                    }
                  }}
                  onTimeUpdate={(e) => {
                    const video = e.currentTarget;
                    const currentSeconds = Math.floor(video.currentTime);
                    setVideoTrimCurrentTime(currentSeconds);
                    // Stop at end time
                    const endSeconds = parseTime(videoTrimEndTime);
                    if (video.currentTime >= endSeconds) {
                      video.pause();
                      setIsVideoTrimPlaying(false);
                      video.currentTime = endSeconds;
                    }
                  }}
                />
                
                {/* Progress Bar on Hover */}
                {isHoveringVideoTrim && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/60 to-transparent">
                    <div 
                      className="relative h-2 bg-secondary/50 rounded-full cursor-pointer"
                      onClick={(e) => {
                        if (videoTrimRef.current) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const clickX = e.clientX - rect.left;
                          const percentage = Math.max(0, Math.min(1, clickX / rect.width));
                          const durationParts = selectedVideoForTrim.duration.split(":");
                          const maxDuration = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
                          const newTime = percentage * maxDuration;
                          videoTrimRef.current.currentTime = newTime;
                          setVideoTrimCurrentTime(Math.floor(newTime));
                        }
                      }}
                    >
                      {/* Progress indicator */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 bg-primary rounded-full"
                        style={{
                          width: `${(() => {
                            const durationParts = selectedVideoForTrim.duration.split(":");
                            const maxDuration = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
                            return maxDuration > 0 ? (videoTrimCurrentTime / maxDuration) * 100 : 0;
                          })()}%`
                        }}
                      />
                      {/* Start time marker */}
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-1 h-4 bg-green-500 rounded-full cursor-ew-resize z-10"
                        style={{
                          left: `${(() => {
                            const durationParts = selectedVideoForTrim.duration.split(":");
                            const maxDuration = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
                            const startSeconds = parseTime(videoTrimStartTime);
                            return maxDuration > 0 ? (startSeconds / maxDuration) * 100 : 0;
                          })()}%`,
                          transform: 'translateX(-50%) translateY(-50%)'
                        }}
                        title={`Start: ${videoTrimStartTime}`}
                      />
                      {/* End time marker */}
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-1 h-4 bg-red-500 rounded-full cursor-ew-resize z-10"
                        style={{
                          left: `${(() => {
                            const durationParts = selectedVideoForTrim.duration.split(":");
                            const maxDuration = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
                            const endSeconds = parseTime(videoTrimEndTime);
                            return maxDuration > 0 ? (endSeconds / maxDuration) * 100 : 0;
                          })()}%`,
                          transform: 'translateX(-50%) translateY(-50%)'
                        }}
                        title={`End: ${videoTrimEndTime}`}
                      />
                      {/* Current time indicator */}
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full cursor-pointer z-20 shadow-lg"
                        style={{
                          left: `${(() => {
                            const durationParts = selectedVideoForTrim.duration.split(":");
                            const maxDuration = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
                            return maxDuration > 0 ? (videoTrimCurrentTime / maxDuration) * 100 : 0;
                          })()}%`,
                          transform: 'translateX(-50%) translateY(-50%)'
                        }}
                      />
                    </div>
                    {/* Time labels - positioned relative to markers */}
                    <div className="relative mt-2 h-4">
                      {/* Start time label - positioned at start marker */}
                      <div 
                        className="absolute top-0 text-xs text-white/90 whitespace-nowrap"
                        style={{
                          left: `${(() => {
                            const durationParts = selectedVideoForTrim.duration.split(":");
                            const maxDuration = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
                            const startSeconds = parseTime(videoTrimStartTime);
                            return maxDuration > 0 ? (startSeconds / maxDuration) * 100 : 0;
                          })()}%`,
                          transform: 'translateX(-50%)'
                        }}
                      >
                        {videoTrimStartTime}
                      </div>
                      {/* Current time label - positioned at current position indicator */}
                      <div 
                        className="absolute top-0 text-xs text-white/90 whitespace-nowrap"
                        style={{
                          left: `${(() => {
                            const durationParts = selectedVideoForTrim.duration.split(":");
                            const maxDuration = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
                            return maxDuration > 0 ? (videoTrimCurrentTime / maxDuration) * 100 : 0;
                          })()}%`,
                          transform: 'translateX(-50%)'
                        }}
                      >
                        {formatTime(videoTrimCurrentTime)}
                      </div>
                      {/* End time label - positioned at end marker */}
                      <div 
                        className="absolute top-0 text-xs text-white/90 whitespace-nowrap"
                        style={{
                          left: `${(() => {
                            const durationParts = selectedVideoForTrim.duration.split(":");
                            const maxDuration = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
                            const endSeconds = parseTime(videoTrimEndTime);
                            return maxDuration > 0 ? (endSeconds / maxDuration) * 100 : 0;
                          })()}%`,
                          transform: 'translateX(-50%)'
                        }}
                      >
                        {videoTrimEndTime}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Timeline Bar - Red background with Yellow selected segment */}
              <div className="relative">
                <div 
                  className="relative h-3 rounded-full overflow-visible cursor-pointer bg-red-500"
                  onClick={(e) => {
                    if (videoTrimRef.current) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
                      const durationParts = selectedVideoForTrim.duration.split(":");
                      const maxDuration = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
                      const newTime = percentage * maxDuration;
                      videoTrimRef.current.currentTime = newTime;
                      setVideoTrimCurrentTime(Math.floor(newTime));
                    }
                  }}
                >
                  {/* Yellow selected segment (between start and end) */}
                  <div 
                    className="absolute top-0 bottom-0 bg-yellow-400"
                    style={{
                      left: `${(() => {
                        const durationParts = selectedVideoForTrim.duration.split(":");
                        const maxDuration = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
                        const startSeconds = parseTime(videoTrimStartTime);
                        return maxDuration > 0 ? (startSeconds / maxDuration) * 100 : 0;
                      })()}%`,
                      width: `${(() => {
                        const durationParts = selectedVideoForTrim.duration.split(":");
                        const maxDuration = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
                        const startSeconds = parseTime(videoTrimStartTime);
                        const endSeconds = parseTime(videoTrimEndTime);
                        return maxDuration > 0 ? ((endSeconds - startSeconds) / maxDuration) * 100 : 0;
                      })()}%`
                    }}
                  />
                  
                  {/* Start marker (In point - white downward arrow) */}
                  <div 
                    className="absolute -top-3 -translate-x-1/2 z-10 cursor-ew-resize"
                    style={{
                      left: `${(() => {
                        const durationParts = selectedVideoForTrim.duration.split(":");
                        const maxDuration = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
                        const startSeconds = parseTime(videoTrimStartTime);
                        return maxDuration > 0 ? (startSeconds / maxDuration) * 100 : 0;
                      })()}%`
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setIsDraggingVideoTrimStart(true);
                      const startX = e.clientX;
                      const durationParts = selectedVideoForTrim.duration.split(":");
                      const maxDuration = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
                      const startSeconds = parseTime(videoTrimStartTime);
                      const initialLeft = (startSeconds / maxDuration) * 100;
                      
                      const handleMouseMove = (moveEvent: MouseEvent) => {
                        const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                        if (rect) {
                          const deltaX = moveEvent.clientX - startX;
                          const deltaPercent = (deltaX / rect.width) * 100;
                          const newPercent = Math.max(0, Math.min(100, initialLeft + deltaPercent));
                          const newSeconds = Math.max(0, Math.min(maxDuration, Math.floor((newPercent / 100) * maxDuration)));
                          const endSeconds = parseTime(videoTrimEndTime);
                          if (newSeconds < endSeconds) {
                          const newTime = formatTime(newSeconds);
                          setVideoTrimStartTime(newTime);
                          if (videoTrimRef.current) {
                            videoTrimRef.current.currentTime = newSeconds;
                            setVideoTrimCurrentTime(newSeconds);
                            }
                          }
                        }
                      };
                      
                      const handleMouseUp = () => {
                        setIsDraggingVideoTrimStart(false);
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };
                      
                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                  >
                    {/* White downward-pointing arrow */}
                    <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white" />
                  </div>
                  
                  {/* End marker (Out point - white downward arrow, same as In) */}
                  <div 
                    className="absolute -top-3 -translate-x-1/2 z-10 cursor-ew-resize"
                    style={{
                      left: `${(() => {
                        const durationParts = selectedVideoForTrim.duration.split(":");
                        const maxDuration = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
                        const endSeconds = parseTime(videoTrimEndTime);
                        return maxDuration > 0 ? (endSeconds / maxDuration) * 100 : 0;
                      })()}%`
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setIsDraggingVideoTrimEnd(true);
                      const startX = e.clientX;
                      const durationParts = selectedVideoForTrim.duration.split(":");
                      const maxDuration = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
                      const endSeconds = parseTime(videoTrimEndTime);
                      const initialLeft = (endSeconds / maxDuration) * 100;
                      
                      const handleMouseMove = (moveEvent: MouseEvent) => {
                        const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                        if (rect) {
                          const deltaX = moveEvent.clientX - startX;
                          const deltaPercent = (deltaX / rect.width) * 100;
                          const newPercent = Math.max(0, Math.min(100, initialLeft + deltaPercent));
                          const newSeconds = Math.max(0, Math.min(maxDuration, Math.floor((newPercent / 100) * maxDuration)));
                          const startSeconds = parseTime(videoTrimStartTime);
                          if (newSeconds > startSeconds) {
                          const newTime = formatTime(newSeconds);
                          setVideoTrimEndTime(newTime);
                          if (videoTrimRef.current) {
                            videoTrimRef.current.currentTime = newSeconds;
                            setVideoTrimCurrentTime(newSeconds);
                            }
                          }
                        }
                      };
                      
                      const handleMouseUp = () => {
                        setIsDraggingVideoTrimEnd(false);
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };
                      
                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                  >
                    {/* White downward-pointing arrow (same as In marker) */}
                    <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white" />
                  </div>
                  
                  {/* Current playhead position (white vertical line with circle) */}
                  <div 
                    className="absolute top-0 -translate-x-1/2 z-20"
                    style={{
                      left: `${(() => {
                        const durationParts = selectedVideoForTrim.duration.split(":");
                        const maxDuration = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
                        return maxDuration > 0 ? (videoTrimCurrentTime / maxDuration) * 100 : 0;
                      })()}%`
                    }}
                  >
                    {/* White circle */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full border border-gray-300" />
                    {/* White vertical line */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-white" />
                  </div>
                </div>
              </div>
              
              {/* Controls Row */}
              <div className="flex items-center gap-4">
                {/* Left: Start/End Time Inputs */}
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">START</Label>
                  <Input
                    type="text"
                    value={videoTrimStartTime}
                    onChange={(e) => {
                      setVideoTrimStartTime(e.target.value);
                      if (videoTrimRef.current) {
                        const seconds = parseTime(e.target.value);
                        videoTrimRef.current.currentTime = seconds;
                        setVideoTrimCurrentTime(seconds);
                      }
                    }}
                    className="w-20 h-9 text-center text-sm font-semibold bg-white border-border rounded-md"
                    placeholder="00:00"
                  />
                </div>
                
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">END</Label>
                  <Input
                    type="text"
                    value={videoTrimEndTime}
                    onChange={(e) => {
                      setVideoTrimEndTime(e.target.value);
                      if (videoTrimRef.current) {
                        const seconds = parseTime(e.target.value);
                        videoTrimRef.current.currentTime = seconds;
                        setVideoTrimCurrentTime(seconds);
                      }
                    }}
                    className="w-20 h-9 text-center text-sm font-semibold bg-white border-border rounded-md"
                    placeholder="00:00"
                  />
                  </div>
                </div>
                
                {/* Center: Playback Controls */}
                <div className="flex items-center gap-1 flex-1 justify-center">
                  {/* Fast Backward (two lines + left triangle) */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-md bg-gray-700 hover:bg-gray-600 border-gray-600"
                    onClick={() => {
                      if (videoTrimRef.current) {
                        videoTrimRef.current.currentTime = 0;
                        setVideoTrimCurrentTime(0);
                        setVideoTrimStartTime("00:00");
                      }
                    }}
                    title="Fast backward"
                  >
                    <div className="flex items-center gap-0.5">
                      <div className="w-0.5 h-3 bg-white rounded" />
                      <div className="w-0.5 h-3 bg-white rounded" />
                      <ChevronLeft className="w-3 h-3 text-white" />
                    </div>
                  </Button>
                  
                  {/* Skip Backward (one line + left triangle) */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-md bg-gray-700 hover:bg-gray-600 border-gray-600"
                    onClick={() => {
                      if (videoTrimRef.current) {
                        const newTime = Math.max(0, videoTrimCurrentTime - 1);
                        videoTrimRef.current.currentTime = newTime;
                        setVideoTrimCurrentTime(newTime);
                      }
                    }}
                    title="1 second backward"
                  >
                    <div className="flex items-center gap-0.5">
                      <div className="w-0.5 h-3 bg-white rounded" />
                      <ChevronLeft className="w-3 h-3 text-white" />
                    </div>
                  </Button>
                  
                  {/* Frame Backward */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-md bg-gray-700 hover:bg-gray-600 border-gray-600"
                    onClick={() => {
                      if (videoTrimRef.current) {
                        const newTime = Math.max(0, videoTrimCurrentTime - 0.1);
                        videoTrimRef.current.currentTime = newTime;
                        setVideoTrimCurrentTime(Math.floor(newTime));
                      }
                    }}
                    title="Frame backward"
                  >
                    <ChevronLeft className="w-3 h-3 text-white" />
                  </Button>
                  
                  {/* Play/Pause */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-md bg-gray-700 hover:bg-gray-600 border-2 border-blue-500"
                    onClick={() => {
                      if (videoTrimRef.current) {
                        if (isVideoTrimPlaying) {
                          videoTrimRef.current.pause();
                          setIsVideoTrimPlaying(false);
                        } else {
                          const startSeconds = parseTime(videoTrimStartTime);
                          videoTrimRef.current.currentTime = startSeconds;
                          videoTrimRef.current.play();
                          setIsVideoTrimPlaying(true);
                        }
                      }
                    }}
                  >
                    {isVideoTrimPlaying ? (
                      <Pause className="w-4 h-4 text-white" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5 text-white" />
                    )}
                  </Button>
                  
                  {/* Frame Forward */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-md bg-gray-700 hover:bg-gray-600 border-gray-600"
                    onClick={() => {
                      if (videoTrimRef.current) {
                        const durationParts = selectedVideoForTrim.duration.split(":");
                        const maxDuration = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
                        const newTime = Math.min(maxDuration, videoTrimCurrentTime + 0.1);
                        videoTrimRef.current.currentTime = newTime;
                        setVideoTrimCurrentTime(Math.floor(newTime));
                      }
                    }}
                    title="Frame forward"
                  >
                    <ChevronRight className="w-3 h-3 text-white" />
                  </Button>
                  
                  {/* Skip Forward (right triangle + one line) */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-md bg-gray-700 hover:bg-gray-600 border-gray-600"
                    onClick={() => {
                      if (videoTrimRef.current) {
                        const durationParts = selectedVideoForTrim.duration.split(":");
                        const maxDuration = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
                        const newTime = Math.min(maxDuration, videoTrimCurrentTime + 1);
                        videoTrimRef.current.currentTime = newTime;
                        setVideoTrimCurrentTime(newTime);
                      }
                    }}
                    title="1 second forward"
                  >
                    <div className="flex items-center gap-0.5">
                      <ChevronRight className="w-3 h-3 text-white" />
                      <div className="w-0.5 h-3 bg-white rounded" />
                    </div>
                  </Button>
                  
                  {/* Fast Forward (right triangle + two lines) */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-md bg-gray-700 hover:bg-gray-600 border-gray-600"
                    onClick={() => {
                      if (videoTrimRef.current) {
                        const durationParts = selectedVideoForTrim.duration.split(":");
                        const maxDuration = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
                        videoTrimRef.current.currentTime = maxDuration;
                        setVideoTrimCurrentTime(maxDuration);
                        setVideoTrimEndTime(selectedVideoForTrim.duration);
                      }
                    }}
                    title="Fast forward"
                  >
                    <div className="flex items-center gap-0.5">
                      <ChevronRight className="w-3 h-3 text-white" />
                      <div className="w-0.5 h-3 bg-white rounded" />
                      <div className="w-0.5 h-3 bg-white rounded" />
                    </div>
                  </Button>
                </div>
                
                {/* Audio Controls: Mute/Unmute and Volume Slider */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-md bg-gray-700 hover:bg-gray-600 border-gray-600"
                    onClick={() => {
                      const newMutedState = !isVideoTrimMuted;
                      setIsVideoTrimMuted(newMutedState);
                      if (videoTrimRef.current) {
                        videoTrimRef.current.muted = newMutedState;
                        if (!newMutedState) {
                          videoTrimRef.current.volume = videoTrimVolume / 100;
                        }
                      }
                    }}
                    title={isVideoTrimMuted ? "Unmute" : "Mute"}
                  >
                    {isVideoTrimMuted ? (
                      <VolumeX className="w-4 h-4 text-white" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-white" />
                    )}
                  </Button>
                  {!isVideoTrimMuted && (
                    <div className="flex items-center gap-2 w-32">
                      <Slider
                        value={[videoTrimVolume]}
                        onValueChange={(value) => {
                          const newVolume = value[0];
                          setVideoTrimVolume(newVolume);
                          if (videoTrimRef.current) {
                            videoTrimRef.current.volume = newVolume / 100;
                            videoTrimRef.current.muted = false;
                          }
                        }}
                        min={0}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-white w-10 text-right">{videoTrimVolume}%</span>
                    </div>
                  )}
                </div>
                
                {/* Right: Clip Duration and Add Button */}
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground uppercase">CLIP DURATION</span>
                    <span className="text-sm font-semibold">
                      {(() => {
                        const startSeconds = parseTime(videoTrimStartTime);
                        const endSeconds = parseTime(videoTrimEndTime);
                        const clipDuration = Math.max(0, endSeconds - startSeconds);
                        return formatTime(clipDuration);
                      })()}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">{selectedVideoForTrim.duration}</span>
                  </div>
                <Button
                  onClick={() => {
                    if (replaceVideoSceneIndex !== null && selectedVideoForTrim) {
                        const videoUrl = selectedVideoForTrim.url || selectedVideoForTrim.thumbnail;
                      const updated = [...scenesData];
                        if (isAddingMedia) {
                          // Add to mediaItems array
                          const currentMediaItems = updated[replaceVideoSceneIndex].mediaItems || [];
                          const newMediaItem: MediaItem = {
                            id: `media-${updated[replaceVideoSceneIndex].id}-${Date.now()}`,
                            url: videoUrl,
                            type: 'video',
                            thumbnail: selectedVideoForTrim.thumbnail,
                          };
                      updated[replaceVideoSceneIndex] = {
                        ...updated[replaceVideoSceneIndex],
                            mediaItems: [...currentMediaItems, newMediaItem],
                            activeMediaIndex: currentMediaItems.length, // Set as active
                          };
                        } else {
                          // Replace existing media
                          updated[replaceVideoSceneIndex] = {
                            ...updated[replaceVideoSceneIndex],
                            mediaUrl: videoUrl,
                        mediaType: 'video',
                        thumbnail: selectedVideoForTrim.thumbnail,
                      };
                        }
                      setScenesData(updated);
                      setIsVideoTrimDialogOpen(false);
                      setReplaceVideoSceneIndex(null);
                        setIsAddingMedia(false);
                        setAddMediaSceneIndex(null);
                      setSelectedVideoForTrim(null);
                      setVideoTrimStartTime("00:00");
                      setVideoTrimEndTime("00:00");
                      setVideoTrimCurrentTime(0);
                      setIsVideoTrimPlaying(false);
                      if (videoTrimRef.current) {
                        videoTrimRef.current.pause();
                        videoTrimRef.current.currentTime = 0;
                      }
                    }
                  }}
                    className="h-9 bg-primary hover:bg-primary/90 px-4"
                >
                    ADD
                </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Template Selection Dialog */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Change Template</DialogTitle>
            <DialogDescription>
              Select a template for your {currentStep === 3 ? "horizontal" : "vertical"} video format
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {currentStep === 3 ? (
              // Horizontal Preview - show 16:9 templates
              <div className="grid grid-cols-4 gap-4">
                {themes.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    name={theme.name}
                    preview={theme.preview}
                    format="16:9"
                    selected={formData.selectedTheme16x9 === theme.id}
                    onClick={() => {
                      setFormData({ ...formData, selectedTheme16x9: theme.id });
                      setIsTemplateDialogOpen(false);
                    }}
                    delay={0}
                    category={theme.category}
                  />
                ))}
              </div>
            ) : (
              // Vertical Preview - show 9:16 templates
              <div className="grid grid-cols-5 gap-4">
                {verticalThemes.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    name={theme.name}
                    preview={theme.preview}
                    format="9:16"
                    selected={formData.selectedTheme9x16 === theme.id}
                    onClick={() => {
                      setFormData({ ...formData, selectedTheme9x16: theme.id });
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

      {/* Video Player Dialog */}
      <Dialog open={!!selectedVideoForEdit} onOpenChange={(open) => !open && setSelectedVideoForEdit(null)}>
        <DialogContent className="max-w-6xl w-[98vw] h-[95vh] max-h-[95vh] p-0 bg-gradient-to-b from-gray-950 to-black flex flex-col border border-gray-800/50 shadow-2xl">
          {/* Mouse move handler for dragging */}
          {selectedVideoForEdit && (isDraggingStart || isDraggingEnd || isDraggingCurrent) && (
            <div
              className="fixed inset-0 z-50 cursor-move"
              onMouseMove={(e) => {
                const timeline = document.querySelector('[data-timeline]') as HTMLElement;
                if (timeline) {
                  const rect = timeline.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const percentage = Math.max(0, Math.min(1, x / rect.width));
                  const totalDuration = parseTime(selectedVideoForEdit.duration);
                  const newTime = Math.floor(percentage * totalDuration);
                  
                  if (isDraggingStart) {
                    const endTime = parseTime(videoEndTime);
                    if (newTime < endTime) {
                      setVideoStartTime(formatTime(newTime));
                      setVideoCurrentTime(newTime);
                    }
                  } else if (isDraggingEnd) {
                    const startTime = parseTime(videoStartTime);
                    if (newTime > startTime) {
                      setVideoEndTime(formatTime(newTime));
                      setVideoCurrentTime(newTime);
                    }
                  } else if (isDraggingCurrent) {
                    setVideoCurrentTime(newTime);
                  }
                }
              }}
              onMouseUp={() => {
                setIsDraggingStart(false);
                setIsDraggingEnd(false);
                setIsDraggingCurrent(false);
              }}
            />
          )}
          {selectedVideoForEdit && (
            <div 
              className="flex flex-col h-full min-h-0"
              onMouseEnter={() => setIsHoveringVideo(true)}
              onMouseLeave={() => setIsHoveringVideo(false)}
            >
              {/* Video Player */}
              <div 
                className="relative flex-1 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center min-h-0"
              >
                {/* Top Right Controls - Close button */}
                <div className="absolute top-5 right-5 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedVideoForEdit(null)}
                    className="text-white hover:bg-red-500/20 bg-white/10 rounded-full h-9 w-9 transition-all duration-200 hover:scale-110 shadow-lg"
                  >
                    <X className="w-4.5 h-4.5" />
                  </Button>
                </div>

                {/* Video Display Area */}
                <div className="relative w-full h-full flex items-center justify-center p-6">
                  <div className={`relative shadow-2xl rounded-xl overflow-hidden border border-gray-700/50 ${
                    selectedVideoForEdit.isVertical === true
                      ? "aspect-[9/16] w-[30%] max-w-[400px]" 
                      : "aspect-video w-full max-w-[92%]"
                  }`}>
                    <img
                      src={selectedVideoForEdit.thumbnail}
                      alt={selectedVideoForEdit.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Progress Bar Overlay - Show on hover */}
                    <div className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${isHoveringVideo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                      <div className="bg-gradient-to-t from-black/90 via-black/70 to-transparent px-4 py-3">
                        {/* Progress Bar */}
                        <div 
                          className="relative h-1.5 bg-white/30 rounded-full cursor-pointer group"
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const clickX = e.clientX - rect.left;
                            const percentage = clickX / rect.width;
                            const totalDuration = parseTime(selectedVideoForEdit.duration);
                            const newTime = Math.max(0, Math.min(totalDuration, Math.floor(percentage * totalDuration)));
                            setVideoCurrentTime(newTime);
                          }}
                        >
                          <div
                            className="absolute h-full bg-red-500 rounded-full transition-all duration-150"
                            style={{
                              width: `${(videoCurrentTime / parseTime(selectedVideoForEdit.duration)) * 100}%`,
                            }}
                          />
                          <div
                            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-red-500 rounded-full cursor-move border-2 border-white shadow-xl transition-all duration-150 group-hover:scale-125"
                            style={{
                              left: `calc(${(videoCurrentTime / parseTime(selectedVideoForEdit.duration)) * 100}% - 7px)`,
                            }}
                          />
                        </div>
                        
                        {/* Time and Controls */}
                        <div className="flex items-center gap-4 mt-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                            className="text-white hover:bg-white/20 h-8 w-8 rounded-full"
                          >
                            {isVideoPlaying ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4 ml-0.5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsVideoMuted(!isVideoMuted)}
                            className="text-white hover:bg-white/20 h-8 w-8 rounded-full"
                          >
                            {isVideoMuted ? (
                              <VolumeX className="w-4 h-4" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </Button>
                          <span className="text-white/90 text-xs font-medium min-w-[85px] tabular-nums">
                            {formatTime(videoCurrentTime)} / {selectedVideoForEdit.duration}
                          </span>
                          <div className="flex-1" />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white/80 hover:text-white hover:bg-white/20 h-8 w-8 rounded-full"
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white/80 hover:text-white hover:bg-white/20 h-8 w-8 rounded-full"
                          >
                            <Maximize className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Controls */}
              <div className="p-5 bg-gray-900/95 border-t border-gray-700/50 flex-shrink-0">
                {/* Timeline with Duration - Show on hover */}
                <div className={`flex items-center gap-4 mb-4 transition-all duration-300 ${isHoveringVideo ? 'opacity-100' : 'opacity-0'}`}>
                  <div 
                    className="relative flex-1 h-4 bg-yellow-500/90 rounded-full overflow-visible cursor-pointer"
                    data-timeline
                    onClick={(e) => {
                      if (!isDraggingStart && !isDraggingEnd && !isDraggingCurrent) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const percentage = clickX / rect.width;
                        const totalDuration = parseTime(selectedVideoForEdit.duration);
                        const newTime = Math.max(0, Math.min(totalDuration, Math.floor(percentage * totalDuration)));
                        setVideoCurrentTime(newTime);
                      }
                    }}
                  >
                    {/* Selected range (red segment) */}
                    <div
                      className="absolute h-full bg-red-500 rounded-full"
                      style={{
                        left: `${(parseTime(videoStartTime) / parseTime(selectedVideoForEdit.duration)) * 100}%`,
                        width: `${((parseTime(videoEndTime) - parseTime(videoStartTime)) / parseTime(selectedVideoForEdit.duration)) * 100}%`,
                      }}
                    />
                    {/* Start marker */}
                    <div
                      className="absolute top-0 cursor-move z-10"
                      style={{
                        left: `${(parseTime(videoStartTime) / parseTime(selectedVideoForEdit.duration)) * 100}%`,
                        transform: 'translateX(-50%)',
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setIsDraggingStart(true);
                      }}
                    >
                      <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-white mx-auto" />
                      <div className="w-0.5 h-5 bg-white mx-auto" />
                    </div>
                    {/* End marker */}
                    <div
                      className="absolute top-0 cursor-move z-10"
                      style={{
                        left: `${(parseTime(videoEndTime) / parseTime(selectedVideoForEdit.duration)) * 100}%`,
                        transform: 'translateX(-50%)',
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setIsDraggingEnd(true);
                      }}
                    >
                      <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[4px] border-transparent border-b-white mx-auto" />
                      <div className="w-0.5 h-5 bg-white mx-auto" />
                    </div>
                    {/* Current position indicator - red circle */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full cursor-move z-20 border-2 border-white"
                      style={{
                        left: `calc(${(videoCurrentTime / parseTime(selectedVideoForEdit.duration)) * 100}% - 6px)`,
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setIsDraggingCurrent(true);
                      }}
                    />
                  </div>
                  <span className="text-white/90 text-xs font-medium tabular-nums min-w-[45px]">
                    {selectedVideoForEdit.duration}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsVideoMuted(!isVideoMuted)}
                    className="text-white/80 hover:text-white hover:bg-white/10 h-8 w-8"
                  >
                    {isVideoMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Controls Row */}
                <div className="flex items-center gap-4">
                  {/* Time Inputs */}
                  <div className="flex items-center gap-2">
                    <Label className="text-white text-xs font-medium">START</Label>
                    <Input
                      type="text"
                      value={videoStartTime}
                      onChange={(e) => setVideoStartTime(e.target.value)}
                      className="w-16 h-8 bg-gray-800 border border-gray-600 text-white text-center font-medium text-xs rounded"
                      placeholder="00:00"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-white text-xs font-medium">END</Label>
                    <Input
                      type="text"
                      value={videoEndTime}
                      onChange={(e) => setVideoEndTime(e.target.value)}
                      className="w-16 h-8 bg-gray-800 border border-gray-600 text-white text-center font-medium text-xs rounded"
                      placeholder="00:00"
                    />
                  </div>
                  
                  <div className="flex-1" />
                  
                  {/* Playback Controls */}
                  <div className="flex items-center gap-1">
                    {/* Fast Rewind (4 bars) */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setVideoCurrentTime(0)}
                      className="text-white hover:bg-gray-700 h-8 w-8 rounded"
                      title="Skip to start"
                    >
                      <div className="flex gap-0.5 items-center">
                        <div className="w-0.5 h-3.5 bg-white rounded" />
                        <div className="w-0.5 h-3.5 bg-white rounded" />
                        <div className="w-0.5 h-3.5 bg-white rounded" />
                        <div className="w-0.5 h-3.5 bg-white rounded" />
                      </div>
                    </Button>
                    {/* Rewind Frame (2 bars) */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setVideoCurrentTime(Math.max(0, videoCurrentTime - 10))}
                      className="text-white hover:bg-gray-700 h-8 w-8 rounded"
                      title="Rewind"
                    >
                      <div className="flex gap-0.5 items-center">
                        <div className="w-0.5 h-3.5 bg-white rounded" />
                        <div className="w-0.5 h-3.5 bg-white rounded" />
                      </div>
                    </Button>
                    {/* Step backward */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setVideoCurrentTime(Math.max(0, videoCurrentTime - 1))}
                      className="text-white hover:bg-gray-700 h-8 w-8 rounded"
                      title="Step backward"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    {/* Mark in */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setVideoStartTime(formatTime(videoCurrentTime))}
                      className="text-white hover:bg-gray-700 h-8 w-8 rounded"
                      title="Mark in point"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    {/* Play/Pause button - highlighted when playing */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className={`h-8 w-8 rounded ${isVideoPlaying ? 'bg-gray-500 text-white' : 'text-white hover:bg-gray-700'}`}
                    >
                      {isVideoPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </Button>
                    {/* Mark out */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setVideoEndTime(formatTime(videoCurrentTime))}
                      className="text-white hover:bg-gray-700 h-8 w-8 rounded"
                      title="Mark out point"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    {/* Step forward */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setVideoCurrentTime(Math.min(parseTime(selectedVideoForEdit.duration), videoCurrentTime + 1))}
                      className="text-white hover:bg-gray-700 h-8 w-8 rounded"
                      title="Step forward"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    {/* Fast forward (2 bars) */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setVideoCurrentTime(Math.min(parseTime(selectedVideoForEdit.duration), videoCurrentTime + 10))}
                      className="text-white hover:bg-gray-700 h-8 w-8 rounded"
                      title="Fast forward"
                    >
                      <div className="flex gap-0.5 items-center">
                        <div className="w-0.5 h-3.5 bg-white rounded" />
                        <div className="w-0.5 h-3.5 bg-white rounded" />
                      </div>
                    </Button>
                    {/* Fast forward to end (4 bars) */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setVideoCurrentTime(parseTime(selectedVideoForEdit.duration))}
                      className="text-white hover:bg-gray-700 h-8 w-8 rounded"
                      title="Skip to end"
                    >
                      <div className="flex gap-0.5 items-center">
                        <div className="w-0.5 h-3.5 bg-white rounded" />
                        <div className="w-0.5 h-3.5 bg-white rounded" />
                        <div className="w-0.5 h-3.5 bg-white rounded" />
                        <div className="w-0.5 h-3.5 bg-white rounded" />
                      </div>
                    </Button>
                  </div>
                  
                  {/* Clip Duration, Slide Dropdown and Add Button */}
                  <div className="flex items-center gap-3">
                    <div className="text-white text-xs font-medium tabular-nums">
                      CLIP DURATION {selectedVideoForEdit.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-white text-xs font-medium">Scene:</Label>
                      <Select value={selectedSceneForVideo} onValueChange={setSelectedSceneForVideo}>
                        <SelectTrigger className="w-32 h-8 bg-gray-800 border border-gray-600 text-white text-xs rounded focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800/95 border border-gray-600/60 backdrop-blur-md">
                          <SelectItem value="ai" className="text-white text-xs focus:bg-gray-700/80">
                            AI Decides
                          </SelectItem>
                          {Array.from({ length: parseInt(formData.scenes) || 6 }, (_, i) => (
                            <SelectItem 
                              key={i + 1} 
                              value={(i + 1).toString()}
                              className="text-white text-xs focus:bg-gray-700/80"
                            >
                              Scene {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleAddVideo}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 h-8 rounded font-medium text-xs"
                    >
                      <Scissors className="w-3.5 h-3.5 mr-1.5" />
                      ADD
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
