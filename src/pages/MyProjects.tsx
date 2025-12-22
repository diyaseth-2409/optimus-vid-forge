import { useState } from "react";
import { Link } from "react-router-dom";
import { Folder, Moon, Sun, ArrowLeft, Play, MoreVertical, Trash2, Edit, Eye } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for projects
const mockProjects = [
  {
    id: 1,
    title: "India's GDP Growth Analysis",
    status: "published" as const,
    thumbnail: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=225&fit=crop",
    duration: "30s",
    scenes: 6,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-16",
  },
  {
    id: 2,
    title: "Tech Industry Trends 2024",
    status: "published" as const,
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop",
    duration: "45s",
    scenes: 9,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-12",
  },
  {
    id: 3,
    title: "Climate Change Impact Report",
    status: "draft" as const,
    thumbnail: "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=225&fit=crop",
    duration: "25s",
    scenes: 5,
    createdAt: "2024-01-18",
    updatedAt: "2024-01-19",
  },
  {
    id: 4,
    title: "Market Analysis Q4 2023",
    status: "draft" as const,
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
    duration: "35s",
    scenes: 7,
    createdAt: "2024-01-20",
    updatedAt: "2024-01-21",
  },
  {
    id: 5,
    title: "Healthcare Innovation Updates",
    status: "published" as const,
    thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=225&fit=crop",
    duration: "40s",
    scenes: 8,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-09",
  },
  {
    id: 6,
    title: "Education Technology Trends",
    status: "draft" as const,
    thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=225&fit=crop",
    duration: "20s",
    scenes: 4,
    createdAt: "2024-01-22",
    updatedAt: "2024-01-22",
  },
];

export default function MyProjects() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"published" | "draft">("published");

  const publishedProjects = mockProjects.filter((p) => p.status === "published");
  const draftProjects = mockProjects.filter((p) => p.status === "draft");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-semibold hover:opacity-80 transition-opacity">
            Slike <span className="text-black dark:text-white font-bold">Optimus</span> Video Creation Platform
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="flex items-center gap-2">
              <Link to="/">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
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
      <main className="relative z-10 container mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Folder className="w-8 h-8 text-primary" />
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              My Projects
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage your published videos and draft projects
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "published" | "draft")} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="published">
              Published ({publishedProjects.length})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Draft ({draftProjects.length})
            </TabsTrigger>
          </TabsList>

          {/* Published Projects */}
          <TabsContent value="published" className="mt-0">
            {publishedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publishedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button size="icon" variant="secondary" className="rounded-full">
                          <Play className="w-5 h-5" />
                        </Button>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {project.duration}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground line-clamp-2 flex-1">
                          {project.title}
                        </h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 ml-2">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{project.scenes} scenes</span>
                        <span>•</span>
                        <span>Updated {formatDate(project.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Folder className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No published projects yet</p>
              </div>
            )}
          </TabsContent>

          {/* Draft Projects */}
          <TabsContent value="draft" className="mt-0">
            {draftProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {draftProjects.map((project) => (
                  <div
                    key={project.id}
                    className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button size="icon" variant="secondary" className="rounded-full">
                          <Play className="w-5 h-5" />
                        </Button>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {project.duration}
                      </div>
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded font-medium">
                        Draft
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground line-clamp-2 flex-1">
                          {project.title}
                        </h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 ml-2">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Continue Editing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{project.scenes} scenes</span>
                        <span>•</span>
                        <span>Updated {formatDate(project.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Folder className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No draft projects yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
