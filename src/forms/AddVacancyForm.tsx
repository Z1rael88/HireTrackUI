import { Box, Button, Typography } from "@mui/material";
import { Vacancy } from "../types/Vacancy";
import { FormProvider, useForm } from "react-hook-form";
import TextInput from "../inputs/TextInput";
import NumberInput from "../inputs/NumberInput";
import DateInput from "../inputs/DateInput";
import dayjs from "dayjs";
type AddVacancyFormProps = {
  onSubmit: (data: Vacancy) => void;
};
const AddVacancyForm = ({ onSubmit }: AddVacancyFormProps) => {
  const form = useForm<Vacancy>({
    /*zodresolver*/
  });
  const handleSubmit = (data: Vacancy) => {
    data.endDate = dayjs(data.endDate).format("YYYY-MM-DD");
    data.addDate = dayjs(data.addDate).format("YYYY-MM-DD");
    onSubmit(data);
  };
  return (
    <FormProvider {...form}>
      <Box
        component="form"
        id="addVacancy-form"
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
          gap: 2,
        }}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            gap: "1em",
            alignItems: "center",
          }}
        >
          <Typography>Add Vacancy</Typography>
          <TextInput id="name" label="Name" name="name" />
          <TextInput id="description" label="Description" name="description" />
          <NumberInput id="salary" label="Salary" name="salary" />
          <DateInput id="addDate" label="Add Date" name="addDate" />
          <DateInput id="endDate" label="End Date" name="endDate" />
          <Button
            type="submit"
            color="primary"
            variant="outlined"
            size="large"
            sx={{ width: "100%" }}
          >
            {" "}
            Add Vacancy
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
};
export default AddVacancyForm;
