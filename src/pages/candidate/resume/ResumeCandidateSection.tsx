import React from "react";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import {Autocomplete, Box, Chip, Stack, TextField, Typography} from "@mui/material";

import type {CandidateDto} from "../../../types/common";
import type {ResumeCandidateSectionProps} from "../../../types/resume";
import {CITIES_BY_COUNTRY, COUNTRIES} from "../../../utils/locations";

type Props = ResumeCandidateSectionProps & {
    editable?: boolean;
};

export default function ResumeCandidateSection({
                                                   value,
                                                   onPatch,
                                                   workTypeLabels
                                               }: Props) {
    const candidate = value?.candidate;
    const country = candidate?.address?.country ?? "";
    const cityOptions = country ? CITIES_BY_COUNTRY[country] ?? [] : [];
    const emailValue = candidate?.email ?? "";
    const isEmailValid = emailValue === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

    const workType = (candidate as { workType?: unknown } | null)?.workType;
    const selectedWorkTypes: number[] = Array.isArray(workType)
        ? workType.map(Number).filter(Number.isFinite)
        : workType != null && (typeof workType === "string" || typeof workType === "number")
            ? [Number(workType)].filter(Number.isFinite)
            : [];

    return (
        <Stack gap={1.5}>
            <Stack direction={{xs: "column", md: "row"}} gap={1.5} flexWrap="wrap">
                <Box sx={{flex: "1 1 200px"}}>
                    <TextField
                        label="Imię"
                        fullWidth
                        size="small"
                        value={candidate?.firstname ?? ""}
                        onChange={(e) =>
                            onPatch({firstname: e.target.value} as Partial<CandidateDto>)
                        }
                    />
                </Box>

                <Box sx={{flex: "1 1 200px"}}>
                    <TextField
                        label="Nazwisko"
                        fullWidth
                        size="small"
                        value={candidate?.lastname ?? ""}
                        onChange={(e) =>
                            onPatch({lastname: e.target.value} as Partial<CandidateDto>)
                        }
                    />
                </Box>

                <Box sx={{flex: "1 1 200px"}}>
                    <TextField
                        label="Email"
                        fullWidth
                        size="small"
                        type="email"
                        value={emailValue}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            onPatch({email: e.target.value} as Partial<CandidateDto>)
                        }
                        error={!isEmailValid}
                        helperText={!isEmailValid ? "Wpisz poprawny adres e-mail." : " "}
                        slotProps={{
                            htmlInput: {inputMode: "email"}
                        }}
                    />
                </Box>
            </Stack>

            <Stack direction={{xs: "column", md: "row"}} gap={1.5} flexWrap="wrap">
                <Box sx={{flex: "1 1 150px"}}>
                    <Autocomplete
                        options={COUNTRIES}
                        value={country}
                        onChange={(_, newValue) => {
                            onPatch({
                                address: {
                                    country: newValue ?? "",
                                    city: ""
                                }
                            } as Partial<CandidateDto>);
                        }}
                        renderInput={(params) => <TextField {...params} label="Kraj" fullWidth size="small"/>}
                        autoHighlight
                        freeSolo={false}
                    />
                </Box>

                <Box sx={{flex: "1 1 150px"}}>
                    <Autocomplete
                        options={cityOptions}
                        value={candidate?.address?.city ?? ""}
                        onChange={(_, newValue) => {
                            onPatch({
                                address: {
                                    ...candidate?.address,
                                    city: newValue ?? ""
                                }
                            } as Partial<CandidateDto>);
                        }}
                        renderInput={(params) => <TextField {...params} label="Miasto" fullWidth size="small"/>}
                        autoHighlight
                        freeSolo={false}
                        disabled={!country}
                    />
                </Box>

                <Box sx={{flex: "0 0 120px"}}>
                    <TextField
                        label="Wiek"
                        fullWidth
                        size="small"
                        type="number"
                        value={candidate?.age ?? ""}
                        onChange={(e) => {
                            const next = e.target.value;
                            onPatch({age: next === "" ? null : Number(next)} as Partial<CandidateDto>);
                        }}
                    />
                </Box>
            </Stack>

            <Stack direction={{xs: "column", md: "row"}} gap={1.5} flexWrap="wrap" alignItems="flex-start">
                <Box sx={{flex: "1 1 200px"}}>
                    <Typography variant="caption" sx={{fontWeight: 700, mb: 0.75, display: "block"}}>
                        Preferowany typ pracy
                    </Typography>

                    <Stack direction="row" gap={1} flexWrap="wrap">
                        {Object.entries(workTypeLabels).map(([id, label]) => {
                            const numId = Number(id);
                            const isSelected = selectedWorkTypes.includes(numId);

                            return (
                                <Chip
                                    key={id}
                                    label={label}
                                    clickable
                                    onClick={() => {
                                        const next = isSelected
                                            ? selectedWorkTypes.filter((x) => x !== numId)
                                            : [...selectedWorkTypes, numId];

                                        onPatch({workType: next} as Partial<CandidateDto>);
                                    }}
                                    icon={isSelected ? <DoneRoundedIcon/> : undefined}
                                    color={isSelected ? "primary" : "default"}
                                    variant={isSelected ? "filled" : "outlined"}
                                    sx={{
                                        borderRadius: 999,
                                        fontWeight: 700,
                                        px: 0.5,
                                        "& .MuiChip-label": {
                                            maxWidth: 180,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        }
                                    }}
                                />
                            );
                        })}
                    </Stack>

                    <Typography variant="caption" color="text.secondary" sx={{mt: 0.75, display: "block"}}>
                        Możesz wybrać kilka opcji.
                    </Typography>
                </Box>
            </Stack>
        </Stack>
    );
}