import type { CreateVacancyFormState, CreateVacancyRequest } from "../types/vacancy.ts";

type ValidationErrors = Record<string, string>;

export const todayIso = () => new Date().toISOString().slice(0, 10);

export const toIsoDate = (v: unknown) => (typeof v === "string" ? v.slice(0, 10) : "");

export const toNumberArray = (value: unknown): number[] =>
  Array.isArray(value) ? value.map(Number).filter(Number.isFinite) : [];

export const validateCreateVacancyForm = (f: CreateVacancyFormState): ValidationErrors => {
  const e: ValidationErrors = {};

  if (!f.name.trim()) e.name = "Wymagane";

  const desc = f.description.trim();
  if (!desc) e.description = "Wymagane";
  else if (desc.length > 250) e.description = "Maksymalnie 250 znaków";

  if (!f.responsibilities.trim()) e.responsibilities = "Wymagane";

  if (f.salary === "" || Number(f.salary) < 0) e.salary = "Podaj kwotę ≥ 0";

  if (!f.addDate) e.addDate = "Wymagane";
  if (!f.endDate) e.endDate = "Wymagane";

  if (toNumberArray(f.workType).length === 0) e.workType = "Wymagane";

  if (!f.address.country.trim()) e["address.country"] = "Wymagane";
  if (!f.address.city.trim()) e["address.city"] = "Wymagane";

  if (f.requirements.yearsOfExperience === "" || Number(f.requirements.yearsOfExperience) < 0) {
    e["requirements.yearsOfExperience"] = "Podaj liczbę lat ≥ 0";
  }

  f.requirements.languageLevels.forEach((x, i) => {
    if (x.language === "") e[`languages.${i}.language`] = "Wymagane";
    if (x.level === "") e[`languages.${i}.level`] = "Wymagane";
  });

  const tech = f.requirements.jobExperience.technologyRequirements;
  if (!tech.length) e.technologies = "Dodaj minimum 1 technologię";

  tech.forEach((x, i) => {
    if (x.technologyTypeId === "") e[`technologies.${i}.type`] = "Wymagane";
    if (x.yearsOfExperience === "" || Number(x.yearsOfExperience) < 0) {
      e[`technologies.${i}.yearsOfExperience`] = "Lata ≥ 0";
    }
  });

  if (f.requirements.education.educationType === "") e["education.type"] = "Wymagane";
  if (f.requirements.education.degree === "") e["education.degree"] = "Wymagane";

  return e;
};

export const buildCreateVacancyPayload = (companyId: number, f: CreateVacancyFormState): CreateVacancyRequest => ({
  companyId,
  name: f.name.trim(),
  description: f.description.trim(),
  responsibilities: f.responsibilities.trim(),
  salary: Number(f.salary),
  addDate: f.addDate,
  endDate: f.endDate,
  workType: toNumberArray(f.workType),
  address: {
    country: f.address.country.trim(),
    city: f.address.city.trim()
  },
  requirements: {
    yearsOfExperience: Number(f.requirements.yearsOfExperience),
    languageLevels: f.requirements.languageLevels.map((x) => ({
      language: Number(x.language),
      level: Number(x.level)
    })),
    jobExperience: {
      technologyRequirements: f.requirements.jobExperience.technologyRequirements.map((x) => ({
        technologyTypeId: Number(x.technologyTypeId),
        name: x.name.trim(),
        yearsOfExperience: Number(x.yearsOfExperience)
      }))
    },
    education: {
      educationType: Number(f.requirements.education.educationType),
      degree: Number(f.requirements.education.degree)
    }
  }
});