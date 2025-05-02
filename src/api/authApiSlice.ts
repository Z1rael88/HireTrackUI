import {api} from './apiSlice';
import {User} from '../types/authUserTypes/RegisterUserType';

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<
            {
                tokenDto: {
                    accessToken: string;
                    refreshToken: string;
                    accessTokenExpirationTime: string;
                    refreshTokenExpirationTime: string;
                };
                userResponseDto: {
                    id: number;
                    firstname: string;
                    lastname: string;
                    email: string;
                    username: string;
                    role: number;
                };
            },
            { username: string; password: string }
        >({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                data: credentials,
            }),
        }),
        registerUser: builder.mutation<void, User>({
            query: (data) => ({
                url: '/auth/register',
                method: 'POST',
                data,
            }),
        }),
        refresh: builder.mutation<
            {
                tokenDto: {
                    accessToken: string;
                    refreshToken: string;
                    accessTokenExpirationTime: string;
                    refreshTokenExpirationTime: string;
                };
                userResponseDto: {
                    id: number;
                    firstname: string;
                    lastname: string;
                    email: string;
                    username: string;
                    role: number;
                };
            },
            { refreshToken: string }
        >({
            query: ({refreshToken}) => ({
                url: `/auth/refresh?refreshToken=${refreshToken}`,
                method: 'POST',
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),

    }),
});

export const {
    useLoginMutation,
    useRegisterUserMutation,
    useRefreshMutation,
} = authApi;