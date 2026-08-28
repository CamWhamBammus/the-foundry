"use client";

import { useState } from "react";
import { Package, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/Field";
import type { Build } from "@/types";

export function BuildsList({ projectId, builds, onChange }: { projectId: string; builds: Build[]; onChange: () => void }) {
  const [version, setVersion] = useState("");
  const [notes, setNotes] = useState("");
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    const v = version.trim();
    if (!v) return;
    setAdding(true);
    try {
      await api.createBuild(projectId, { version: v, notes: notes.trim() || undefined });
      setVersion("");
      setNotes("");
      onChange();
    } finally {
      setAdding(false);
    }
  }

  async function remove(id: string) {
    await api.deleteBuild(id);
    onChange();
  }

  return (
    <div>
      <h2 className="mb-2 text-xs font-medium tracking-wide text-charcoal-600/60 uppercase">Builds</h2>

      <div className="rounded-lg border border-walnut-500/15 bg-parchment-paper shadow-soft">
        {builds.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-charcoal-600/50">No builds tagged yet.</p>
        ) : (
          <div className="divide-y divide-walnut-500/8">
            {builds.map((b) => (
              <div key={b.id} className="group flex items-start gap-3 px-4 py-2.5">
                <Package size={14} className="mt-0.5 shrink-0 text-charcoal-600/40" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-canopy-900">{b.version}</span>
                    <span className="text-[11px] text-charcoal-600/45">{format(new Date(b.date), "MMM d, yyyy")}</span>
                  </div>
                  {b.notes && <p className="mt-0.5 text-xs text-charcoal-600/70">{b.notes}</p>}
                </div>
                <button
                  onClick={() => remove(b.id)}
                  className="shrink-0 rounded p-1 text-charcoal-600/30 opacity-0 transition-opacity hover:bg-clay-500/10 hover:text-clay-500 group-hover:opacity-100"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 border-t border-walnut-500/10 px-3 py-2.5">
          <TextInput
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="v0.3.0"
            className="h-8 w-28 text-sm"
          />
          <TextInput
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="What changed…"
            className="h-8 flex-1 text-sm"
          />
          <Button size="sm" onClick={handleAdd} disabled={!version.trim() || adding}>
            Tag
          </Button>
        </div>
      </div>
    </div>
  );
}
