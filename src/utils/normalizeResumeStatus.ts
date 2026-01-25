import { ResumeStatus } from "../types/enums";

export function normalizeResumeStatus(raw: unknown): ResumeStatus | null {
  if (raw == null) return null;

  const num = typeof raw === "number" ? raw : typeof raw === "string" ? Number(raw) : NaN;
  if (Number.isNaN(num)) return null;

  if (num >= 1 && num <= 4) return num as ResumeStatus;
  if (num >= 0 && num <= 3) return (num + 1) as ResumeStatus;

  return null;
}
