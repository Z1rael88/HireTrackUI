import React from "react";
import { FormControl, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import getNestedError from "../ErrorAlert/NestedError";

interface NumberInputProps {
  id: string;
  label: string;
  name: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ id, label, name }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = getNestedError(errors, name);

  return (
    <FormControl fullWidth>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            size="small"
            type="number"
            fullWidth
            id={id}
            label={label}
            error={!!errorMessage}
            helperText={errorMessage}
          />
        )}
      />
    </FormControl>
  );
};

export default NumberInput;
