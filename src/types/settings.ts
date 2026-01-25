export type ProfileSettings = {
    firstname: string;
    lastname: string;
    email: string;
};

export type SecuritySettings = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

export type Settings = {
    profile: ProfileSettings;
    security: SecuritySettings;
};

export type SnackbarState = {
    open: boolean;
    msg: string;
    severity?: 'success' | 'error' | 'info';
};