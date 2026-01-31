import { useState } from "react";
import { Puzzle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExtensionInstallModal } from "./ExtensionInstallModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ExtensionButton = () => {
  const [showInstallModal, setShowInstallModal] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 border border-border hover:bg-primary/10 hover:border-primary/30"
              asChild
            >
              <a
                href="https://github.com/my7thownmail-glitch/idea-validator/releases/tag/extension-v1.0.0"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Puzzle className="h-4 w-4" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Get Chrome Extension</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <ExtensionInstallModal
        open={showInstallModal}
        onOpenChange={setShowInstallModal}
      />
    </>
  );
};
