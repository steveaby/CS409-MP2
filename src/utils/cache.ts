export function setCache(key: string, value: any, ttlMs = 1000 * 60) {
  try {
    const payload = { ts: Date.now(), ttl: ttlMs, v: value };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch {}
}

export function getCache(key: string) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { ts, ttl, v } = JSON.parse(raw);
    if (Date.now() - ts > ttl) { localStorage.removeItem(key); return null; }
    return v;
  } catch { return null; }
}
