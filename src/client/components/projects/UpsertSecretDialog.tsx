"use client";

import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger,
  Button,
  Label,
  Input,
  Textarea
} from "@/client/components/ui";
import { Plus, Settings2, Save, Key } from "lucide-react";
import { Secret } from "@/shared/schema/types";
import { useWorkspace } from "@/client/context/WorkspaceContext";

interface UpsertSecretDialogProps {
  projectId: string;
  serviceId?: string;
  editingSecret?: Secret | null;
  onUpsert?: (secret: Secret, serviceId?: string) => Promise<void>;
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function UpsertSecretDialog({ 
  projectId, 
  serviceId, 
  editingSecret, 
  onUpsert, 
  trigger,
  open: externalOpen,
  onOpenChange: externalOnOpenChange
}: UpsertSecretDialogProps) {
  const { upsertSecret } = useWorkspace();
  const [internalOpen, setInternalOpen] = useState(false);
  
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange !== undefined ? externalOnOpenChange : setInternalOpen;

  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingSecret) {
      setKey(editingSecret.key);
      setValue(editingSecret.value);
      setNote(editingSecret.note || "");
    } else {
      setKey("");
      setValue("");
      setNote("");
    }
  }, [editingSecret, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim() || !value.trim()) return;

    setIsLoading(true);
    try {
      const secret: Secret = {
        key: key.trim(),
        value: value.trim(),
        note: note.trim(),
        lastRotated: editingSecret?.lastRotated || new Date().toISOString(),
      };
      
      if (onUpsert) {
        await onUpsert(secret, serviceId);
      } else {
        await upsertSecret(projectId, secret, serviceId);
      }
      setOpen(false);
      if (!editingSecret) {
        setKey("");
        setValue("");
        setNote("");
      }
    } catch (error) {
      console.error("Failed to upsert secret:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isEditing = !!editingSecret;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          trigger || (externalOpen !== undefined ? <div className="hidden" /> : (
            <Button variant={isEditing ? "ghost" : "outline"} size={isEditing ? "icon" : "sm"} className="gap-2">
              {isEditing ? <Settings2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {!isEditing && "Add Secret"}
            </Button>
          ))
        }
      />
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-black italic">
            <Key className="w-5 h-5 text-primary" />
            {isEditing ? "Edit Secret" : "Add New Secret"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="secret-key" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Variable Name (Key)
              </Label>
              <Input
                id="secret-key"
                placeholder="e.g. DATABASE_URL"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                disabled={isEditing} // Key is often the ID in this model, disable if editing or handle rename carefully
                className="bg-zinc-900 border-zinc-800 focus:ring-primary h-12 font-mono"
                required
              />
              {isEditing && <p className="text-[9px] text-zinc-600 italic">Key names cannot be changed once created.</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secret-value" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Secret Value
              </Label>
              <Input
                id="secret-value"
                type="text" // Or password toggle? Let's use text for simplicity as it's a dialog
                placeholder="Sensitive value..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="bg-zinc-900 border-zinc-800 focus:ring-primary h-12 font-mono"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secret-note" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Note (Optional)
              </Label>
              <Textarea
                id="secret-note"
                placeholder="What is this secret used for?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="bg-zinc-900 border-zinc-800 focus:ring-primary min-h-[80px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              className="w-full gap-2 font-black uppercase tracking-widest" 
              disabled={isLoading || !key.trim() || !value.trim()}
            >
              {isLoading ? "Saving..." : (
                <>
                  <Save className="w-4 h-4" />
                  {isEditing ? "Update Secret" : "Save Secret"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
