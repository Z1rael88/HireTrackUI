import {createApi, BaseQueryFn} from '@reduxjs/toolkit/query/react';
import {AxiosRequestConfig, AxiosError} from 'axios';
import axios from 'axios';

type AxiosBaseQueryArgs = {
    url: string;
    method: AxiosRequestConfig['method'];
    data?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
};
const rawAxiosBaseQuery = ({baseUrl}: { baseUrl: string }): BaseQueryFn<AxiosBaseQueryArgs, unknown, unknown> =>
    async ({url, method, data, params}) => {
        try {
            const result = await axios({
                url: baseUrl + url,
                method,
                data,
                params,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return {data: result.data};
        } catch (axiosError) {
            const err = axiosError as AxiosError;
            return {
                error: {
                    status: err.response?.status,
                    data: err.response?.data || err.message,
                },
            };
        }
    };
const baseQueryWithReauth: BaseQueryFn<AxiosBaseQueryArgs, unknown, unknown> =
    async (args, api, extraOptions) => {
        const baseQuery = rawAxiosBaseQuery({baseUrl: 'http://localhost:5101'});

        let result = await baseQuery(args, api, extraOptions);

        if (result.error && (result.error as { status: number }).status === 401) {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                const {logout} = await import('../store/userSlice');
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
                const {logout} = await import('../store/userSlice');
                api.dispatch(logout());
            }
        }
        return result;
    };
export const api = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
});
