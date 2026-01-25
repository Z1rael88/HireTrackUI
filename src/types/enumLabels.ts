import {WorkType, LanguageLevel, EducationType, Degree, ResumeStatus, Language} from './enums';

export const WORK_TYPE: Record<WorkType, string> = {
    [WorkType.OnSite]: 'Praca stacjonarna',
    [WorkType.Hybrid]: 'Praca hybrydowa',
    [WorkType.Remote]: 'Praca zdalna',
};

export const LANGUAGE_LEVEL: Record<LanguageLevel, string> = {
    [LanguageLevel.Beginner]: 'Poziom podstawowy',
    [LanguageLevel.Intermediate]: 'Poziom średni',
    [LanguageLevel.UpperIntermediate]: 'Poziom zaawansowany',
    [LanguageLevel.Native]: 'Native',
};

export const EDUCATION_TYPE: Record<EducationType, string> = {
    [EducationType.University]: 'Studia',
    [EducationType.OnlineCourse]: 'Kurs online',
    [EducationType.OfflineCourse]: 'Kurs stacjonarny',
};

export const DEGREE: Record<Degree, string> = {
    [Degree.Bachelors]: 'Licencjat',
    [Degree.Masters]: 'Magister',
    [Degree.Phd]: 'Doktor',
};

export const RESUME_STATUS: Record<ResumeStatus, string> = {
    [ResumeStatus.Sent]: 'Wysłane',
    [ResumeStatus.Pending]: 'W trakcie',
    [ResumeStatus.Accepted]: 'Zaakceptowane',
    [ResumeStatus.Rejected]: 'Odrzucone',
};

export const RESUME_STATUS_COLOR: Record<
    ResumeStatus,
    'default' | 'info' | 'success' | 'error' | 'warning'
> = {
    [ResumeStatus.Sent]: 'default',
    [ResumeStatus.Pending]: 'info',
    [ResumeStatus.Accepted]: 'success',
    [ResumeStatus.Rejected]: 'error',
};

export const LANGUAGE: Record<Language, string> = {
    [Language.English]: 'Angielski',
    [Language.Spanish]: 'Hiszpański',
    [Language.Ukrainian]: 'Ukraiński',
    [Language.Polish]: 'Polski',
};