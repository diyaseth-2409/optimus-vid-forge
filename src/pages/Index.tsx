import { useState } from "react";
import { ContentSourceSelection } from "@/components/screens/ContentSourceSelection";
import { ArticleSelection } from "@/components/screens/ArticleSelection";
import { VideoCreationForm } from "@/components/screens/VideoCreationForm";
import { PreviewEditMode } from "@/components/screens/PreviewEditMode";
import { AdvancedEditor } from "@/components/screens/AdvancedEditor";

type Screen = "source" | "article" | "form" | "preview" | "advanced";
type ContentSource = "article" | "trending" | "text" | "webstory" | "photos" | null;

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("source");
  const [selectedSource, setSelectedSource] = useState<ContentSource>(null);

  const handleSourceSelect = (source: ContentSource) => {
    setSelectedSource(source);
    // For now, all paths lead to article selection for demo
    // In production, each source would have its own flow
    setCurrentScreen("article");
  };

  const handleArticlesContinue = (selectedArticles: string[]) => {
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
