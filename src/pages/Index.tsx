import { useState } from "react";
import { ContentSourceSelection } from "@/components/screens/ContentSourceSelection";
import { ArticleSelection } from "@/components/screens/ArticleSelection";
import { TrendingTopicsSelection } from "@/components/screens/TrendingTopicsSelection";
import { TextToVideoSelection } from "@/components/screens/TextToVideoSelection";
import { VideoCreationForm } from "@/components/screens/VideoCreationForm";
import { PreviewEditMode } from "@/components/screens/PreviewEditMode";
import { AdvancedEditor } from "@/components/screens/AdvancedEditor";

type Screen = "source" | "article" | "trending" | "text" | "form" | "preview" | "advanced";
type ContentSource = "article" | "trending" | "text" | "visual" | null;

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("source");
  const [selectedSource, setSelectedSource] = useState<ContentSource>(null);

  const handleSourceSelect = (source: ContentSource) => {
    setSelectedSource(source);
    // Route to appropriate selection screen based on source
    if (source === "trending") {
      setCurrentScreen("trending");
    } else if (source === "text") {
      setCurrentScreen("text");
    } else {
      setCurrentScreen("article");
    }
  };

  const handleArticlesContinue = (selectedArticles: string[]) => {
    setCurrentScreen("form");
  };

  const handleTrendingTopicsContinue = (selectedTopics: string[]) => {
    setCurrentScreen("form");
  };

  const handleTextToVideoContinue = (content: string) => {
    setCurrentScreen("form");
  };

  switch (currentScreen) {
    case "source":
      return <ContentSourceSelection onSelect={handleSourceSelect} />;
    case "article":
      return (
        <ArticleSelection
          onBack={() => setCurrentScreen("source")}
          onContinue={handleArticlesContinue}
        />
      );
    case "trending":
      return (
        <TrendingTopicsSelection
          onBack={() => setCurrentScreen("source")}
          onContinue={handleTrendingTopicsContinue}
        />
      );
    case "text":
      return (
        <TextToVideoSelection
          onBack={() => setCurrentScreen("source")}
          onContinue={handleTextToVideoContinue}
        />
      );
    case "form":
      return (
        <VideoCreationForm
          onBack={() => setCurrentScreen("article")}
          onPreview={() => setCurrentScreen("preview")}
          onAdvancedEdit={() => setCurrentScreen("advanced")}
        />
      );
    case "preview":
      return (
        <PreviewEditMode
          onBack={() => setCurrentScreen("form")}
          onAdvancedEdit={() => setCurrentScreen("advanced")}
        />
      );
    case "advanced":
      return <AdvancedEditor onBack={() => setCurrentScreen("preview")} />;
    default:
      return <ContentSourceSelection onSelect={handleSourceSelect} />;
  }
};

export default Index;
