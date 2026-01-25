import { api } from "./apiSlice";
import type {
  ResumeRequestDto,
  ResumeResponse,
  ChangeResumeStatusRequest,
  UploadResumeResponse
} from "../types/resume";

export const resumesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createResume: builder.mutation<void, ResumeRequestDto>({
      query: (payload) => ({
        url: "/resumes",
        method: "POST",
        data: payload
      })
    }),
    updateResume: builder.mutation<
      void,
      { resumeId: number; data: ResumeRequestDto }
    >({
      query: ({ resumeId, data }) => ({
        url: "/resumes",
        method: "PUT",
        params: { resumeId },
        data
      })
    }),
    getResumeById: builder.query<ResumeResponse, number>({
      query: (resumeId) => ({
        url: `/resumes/${resumeId}`,
        method: "GET"
      })
    }),
    getResumeByVacancyId: builder.query<ResumeResponse[], number>({
      query: (vacancyId) => ({
        url: `/resumes/byVacancyId/${vacancyId}`,
        method: "GET"
      })
    }),
    changeResumeStatus: builder.mutation<void, ChangeResumeStatusRequest>({
      query: ({ resumeId, vacancyId, status }) => ({
        url: `/resumes/changeStatus/${resumeId}?vacancyId=${vacancyId}&status=${status}`,
        method: "PATCH"
      })
    }),
    getResumeByUserId: builder.query<ResumeResponse, number>({
      query: (userId) => ({
        url: `/resumes/byUserId/${userId}`,
        method: "GET"
      })
    }),
    uploadResume: builder.mutation<UploadResumeResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("resume", file);

        return {
          url: "/resumes/uploadResume",
          method: "POST",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" }
        };
      }
    })
  }),
  overrideExisting: true
});

export const {
  useCreateResumeMutation,
  useUpdateResumeMutation,
  useGetResumeByIdQuery,
  useGetResumeByVacancyIdQuery,
  useChangeResumeStatusMutation,
  useGetResumeByUserIdQuery,
  useUploadResumeMutation
} = resumesApi;