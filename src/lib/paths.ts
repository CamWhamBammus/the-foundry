import os from "os";
import path from "path";
import fs from "fs";

/**
 * Every piece of persistent state for The Foundry lives under a single
 * macOS-conventional Application Support directory, resolved from the
 * current user's home directory at runtime — same pattern as every other
 * app in the cabin.
 */
export const APP_DATA_DIR = path.join(os.homedir(), "Library", "Application Support", "The Foundry");

export const DB_PATH = path.join(APP_DATA_DIR, "the-foundry.db");

export function ensureDataDirs() {
  fs.mkdirSync(APP_DATA_DIR, { recursive: true });
}
