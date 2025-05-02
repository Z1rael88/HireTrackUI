import {Box, Typography} from "@mui/material";

type Props = {
    password: string;
};

const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 3) strength++;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    return strength;
};

const getColor = (strength: number) => {
    if (strength <= 2) return "red";
    if (strength <= 4) return "secondary.main";
    return "green";
};

const getLabel = (strength: number) => {
    if (strength <= 2) return "Słabe hasło";
    if (strength <= 4) return "Średnie hasło";
    return "Silne hasło";
};

export const PasswordStrengthBar = ({password}: Props) => {
    const strength = getPasswordStrength(password);
    const percentage = (strength / 5) * 100;
    const color = getColor(strength);
    const label = getLabel(strength);

    return (
        <Box display="flex" alignItems="center" gap={1.5} mt={1} sx={{margin: 0}}>
            <Box
                sx={{
                    flex: 1,
                    maxWidth: "200px",
                    height: "8px",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "10px",
                    overflow: "hidden"
                }}
            >
                <Box
                    sx={{
                        height: "100%",
                        width: `${percentage}%`,
                        backgroundColor: color,
                        transition: "width 0.6s ease",
                    }}
                />
            </Box>
            <Typography
                variant="caption"
                sx={{
                    color: color,
                    fontWeight: 500,
                    minWidth: "80px",
                    textAlign: "right",
                }}
            >
                {label}
            </Typography>
        </Box>
    );
};
