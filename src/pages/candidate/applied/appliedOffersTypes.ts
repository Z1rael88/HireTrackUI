import { ResumeStatus } from "../../../types/enums";

export type AppliedOffersSortOption = "Najnowsze" | "Status";

export type AppliedOfferItem = {
  vacancyId: number;
  title: string;
  company: string;
  cityLabel: string | null;
  salaryLabel: string | null;
  endDateLabel: string | null;
  status: ResumeStatus;
};