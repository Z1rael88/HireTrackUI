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

export type Roles = 0 | 1 | 2 | 3;
// SystemAdministrator = 0
// CompanyAdministrator = 1
// HrManager = 2
// Candidate = 3