import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { Vacancy } from "../types/Vacancy";
import { addVacancy } from "../slices/vacancySlice";
import { Box } from "@mui/material";
import AddVacancyForm from "../forms/AddVacancyForm";

const VacancyPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const onSubmit = async (vacancy: Vacancy) => {
    await dispatch(addVacancy(vacancy));
  };
  return (
    <Box
      sx={{
        alignSelf: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "1000px",
        }}
      >
        <AddVacancyForm onSubmit={onSubmit} />
      </Box>
    </Box>
  );
};
export default VacancyPage;
