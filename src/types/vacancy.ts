import {
  LanguageLevelDto,
  JobExperienceRequirementDto,
  EducationRequirementDto
} from "./common";
import { WorkType } from "./enums.ts";

export interface RequirementsDto {
  yearsOfExperience: number;
  languageLevels?: LanguageLevelDto[];
  jobExperience?: JobExperienceRequirementDto;
  jobExperiences?: JobExperienceRequirementDto[];
  education?: EducationRequirementDto;
  educations?: EducationRequirementDto[];
}

export interface AddressDto {
  country: string;
  city: string;
}

export interface CreateVacancyRequest {
  companyId: number;
  name: string;
  description: string;
  salary: number;
  addDate: string;
  endDate: string;
  requirements: RequirementsDto;
  workType: WorkType[];
  address: AddressDto;
  responsibilities: string;
}

export interface VacancyResponse {
  id: number | string;
  name: string;
  description: string;
  companyId: number;
  salary: number;
  addDate: string;
  endDate: string;
  requirements: RequirementsDto;
  createdAt?: string;
  workType: WorkType[];
  address?: AddressDto | null;
  responsibilities: string;
}

export type CreateVacancyFormState = {
  name: string;
  description: string;
  responsibilities: string;
  salary: number | "";
  addDate: string;
  endDate: string;
  workType: WorkType[];
  address: {
    country: string;
    city: string;
  };
  requirements: {
    yearsOfExperience: number | "";
    languageLevels: {
      language: number | "";
      level: number | "";
    }[];
    jobExperience: {
      technologyRequirements: {
        technologyTypeId: number | "";
        name: string;
        yearsOfExperience: number | "";
      }[];
    };
    education: {
      educationType: number | "";
      degree: number | "";
    };
  };
};

export const INITIAL_CREATE_VACANCY_FORM: CreateVacancyFormState = {
  name: "",
  description: "",
  responsibilities: "",
  salary: "",
  addDate: new Date().toISOString().slice(0, 10),
  endDate: "",
  workType: [],
  address: {
    country: "",
    city: ""
  },
  requirements: {
    yearsOfExperience: "",
    languageLevels: [
      {
        language: "",
        level: ""
      }
    ],
    jobExperience: {
      technologyRequirements: [
        {
          technologyTypeId: "",
          name: "",
          yearsOfExperience: ""
        }
      ]
    },
    education: {
      educationType: "",
      degree: ""
    }
  }
};

export type UpdateVacancyRequest = {
  companyId: number;
  name: string;
  description: string;
  salary: number;
  addDate: string;
  endDate: string;
  requirements: {
    yearsOfExperience: number;
    languageLevels: { language: number; level: number }[];
    jobExperience: {
      technologyRequirements: {
        name: string;
        yearsOfExperience: number;
        technologyTypeId: number;
      }[];
    };
    education: {
      educationType: number;
      degree: number;
    };
  };
  workType: number[];
  address: { country: string; city: string };
  responsibilities: string;
};