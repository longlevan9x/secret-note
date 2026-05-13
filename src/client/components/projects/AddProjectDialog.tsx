"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  Button,
  Input,
  Label,
  Textarea,
  buttonVariants
} from "@/client/components/ui";
import { cn } from "@/client/utils/utils";
import { Plus } from "lucide-react";

interface AddProjectDialogProps {
  onAdd: (data: { name: string; description?: string; icon?: string }) => void;
  trigger?: React.ReactElement;
}

export function AddProjectDialog({ onAdd, trigger }: AddProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      description: description.trim() || undefined,
      icon: icon.trim() || undefined,
    });

    setName("");
    setDescription("");
    setIcon("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={trigger || (
          <button className={cn(buttonVariants({ size: "sm" }), "gap-2")}>
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        )}
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input 
              id="project-name" 
              placeholder="e.g., Infrastructure, Frontend Services" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-description">Description (Optional)</Label>
            <Textarea 
              id="project-description" 
              placeholder="What is this project for?" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-icon">Icon Slug (Optional)</Label>
            <Input 
              id="project-icon" 
              placeholder="e.g., vercel, supabase, amazonwebservices" 
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />
            <p className="text-[10px] text-muted-foreground">Uses Simple Icons slugs.</p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
