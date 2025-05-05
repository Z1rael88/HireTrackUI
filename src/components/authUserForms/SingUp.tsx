import React, {useState} from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
} from "@mui/material";
import {useForm, Controller} from "react-hook-form";
import {FcGoogle} from "react-icons/fc";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {validatePassword} from "../../validation/validationPassword.ts";
import {PasswordStrengthBar} from "../../validation/passwordStrenghtBar.tsx";
import {User} from "../../types/authUserTypes/RegisterUserType.ts";
import {useRegisterUserMutation} from '../../api/authApiSlice';
import {toast} from 'react-toastify';

const SignUp: React.FC = () => {
    const {
        handleSubmit,
        control,
        watch,
        formState: {errors},
        getValues,
        reset,
    } = useForm<User>({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            age: 18,
            role: 3,
            password: "",
            confirmPassword: "",
        },
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword] = useState<boolean>(false);
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const [registerUser] = useRegisterUserMutation();
    const onSubmit = async (data: User) => {
        try {
            await registerUser(data).unwrap();
            toast.success('Rejestracja zakończona! Przejdź do logowania.');
            reset();
        } catch (error: any) {
            const msg = error?.data?.errors?.[0]?.toLowerCase() || "Błąd rejestracji";

            if (msg.includes("username") && msg.includes("already taken")) {
                toast.error("Użytkownik o takiej nazwie już istnieje!");
            } else if (msg.includes("ix_aspnetusers_email")) {
                toast.error("Podany e-mail jest już przypisany do innego konta!");
            } else {
                toast.error("Błąd rejestracji. Spróbuj ponownie.");
            }
        }
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const allowedKeys = ["ArrowUp", "ArrowDown", "Tab"];
        if (!allowedKeys.includes(e.key)) {
            e.preventDefault();
        }
    };
    const password = watch("password");
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" flexDirection="column" gap={1.5}>
                <Box display="flex" flexDirection="row" gap={1.5}>
                    <Controller
                        name="firstName"
                        control={control}
                        rules={{
                            required: "Imię jest wymagane!",
                            pattern: {
                                value: /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?: [A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)*$/,
                                message: "Imię musi zaczynać się z wielkiej litery i zawierać tylko litery!",
                            }
                        }}
                        render={({field}) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Imię"
                                size="small"
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "14px",
                                        padding: "8px",
                                        backgroundColor: "#f2f2f2",
                                        "&:hover fieldset": {borderColor: "gray"},
                                        "&.Mui-focused fieldset": {borderColor: "gray"},
                                    },
                                    "& label": {color: "gray"},
                                    "& label.Mui-focused": {color: "gray"},
                                    input: {color: "primary.contrastText", fontSize: "17px"},
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="lastName"
                        control={control}
                        rules={{
                            required: "Nazwisko jest wymagane!",
                            pattern: {
                                value: /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?: [A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)*$/,
                                message: "Nazwisko musi zaczynać się z wielkiej litery i zawierać tylko litery!",
                            }
                        }}
                        render={({field}) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Nazwisko"
                                size="small"
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "14px",
                                        padding: "8px",
                                        backgroundColor: "#f2f2f2",
                                        display: "flex",
                                        alignItems: "center",
                                        "&:hover fieldset": {borderColor: "gray"},
                                        "&.Mui-focused fieldset": {borderColor: "gray"},
                                    },
                                    "& label": {color: "gray"},
                                    "& label.Mui-focused": {color: "gray"},
                                    input: {color: "primary.contrastText", fontSize: "17px"},
                                }}
                            />
                        )}
                    />
                </Box>
                <Controller
                    name="email"
                    control={control}
                    rules={{
                        required: "Email jest wymagany!",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Podaj poprawny adres e-mail",
                        },
                    }}
                    render={({field}) => (
                        <TextField
                            {...field}
                            fullWidth
                            label="Email"
                            size="small"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "14px",
                                    padding: "8px",
                                    backgroundColor: "#f2f2f2",
                                    "&:hover fieldset": {borderColor: "gray"},
                                    "&.Mui-focused fieldset": {borderColor: "gray"},
                                },
                                "& label": {color: "gray"},
                                "& label.Mui-focused": {color: "gray"},
                                input: {color: "primary.contrastText", fontSize: "17px"},
                            }}
                        />
                    )}
                />
                <Controller
                    name="username"
                    control={control}
                    rules={{required: "Nazwa użytkownika jest wymagana!"}}
                    render={({field}) => (
                        <TextField
                            {...field}
                            fullWidth
                            label="Nazwa użytkownika"
                            size="small"
                            error={!!errors.username}
                            helperText={errors.username?.message}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "14px",
                                    padding: "8px",
                                    backgroundColor: "#f2f2f2",
                                    "&:hover fieldset": {borderColor: "gray"},
                                    "&.Mui-focused fieldset": {borderColor: "gray"},
                                },
                                "& label": {color: "gray"},
                                "& label.Mui-focused": {color: "gray"},
                                input: {color: "primary.contrastText", fontSize: "17px"},
                            }}
                        />
                    )}
                />
                <Box display="flex" flexDirection="row" gap={1.5}>
                    <Controller
                        name="age"
                        control={control}
                        rules={{
                            required: "Wiek jest wymagany!",
                            min: {value: 18, message: "Wymagane 18 lat!"},
                            max: {value: 60, message: "Wiek nie może przekraczać 60 lat!"},
                        }}
                        render={({field, fieldState: {error}}) => (
                            <TextField
                                {...field}
                                type="number"
                                label="Wiek"
                                size="small"
                                fullWidth
                                onKeyDown={handleKeyDown}
                                error={!!error}
                                helperText={error ? error.message : ""}
                                slotProps={{
                                    input: {
                                        inputProps: {
                                            min: 18,
                                            max: 60,
                                            step: 1,
                                        },
                                    },
                                }}
                                sx={{
                                    maxWidth: "100px",
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "14px",
                                        padding: "8px",
                                        backgroundColor: "#f2f2f2",
                                        "&:hover fieldset": {borderColor: "gray"},
                                        "&.Mui-focused fieldset": {borderColor: "gray"},
                                    },
                                    "& label": {color: "gray"},
                                    "& label.Mui-focused": {color: "gray"},
                                    input: {
                                        color: "primary.contrastText",
                                        fontSize: "17px",
                                        textAlign: "center",
                                        paddingRight: "0px",
                                    }
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="role"
                        control={control}
                        render={({field}) => (
                            <FormControl
                                fullWidth
                                size="small"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "14px",
                                        backgroundColor: "#f2f2f2",
                                        "&:hover fieldset": {borderColor: "gray"},
                                        "&.Mui-focused fieldset": {borderColor: "gray"},
                                    },
                                    "& label": {color: "gray"},
                                    "& label.Mui-focused": {color: "gray"},
                                    "& .MuiSelect-select": {
                                        color: "primary.contrastText",
                                        fontSize: "17px",
                                    },
                                }}
                            >
                                <InputLabel>Rola</InputLabel>
                                <Select
                                    {...field}
                                    label="Rola"
                                    disabled
                                    value={3}
                                >
                                    <MenuItem value={3} sx={{color: "primary.contrastText"}}>Kandydat</MenuItem>
                                </Select>
                                <FormHelperText>{errors.role?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />
                </Box>
                <Controller
                    name="password"
                    control={control}
                    rules={{
                        required: "Hasło jest wymagane!",
                        validate: validatePassword,
                    }}
                    render={({field}) => (
                        <Box position="relative">
                            <TextField
                                {...field}
                                fullWidth
                                label="Hasło"
                                size="small"
                                type={showPassword ? "text" : "password"}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "14px",
                                        padding: "8px",
                                        backgroundColor: "#f2f2f2",
                                        "&:hover fieldset": {borderColor: "gray"},
                                        "&.Mui-focused fieldset": {borderColor: "gray"},
                                    },
                                    "& label": {color: "gray"},
                                    "& label.Mui-focused": {color: "gray"},
                                    input: {
                                        color: "primary.contrastText",
                                        fontSize: "17px",
                                        paddingRight: "40px",
                                        "&::-ms-reveal": {display: "none"},
                                        "&::-ms-clear": {display: "none"},
                                    },
                                }}
                            />
                            <IconButton
                                onClick={togglePasswordVisibility}
                                sx={{
                                    position: "absolute",
                                    right: "10px",
                                }}
                            >
                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                            </IconButton>
                        </Box>
                    )}
                />
                {password && <PasswordStrengthBar password={password}/>}
                <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{
                        required: "Potwierdzenie hasła jest wymagane!",
                        validate: (value) =>
                            value === getValues("password") || "Hasła się nie zgadzają!",
                    }}
                    render={({field}) => (
                        <Box position="relative">
                            <TextField
                                {...field}
                                fullWidth
                                label="Potwierdź hasło"
                                size="small"
                                type={showConfirmPassword ? "text" : "password"}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "14px",
                                        padding: "8px",
                                        backgroundColor: "#f2f2f2",
                                        "&:hover fieldset": {borderColor: "gray"},
                                        "&.Mui-focused fieldset": {borderColor: "gray"},
                                    },
                                    "& label": {color: "gray"},
                                    "& label.Mui-focused": {color: "gray"},
                                    input: {
                                        color: "primary.contrastText",
                                        fontSize: "17px",
                                        paddingRight: "40px",
                                        "&::-ms-reveal": {display: "none"},
                                        "&::-ms-clear": {display: "none"},
                                    },
                                }}
                            />
                        </Box>
                    )}
                />
                <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        backgroundColor: "secondary.main",
                        borderRadius: "30px",
                        mt: 1,
                        py: 1.2,
                        textTransform: "none",
                        fontWeight: "bold",
                        fontSize: "15px",
                        "&:hover": {backgroundColor: "text.primary"},
                    }}
                >
                    Zarejestruj się
                </Button>

                <Typography variant="body2" color="#000" mb={1} mt={1}>
                    albo zarejestruj się przez Google
                </Typography>

                <Box display="flex" justifyContent="center" gap={2} mb={2}>
                    <Button
                        variant="contained"
                        startIcon={<FcGoogle size={28}/>}
                        sx={{
                            backgroundColor: "primary.main",
                            textTransform: "none",
                            fontWeight: "bold",
                            fontSize: "15px",
                            gap: 0.5,
                        }}
                    >
                        Sign Up with Google account
                    </Button>
                </Box>
            </Box>
        </form>
    );
};

export default SignUp;
