export const CARD_BORDER = "grey.200";
export const SECONDARY_TEXT = "grey.700";

export function daysAgo(iso?: string): string {
  if (!iso) return "";

  const time = new Date(iso).getTime();
  if (!Number.isFinite(time)) return "";

  const diff = Math.floor((Date.now() - time) / 86_400_000);
  if (diff <= 0) return "today";
  if (diff === 1) return "1 day ago";
  return `${diff} days ago`;
}

export const chipSx = {
  bgcolor: "grey.50",
  border: "1px solid",
  borderColor: CARD_BORDER,
  color: "grey.900",
  borderRadius: 999,
  "& .MuiChip-label": { px: 0.5 }
};

type Offer = {
  company?: string;
  companyName?: string;

  address?: { city?: string };
  city?: string;
  location?: string;

  postedAt?: string | number | Date;
  createdAt?: string | number | Date;
  addDate?: string | number | Date;

  salaryRange?: string;
  salaryFrom?: string | number;
  salaryTo?: string | number;
  salary?: string | number;
};

export function getCompany(input: unknown): string {
  const o = input as Offer;
  return o.company || o.companyName || "";
}

export function getCity(input: unknown): string {
  const o = input as Offer;
  return o.address?.city || o.city || o.location || "";
}

export function getPostedAt(input: unknown): Offer["postedAt"] {
  const o = input as Offer;
  return o.postedAt || o.createdAt || o.addDate;
}

export function getSalary(input: unknown): string | undefined {
  const o = input as Offer;

  if (o.salaryRange) return o.salaryRange;

  if (o.salaryFrom != null && o.salaryTo != null) {
    return `${o.salaryFrom}-${o.salaryTo}`;
  }

  return o.salary != null ? String(o.salary) : undefined;
}