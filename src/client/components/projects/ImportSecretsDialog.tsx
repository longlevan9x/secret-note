"use client";

import React, { useState, useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  Button,
  Label,
  Textarea,
  ScrollArea,
  buttonVariants
} from "@/client/components/ui";
import { cn } from "@/client/utils/utils";
import { Import, AlertCircle, CheckCircle2, ClipboardPaste, FileUp, Upload } from "lucide-react";
import { Secret } from "@/shared/schema/types";

type ImportMode = "paste" | "file";

interface ImportSecretsDialogProps {
  onImport: (secrets: Secret[]) => void | Promise<void>;
  trigger?: React.ReactElement;
}

/**
 * Parse raw KEY=VALUE text into Secret objects.
 */
function parseEnvText(text: string): Secret[] {
  const lines = text.split("\n");
  const secrets: Secret[] = [];

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) return;

    const match = trimmedLine.match(/^([^=:]+)[=:](.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();

      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      secrets.push({
        key,
        value,
        lastRotated: new Date().toISOString(),
      });
    }
  });

  return secrets;
}

export function ImportSecretsDialog({ onImport, trigger }: ImportSecretsDialogProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ImportMode>("paste");
  const [rawText, setRawText] = useState("");
  const [parsedSecrets, setParsedSecrets] = useState<Secret[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setRawText("");
    setParsedSecrets([]);
    setError(null);
    setFileName(null);
  };

  const handleModeChange = (newMode: ImportMode) => {
    setMode(newMode);
    resetState();
  };

  const handleParse = (text?: string) => {
    const content = text ?? rawText;
    try {
      const secrets = parseEnvText(content);
      if (secrets.length === 0) {
        setError("No valid secrets found. Use KEY=VALUE format.");
        setParsedSecrets([]);
      } else {
        setError(null);
        setParsedSecrets(secrets);
      }
    } catch {
      setError("Failed to parse. Please check the format.");
      setParsedSecrets([]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setRawText(text);
      handleParse(text);
    };
    reader.onerror = () => {
      setError("Failed to read file.");
    };
    reader.readAsText(file);

    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setRawText(text);
      handleParse(text);
    };
    reader.readAsText(file);
  };

  const handleConfirm = async () => {
    await onImport(parsedSecrets);
    resetState();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetState();
    }}>
      <DialogTrigger 
        render={trigger || (
          <button className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}>
            <Import className="w-4 h-4" />
            Import Secrets
          </button>
        )} 
      />
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Secrets</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {/* Mode Switcher */}
          <div className="flex gap-2 p-1 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <button
              onClick={() => handleModeChange("paste")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all",
                mode === "paste"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              Paste Text
            </button>
            <button
              onClick={() => handleModeChange("file")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all",
                mode === "file"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <FileUp className="w-3.5 h-3.5" />
              Choose File
            </button>
          </div>

          {/* Paste Mode */}
          {mode === "paste" && (
            <div className="space-y-3">
              <Label className="text-xs">Paste <code className="text-primary">.env</code> or <code className="text-primary">KEY=VALUE</code> content</Label>
              <Textarea 
                placeholder={"DATABASE_URL=postgres://...\nAPI_KEY=sk_test_...\n# Comments are ignored"} 
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="min-h-[180px] font-mono text-xs resize-none bg-zinc-950 border-zinc-800"
              />
              <Button 
                variant="secondary" 
                className="w-full" 
                onClick={() => handleParse()}
                disabled={!rawText.trim()}
              >
                Preview Import
              </Button>
            </div>
          )}

          {/* File Mode */}
          {mode === "file" && (
            <div className="space-y-3">
              <Label className="text-xs">
                Upload a <code className="text-primary">.env</code> file or any text file with <code className="text-primary">KEY=VALUE</code> pairs
              </Label>
              <div 
                className="border-2 border-dashed border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={handleDrop}
              >
                <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                </div>
                {fileName ? (
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">{fileName}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">File loaded. Click to change.</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-xs font-bold text-muted-foreground">
                      Click to browse or drag & drop
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Supports .env, .txt, and similar text files
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".env,.txt,.conf,.cfg,.properties,.yaml,.yml,.toml,.ini"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Preview */}
          {parsedSecrets.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Detected {parsedSecrets.length} secrets
                </p>
              </div>
              <ScrollArea className="h-[150px] rounded-md border border-zinc-800 bg-zinc-950 p-3">
                <div className="space-y-2">
                  {parsedSecrets.map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px] border-b border-zinc-900 pb-1 last:border-0">
                      <span className="font-mono text-primary">{s.key}</span>
                      <span className="text-muted-foreground truncate max-w-[200px]">
                        {s.value.length > 20 ? s.value.substring(0, 20) + "..." : s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Button className="w-full" onClick={handleConfirm}>
                Confirm Import
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
