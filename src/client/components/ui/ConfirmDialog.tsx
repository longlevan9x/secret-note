"use client";

import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  Button 
} from "@/client/components/ui";
import { AlertTriangle, Info, Trash2, X } from "lucide-react";
import { cn } from "@/client/utils/utils";

interface ConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false
}: ConfirmDialogProps) {
  
  const getIcon = () => {
    switch (variant) {
      case "danger": return <Trash2 className="w-6 h-6 text-red-500" />;
      case "warning": return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      default: return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getConfirmButtonStyles = () => {
    switch (variant) {
      case "danger": return "bg-red-600 hover:bg-red-700 text-white";
      case "warning": return "bg-yellow-600 hover:bg-yellow-700 text-white";
      default: return "bg-primary hover:bg-primary/90 text-white";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-zinc-950 border-zinc-800 text-white p-0 overflow-hidden rounded-3xl shadow-2xl">
        <div className="p-6 pt-8 text-center flex flex-col items-center gap-4">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner",
            variant === "danger" ? "bg-red-500/10 border border-red-500/20" : 
            variant === "warning" ? "bg-yellow-500/10 border border-yellow-500/20" : 
            "bg-blue-500/10 border border-blue-500/20"
          )}>
            {getIcon()}
          </div>
          
          <div className="space-y-2">
            <DialogTitle className="text-xl font-black tracking-tight">{title}</DialogTitle>
            <p className="text-sm text-zinc-400 font-medium px-4">
              {description}
            </p>
          </div>
        </div>

        <DialogFooter className="p-6 bg-zinc-900/50 flex flex-row gap-3 sm:justify-center border-t border-zinc-800">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 h-12 rounded-xl font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              // Note: the parent should close it after success if not controlled
            }}
            disabled={isLoading}
            className={cn(
              "flex-1 h-12 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-95",
              getConfirmButtonStyles()
            )}
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </DialogFooter>

        <button 
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all focus:outline-none"
        >
          <X className="w-4 h-4" />
        </button>
      </DialogContent>
    </Dialog>
  );
}
