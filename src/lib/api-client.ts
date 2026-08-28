import type { Build, DevlogEntry, DevlogKind, Milestone, ProjectWithRelations, Task, TaskStatus, TaskType } from "@/types";
import type { ReadingCabinBook } from "./readingCabin";

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? "Something went wrong.");
  }
  return res.json();
}

export interface FoundrySummary {
  totalProjects: number;
  active: number;
  paused: number;
  shipped: number;
  abandoned: number;
  openTasks: number;
}

export const api = {
  listProjects: () => fetch("/api/projects", { cache: "no-store" }).then((r) => json<ProjectWithRelations[]>(r)),

  getProject: (id: string) => fetch(`/api/projects/${id}`, { cache: "no-store" }).then((r) => json<ProjectWithRelations>(r)),

  createProject: (data: {
    title: string;
    description?: string;
    engine?: string;
    genre?: string;
    targetDate?: string;
    linkedBookIds?: string[];
  }) =>
    fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => json<ProjectWithRelations>(r)),

  updateProject: (
    id: string,
    data: Partial<{
      title: string;
      description: string | null;
      engine: string | null;
      genre: string | null;
      targetDate: string | null;
    }>
  ) =>
    fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => json<ProjectWithRelations>(r)),

  deleteProject: (id: string) => fetch(`/api/projects/${id}`, { method: "DELETE" }).then((r) => json(r)),

  pauseProject: (id: string) => fetch(`/api/projects/${id}/pause`, { method: "POST" }).then((r) => json<ProjectWithRelations>(r)),
  resumeProject: (id: string) => fetch(`/api/projects/${id}/resume`, { method: "POST" }).then((r) => json<ProjectWithRelations>(r)),

  shipProject: (id: string, retro?: string) =>
    fetch(`/api/projects/${id}/ship`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ retro }),
    }).then((r) => json<ProjectWithRelations>(r)),

  abandonProject: (id: string, retro?: string) =>
    fetch(`/api/projects/${id}/abandon`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ retro }),
    }).then((r) => json<ProjectWithRelations>(r)),

  createMilestone: (projectId: string, title: string) =>
    fetch(`/api/projects/${projectId}/milestones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    }).then((r) => json<Milestone>(r)),

  updateMilestone: (id: string, data: Partial<{ title: string; completed: boolean; order: number }>) =>
    fetch(`/api/milestones/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => json<Milestone>(r)),

  deleteMilestone: (id: string) => fetch(`/api/milestones/${id}`, { method: "DELETE" }).then((r) => json(r)),

  createTask: (projectId: string, data: { title: string; type: TaskType }) =>
    fetch(`/api/projects/${projectId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => json<Task>(r)),

  updateTask: (id: string, data: Partial<{ title: string; type: TaskType; status: TaskStatus; order: number }>) =>
    fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => json<Task>(r)),

  deleteTask: (id: string) => fetch(`/api/tasks/${id}`, { method: "DELETE" }).then((r) => json(r)),

  createDevlogEntry: (projectId: string, data: { kind: DevlogKind; body: string; date?: string }) =>
    fetch(`/api/projects/${projectId}/devlog`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => json<DevlogEntry>(r)),

  deleteDevlogEntry: (id: string) => fetch(`/api/devlog/${id}`, { method: "DELETE" }).then((r) => json(r)),

  createBuild: (projectId: string, data: { version: string; notes?: string }) =>
    fetch(`/api/projects/${projectId}/builds`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => json<Build>(r)),

  deleteBuild: (id: string) => fetch(`/api/builds/${id}`, { method: "DELETE" }).then((r) => json(r)),

  getSummary: () => fetch("/api/summary", { cache: "no-store" }).then((r) => json<FoundrySummary>(r)),

  listReadingCabinBooks: () =>
    fetch("/api/reading-cabin/books", { cache: "no-store" }).then((r) => json<ReadingCabinBook[]>(r)),

  linkBook: (projectId: string, textbookId: string) =>
    fetch(`/api/projects/${projectId}/linked-books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ textbookId }),
    }).then((r) => json(r)),

  unlinkBook: (projectId: string, textbookId: string) =>
    fetch(`/api/projects/${projectId}/linked-books/${textbookId}`, { method: "DELETE" }).then((r) => json(r)),
};
