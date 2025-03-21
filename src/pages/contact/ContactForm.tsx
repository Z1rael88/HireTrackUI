import {motion} from "framer-motion";
import {
    Box,
    Button,
    Modal,
    TextField,
    Typography,
    CircularProgress
} from "@mui/material";
import React, {useState} from "react";
import {useForm, Controller} from "react-hook-form";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import theme from "../../style/ColorTheme.ts";
import {ThemeProvider} from "@mui/material";
import {sendContactForm} from "../../api/contactApi";
import {ContactFormData} from "../../types/ContactFormData.ts";

interface ContactFormProps {
    open: boolean;
    handleClose: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({open, handleClose}) => {
    const {handleSubmit, control, formState: {errors}, reset} = useForm<ContactFormData>({
        defaultValues: {
            name: "",
            email: "",
            message: "",
        }
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<"success" | "error" | null>(null);
    const onSubmit = async (data: ContactFormData) => {
        setIsLoading(true);
        setStatus(null);
        try {
            const response = await sendContactForm(data);
            if (response.status >= 200 && response.status < 300) {
                setStatus("success");
                setTimeout(() => {
                    setStatus(null);
                    reset();
                    handleClose();
                }, 2000);
            } else {
                setStatus("error");
                setTimeout(() => {
                    setStatus(null);
                    handleClose();
                }, 2000);
            }
        } catch {
            setStatus("error");
            setTimeout(() => {
                setStatus(null);
                handleClose();
            }, 2000);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Modal open={open} onClose={handleClose}
               sx={{
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "center"
               }}>
            <motion.div
                initial={{opacity: 0, scale: 0.8}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.8}}
                transition={{duration: 0.3}}
                style={{
                    backgroundColor: "rgba(10, 10, 10, 0.9)",
                    backdropFilter: "blur(3px)",
                    padding: "30px",
                    borderRadius: "18px",
                    maxWidth: "500px",
                    width: "90%",
                    textAlign: "center",
                    position: "relative",
                }}
            >
                {isLoading && (
                    <Box sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "18px",
                        zIndex: 2
                    }}>
                        <CircularProgress size={50}/>
                    </Box>
                )}
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2
                }}>
                    <EmailIcon
                        sx={{
                            color: "secondary.main",
                            fontSize: 34,
                            mr: 1
                        }}/>
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        color="primary.main"
                    >
                        Skontaktuj się z nami
                    </Typography>
                </Box>
                {status && (
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        backgroundColor: status === "success" ? "#dff0d8" : "#f8d7da",
                        padding: "15px",
                        borderRadius: "12px",
                        marginBottom: "20px",
                        zIndex: 1
                    }}>
                        {status === "success" ? (
                            <CheckCircleIcon
                                sx={{
                                    color: "green",
                                    fontSize: 100
                                }}/>
                        ) : (
                            <ErrorIcon
                                sx={{
                                    color: "red",
                                    fontSize: 100
                                }}/>
                        )}
                        <Typography
                            variant="h6"
                            sx={{
                                color: status === "success" ? "green" : "red",
                                mt: 1
                            }}>
                            {status === "success" ? "Wiadomość została wysłana!" : "Wystąpił nieoczekiwany błąd!"}
                        </Typography>
                    </Box>
                )}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="name"
                        control={control}
                        rules={{
                            required: "Imię jest wymagane!",
                            pattern: {
                                value: /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?: [A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)*$/,
                                message: "Imię musi zaczynać się z wielkiej litery i nie może zawierać cyfr albo znaków.",
                            }
                        }}
                        render={({field}) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Twoje imię"
                                variant="outlined"
                                disabled={isLoading}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                sx={{
                                    mb: 2,
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "14px",
                                        padding: "10px",
                                        "& fieldset": {borderColor: "gray"},
                                    },
                                    input: {color: "primary.main", fontSize: "16px"},
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="email"
                        control={control}
                        rules={{
                            required: "E-mail jest wymagany!",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Podaj poprawny adres e-mail"
                            }
                        }}
                        render={({field}) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="E-mail"
                                variant="outlined"
                                disabled={isLoading}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                sx={{
                                    mb: 2,
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "14px",
                                        padding: "10px",
                                        "& fieldset": {borderColor: "gray"},
                                    },
                                    input: {color: "primary.main", fontSize: "16px"},
                                }}
                            />
                        )}
                    />
                    <ThemeProvider theme={theme}>
                        <Controller
                            name="message"
                            control={control}
                            rules={{
                                required: "Wiadomość nie może być pusta!"
                            }}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Wiadomość"
                                    multiline
                                    rows={5}
                                    variant="outlined"
                                    disabled={isLoading}
                                    error={!!errors.message}
                                    helperText={errors.message?.message}
                                    sx={{
                                        mb: 3,
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "12px",
                                            "& fieldset": {borderColor: "gray"},
                                        },
                                        input: {color: "primary.main", fontSize: "16px"},
                                        textarea: {
                                            color: "primary.main",
                                        },
                                        "& textarea::-webkit-scrollbar": {
                                            width: "5px",
                                        },
                                        "& textarea::-webkit-scrollbar-track": {
                                            background: "gray",
                                            borderRadius: "10px",
                                        },
                                        "& textarea::-webkit-scrollbar-thumb": {
                                            background: theme.palette.secondary.main,
                                            borderRadius: "10px",
                                            "&:hover": {
                                                background: theme.palette.text.primary,
                                            },
                                        },
                                    }}
                                />
                            )}
                        />
                    </ThemeProvider>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 2,
                            mt: 2,
                            width: "100%"
                        }}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleClose}
                            disabled={isLoading}
                            sx={{
                                borderRadius: "14px",
                                fontWeight: "bold",
                                fontSize: "15px",
                                padding: "10px 20px",
                                "&:hover": {backgroundColor: "red"}
                            }}>
                            Zamknij
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={isLoading}
                            sx={{
                                borderRadius: "14px",
                                fontWeight: "bold",
                                backgroundColor: isLoading ? "gray" : "secondary.main",
                                color: "black",
                                fontSize: "15px",
                                padding: "10px 30px",
                                minWidth: "120px"
                            }}>
                            Wyślij
                        </Button>
                    </Box>
                </form>
            </motion.div>
        </Modal>
    );
};
export default ContactForm;