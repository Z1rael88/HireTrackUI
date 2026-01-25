import type {Settings} from '../types/settings.ts';

type BasicProfile = {
    firstname?: string | null;
    lastname?: string | null;
    email?: string | null;
};

export const defaultSettings: Settings = {
    profile: {
        firstname: '',
        lastname: '',
        email: '',
    },
    security: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    },
};

export function loadSettingsFromStorage(storageKey = 'userSettings'): Settings {
    try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return defaultSettings;

        const parsed = JSON.parse(raw) as Partial<Settings>;

        return {
            profile: {...defaultSettings.profile, ...(parsed.profile ?? {})},
            security: {...defaultSettings.security, ...(parsed.security ?? {})},
        };
    } catch {
        return defaultSettings;
    }
}

export function saveSettingsToStorage(settings: Settings, storageKey = 'userSettings'): void {
    localStorage.setItem(storageKey, JSON.stringify(settings));

    try {
        window.dispatchEvent(new CustomEvent('settings:updated'));
    } catch {
        window.dispatchEvent(new Event('settings:updated'));
    }
}

export function applyProfileFromUser(
    current: Settings,
    userProfile: BasicProfile | null | undefined,
): Settings {
    if (!userProfile) return current;

    return {
        ...current,
        profile: {
            ...current.profile,
            firstname: current.profile.firstname || userProfile.firstname || '',
            lastname: current.profile.lastname || userProfile.lastname || '',
            email: current.profile.email || userProfile.email || '',
        },
    };
}