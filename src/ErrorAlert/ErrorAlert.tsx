import { Alert, AlertTitle } from "@mui/material";
import ErrorResponse from "../types/ErrorResponse";

type ErrorAlertProps = {
  error: ErrorResponse;
};

export const ErrorAlert = ({ error }: ErrorAlertProps) => (
  <Alert severity="error">
    <AlertTitle>{error.message}</AlertTitle>
    {Array.isArray(error.errors) && error.errors.length > 0 && (
      <ul>
        {error.errors.map((err, index) => (
          <li key={index}>{err}</li>
        ))}
      </ul>
    )}
  </Alert>
);
