import type { VacancyResponse } from "./vacancy";
import type { ResumeResponse } from "./resume";

export type VacancyDto = VacancyResponse;
export type ResumeDto = ResumeResponse & {
  candidate?: (ResumeResponse["candidate"] & {
    firstname?: string | null;
    lastname?: string | null;
    email?: string | null;
  }) | null;

  jobExperiences?: Array<{
    technologies?: Array<{
      yearsOfExperience?: number | null;
      technologyType?: {
        id?: number;
        name?: string | null;
      } | null;
    }> | null;
  }> | null;
};
export type StatisticsSummaryDto = {
  totalSummary?: string | null;
  educationSummary?: string | null;
  experienceSummary?: string | null;
  languageLevelSummary?: string | null;
};

export type TotalStatisticsDto = {
  totalMatchPercent?: number | null;
  summaryDto?: StatisticsSummaryDto | null;
};

export type EducationStatisticsDto = {
  educationMatchPercent?: number | null;
  educationSummary?: string | null;
};

export type ExperienceStatisticsDto = {
  experienceMatchPercent?: number | null;
  experienceSummary?: string | null;
};

export type LanguageLevelStatisticsDto = {
  matchPercent?: number | null;
  languageLevelSummary?: string | null;
};

export type OverallStatDto = {
  resumeId: number;
  vacancyId: number;

  totalStatistics?: TotalStatisticsDto | null;
  educationStatistics?: EducationStatisticsDto | null;
  experienceStatistics?: ExperienceStatisticsDto | null;
  languageLevelStatistics?: LanguageLevelStatisticsDto | null;
};