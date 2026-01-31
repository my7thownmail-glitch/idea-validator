import { useState, useEffect } from "react";
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
  const [isPulsing, setIsPulsing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsPulsing(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 border border-primary/40 bg-primary/5 hover:bg-primary/15 hover:border-primary/60 shadow-[0_0_12px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)] transition-all duration-300 ${isPulsing ? "animate-[pulse_3s_ease-in-out_infinite]" : ""}`}
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
