"use client";

import { useState } from "react";
import { Award, Flame, Pause, Play, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Field";
import { cn } from "@/lib/utils";
import { STATUS_LABELS } from "@/types";
import type { ProjectWithRelations } from "@/types";

const STATUS_TONE: Record<string, string> = {
  ACTIVE: "bg-moss-600/12 text-moss-600",
  PAUSED: "bg-charcoal-600/8 text-charcoal-600",
  SHIPPED: "bg-moss-600/12 text-moss-600",
  ABANDONED: "bg-clay-500/12 text-clay-500",
};

export function ProjectHeader({
  project,
  onPause,
  onResume,
  onShip,
  onAbandon,
  onDelete,
}: {
  project: ProjectWithRelations;
  onPause: () => void;
  onResume: () => void;
  onShip: (retro?: string) => void;
  onAbandon: (retro?: string) => void;
  onDelete: () => void;
}) {
  const [outcomeAction, setOutcomeAction] = useState<"ship" | "abandon" | null>(null);
  const [retro, setRetro] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function handleOutcome() {
    if (outcomeAction === "ship") onShip(retro.trim() || undefined);
    else if (outcomeAction === "abandon") onAbandon(retro.trim() || undefined);
    setOutcomeAction(null);
    setRetro("");
  }

  const finished = project.status === "SHIPPED" || project.status === "ABANDONED";

  return (
    <header>
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-3xl text-canopy-950">{project.title}</h1>
            <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium", STATUS_TONE[project.status])}>
              {STATUS_LABELS[project.status]}
            </span>
          </div>
          {(project.engine || project.genre) && (
            <p className="mt-1 text-sm text-charcoal-600/60">{[project.engine, project.genre].filter(Boolean).join(" · ")}</p>
          )}
          {project.description && <p className="mt-2 text-sm text-charcoal-600">{project.description}</p>}
          {project.targetDate && (
            <p className="mt-2 text-xs text-charcoal-600/50">Target: {format(new Date(project.targetDate), "MMM d, yyyy")}</p>
          )}
        </div>
      </div>

      {!finished ? (
        <div className="mt-5 flex items-center gap-2">
          {project.status === "ACTIVE" ? (
            <Button size="sm" variant="secondary" onClick={onPause}>
              <Pause size={14} />
              Pause
            </Button>
          ) : (
            <Button size="sm" variant="secondary" onClick={onResume}>
              <Play size={14} />
              Resume
            </Button>
          )}
          <Button size="sm" variant="secondary" onClick={() => setOutcomeAction("ship")}>
            <Award size={14} />
            Mark shipped
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setOutcomeAction("abandon")}>
            <Flame size={14} />
            Abandon
          </Button>
          <Button size="sm" variant="danger" onClick={() => setConfirmingDelete(true)}>
            <Trash2 size={14} />
            Delete
          </Button>
        </div>
      ) : (
        <div className="mt-5">
          <Button size="sm" variant="danger" onClick={() => setConfirmingDelete(true)}>
            <Trash2 size={14} />
            Delete
          </Button>
        </div>
      )}

      {project.retro && finished && (
        <p className="mt-4 border-l-2 border-walnut-500/20 pl-3 text-sm text-charcoal-800 italic">&ldquo;{project.retro}&rdquo;</p>
      )}

      <Modal
        open={outcomeAction !== null}
        onClose={() => setOutcomeAction(null)}
        title={outcomeAction === "ship" ? "Mark this project shipped?" : "Abandon this project?"}
      >
        <div className="flex flex-col gap-3">
          <p className="text-sm text-charcoal-600">
            {outcomeAction === "ship"
              ? "It'll move to the Shelf as shipped."
              : "That's fine — honest data is still data. It'll move to the Shelf as abandoned."}
          </p>
          <Textarea
            rows={3}
            value={retro}
            onChange={(e) => setRetro(e.target.value)}
            placeholder="Any reflection — what worked, what you'd do differently…"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOutcomeAction(null)}>
              Cancel
            </Button>
            <Button onClick={handleOutcome}>{outcomeAction === "ship" ? "Ship it" : "Abandon it"}</Button>
          </div>
        </div>
      </Modal>

      <Modal open={confirmingDelete} onClose={() => setConfirmingDelete(false)} title="Delete this project?">
        <div className="flex flex-col gap-3">
          <p className="text-sm text-charcoal-600">
            This permanently deletes &ldquo;{project.title}&rdquo; and everything tracked under it — milestones, tasks, devlog, builds.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmingDelete(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onDelete}>
              Delete permanently
            </Button>
          </div>
        </div>
      </Modal>
    </header>
  );
}
