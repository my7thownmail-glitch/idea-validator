import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export interface FormData {
  idea: string;
  platform: string;
  contentType: string;
  audienceLevel: string;
  goal: string;
}

interface ValidatorFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const platforms = [
  { value: "youtube-shorts", label: "YouTube Shorts" },
  { value: "tiktok", label: "TikTok" },
  { value: "instagram-reels", label: "Instagram Reels" },
  { value: "x", label: "X (Twitter)" },
  { value: "linkedin", label: "LinkedIn" },
];

const contentTypes = [
  { value: "educational", label: "Educational" },
  { value: "entertainment", label: "Entertainment" },
  { value: "storytelling", label: "Storytelling" },
  { value: "ai-tech", label: "AI/Tech" },
  { value: "finance", label: "Finance" },
  { value: "motivation", label: "Motivation" },
  { value: "horror", label: "Horror" },
];

const audienceLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "mass", label: "Mass Appeal" },
];

const goals = [
  { value: "viral", label: "Go viral" },
  { value: "authority", label: "Build authority" },
  { value: "followers", label: "Get followers" },
  { value: "traffic", label: "Drive traffic" },
];

export function ValidatorForm({ onSubmit, isLoading }: ValidatorFormProps) {
  const [formData, setFormData] = useState<FormData>({
    idea: "",
    platform: "",
    contentType: "",
    audienceLevel: "",
    goal: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid = formData.idea.trim() && formData.platform && formData.contentType && formData.audienceLevel && formData.goal;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="idea" className="text-foreground">Content Idea</Label>
        <Textarea
          id="idea"
          placeholder="Describe your content idea in detail. What's the hook? What value does it provide?"
          value={formData.idea}
          onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
          className="min-h-[120px] bg-input border-border text-foreground placeholder:text-muted-foreground resize-none focus:ring-primary focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-foreground">Platform</Label>
          <Select
            value={formData.platform}
            onValueChange={(value) => setFormData({ ...formData, platform: value })}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {platforms.map((p) => (
                <SelectItem key={p.value} value={p.value} className="text-popover-foreground hover:bg-muted">
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Content Type</Label>
          <Select
            value={formData.contentType}
            onValueChange={(value) => setFormData({ ...formData, contentType: value })}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {contentTypes.map((t) => (
                <SelectItem key={t.value} value={t.value} className="text-popover-foreground hover:bg-muted">
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Audience Level</Label>
          <Select
            value={formData.audienceLevel}
            onValueChange={(value) => setFormData({ ...formData, audienceLevel: value })}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {audienceLevels.map((a) => (
                <SelectItem key={a.value} value={a.value} className="text-popover-foreground hover:bg-muted">
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Goal</Label>
          <Select
            value={formData.goal}
            onValueChange={(value) => setFormData({ ...formData, goal: value })}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select goal" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {goals.map((g) => (
                <SelectItem key={g.value} value={g.value} className="text-popover-foreground hover:bg-muted">
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin-slow" />
            Analyzing...
          </>
        ) : (
          "Validate Idea"
        )}
      </Button>
    </form>
  );
}
