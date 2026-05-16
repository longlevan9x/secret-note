"use client";

import { Card, CardContent, CardHeader, CardTitle, Button, Textarea, Label, Input } from "@/client/components/ui";
import dynamic from "next/dynamic";

const ReactMarkdown = dynamic(() => import("react-markdown"), {
  loading: () => <p className="text-xs text-zinc-500 italic">Loading preview...</p>,
});

interface DocumentationManagerProps {
  isPreviewMode: boolean;
  setIsPreviewMode: (val: boolean) => void;
  localDescription: string;
  setLocalDescription: (val: string) => void;
  serviceColor: string;
  handleUpdateColor: (color: string) => void;
  handleDescriptionBlur: () => void;
}

export function DocumentationManager({
  isPreviewMode,
  setIsPreviewMode,
  localDescription,
  setLocalDescription,
  serviceColor,
  handleUpdateColor,
  handleDescriptionBlur,
}: DocumentationManagerProps) {
  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Service Documentation</CardTitle>
        <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
          <Button 
            variant={!isPreviewMode ? "secondary" : "ghost"} 
            size="sm" 
            className="h-7 text-[10px] uppercase tracking-wider font-bold"
            onClick={() => setIsPreviewMode(false)}
          >
            Edit
          </Button>
          <Button 
            variant={isPreviewMode ? "secondary" : "ghost"} 
            size="sm" 
            className="h-7 text-[10px] uppercase tracking-wider font-bold"
            onClick={() => setIsPreviewMode(true)}
          >
            Preview
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          {isPreviewMode ? (
            <div className="min-h-[120px] p-4 rounded-md border border-zinc-800 bg-zinc-900/20 prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{localDescription || "_No documentation provided yet._"}</ReactMarkdown>
            </div>
          ) : (
            <Textarea 
              value={localDescription}
              onChange={(e) => setLocalDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
              placeholder="Use Markdown to document this service... (e.g. # API Endpoints, **Bold**, etc.)"
              className="bg-zinc-900 border-zinc-800 min-h-[120px] font-mono text-sm"
            />
          )}
        </div>
        
        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-white">Service Appearance</p>
              <p className="text-xs text-muted-foreground">Choose a custom color for this service on the graph.</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {[
              "#3b82f6", // Blue
              "#10b981", // Emerald
              "#f59e0b", // Amber
              "#ef4444", // Red
              "#8b5cf6", // Violet
              "#ec4899", // Pink
              "#71717a", // Zinc
            ].map((c) => (
              <button
                key={c}
                onClick={() => handleUpdateColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  serviceColor === c ? "border-white scale-110 shadow-lg shadow-white/20" : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
            <div className="flex items-center gap-2 ml-auto">
              <Label className="text-[10px] uppercase font-bold text-zinc-500">Custom Hex</Label>
              <Input 
                value={serviceColor || ""}
                onChange={(e) => handleUpdateColor(e.target.value)}
                placeholder="#000000"
                className="h-8 w-24 text-xs font-mono bg-zinc-950 border-zinc-800"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
