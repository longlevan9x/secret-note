"use client";

import { Card, CardContent, CardHeader, CardTitle, Label, Input, Button } from "@/client/components/ui";
import { Plus, Settings2, Save } from "lucide-react";

interface SecretFormProps {
  editingSecretKey: string | null;
  newKey: string;
  setNewKey: (val: string) => void;
  newValue: string;
  setNewValue: (val: string) => void;
  newNote: string;
  setNewNote: (val: string) => void;
  handleAddSecret: () => void;
  setEditingSecretKey: (key: string | null) => void;
}

export function SecretForm({
  editingSecretKey,
  newKey,
  setNewKey,
  newValue,
  setNewValue,
  newNote,
  setNewNote,
  handleAddSecret,
  setEditingSecretKey,
}: SecretFormProps) {
  return (
    <Card id="secret-form" className="bg-zinc-950 border-zinc-800 shadow-xl overflow-hidden">
      <CardHeader className="bg-zinc-900/30 pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          {editingSecretKey ? <Settings2 className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
          {editingSecretKey ? "Edit Secret" : "Add New Secret"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase text-zinc-500">Key Name</Label>
            <Input 
              placeholder="e.g. DATABASE_URL" 
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="bg-zinc-900 border-zinc-800"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase text-zinc-500">Value</Label>
            <Input 
              type="password"
              placeholder="Sensitive value..." 
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="bg-zinc-900 border-zinc-800"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase text-zinc-500">Internal Note (Optional)</Label>
          <Input 
            placeholder="Brief note about this secret..." 
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="bg-zinc-900 border-zinc-800 h-10"
          />
        </div>
        <div className="flex justify-end gap-2">
          {editingSecretKey && (
            <Button variant="outline" onClick={() => {
              setNewKey("");
              setNewValue("");
              setNewNote("");
              setEditingSecretKey(null);
            }}>Cancel</Button>
          )}
          <Button onClick={handleAddSecret} className="gap-2 font-bold px-8">
            <Save className="w-4 h-4" />
            {editingSecretKey ? "Update Secret" : "Save Secret"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
