import type {WorkType} from './enums';

export interface UserProfileResponse {
    id?: number;
    candidateId?: number | null;
    firstname?: string | null;
    lastname?: string | null;
    email?: string | null;
    bio?: string | null;
    phoneNumber?: string | null;
    workType?: WorkType | null;
    companyName?: string | null;
    companyId?: number | null;
}