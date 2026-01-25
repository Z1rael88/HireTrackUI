import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material";

import type {
  CandidateDto,
  EducationRequestDto,
  JobExperienceRequestDto,
  LanguageLevelDto
} from "./common";
import { ResumeStatus } from "./enums";

export interface ResumeRequestDto {
  candidate: CandidateDto;
  expectedSalary: number;
  yearsOfExperience: number;
  languageLevels: LanguageLevelDto[];
  jobExperiences: JobExperienceRequestDto[];
  educations: EducationRequestDto[];
  vacancyId: number;
}

export interface ResumeResponse {
  id: number;
  vacancyId?: number | null;
  candidate?: CandidateDto;
  status?: ResumeStatus;

  expectedSalary?: number | null;
  yearsOfExperience?: number | null;
  languageLevels?: LanguageLevelDto[] | null;
  jobExperiences?: JobExperienceRequestDto[] | null;
  educations?: EducationRequestDto[] | null;
}

export interface ChangeResumeStatusRequest {
  resumeId: number;
  vacancyId: number;
  status: ResumeStatus;
}

export type ResumeCandidateSectionProps = {
  value: ResumeRequestDto | null;
  onPatch: (patch: Partial<CandidateDto>) => void;
  workTypeLabels: Record<number, string>;
  readOnlySx?: SxProps<Theme>;
};

export type ResumeCardSectionProps = {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
};

export type EducationItem = {
  title: string;
  educationType: number;
  degree: number;
  startDate: string;
  endDate: string | null;
  description: string;
};

export type ResumeEducationSectionProps = {
  items: EducationItem[] | null;
  onChange: (next: EducationItem[] | null) => void;
  educationTypeLabels: Record<number, string>;
  degreeLabels: Record<number, string>;
  disabled?: boolean;
};

export type TechnologyItem = {
  technologyTypeId: number;
  yearsOfExperience: number;
};

export type ExperienceItem = {
  nameOfCompany: string;
  startDate: string;
  endDate: string | null;
  description: string;
  technologies: TechnologyItem[] | null;
};

export type ResumeExperienceSectionProps = {
  items: ExperienceItem[] | null | undefined;
  onChange: (next: ExperienceItem[] | null) => void;
  technologyOptions: { id: number; label: string }[];
  technologiesLoading?: boolean;
  disabled?: boolean;
};

export type LanguageLevelItem = {
  language: number;
  level: number;
};

export type ResumeLanguagesSectionProps = {
  items: LanguageLevelItem[] | null;
  onChange: (next: LanguageLevelItem[] | null) => void;
  languageLabels: Record<number, string>;
  levelLabels: Record<number, string>;
  disabled?: boolean;
};

export type ResumeSummarySectionProps = {
  value: ResumeRequestDto | null;
  onChange: (next: ResumeRequestDto | null) => void;
};

export type UploadResumeResponse = {
  id: number;
  candidateId: number | null;
  candidate: {
    firstname: string;
    lastname: string;
    age: number;
    bio: string;
    email: string;
    workType: number[] | null;
    address: string | null;
  };
  status: number;
  expectedSalary: number;
  yearsOfExperience: number;
  languageLevels: Array<{ language: number; level: number }>;
  jobExperiences: ExperienceItem[] | null;
  educations: EducationItem[] | null;
};

