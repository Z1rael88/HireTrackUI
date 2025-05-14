import {createApi, BaseQueryFn} from '@reduxjs/toolkit/query/react';
import axios, {AxiosRequestConfig, AxiosError} from 'axios';
import {User} from '../types/authUserTypes/RegisterUserType';
import {logout} from '../store/userSlice.ts';

interface AxiosBaseQueryArgs {
    url: string;
    method: AxiosRequestConfig['method'];
    data?: any;
    params?: any;
}

const baseUrl = 'http://localhost:5101';

const rawAxiosBaseQuery = ({baseUrl}: { baseUrl: string }): BaseQueryFn<AxiosBaseQueryArgs> =>
    async ({url, method, data, params}) => {
        try {
            const result = await axios({
                url: baseUrl + url,
                method,
                data,
                params
            });
            return {data: result.data};
        } catch (axiosError) {
            const err = axiosError as AxiosError;
            return {
                error: {
                    status: err.response?.status,
                    data: err.response?.data ?? err.message,
                },
            };
        }
    };

const baseQueryWithReauth: BaseQueryFn<AxiosBaseQueryArgs> =
    async (args, api, extraOptions) => {
        const baseQuery = rawAxiosBaseQuery({baseUrl});
        let result = await baseQuery(args, api, extraOptions);

        if (result.error && (result.error as any).status === 401) {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                api.dispatch(logout());
                return result;
            }
            const refreshResult = await baseQuery({
                url: `/auth/refresh?refreshToken=${refreshToken}`,
                method: 'POST',
            }, api, extraOptions);

            if (refreshResult.data) {
                const {accessToken, refreshToken: newRefreshToken} = refreshResult.data as {
                    accessToken: string;
                    refreshToken: string;
                };
                localStorage.setItem('token', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                result = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch(logout());
            }
        }
        return result;
    };
export const api = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
});
export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<
            {
                tokenDto: { accessToken: string; refreshToken: string };
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
                data: credentials
            }),
        }),
        register: builder.mutation<void, Omit<User, 'confirmPassword'>>({
            query: (body) => ({
                url: '/auth/register',
                method: 'POST',
                data: body,
            }),
        }),
        refresh: builder.mutation<
            {
                accessToken: string;
                refreshToken: string;
                accessTokenExpirationTime: string;
                refreshTokenExpirationTime: string;
            },
            { refreshToken: string }
        >({
            query: ({refreshToken}) => ({
                url: `/auth/refresh?refreshToken=${refreshToken}`,
                method: 'POST',
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useLoginMutation,
    useRegisterMutation,
} = authApi;