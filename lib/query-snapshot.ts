import { APP_VERSION } from "./env";

type SnapshotPayload<T> = {
  version: string;
  value: T;
  savedAt: number;
};

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeRead<T>(key: string): T | undefined {
  if (!isBrowser()) return undefined;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as SnapshotPayload<T>;
    if (!parsed || parsed.version !== APP_VERSION) {
      return undefined;
    }
    return parsed.value;
  } catch {
    return undefined;
  }
}

function safeWrite<T>(key: string, value: T) {
  if (!isBrowser()) return;

  try {
    const payload: SnapshotPayload<T> = {
      version: APP_VERSION,
      value,
      savedAt: Date.now(),
    };
    window.localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // ignore snapshot write failures
  }
}

export function createSnapshotKey(parts: Array<string | number | null | undefined>) {
  return ["owwi.newui", APP_VERSION, ...parts.map((part) => String(part ?? ""))].join(":");
}

export function readSnapshot<T>(key: string) {
  return safeRead<T>(key);
}

export function writeSnapshot<T>(key: string, value: T) {
  safeWrite(key, value);
}
