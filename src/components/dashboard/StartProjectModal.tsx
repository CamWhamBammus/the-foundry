"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, TextInput, Textarea } from "@/components/ui/Field";
import { api } from "@/lib/api-client";
import type { ReadingCabinBook } from "@/lib/readingCabin";

export function StartProjectModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [engine, setEngine] = useState("");
  const [genre, setGenre] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [books, setBooks] = useState<ReadingCabinBook[] | null>(null);
  const [selectedBookIds, setSelectedBookIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBooks(null);
    api
      .listReadingCabinBooks()
      .then(setBooks)
      .catch(() => setBooks([]));
  }, [open]);

  function toggleBook(id: string) {
    setSelectedBookIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleCreate() {
    setError(null);
    if (!title.trim()) {
      setError("Give it a title.");
      return;
    }
    setCreating(true);
    try {
      await api.createProject({
        title: title.trim(),
        description: description.trim() || undefined,
        engine: engine.trim() || undefined,
        genre: genre.trim() || undefined,
        targetDate: targetDate ? new Date(targetDate).toISOString() : undefined,
        linkedBookIds: selectedBookIds.size > 0 ? [...selectedBookIds] : undefined,
      });
      setTitle("");
      setDescription("");
      setEngine("");
      setGenre("");
      setTargetDate("");
      setSelectedBookIds(new Set());
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Start a new project" width="lg">
      <div className="flex flex-col gap-4">
        <Field label="What are you building?" required>
          <TextInput
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A top-down roguelike in Godot"
          />
        </Field>
        <Field label="Description" hint="Optional">
          <Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Engine / stack" hint="Optional">
            <TextInput value={engine} onChange={(e) => setEngine(e.target.value)} placeholder="Godot 4 / GDScript" />
          </Field>
          <Field label="Genre" hint="Optional">
            <TextInput value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Roguelike" />
          </Field>
        </div>
        <Field label="Target date" hint="Optional">
          <TextInput type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
        </Field>

        {books && books.length > 0 && (
          <Field label="Books you're reading for this" hint="Optional">
            <div className="flex flex-col gap-1.5 rounded-md border border-walnut-500/20 p-2.5">
              {books.map((b) => (
                <label key={b.id} className="flex items-center gap-2 text-sm text-charcoal-800">
                  <input
                    type="checkbox"
                    checked={selectedBookIds.has(b.id)}
                    onChange={() => toggleBook(b.id)}
                    className="accent-moss-600"
                  />
                  {b.title}
                </label>
              ))}
            </div>
          </Field>
        )}

        {error && <p className="text-sm text-clay-500">{error}</p>}
        <div className="mt-1 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={creating}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={creating}>
            {creating ? "Starting…" : "Start the project"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
