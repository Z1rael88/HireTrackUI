import React, {useState} from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    IconButton,
} from "@mui/material";
import {useForm, Controller} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {FcGoogle} from "react-icons/fc";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useLoginMutation} from '../../api/authApiSlice';
import {LoginUserType} from "../../types/authUserTypes/LoginUserType.ts";
import {toast} from 'react-toastify';

const SignIn: React.FC = () => {
    const {
        handleSubmit,
        control,
        formState: {errors},
    } = useForm<LoginUserType>({
        defaultValues: {
            username: "",
            password: "",
        },
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };
    const [login] = useLoginMutation();
    const navigate = useNavigate();
    const onSubmit = async (data: LoginUserType) => {
        try {
            const res = await login(data).unwrap();
            toast.success(`Witam ${res.userResponseDto.firstname} ${res.userResponseDto.lastname}!`);
            navigate("/");
        } catch (error: any) {
            const msg =
                error?.data?.message ||
                error?.error?.message ||
                "Błąd logowania. Spróbuj ponownie.";
            toast.error(msg);
        }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box
                display="flex"
                flexDirection="column"
                gap={2}
            >
                <Controller
                    name="username"
                    control={control}
                    rules={{
                        required: "Nazwa użytkownika jest wymagana!",
                    }}
                    render={({field}) => (
                        <TextField
                            {...field}
                            fullWidth
                            label="Nazwa użytkownika"
                            error={!!errors.username}
                            helperText={errors.username?.message}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "14px",
                                    padding: "10px",
                                    backgroundColor: "#f2f2f2",
                                    "&:hover fieldset": {borderColor: "gray"},
                                    "&.Mui-focused fieldset": {borderColor: "gray"},
                                },
                                '& label': {
                                    color: "gray",
                                },
                                '& label.Mui-focused': {
                                    color: "gray",
                                },
                                input: {color: "primary.contrastText", fontSize: "17px"},
                            }}
                        />
                    )}
                />
                <Controller
                    name="password"
                    control={control}
                    rules={{
                        required: "Hasło jest wymagane!",
                    }}
                    render={({field}) => (
                        <Box position="relative">
                            <TextField
                                {...field}
                                fullWidth
                                label="Hasło"
                                type={showPassword ? "text" : "password"}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "14px",
                                        padding: "10px",
                                        backgroundColor: "#f2f2f2",
                                        "&:hover fieldset": {borderColor: "gray"},
                                        "&.Mui-focused fieldset": {borderColor: "gray"},
                                    },
                                    '& label': {
                                        color: "gray",
                                    },
                                    '& label.Mui-focused': {
                                        color: "gray",
                                    },
                                    input: {color: "primary.contrastText", fontSize: "17px"},
                                }}
                            />
                            <IconButton
                                onClick={togglePasswordVisibility}
                                sx={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "7px",
                                }}
                            >
                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                            </IconButton>
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
                        "&:hover": {
                            backgroundColor: "text.primary",
                        },
                    }}
                >
                    Zaloguj
                </Button>

                <Typography variant="body2" color="#000" mb={1} mt={1}>
                    albo zaloguj się przez Google
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
                            gap: 0.5
                        }}>
                        Sing In with Google account
                    </Button>
                </Box>
            </Box>
        </form>
    );
};

export default SignIn;
