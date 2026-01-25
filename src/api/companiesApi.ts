import {api} from './apiSlice';
import type {CompanyResponse} from '../types/company';

export const companiesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCompanies: builder.query<CompanyResponse[], void>({
            query: () => ({
                url: '/companies',
                method: 'GET',
            }),
        }),
        getCompanyById: builder.query<CompanyResponse, number>({
            query: (companyId) => ({
                url: `/companies/${companyId}`,
                method: 'GET',
            }),
        }),
    }),
    overrideExisting: false,
});

export const {useGetCompaniesQuery, useGetCompanyByIdQuery} = companiesApi;