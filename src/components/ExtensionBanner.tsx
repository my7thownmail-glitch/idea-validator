import { useState } from "react";
import { Chrome, Puzzle, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExtensionInstallModal } from "./ExtensionInstallModal";

export const ExtensionBanner = () => {
  const [showInstallModal, setShowInstallModal] = useState(false);

  return (
    <>
      <div className="bg-secondary/50 border border-border rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Icon & Info */}
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/30">
              <Puzzle className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm sm:text-base">
                Chrome Extension Available
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
                Validate ideas while browsing YouTube, TikTok, X & more.
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MousePointerClick className="h-3 w-3" />
                  Right-click to analyze
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Chrome className="h-3 w-3" />
                  Auto-detect platform
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 sm:flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInstallModal(true)}
            >
              How to Install
            </Button>
            <Button
              size="sm"
              asChild
            >
              <a
                href="https://github.com/my7thownmail-glitch/idea-validator/releases/tag/extension-v1.0.0"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Extension
              </a>
            </Button>
          </div>
        </div>
      </div>

      <ExtensionInstallModal
        open={showInstallModal}
        onOpenChange={setShowInstallModal}
      />
    </>
  );
};
