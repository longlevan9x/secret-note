"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/client/components/ui/Dialog";
import { Button } from "@/client/components/ui/Button";
import { Input } from "@/client/components/ui/Input";
import { Label } from "@/client/components/ui/Label";
import { Plus, Trash2, Settings2 } from "lucide-react";
import { ServiceTemplate, SecretTemplate } from "@/shared/schema/types";
import { useWorkspace } from "@/client/context/WorkspaceContext";
import { useToast } from "@/client/hooks/use-toast";

export function CustomTemplateDialog() {
  const { addCustomTemplate } = useWorkspace();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [keys, setKeys] = useState<SecretTemplate[]>([
    { key: "", description: "", isSensitive: true }
  ]);

  const handleAddKey = () => {
    setKeys([...keys, { key: "", description: "", isSensitive: true }]);
  };

  const handleRemoveKey = (index: number) => {
    setKeys(keys.filter((_, i) => i !== index));
  };

  const handleKeyChange = (index: number, field: keyof SecretTemplate, value: string | boolean) => {
    const newKeys = [...keys];
    newKeys[index] = { ...newKeys[index], [field]: value };
    setKeys(newKeys);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({ title: "Template name required", variant: "destructive" });
      return;
    }

    const validKeys = keys.filter(k => k.key.trim());
    if (validKeys.length === 0) {
      toast({ title: "At least one key is required", variant: "destructive" });
      return;
    }

    const template: ServiceTemplate = {
      providerId: `custom-${crypto.randomUUID()}`,
      name,
      icon: icon.trim() || "layout",
      secretTemplates: validKeys,
    };

    await addCustomTemplate(template);
    
    toast({
      title: "Template Saved",
      description: `"${name}" is now available in your template list.`,
    });

    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setIcon("");
    setKeys([{ key: "", description: "", isSensitive: true }]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger 
        render={
          <Button variant="outline" className="h-full min-h-[120px] border-2 border-dashed border-zinc-800 hover:border-primary/50 hover:bg-primary/5 transition-all group flex flex-col gap-2">
            <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Plus className="w-5 h-5 text-zinc-500 group-hover:text-primary" />
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-zinc-400 group-hover:text-white">New Template</p>
              <p className="text-[10px] text-zinc-600">Create custom structure</p>
            </div>
          </Button>
        }
      />
      <DialogContent className="max-w-2xl bg-zinc-950 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-black">
            <Settings2 className="w-6 h-6 text-primary" />
            Create Custom Template
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Template Name</Label>
              <Input 
                placeholder="e.g. My Internal API" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="bg-zinc-900 border-zinc-800 h-11"
              />
            </div>
            <div className="space-y-2">
              <Label>Icon Slug (Simple Icons)</Label>
              <Input 
                placeholder="e.g. docker, node-dot-js" 
                value={icon}
                onChange={e => setIcon(e.target.value)}
                className="bg-zinc-900 border-zinc-800 h-11"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Required Keys</Label>
              <Button variant="ghost" size="sm" onClick={handleAddKey} className="h-7 text-[10px] gap-1 hover:bg-primary/10 hover:text-primary font-bold">
                <Plus className="w-3 h-3" />
                Add Field
              </Button>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {keys.map((k, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 group/key">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Input 
                        placeholder="KEY_NAME" 
                        value={k.key}
                        onChange={e => handleKeyChange(i, "key", e.target.value)}
                        className="h-9 font-mono text-xs bg-zinc-950"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Input 
                        placeholder="Short description..." 
                        value={k.description}
                        onChange={e => handleKeyChange(i, "description", e.target.value)}
                        className="h-9 text-xs bg-zinc-950"
                      />
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveKey(i)}
                    className="h-9 w-9 text-zinc-600 hover:text-destructive hover:bg-destructive/10"
                    disabled={keys.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-zinc-800">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} className="px-8 font-bold">Save Template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
