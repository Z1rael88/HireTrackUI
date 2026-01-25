export function parseYmdToUtcDate(value?: string | null): Date | null {
  if (!value) return null;

  const parts = value.split("-").map((v) => Number(v));
  const [y, m, d] = parts;

  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;
  return new Date(Date.UTC(y, m - 1, d));
}

export function startOfTodayUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function isActiveByEndDate(endDate?: string | null): boolean {
  const todayUtc = startOfTodayUtc();
  const parsed = parseYmdToUtcDate(endDate ?? null);
  if (!parsed) return true;
  if (Number.isNaN(parsed.getTime())) return true;
  return parsed.getTime() >= todayUtc.getTime();
}