import { api } from "./apiSlice";

export const statisticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    generateStatisticsByResumeId: builder.mutation<
      void,
      { resumeId: number; vacancyId: number }
    >({
      query: ({ resumeId, vacancyId }) => ({
        url: `/statistics/generateStatisticsBy/${resumeId}`,
        method: "POST",
        params: { vacancyId }
      })
    }),
    getOverallStatisticsByVacancyId: builder.query<unknown, number>({
      query: (vacancyId) => ({
        url: `/statistics/getOverallStatisticsBy/${vacancyId}`,
        method: "GET"
      })
    }),
    getStatisticsByResumeId: builder.query<unknown, number>({
      query: (resumeId) => ({
        url: `/statistics/getStatisticsBy/${resumeId}`,
        method: "GET"
      })
    })
  }),
  overrideExisting: false
});

export const {
  useGenerateStatisticsByResumeIdMutation,
  useGetOverallStatisticsByVacancyIdQuery,
  useGetStatisticsByResumeIdQuery
} = statisticsApi;