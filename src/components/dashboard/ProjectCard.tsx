import Link from "next/link";
import { Pause } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { ProjectWithRelations } from "@/types";

export function ProjectCard({ project }: { project: ProjectWithRelations }) {
  const milestonesTotal = project.milestones.length;
  const milestonesDone = project.milestones.filter((m) => m.completed).length;
  const openTasks = project.tasks.filter((t) => t.status !== "DONE").length;
  const lastDevlog = project.devlogEntries[0];
  const paused = project.status === "PAUSED";

  return (
    <Link
      href={`/project/${project.id}`}
      className="block rounded-lg border border-walnut-500/15 bg-parchment-paper p-4 shadow-soft transition-shadow hover:shadow-lifted"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-serif text-lg text-canopy-900">{project.title}</h3>
          {project.engine && <p className="mt-0.5 text-xs text-charcoal-600/60">{project.engine}</p>}
        </div>
        {paused && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-charcoal-600/8 px-2 py-0.5 text-[11px] font-medium text-charcoal-600">
            <Pause size={11} />
            Paused
          </span>
        )}
      </div>

      {project.description && <p className="mt-2 line-clamp-2 text-sm text-charcoal-600">{project.description}</p>}

      {milestonesTotal > 0 && (
        <div className="mt-3 flex items-center gap-2">
          <span className="h-1 flex-1 overflow-hidden rounded-full bg-walnut-500/15">
            <span
              className="block h-full bg-moss-600"
              style={{ width: `${Math.round((milestonesDone / milestonesTotal) * 100)}%` }}
            />
          </span>
          <span className="shrink-0 text-[11px] text-charcoal-600/50">
            {milestonesDone}/{milestonesTotal}
          </span>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-charcoal-600/60">
        {project.genre && <span>{project.genre}</span>}
        <span className={cn(openTasks > 0 && "text-clay-500")}>
          {openTasks} open task{openTasks === 1 ? "" : "s"}
        </span>
        {lastDevlog && <span>Last entry {format(new Date(lastDevlog.date), "MMM d")}</span>}
      </div>
    </Link>
  );
}
