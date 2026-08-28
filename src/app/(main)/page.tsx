"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { ProjectGrid } from "@/components/dashboard/ProjectGrid";
import type { ProjectWithRelations } from "@/types";

export default function HomePage() {
  const [projects, setProjects] = useState<ProjectWithRelations[] | null>(null);

  function refresh() {
    api.listProjects().then(setProjects);
  }

  useEffect(refresh, []);

  if (projects === null) {
    return <div className="p-10 text-sm text-charcoal-600/50">Warming up the foundry…</div>;
  }

  return (
    <main className="paper-grain mx-auto min-h-screen max-w-5xl px-6 py-12">
      <ProjectGrid projects={projects} onChange={refresh} />
    </main>
  );
}
