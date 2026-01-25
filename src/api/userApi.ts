import {api} from './apiSlice';
import type {UserProfileResponse} from '../types/user';

export const userApi = api.injectEndpoints({
    endpoints: (build) => ({
        getUserByUserId: build.query<UserProfileResponse, number>({
            query: (userId) => ({
                url: `/users/byUserId/${userId}`,
                method: 'GET',
            }),
        }),
        getUserByCandidateId: build.query<UserProfileResponse, number>({
            query: (candidateId) => ({
                url: `/users/byCandidateId/${candidateId}`,
                method: 'GET',
            }),
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetUserByUserIdQuery,
    useGetUserByCandidateIdQuery,
} = userApi;