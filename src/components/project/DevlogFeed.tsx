"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { DEVLOG_KIND_LABELS } from "@/types";
import type { DevlogEntry, DevlogKind } from "@/types";

const KINDS: DevlogKind[] = ["BUILD", "PLAYTEST", "LEARNING", "NOTE"];
const KIND_TONE: Record<DevlogKind, string> = {
  BUILD: "bg-amber-500/12 text-amber-500",
  PLAYTEST: "bg-sage-400/20 text-moss-600",
  LEARNING: "bg-walnut-500/12 text-walnut-500",
  NOTE: "bg-charcoal-600/8 text-charcoal-600",
};

export function DevlogFeed({
  projectId,
  entries,
  onChange,
}: {
  projectId: string;
  entries: DevlogEntry[];
  onChange: () => void;
}) {
  const [kind, setKind] = useState<DevlogKind>("NOTE");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleAdd() {
    const text = body.trim();
    if (!text) return;
    setSubmitting(true);
    try {
      await api.createDevlogEntry(projectId, { kind, body: text });
      setBody("");
      onChange();
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string) {
    await api.deleteDevlogEntry(id);
    onChange();
  }

  return (
    <div>
      <h2 className="mb-2 text-xs font-medium tracking-wide text-charcoal-600/60 uppercase">Devlog</h2>

      <div className="rounded-lg border border-walnut-500/15 bg-parchment-paper p-3 shadow-soft">
        <div className="flex items-center gap-2">
          <Select value={kind} onChange={(e) => setKind(e.target.value as DevlogKind)} className="h-8 w-36 text-sm">
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {DEVLOG_KIND_LABELS[k]}
              </option>
            ))}
          </Select>
        </div>
        <Textarea
          rows={2}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What got built, what you learned, how the playtest went…"
          className="mt-2"
        />
        <div className="mt-2 flex justify-end">
          <Button size="sm" onClick={handleAdd} disabled={!body.trim() || submitting}>
            {submitting ? "Logging…" : "Log entry"}
          </Button>
        </div>
      </div>

      {entries.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {entries.map((e) => (
            <div key={e.id} className="group flex items-start gap-3 rounded-lg border border-walnut-500/10 bg-parchment-paper/60 px-3 py-2.5">
              <span className={cn("mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium", KIND_TONE[e.kind])}>
                {DEVLOG_KIND_LABELS[e.kind]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm whitespace-pre-wrap text-charcoal-800">{e.body}</p>
                <p className="mt-1 text-[11px] text-charcoal-600/45">{format(new Date(e.date), "MMM d, yyyy · h:mm a")}</p>
              </div>
              <button
                onClick={() => remove(e.id)}
                className="shrink-0 rounded p-1 text-charcoal-600/30 opacity-0 transition-opacity hover:bg-clay-500/10 hover:text-clay-500 group-hover:opacity-100"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
