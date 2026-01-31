import { useState } from "react";
import { ValidatorForm, FormData } from "@/components/ValidatorForm";
import { ValidationResults, ValidationResult } from "@/components/ValidationResults";
import { ExtensionButton } from "@/components/ExtensionButton";
import { validateIdea } from "@/lib/validateIdea";
import { toast } from "sonner";
import { Zap } from "lucide-react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const validationResult = await validateIdea(data);
      setResult(validationResult);
    } catch (error) {
      toast.error("Analysis failed. Please try again.");
      console.error("Validation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Right Extension Button */}
      <div className="fixed top-4 right-4 z-50">
        <ExtensionButton />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-primary/10 border border-primary/30">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Content Validator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight">
            AI Content Idea Validator
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Get honest, data-driven feedback on your content ideas before wasting time on mediocre posts.
          </p>
        </header>

        {/* Main Content */}
        <div className="space-y-10">
          {/* Form Section */}
          <section className="bg-card border border-border rounded-xl p-6 sm:p-8">
            <ValidatorForm onSubmit={handleSubmit} isLoading={isLoading} />
          </section>

          {/* Results Section */}
          {result && (
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full" />
                Analysis Results
              </h2>
              <ValidationResults result={result} />
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>No fluff. No motivation. Just data.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
