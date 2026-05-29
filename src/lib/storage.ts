// Tiny typed-ish localStorage helpers (SSR-safe)
export const storage = {
  get<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    if (typeof window === "undefined") return;
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
  remove(key: string) {
    if (typeof window === "undefined") return;
    try { window.localStorage.removeItem(key); } catch {}
  },
};
