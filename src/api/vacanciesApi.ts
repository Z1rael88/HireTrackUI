import { api } from "./apiSlice";
import type { CreateVacancyRequest, VacancyResponse, UpdateVacancyRequest } from "../types/vacancy";


export const vacanciesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createVacancy: builder.mutation<VacancyResponse, CreateVacancyRequest>({
      query: (vacancyPayload) => ({
        url: "/vacancies",
        method: "POST",
        data: vacancyPayload
      })
    }),
    getVacancies: builder.query<VacancyResponse[], void>({
      query: () => ({
        url: "/vacancies",
        method: "GET"
      })
    }),
    getVacancyById: builder.query<VacancyResponse, number | string>({
      query: (vacancyId) => ({
        url: `/vacancies/${vacancyId}`,
        method: "GET"
      })
    }),
    updateVacancy: builder.mutation<
      VacancyResponse,
      { vacancyId: number | string; body: UpdateVacancyRequest }
    >({
      query: ({ vacancyId, body }) => ({
        url: `/vacancies/${vacancyId}`,
        method: "PUT",
        data: body
      })
    }),
    deleteVacancy: builder.mutation<void, number | string>({
      query: (vacancyId) => ({
        url: `/vacancies/${vacancyId}`,
        method: "DELETE"
      })
    }),
    getVacanciesByCompanyId: builder.query<
      VacancyResponse[],
      number | string
    >({
      query: (companyId) => ({
        url: `/vacancies/byCompanyId/${companyId}`,
        method: "GET"
      })
    }),
    getVacanciesByUserId: builder.query<VacancyResponse[], number | string>({
      query: (userId) => ({
        url: "/vacancies/byUserId",
        params: { userId },
        method: "GET"
      })
    }),
    getVacanciesByHrId: builder.query<VacancyResponse[], number | string>({
      query: (hrId) => ({
        url: "/vacancies/byHrId",
        params: { hrId },
        method: "GET"
      })
    })
  }),
  overrideExisting: false
});

export const {
  useCreateVacancyMutation,
  useGetVacanciesQuery,
  useGetVacancyByIdQuery,
  useUpdateVacancyMutation,
  useDeleteVacancyMutation,
  useGetVacanciesByCompanyIdQuery,
  useGetVacanciesByUserIdQuery,
  useGetVacanciesByHrIdQuery
} = vacanciesApi;