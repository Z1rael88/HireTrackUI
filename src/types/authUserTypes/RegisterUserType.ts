import {Roles} from "../enums";

export type RegisterUserType = {
    firstName: string;
    lastName: string;
    email: string;
    age: number;
    role: Roles;
    password: string;
    confirmPassword: string;
};