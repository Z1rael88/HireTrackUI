export type User = {
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    age: number,
    role: Roles,
    password: string,
    confirmPassword: string
};

export type AuthResponse = {
    accessToken: string;
}

export type Roles = 2 | 3;