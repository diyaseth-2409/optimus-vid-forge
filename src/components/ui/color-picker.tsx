import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Droplet, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  type?: "text" | "background";
}

const presetColors = [
  "#000000",
  "#8B5CF6",
  "#78716C",
  "#D4A574",
  "#FFFFFF",
  "#F5F5F0",
];

// Convert hex to HSL
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

// Convert HSL to hex
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Extract hex from rgba/rgb
function extractHex(color: string): string {
  if (color.startsWith("#")) {
    return color;
  }
  if (color.startsWith("rgba") || color.startsWith("rgb")) {
    const match = color.match(/\d+/g);
    if (match && match.length >= 3) {
      const r = parseInt(match[0]).toString(16).padStart(2, "0");
      const g = parseInt(match[1]).toString(16).padStart(2, "0");
      const b = parseInt(match[2]).toString(16).padStart(2, "0");
      return `#${r}${g}${b}`;
    }
  }
  return "#000000";
}

export function ColorPicker({ value, onChange, type = "text" }: ColorPickerProps) {
  // Check if value is transparent
  const isTransparent = value === "transparent" || value === "rgba(0,0,0,0)" || value.includes("rgba(0, 0, 0, 0)");
  const hexValue = isTransparent ? "#000000" : extractHex(value);
  const [hsl, setHsl] = useState(() => hexToHsl(hexValue));
  const [hex, setHex] = useState(hexValue);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingHue, setIsDraggingHue] = useState(false);
  const colorBoxRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTransparentValue = value === "transparent" || value === "rgba(0,0,0,0)" || value.includes("rgba(0, 0, 0, 0)");
    if (!isTransparentValue) {
      const newHex = extractHex(value);
      setHex(newHex);
      setHsl(hexToHsl(newHex));
    }
  }, [value]);

  const updateColor = (h: number, s: number, l: number) => {
    const newHex = hslToHex(h, s, l);
    setHsl({ h, s, l });
    setHex(newHex);
    onChange(newHex);
  };

  const handleColorBoxClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!colorBoxRef.current) return;
    const rect = colorBoxRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const s = (x / rect.width) * 100;
    const l = 100 - (y / rect.height) * 100;
    updateColor(hsl.h, s, l);
  };

  const handleColorBoxDrag = (e: MouseEvent) => {
    if (!isDragging || !colorBoxRef.current) return;
    const rect = colorBoxRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const s = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const l = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));
    updateColor(hsl.h, s, l);
  };

  const handleHueSliderChange = (values: number[]) => {
    updateColor(values[0], hsl.s, hsl.l);
  };

  const handleHueDrag = (e: MouseEvent) => {
    if (!isDraggingHue || !hueSliderRef.current) return;
    const rect = hueSliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const hue = Math.max(0, Math.min(360, (x / rect.width) * 360));
    updateColor(hue, hsl.s, hsl.l);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleColorBoxDrag);
      document.addEventListener("mouseup", () => setIsDragging(false));
      return () => {
        document.removeEventListener("mousemove", handleColorBoxDrag);
        document.removeEventListener("mouseup", () => setIsDragging(false));
      };
    }
  }, [isDragging, hsl.h]);

  useEffect(() => {
    if (isDraggingHue) {
      document.addEventListener("mousemove", handleHueDrag);
      document.addEventListener("mouseup", () => setIsDraggingHue(false));
      return () => {
        document.removeEventListener("mousemove", handleHueDrag);
        document.removeEventListener("mouseup", () => setIsDraggingHue(false));
      };
    }
  }, [isDraggingHue]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    if (/^#[0-9A-Fa-f]{0,6}$/.test(newHex)) {
      setHex(newHex);
      if (newHex.length === 7) {
        const newHsl = hexToHsl(newHex);
        setHsl(newHsl);
        onChange(newHex);
      }
    }
  };

  return (
    <div className="w-64 space-y-3">
      {/* No Background Option (only for background type) */}
      {type === "background" && (
        <div className="mb-2">
          <button
            onClick={() => onChange("transparent")}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-md border-2 transition-all hover:bg-secondary",
              isTransparent
                ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                : "border-border"
            )}
          >
            <div className={cn(
              "h-6 w-6 rounded border-2 flex items-center justify-center",
              isTransparent ? "border-primary" : "border-border"
            )}>
              {isTransparent ? (
                <X className="w-4 h-4 text-primary" />
              ) : (
                <div className="w-full h-full bg-[linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc_100%),linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc_100%)] bg-[length:8px_8px] bg-[0_0,4px_4px]" />
              )}
            </div>
            <span className="text-sm font-medium">No Background</span>
          </button>
        </div>
      )}

      {/* Preset Colors */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full border-2 border-dashed"
        >
          <span className="text-xs">+</span>
        </Button>
        <div className="flex gap-2">
          {presetColors.map((color, index) => (
            <button
              key={index}
              onClick={() => {
                const newHsl = hexToHsl(color);
                setHsl(newHsl);
                setHex(color);
                onChange(color);
              }}
              className={cn(
                "h-8 w-8 rounded-full border-2 transition-all hover:scale-110",
                !isTransparent && hex.toLowerCase() === color.toLowerCase()
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border"
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Color Picker */}
      <div className="space-y-3 mt-3">
        {/* Color Box */}
          <div
            ref={colorBoxRef}
            className={cn(
              "relative w-full h-48 rounded-lg overflow-hidden border border-border",
              isTransparent ? "cursor-not-allowed opacity-50" : "cursor-crosshair"
            )}
            style={{
              background: `
                linear-gradient(to bottom, transparent 0%, black 100%),
                linear-gradient(to right, white 0%, hsl(${hsl.h}, 100%, 50%) 100%)
              `,
            }}
            onClick={isTransparent ? undefined : handleColorBoxClick}
            onMouseDown={isTransparent ? undefined : (e) => {
              setIsDragging(true);
              handleColorBoxClick(e);
            }}
          >
            <div
              className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${hsl.s}%`,
                top: `${100 - hsl.l}%`,
                backgroundColor: hex,
              }}
            />
          </div>

          {/* Hue Slider */}
          <div className="space-y-2">
            <div
              ref={hueSliderRef}
              className={cn(
                "relative h-4 rounded-full",
                isTransparent ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              )}
              style={{
                background:
                  "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
              }}
              onClick={isTransparent ? undefined : (e) => {
                if (!hueSliderRef.current) return;
                const rect = hueSliderRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const hue = Math.max(0, Math.min(360, (x / rect.width) * 360));
                updateColor(hue, hsl.s, hsl.l);
              }}
              onMouseDown={isTransparent ? undefined : (e) => {
                setIsDraggingHue(true);
                if (!hueSliderRef.current) return;
                const rect = hueSliderRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const hue = Math.max(0, Math.min(360, (x / rect.width) * 360));
                updateColor(hue, hsl.s, hsl.l);
              }}
            >
              <div
                className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2"
                style={{
                  left: `${(hsl.h / 360) * 100}%`,
                  backgroundColor: hslToHex(hsl.h, 100, 50),
                }}
              />
            </div>
          </div>

          {/* Hex Input and Eyedropper */}
          <div className="flex items-center gap-2">
            {isTransparent ? (
              <div className="h-8 w-8 rounded border border-border flex-shrink-0 bg-[linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc_100%),linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc_100%)] bg-[length:8px_8px] bg-[0_0,4px_4px]" />
            ) : (
              <div
                className="h-8 w-8 rounded border border-border flex-shrink-0"
                style={{ backgroundColor: hex }}
              />
            )}
            <Input
              type="text"
              value={isTransparent ? "transparent" : hex}
              onChange={handleHexChange}
              disabled={isTransparent}
              className="flex-1 h-8 text-xs font-mono"
              placeholder="#000000"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              disabled={isTransparent}
              onClick={async () => {
                // Eyedropper API
                if ("EyeDropper" in window) {
                  try {
                    const eyeDropper = new (window as any).EyeDropper();
                    const result = await eyeDropper.open();
                    const newHsl = hexToHsl(result.sRGBHex);
                    setHsl(newHsl);
                    setHex(result.sRGBHex);
                    onChange(result.sRGBHex);
                  } catch (e) {
                    // User cancelled
                  }
                }
              }}
            >
              <Droplet className="w-4 h-4" />
            </Button>
          </div>
      </div>
    </div>
  );
}
