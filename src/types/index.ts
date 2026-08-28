import type { Build, DevlogEntry, DevlogKind, LinkedBook, Milestone, Project, ProjectStatus, Task, TaskStatus, TaskType } from "@prisma/client";

export type { Build, DevlogEntry, DevlogKind, LinkedBook, Milestone, Project, ProjectStatus, Task, TaskStatus, TaskType };

export type ProjectWithRelations = Project & {
  milestones: Milestone[];
  tasks: Task[];
  devlogEntries: DevlogEntry[];
  builds: Build[];
  linkedBooks: LinkedBook[];
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  ACTIVE: "Active",
  PAUSED: "Paused",
  SHIPPED: "Shipped",
  ABANDONED: "Abandoned",
};

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  FEATURE: "Features",
  BUG: "Bugs",
  ASSET: "Assets",
  POLISH: "Polish",
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};

export const DEVLOG_KIND_LABELS: Record<DevlogKind, string> = {
  BUILD: "Build",
  PLAYTEST: "Playtest",
  LEARNING: "Learning",
  NOTE: "Note",
};
