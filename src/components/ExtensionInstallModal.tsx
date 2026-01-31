import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ExtensionInstallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExtensionInstallModal = ({ open, onOpenChange }: ExtensionInstallModalProps) => {
  const steps = [
    {
      number: 1,
      title: "Download the extension",
      description: "Download the chrome-extension folder from the project repository or request the ZIP file.",
    },
    {
      number: 2,
      title: "Open Chrome Extensions",
      description: "Go to chrome://extensions in your browser address bar.",
    },
    {
      number: 3,
      title: "Enable Developer Mode",
      description: "Toggle the 'Developer mode' switch in the top right corner.",
    },
    {
      number: 4,
      title: "Load the extension",
      description: "Click 'Load unpacked' and select the chrome-extension folder.",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Manual Installation</DialogTitle>
          <DialogDescription>
            Follow these steps to install the extension locally.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                {step.number}
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">{step.title}</h4>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-secondary rounded-lg">
          <p className="text-xs text-muted-foreground">
            <span className="text-primary font-medium">Tip:</span> The extension files are located in the{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-foreground">chrome-extension/</code> folder of this project.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
