import axios from "axios";
import { Vacancy } from "../types/Vacancy";

const API_URL = "https://localhost:7164/api/vacancy";

export const getVacancies = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createVacancy = async (vacancy: Vacancy) => {
  const response = await axios.post(API_URL, vacancy);
  return response.data;
};

export const updateVacancy = async (id: string, vacancy: Vacancy) => {
  const response = await axios.put(`${API_URL}/${id}`, vacancy);
  return response.data;
};

export const deleteVacancy = async (id: string) => {
  await axios.delete(`${API_URL}/${id}`);
};
