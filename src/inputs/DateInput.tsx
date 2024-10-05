import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormControl } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import dayjs from "dayjs";
import React from "react";

interface DateInputProps {
  id: string;
  label: string;
  name: string;
}

const DateInput: React.FC<DateInputProps> = ({ id, label, name }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <FormControl fullWidth>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name={name}
          control={control}
          defaultValue={null}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              label={label}
              value={value ? dayjs(value) : null}
              onChange={(date) => onChange(date ? date.toDate() : null)}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  id: `${id}`,
                  error: !!errorMessage,
                  helperText: errorMessage || "",
                },
              }}
            />
          )}
        />
      </LocalizationProvider>
    </FormControl>
  );
};

export default DateInput;
