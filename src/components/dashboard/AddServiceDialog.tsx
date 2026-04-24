"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  Button
} from "@/components/ui";
import { ServiceTemplate, ServiceNode, Secret } from "@/core/schema/types";
import { APP_CONFIG } from "@/core/constants/app";
import { TemplateSelector } from "./add-service/TemplateSelector";
import { ServiceConfigForm } from "./add-service/ServiceConfigForm";
import { useWorkspace } from "@/context/WorkspaceContext";
import { encryptSecret } from "@/core/security/crypto";

interface AddServiceDialogProps {
  onAdd: (service: Omit<ServiceNode, "id">) => void;
  trigger?: React.ReactElement;
}

export function AddServiceDialog({ onAdd, trigger }: AddServiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"select" | "configure">("select");
  const [selectedTemplate, setSelectedTemplate] = useState<ServiceTemplate | null>(null);
  
  // Form state
  const [serviceName, setServiceName] = useState("");
  const [env, setEnv] = useState(APP_CONFIG.DEFAULT_ENVIRONMENTS[0]);
  const [description, setDescription] = useState("");
  const [initialSecrets, setInitialSecrets] = useState<Record<string, string>>({});

  const { masterPassword } = useWorkspace();

  const resetState = () => {
    setStep("select");
    setSelectedTemplate(null);
    setServiceName("");
    setEnv(APP_CONFIG.DEFAULT_ENVIRONMENTS[0]);
    setDescription("");
    setInitialSecrets({});
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(resetState, APP_CONFIG.MODAL_RESET_TIMEOUT);
    }
  };

  const handleSelectTemplate = (template: ServiceTemplate | null) => {
    setSelectedTemplate(template);
    setServiceName(""); // Keep empty so user enters their own custom name
    setStep("configure");
  };

  const handleSubmit = () => {
    if (!serviceName.trim()) return;

    const secrets: Secret[] = [];

    if (selectedTemplate) {
      selectedTemplate.secretTemplates.forEach(t => {
        const value = initialSecrets[t.key] || "";
        const encryptedValue = (value && masterPassword) ? encryptSecret(value, masterPassword) : value;
        
        secrets.push({
          key: t.key,
          value: encryptedValue,
          lastRotated: new Date().toISOString()
        });
      });
    }

    onAdd({
      name: serviceName,
      provider: selectedTemplate ? selectedTemplate.name : "Custom",
      icon: selectedTemplate?.icon,
      env: env,
      description: description,
      secrets,
      dependsOn: [],
    });

    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger || (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 px-4 border-dashed hover:border-primary hover:bg-primary/5 hover:text-primary transition-all gap-2"
        >
          <span className="text-lg">+</span>
          Add Service
        </Button>
      )} />
      <DialogContent size="4xl">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl">Add New Service</DialogTitle>
          <DialogDescription className="text-base">
            {step === "select" ? "Choose a template to quickly set up standard environment variables." : "Configure your service details."}
          </DialogDescription>
        </DialogHeader>

        {step === "select" && (
          <TemplateSelector onSelect={handleSelectTemplate} />
        )}

        {step === "configure" && (
          <ServiceConfigForm 
            selectedTemplate={selectedTemplate}
            serviceName={serviceName}
            setServiceName={setServiceName}
            env={env}
            setEnv={setEnv}
            description={description}
            setDescription={setDescription}
            initialSecrets={initialSecrets}
            setInitialSecrets={setInitialSecrets}
            onBack={() => setStep("select")}
            onSubmit={handleSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
