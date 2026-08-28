"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { TASK_TYPE_LABELS } from "@/types";
import type { Task, TaskStatus, TaskType } from "@/types";

const TYPES: TaskType[] = ["FEATURE", "BUG", "ASSET", "POLISH"];
const STATUS_CYCLE: Record<TaskStatus, TaskStatus> = {
  TODO: "IN_PROGRESS",
  IN_PROGRESS: "DONE",
  DONE: "TODO",
};
const STATUS_DOT: Record<TaskStatus, string> = {
  TODO: "border-walnut-500/40",
  IN_PROGRESS: "border-amber-500 bg-amber-500/30",
  DONE: "border-moss-600 bg-moss-600",
};

function TaskColumn({
  projectId,
  type,
  tasks,
  onChange,
}: {
  projectId: string;
  type: TaskType;
  tasks: Task[];
  onChange: () => void;
}) {
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    const title = draft.trim();
    if (!title) return;
    setAdding(true);
    try {
      await api.createTask(projectId, { title, type });
      setDraft("");
      onChange();
    } finally {
      setAdding(false);
    }
  }

  async function cycleStatus(task: Task) {
    await api.updateTask(task.id, { status: STATUS_CYCLE[task.status] });
    onChange();
  }

  async function remove(id: string) {
    await api.deleteTask(id);
    onChange();
  }

  return (
    <div className="rounded-lg border border-walnut-500/15 bg-parchment-paper shadow-soft">
      <div className="flex items-baseline justify-between border-b border-walnut-500/10 px-3 py-2">
        <h3 className="text-xs font-medium tracking-wide text-charcoal-600/60 uppercase">{TASK_TYPE_LABELS[type]}</h3>
        <span className="text-xs text-charcoal-600/50">{tasks.length}</span>
      </div>

      {tasks.length === 0 ? (
        <p className="px-3 py-4 text-center text-xs text-charcoal-600/40">Nothing here yet.</p>
      ) : (
        <div className="divide-y divide-walnut-500/8">
          {tasks.map((t) => (
            <div key={t.id} className="group flex items-center gap-2.5 px-3 py-2">
              <button
                onClick={() => cycleStatus(t)}
                title={t.status}
                className={cn("h-3.5 w-3.5 shrink-0 rounded-full border transition-colors", STATUS_DOT[t.status])}
              />
              <span className={cn("flex-1 text-sm", t.status === "DONE" ? "text-charcoal-600/40 line-through" : "text-charcoal-800")}>
                {t.title}
              </span>
              <button
                onClick={() => remove(t.id)}
                className="rounded p-1 text-charcoal-600/30 opacity-0 transition-opacity hover:bg-clay-500/10 hover:text-clay-500 group-hover:opacity-100"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1.5 border-t border-walnut-500/10 px-2 py-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add…"
          className="h-7 flex-1 rounded-md border border-walnut-500/20 bg-transparent px-2 text-xs text-charcoal-800 placeholder:text-charcoal-600/40 focus:border-moss-500 focus:outline-none"
        />
        <button
          onClick={handleAdd}
          disabled={!draft.trim() || adding}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-moss-600 hover:bg-moss-600/10 disabled:opacity-40"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

export function TaskBoard({ projectId, tasks, onChange }: { projectId: string; tasks: Task[]; onChange: () => void }) {
  return (
    <div>
      <h2 className="mb-2 text-xs font-medium tracking-wide text-charcoal-600/60 uppercase">Backlog</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TYPES.map((type) => (
          <TaskColumn
            key={type}
            projectId={projectId}
            type={type}
            tasks={tasks.filter((t) => t.type === type)}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
}
