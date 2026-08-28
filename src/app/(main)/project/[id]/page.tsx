"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { MilestoneChecklist } from "@/components/project/MilestoneChecklist";
import { TaskBoard } from "@/components/project/TaskBoard";
import { DevlogFeed } from "@/components/project/DevlogFeed";
import { BuildsList } from "@/components/project/BuildsList";
import { LinkedBooksPanel } from "@/components/project/LinkedBooksPanel";
import type { ProjectWithRelations } from "@/types";

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<ProjectWithRelations | null | undefined>(undefined);

  function refresh() {
    api.getProject(id).then(setProject).catch(() => setProject(null));
  }

  useEffect(refresh, [id]);

  if (project === undefined) {
    return <div className="p-10 text-sm text-charcoal-600/50">Fetching from the bench…</div>;
  }

  if (project === null) {
    return <div className="p-10 text-sm text-charcoal-600/50">Couldn&apos;t find that project.</div>;
  }

  async function handleDelete() {
    await api.deleteProject(id);
    router.push("/");
  }

  return (
    <main className="paper-grain mx-auto min-h-screen max-w-3xl px-6 py-12">
      <ProjectHeader
        project={project}
        onPause={() => api.pauseProject(id).then(refresh)}
        onResume={() => api.resumeProject(id).then(refresh)}
        onShip={(retro) => api.shipProject(id, retro).then(refresh)}
        onAbandon={(retro) => api.abandonProject(id, retro).then(refresh)}
        onDelete={handleDelete}
      />

      <div className="mt-8">
        <MilestoneChecklist projectId={project.id} milestones={project.milestones} onChange={refresh} />
      </div>

      <div className="mt-8">
        <TaskBoard projectId={project.id} tasks={project.tasks} onChange={refresh} />
      </div>

      <div className="mt-8">
        <BuildsList projectId={project.id} builds={project.builds} onChange={refresh} />
      </div>

      <div className="mt-8">
        <LinkedBooksPanel projectId={project.id} linkedBooks={project.linkedBooks} onChange={refresh} />
      </div>

      <div className="mt-8">
        <DevlogFeed projectId={project.id} entries={project.devlogEntries} onChange={refresh} />
      </div>
    </main>
  );
}
