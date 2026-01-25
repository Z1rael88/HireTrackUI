import React, { useState } from "react";
import { Box, Button, TextField, IconButton, CircularProgress, InputAdornment } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useLoginMutation } from "../../api/apiSlice";
import type { LoginUserType } from "../../types/authUserTypes/LoginUserType";
import { toast } from "react-toastify";
import { COLORS } from "../../style/ColorTheme";

const SignIn: React.FC = () => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<LoginUserType>({
    defaultValues: { email: "", password: "" }
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginUserType) => {
    try {
      const res = await login(data).unwrap();
      toast.success(`Witam ${res.userResponseDto.firstname} ${res.userResponseDto.lastname}!`);
      navigate("/");
    } catch (error) {
      const msg = (error as { data?: { message?: string } })?.data?.message?.toLowerCase() || "Błąd logowania";

      if (msg.includes("invalid password")) {
        toast.error("Nieprawidłowe hasło!");
      } else if (msg.includes("email") && msg.includes("not found")) {
        toast.error("Nie znaleziono konta za podanym email!");
      } else {
        toast.error("Błąd logowania. Spróbuj ponownie.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box display="flex" flexDirection="column" gap={2}>
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email jest wymagany!",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Podaj poprawny adres e-mail"
            }
          }}
          render={({ field }) => (
            <TextField {...field} label="Email" error={!!errors.email} helperText={errors.email?.message} />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{ required: "Hasło jest wymagane!" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Hasło"
              type={showPassword ? "text" : "password"}
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        aria-label="Pokaż/ukryj hasło"
                        size="small"
                        sx={{
                          color: COLORS.textSecondary,
                          "&:hover": { backgroundColor: alpha(COLORS.black, 0.03) }
                        }}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{
            mt: 0.5,
            py: 1.15,
            backgroundColor: COLORS.black,
            color: COLORS.white,
            "&:hover": { backgroundColor: COLORS.black, color: COLORS.accent },
            "&.Mui-disabled": {
              backgroundColor: alpha(COLORS.black, 0.55),
              color: alpha(COLORS.white, 0.85)
            }
          }}
        >
          {isLoading ? <CircularProgress size={22} sx={{ color: alpha(COLORS.white, 0.9) }} /> : "Zaloguj"}
        </Button>
      </Box>
    </form>
  );
};

export default SignIn;