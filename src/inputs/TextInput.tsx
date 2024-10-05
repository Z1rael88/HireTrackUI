import React from "react";
import { FormControl, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import getNestedError from "../ErrorAlert/NestedError";
interface TextInputProps {
  id: string;
  label: string;
  name: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  name,
  type,
  multiline,
  rows,
}) => {
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
            type={type}
            fullWidth
            id={id}
            label={label}
            error={!!errorMessage}
            helperText={errorMessage}
            multiline={multiline}
            rows={rows}
          />
        )}
      />
    </FormControl>
  );
};

export default TextInput;
