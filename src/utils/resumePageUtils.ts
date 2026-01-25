import type { CandidateDto } from "../types/common.ts";
import type { Degree, EducationType, WorkType } from "../types/enums.ts";
import { WorkType as WorkTypeEnum } from "../types/enums.ts";
import type { ResumeRequestDto, ResumeResponse } from "../types/resume.ts";

export const toNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

function normalizeWorkTypes(value: unknown): WorkType[] {
  const list = Array.isArray(value)
    ? value.map((v) => toNumber(v, NaN)).filter(Number.isFinite)
    : value != null
      ? [toNumber(value, NaN)].filter(Number.isFinite)
      : [];

  const mapped = list.map((v) => v as WorkType);
  return mapped.length ? mapped : [WorkTypeEnum.Remote];
}

export function buildInitialFromProfile(profile: Partial<CandidateDto> | null | undefined): ResumeRequestDto {
  const workTypeRaw = (profile as { workType?: unknown } | null)?.workType;

  const candidate: CandidateDto = {
    firstname: String(profile?.firstname ?? ""),
    lastname: String(profile?.lastname ?? ""),
    age: typeof profile?.age === "number" ? profile.age : 0,
    bio: "",
    email: String(profile?.email ?? ""),
    workType: normalizeWorkTypes(workTypeRaw),
    address: {
      country: profile?.address?.country ?? "",
      city: profile?.address?.city ?? ""
    }
  };

  return {
    candidate,
    expectedSalary: 0,
    yearsOfExperience: 0,
    languageLevels: [],
    jobExperiences: [],
    educations: [],
    vacancyId: 0
  };
}

type ApiTechnology = {
  yearsOfExperience?: number;
  technologyTypeId?: number;
  technologyType?: { id?: number };
};

export function mapResponseToForm(
  resume: ResumeResponse,
  fallbackProfile: Partial<CandidateDto> | null | undefined
): ResumeRequestDto {
  const candidateFromApi = (resume.candidate ?? {}) as Partial<CandidateDto> & { workType?: unknown };
  const fallbackCandidate = (fallbackProfile ?? {}) as Partial<CandidateDto> & { workType?: unknown };

  const jobExperiences: ResumeRequestDto["jobExperiences"] = (resume.jobExperiences ?? []).map((job) => ({
    nameOfCompany: job.nameOfCompany ?? "",
    startDate: job.startDate,
    endDate: job.endDate ?? null,
    description: job.description ?? "",
    technologies: (job.technologies ?? []).map((tech) => {
      const item = tech as ApiTechnology;
      return {
        yearsOfExperience: item.yearsOfExperience ?? 0,
        technologyTypeId: item.technologyTypeId ?? item.technologyType?.id ?? 0
      };
    })
  }));

  const educations: ResumeRequestDto["educations"] = (resume.educations ?? []).map((edu) => ({
    title: edu.title ?? "",
    educationType: edu.educationType,
    degree: edu.degree,
    startDate: edu.startDate,
    endDate: edu.endDate ?? null,
    description: edu.description ?? ""
  }));

  const profileAge = fallbackCandidate.age;

  return {
    candidate: {
      firstname: candidateFromApi.firstname ?? fallbackCandidate.firstname ?? "",
      lastname: candidateFromApi.lastname ?? fallbackCandidate.lastname ?? "",
      age:
        typeof profileAge === "number" && profileAge > 0
          ? profileAge
          : typeof candidateFromApi.age === "number"
            ? candidateFromApi.age
            : 0,
      bio: candidateFromApi.bio ?? "",
      email: candidateFromApi.email ?? fallbackCandidate.email ?? "",
      workType: normalizeWorkTypes(candidateFromApi.workType ?? fallbackCandidate.workType),
      address: {
        country: candidateFromApi.address?.country ?? fallbackCandidate.address?.country ?? "",
        city: candidateFromApi.address?.city ?? fallbackCandidate.address?.city ?? ""
      }
    },
    expectedSalary: resume.expectedSalary ?? 0,
    yearsOfExperience: typeof resume.yearsOfExperience === "number" ? resume.yearsOfExperience : 0,
    languageLevels: Array.isArray(resume.languageLevels) ? resume.languageLevels : [],
    jobExperiences,
    educations,
    vacancyId: resume.vacancyId ?? 0
  };
}

export function validateResumeForm(values: ResumeRequestDto, opts?: { isGuest?: boolean }): string | null {
  const c = values.candidate;

  if (!c?.firstname?.trim() || !c?.lastname?.trim() || !c?.email?.trim()) {
    return opts?.isGuest
      ? "Uzupełnij imię, nazwisko i email."
      : "Uzupełnij imię, nazwisko i email (pochodzą z profilu).";
  }

  if (opts?.isGuest) {
    if (!c.age || c.age <= 0) return "Podaj wiek > 0.";
  }

  if (toNumber(values.expectedSalary, 0) <= 0) {
    return "Podaj oczekiwane wynagrodzenie > 0.";
  }

  for (const job of values.jobExperiences ?? []) {
    if ((job.nameOfCompany ?? "").trim() && !job.startDate) {
      return "W doświadczeniu podaj datę rozpoczęcia.";
    }
  }

  for (const edu of values.educations ?? []) {
    if ((edu.title ?? "").trim() && !edu.startDate) {
      return "W edukacji podaj datę rozpoczęcia.";
    }
  }

  return null;
}

export function buildResumePayload(values: ResumeRequestDto, opts?: { vacancyId?: number }): ResumeRequestDto {
  const candidate = values.candidate as CandidateDto;

  const jobExperiencesSource = values.jobExperiences ?? [];
  const jobExperiences: ResumeRequestDto["jobExperiences"] = jobExperiencesSource
    .filter((job) => {
      const hasText = (job.nameOfCompany ?? "").trim() || (job.description ?? "").trim();
      return hasText || !!job.startDate || !!job.endDate;
    })
    .map((job) => ({
      nameOfCompany: job.nameOfCompany ?? "",
      startDate: job.startDate || "",
      endDate: job.endDate || "",
      description: job.description ?? "",
      technologies: (job.technologies ?? []).map((tech) => ({
        yearsOfExperience: toNumber(tech.yearsOfExperience, 0),
        technologyTypeId: toNumber(tech.technologyTypeId, 0)
      }))
    }));

  const educationsSource = values.educations ?? [];
  const educations: ResumeRequestDto["educations"] = educationsSource
    .filter((edu) => {
      const hasText = (edu.title ?? "").trim() || (edu.description ?? "").trim();
      return hasText || !!edu.startDate || !!edu.endDate;
    })
    .map((edu) => ({
      title: edu.title ?? "",
      educationType: toNumber(edu.educationType, 1) as EducationType,
      degree: toNumber(edu.degree, 1) as Degree,
      startDate: edu.startDate || "",
      endDate: edu.endDate || "",
      description: edu.description ?? ""
    }));

  return {
    candidate: {
      firstname: candidate.firstname || "",
      lastname: candidate.lastname || "",
      age: toNumber(candidate.age, 0),
      bio: candidate.bio ?? "",
      email: candidate.email || "",
      workType: normalizeWorkTypes(candidate.workType),
      address: {
        country: candidate.address?.country ?? "",
        city: candidate.address?.city ?? ""
      }
    },
    expectedSalary: toNumber(values.expectedSalary, 0),
    yearsOfExperience: toNumber(values.yearsOfExperience, 0),
    languageLevels: values.languageLevels ?? [],
    jobExperiences,
    educations,
    vacancyId: opts?.vacancyId ?? values.vacancyId ?? 0
  };
}