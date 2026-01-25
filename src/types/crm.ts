export interface CrmNamedItem {
    id: number;
    name: string;
}

export interface TechnologyTypeResponse {
    id: number;
    name: string;
    logoUrl?: string | null;
    technologyCategory: number;
}