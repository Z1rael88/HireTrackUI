import {Degree, EducationType, Language, LanguageLevel, WorkType} from './enums';

export interface CandidateDto {
    firstname?: string | null;
    lastname?: string | null;
    age: number;
    bio?: string | null;
    email?: string | null;
    workType: WorkType[];
    address?: {
        country?: string | null;
        city?: string | null;
    } | null;
}

export interface LanguageLevelDto {
    language: Language;
    level: LanguageLevel;
}

export interface TechnologyRequestDto {
    yearsOfExperience: number;
    technologyTypeId: number;
}

export interface TechnologyRequirementDto {
    name?: string | null;
    yearsOfExperience: number;
    technologyTypeId: number;
}

export interface JobExperienceRequestDto {
    nameOfCompany?: string | null;
    startDate: string;       // yyyy-mm-dd
    endDate?: string | null; // yyyy-mm-dd
    technologies?: TechnologyRequestDto[] | null;
    description?: string | null;
}

export interface JobExperienceRequirementDto {
    technologyRequirements?: TechnologyRequirementDto[] | null;
}

export interface EducationRequestDto {
    title?: string | null;
    educationType: EducationType;
    degree: Degree;
    startDate: string;       // yyyy-mm-dd
    endDate?: string | null;
    description?: string | null;
}

export interface EducationRequirementDto {
    educationType: EducationType;
    degree: Degree;
}