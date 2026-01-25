import { useState } from "react";
import { Box, Button, TextField, IconButton, CircularProgress, InputAdornment } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useForm, Controller } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { validatePassword } from "../../validation/validationPassword.ts";
import { PasswordStrengthBar } from "../../validation/passwordStrenghtBar.tsx";
import { RegisterUserType } from "../../types/authUserTypes/RegisterUserType.ts";
import { useRegisterMutation } from "../../api/apiSlice.ts";
import { toast } from "react-toastify";
import { Roles } from "../../types/enums";
import { COLORS } from "../../style/ColorTheme";

type Props = { onSuccess?: () => void };

const SignUp = ({ onSuccess }: Props) => {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    getValues,
    reset
  } = useForm<RegisterUserType>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      age: 18,
      role: 2,
      password: "",
      confirmPassword: ""
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  const [registerUser, { isLoading }] = useRegisterMutation();

  const onSubmit = async (data: RegisterUserType) => {
    try {
      const payload: RegisterUserType = {
        ...data,
        role: Roles.Candidate,
        age: Number(data.age)
      };

      await registerUser(payload).unwrap();
      onSuccess?.();
      toast.success("Rejestracja zakończona! Przejdź do logowania.");
      reset();
    } catch (error: unknown) {
      const msg =
        (error as { data?: { errors?: string[] } })?.data?.errors?.[0]?.toLowerCase() ?? "Błąd rejestracji";

      if (msg.includes("username") && msg.includes("already taken")) {
        toast.error("Użytkownik o takiej nazwie już istnieje!");
      } else if (msg.includes("ix_aspnetusers_email")) {
        toast.error("Podany e-mail jest już przypisany do innego konta!");
      } else {
        toast.error("Błąd rejestracji. Spróbuj ponownie.");
      }
    }
  };

  const password = watch("password");

  const renderPasswordAdornment = (isVisible: boolean, onToggle: () => void) => (
    <InputAdornment position="end">
      <IconButton
        onClick={onToggle}
        aria-label="Pokaż/ukryj hasło"
        size="small"
        sx={{ color: COLORS.textSecondary, "&:hover": { backgroundColor: alpha(COLORS.black, 0.03) } }}
      >
        {isVisible ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box display="flex" flexDirection="column" gap={1.5}>
        <Box display="flex" gap={1.5} flexWrap="wrap">
          <Box flex="1 1 220px">
            <Controller
              name="firstName"
              control={control}
              rules={{
                required: "Imię jest wymagane!",
                pattern: {
                  value: /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?: [A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)*$/,
                  message: "Imię musi zaczynać się z wielkiej litery i zawierać tylko litery!"
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Imię"
                  size="small"
                  fullWidth
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              )}
            />
          </Box>

          <Box flex="1 1 220px">
            <Controller
              name="lastName"
              control={control}
              rules={{
                required: "Nazwisko jest wymagane!",
                pattern: {
                  value: /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?: [A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)*$/,
                  message: "Nazwisko musi zaczynać się z wielkiej litery i zawierać tylko litery!"
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nazwisko"
                  size="small"
                  fullWidth
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              )}
            />
          </Box>
        </Box>

        <Box display="flex" gap={1.5} sx={{ flexWrap: { xs: "wrap", sm: "nowrap" }, alignItems: "center" }}>
          <Box flex="1 1 360px" sx={{ minWidth: 180 }}>
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
                <TextField
                  {...field}
                  label="Email"
                  size="small"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  slotProps={{ formHelperText: { sx: { m: 0, minHeight: 0 } } }}
                />
              )}
            />
          </Box>

          <Box flex="0 0 auto" sx={{ width: { xs: "100%", sm: 85 } }}>
            <Controller
              name="age"
              control={control}
              rules={{
                required: "Wiek jest wymagany!",
                min: { value: 18, message: "Wymagane 18 lat!" },
                max: { value: 60, message: "Wiek nie może przekraczać 60 lat!" }
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Wiek"
                  placeholder="Wiek"
                  size="small"
                  error={!!error}
                  helperText={error?.message}
                  slotProps={{
                    formHelperText: { sx: { m: 0, minHeight: 0 } },
                    input: { inputProps: { min: 18, max: 60, step: 1, style: { textAlign: "center" } } }
                  }}
                  onKeyDown={(e) => {
                    const allowed = [
                      "Backspace", "Delete", "Tab", "ArrowLeft",
                      "ArrowRight", "ArrowUp", "ArrowDown"
                    ];
                    if (allowed.includes(e.key)) return;
                    if (/^\d$/.test(e.key)) return;
                    e.preventDefault();
                  }}
                />
              )}
            />
          </Box>
        </Box>

        <Controller
          name="password"
          control={control}
          rules={{ required: "Hasło jest wymagane!", validate: validatePassword }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Hasło"
              size="small"
              type={showPassword ? "text" : "password"}
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{
                input: { endAdornment: renderPasswordAdornment(showPassword, togglePasswordVisibility) }
              }}
            />
          )}
        />

        {password ? <PasswordStrengthBar password={password} /> : null}

        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: "Potwierdzenie hasła jest wymagane!",
            validate: (value) => value === getValues("password") || "Hasła się nie zgadzają!"
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Potwierdź hasło"
              size="small"
              type={showConfirmPassword ? "text" : "password"}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              slotProps={{
                input: {
                  endAdornment: renderPasswordAdornment(showConfirmPassword, toggleConfirmPasswordVisibility)
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
            mt: 1,
            py: 1.15,
            fontWeight: 800,
            fontSize: 15,
            backgroundColor: COLORS.black,
            color: COLORS.white,
            "&:hover": { backgroundColor: COLORS.black, color: COLORS.accent },
            "&.Mui-disabled": {
              backgroundColor: alpha(COLORS.black, 0.55),
              color: alpha(COLORS.white, 0.85)
            }
          }}
        >
          {isLoading ? <CircularProgress size={22} sx={{ color: alpha(COLORS.white, 0.9) }} /> : "Zarejestruj się"}
        </Button>
      </Box>
    </form>
  );
};

export default SignUp;