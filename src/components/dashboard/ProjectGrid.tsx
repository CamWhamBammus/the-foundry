"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "./ProjectCard";
import { EmptyFoundryState } from "./EmptyFoundryState";
import { StartProjectModal } from "./StartProjectModal";
import type { ProjectWithRelations } from "@/types";

export function ProjectGrid({
  projects,
  onChange,
}: {
  projects: ProjectWithRelations[];
  onChange: () => void;
}) {
  const [open, setOpen] = useState(false);

  const workbench = projects.filter((p) => p.status === "ACTIVE" || p.status === "PAUSED");

  if (workbench.length === 0) {
    return <EmptyFoundryState onCreated={onChange} />;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-canopy-950">The Foundry</h1>
          <p className="mt-1 text-sm text-charcoal-600">What&apos;s on the bench right now.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} />
          New project
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workbench.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      <StartProjectModal open={open} onClose={() => setOpen(false)} onCreated={onChange} />
    </div>
  );
}
