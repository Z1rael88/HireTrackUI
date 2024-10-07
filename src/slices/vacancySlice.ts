import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getVacancies,
  createVacancy,
  updateVacancy,
  deleteVacancy,
} from "../services/vacancyService";
import { Vacancy } from "../types/Vacancy";

interface VacancyState {
  vacancies: Vacancy[];
  loading: boolean;
  error: string | null;
}

const initialState: VacancyState = {
  vacancies: [],
  loading: false,
  error: null,
};

export const fetchVacancies = createAsyncThunk<Vacancy[], void>(
  "vacancies/fetch",
  getVacancies
);

export const addVacancy = createAsyncThunk<Vacancy, Vacancy>(
  "vacancies/add",
  createVacancy
);

export const editVacancy = createAsyncThunk<
  Vacancy,
  { id: string; vacancy: Vacancy }
>("vacancies/edit", async ({ id, vacancy }) => {
  return await updateVacancy(id, vacancy);
});

export const removeVacancy = createAsyncThunk<void, string>(
  "vacancies/remove",
  deleteVacancy
);

const vacancySlice = createSlice({
  name: "vacancies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVacancies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVacancies.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.vacancies = payload;
      })
      .addCase(fetchVacancies.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || "Failed to fetch vacancies";
      })
      .addCase(addVacancy.fulfilled, (state, { payload }) => {
        state.vacancies.push(payload);
      })
      .addCase(editVacancy.fulfilled, (state, { payload }) => {
        const index = state.vacancies.findIndex(
          (vacancy) => vacancy.id === payload.id
        );
        if (index !== -1) {
          state.vacancies[index] = payload;
        }
      })
      .addCase(removeVacancy.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.vacancies = state.vacancies.filter(
          (vacancy) => vacancy.id !== id
        );
      });
  },
});

export const selectVacancies = (state: { vacancies: VacancyState }) =>
  state.vacancies;

export default vacancySlice.reducer;
