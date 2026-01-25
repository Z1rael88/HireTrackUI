import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { RegisterUserType } from "../types/authUserTypes/RegisterUserType";
import { logout } from "../store/userSlice";

interface AxiosBaseQueryArgs {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: unknown;
  params?: unknown;
}

interface AxiosBaseQueryError {
  status?: number;
  data: unknown;
}

const API_URL = import.meta.env.VITE_API_URL as string;

const rawAxiosBaseQuery =
  ({ baseUrl }: { baseUrl: string }): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> =>
    async ({ url, method, data, params }) => {
      try {
        const accessToken = localStorage.getItem("token");
        const isRefreshCall = url === "/auth/refresh";

        const result = await axios({
          url: baseUrl + url,
          method,
          data,
          params,
          headers: accessToken && !isRefreshCall
            ? { Authorization: `Bearer ${accessToken}` }
            : undefined
        });

        return { data: result.data };
      } catch (axiosError) {
        const error = axiosError as AxiosError;
        return {
          error: {
            status: error.response?.status,
            data: error.response?.data ?? error.message
          }
        };
      }
    };

const baseQueryWithReauth: BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const baseQuery = rawAxiosBaseQuery({ baseUrl: API_URL });
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
        data: { refreshToken }
      },
      api,
      extraOptions
    );
    if ("data" in refreshResult && refreshResult.data) {
      const { accessToken, refreshToken: newRefreshToken } = refreshResult.data as {
        accessToken: string;
        refreshToken: string;
      };
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};
export const api = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({})
});
export const apiSlice = api.injectEndpoints({
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
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        data: credentials
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        const { data } = await queryFulfilled;
        localStorage.setItem("token", data.tokenDto.accessToken);
        localStorage.setItem("refreshToken", data.tokenDto.refreshToken);
      }

    }),
    register: builder.mutation<void, Omit<RegisterUserType, "confirmPassword">>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        data: body
      })
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
      query: ({ refreshToken }) => ({
        url: "/auth/refresh",
        method: "POST",
        params: { refreshToken }
      })
    })
  }),
  overrideExisting: false
});

export const { useLoginMutation, useRegisterMutation } = apiSlice;