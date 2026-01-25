import {
  DEGREE,
  EDUCATION_TYPE,
  LANGUAGE_LEVEL,
  WORK_TYPE
} from "../types/enumLabels.ts";
import type { RequirementsDto, VacancyResponse } from "../types/vacancy.ts";

type LanguageRequirement = {
  language?: number | null;
  level?: number | null;
};

type TechnologyRequirement = {
  technologyTypeId?: number | null;
  yearsOfExperience?: number | string | null;
  name?: string | null;
};

type EducationRequirement = {
  educationType?: number | null;
  degree?: number | null;
};

export type OfferDetailsData = {
  workTypeLabel: string;
  salaryLabel: string;
  locationLabel: string;
  benefits: string[];
  requiredYears: number | null;
  languageLines: string[];
  technologyLines: string[];
  educationLine: string;
};

export function mapWorkTypeLabel(workType?: unknown): string {
  const list = Array.isArray(workType) ? workType : workType != null ? [workType] : [];
  const labels = list
    .map(Number)
    .filter(Number.isFinite)
    .map((id) => (WORK_TYPE as Record<number, string>)[id] ?? `Typ ${id}`);

  return labels.length ? labels.join(", ") : "Tryb pracy";
}

function buildLocationLabel(offer: VacancyResponse): string {
  const raw = offer as VacancyResponse & { city?: string | null; country?: string | null };
  const city = String(offer.address?.city ?? raw.city ?? "").trim();
  const country = String(offer.address?.country ?? raw.country ?? "").trim();

  if (!city && !country) return "";
  return city && country ? `${city}, ${country}` : city || country;
}

function yearSuffixPl(years: number): string {
  if (years === 1) return "rok";
  if (years >= 2 && years <= 4) return "lata";
  return "lat";
}

export function buildOfferDetails(args: {
  offer: VacancyResponse;
  languages: Array<{ id: number; name: string | null }>;
  technologyTypes: Array<{ id: number; name: string | null }>;
}): OfferDetailsData {
  const { offer, languages, technologyTypes } = args;

  const workTypeLabel = mapWorkTypeLabel(offer.workType);
  const salaryLabel = offer.salary != null ? `${offer.salary} PLN` : "";
  const locationLabel = buildLocationLabel(offer);

  const benefitsRaw = (offer as { benefits?: unknown }).benefits;
  const benefits = Array.isArray(benefitsRaw) ? benefitsRaw.filter((v): v is string => typeof v === "string") : [];

  const requirements: RequirementsDto | undefined = offer.requirements;
  const requiredYears = requirements?.yearsOfExperience ?? null;

  const languageNameById = new Map(
    languages.map((l) => [l.id, l.name?.trim() || `Język #${l.id}`] as const)
  );
  const techNameById = new Map(
    technologyTypes.map((t) => [t.id, t.name?.trim() || `Technologia #${t.id}`] as const)
  );

  const languageLines: string[] = [];
  const languageItems = (requirements?.languageLevels ?? []) as LanguageRequirement[];

  languageItems.forEach(({ language, level }) => {
    if (language == null || level == null) return;

    const languageName = languageNameById.get(language) ?? `Język #${language}`;
    const levelName =
      LANGUAGE_LEVEL[level as keyof typeof LANGUAGE_LEVEL] ?? `Poziom ${level}`;

    languageLines.push(`${languageName}: ${levelName}`);
  });

  const technologyLines: string[] = [];
  const techItems = (requirements?.jobExperience?.technologyRequirements ?? []) as TechnologyRequirement[];

  techItems.forEach((item) => {
    const typeId = item.technologyTypeId;
    if (typeId == null) return;

    const mappedName = techNameById.get(typeId) ?? `Technologia #${typeId}`;
    const explicitName = String(item.name ?? "").trim();
    const name = explicitName || mappedName;

    const years = Number(item.yearsOfExperience);
    if (Number.isFinite(years) && years > 0) {
      technologyLines.push(`${name}: min. ${years} ${yearSuffixPl(years)} doświadczenia`);
      return;
    }

    technologyLines.push(name);
  });

  let educationLine = "";
  const education = requirements?.education as EducationRequirement | undefined;

  if (education?.educationType != null || education?.degree != null) {
    const typeId = education?.educationType;
    const degreeId = education?.degree;

    const typeName =
      typeId != null
        ? EDUCATION_TYPE[typeId as keyof typeof EDUCATION_TYPE] ?? `Typ ${typeId}`
        : "";

    const degreeName =
      degreeId != null
        ? DEGREE[degreeId as keyof typeof DEGREE] ?? `Stopień ${degreeId}`
        : "";

    const parts = [typeName && `Wykształcenie: ${typeName}`, degreeName && `stopień: ${degreeName}`].filter(Boolean);
    educationLine = parts.join(", ");
  }

  return {
    workTypeLabel,
    salaryLabel,
    locationLabel,
    benefits,
    requiredYears,
    languageLines,
    technologyLines,
    educationLine
  };
}

export function getVacancyTitle(vacancy: VacancyResponse): string {
  const raw = vacancy as VacancyResponse & { title?: string | null };
  return vacancy.name || raw.title?.trim() || "Oferta";
}