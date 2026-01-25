import { api } from "./apiSlice";
import type { CrmNamedItem, TechnologyTypeResponse } from "../types/crm";

function mapStringsToNamedItems(response: string[]): CrmNamedItem[] {
  return response.map((name, index) => ({
    id: index + 1,
    name
  }));
}

export const crmApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCrmLanguages: builder.query<CrmNamedItem[], void>({
      query: () => ({ url: "/crm/languages", method: "GET" }),
      transformResponse: mapStringsToNamedItems
    }),
    getCrmTechnologyTypes: builder.query<TechnologyTypeResponse[], void>({
      query: () => ({ url: "/crm/technologyTypes", method: "GET" })
    })
  }),
  overrideExisting: false
});
export const {
  useGetCrmLanguagesQuery,
  useGetCrmTechnologyTypesQuery
} = crmApi;