import { Autocomplete, Box, ButtonBase, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import { alpha } from "@mui/material/styles";

import type { CreateVacancyFormState } from "../../../../types/vacancy";
import { WORK_TYPE } from "../../../../types/enumLabels";
import { COUNTRIES, CITIES_BY_COUNTRY } from "../../../../utils/locations";
import { COLORS } from "../../../../style/ColorTheme";

type BasicInfoSectionProps = {
  form: CreateVacancyFormState;
  errors: Record<string, string>;
  setField: <K extends keyof CreateVacancyFormState>(key: K, value: CreateVacancyFormState[K]) => void;
  companyName: string;
};

const DESCRIPTION_MAX = 250;
const RESPONSIBILITIES_MAX = 500;

function parseNumberOrEmpty(value: string): number | "" {
  if (value === "") return "";
  const n = Number(value);
  return Number.isFinite(n) ? n : "";
}

export default function BasicInfoSection({ form, errors, setField, companyName }: BasicInfoSectionProps) {
  const country = form.address.country || "";
  const city = form.address.city || "";
  const cityOptions = country ? CITIES_BY_COUNTRY[country] ?? [] : [];

  const descriptionHelper = errors.description || `${form.description.length}/${DESCRIPTION_MAX}`;
  const responsibilitiesHelper =
    errors.responsibilities ||
    `Oddzielaj obowiązki przecinkami (lub średnikami) — zostaną pokazane jako lista. ${form.responsibilities.length}/${RESPONSIBILITIES_MAX}`;

  const selectedList: number[] = Array.isArray(form.workType) ? form.workType : [];
  const workTypeHasError = Boolean(errors.workType);

  const toggleWorkType = (numId: number) => {
    const isSelected = selectedList.includes(numId);
    const next = isSelected ? selectedList.filter((x) => x !== numId) : [...selectedList, numId];
    setField("workType", next as CreateVacancyFormState["workType"]);
  };

  return (
    <Stack spacing={1.5}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
        <Box flex={1}>
          <TextField
            label="Firma przypisana do konta"
            value={companyName}
            fullWidth
            slotProps={{
              input: {
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessRoundedIcon sx={{ mr: 0.75 }} />
                  </InputAdornment>
                )
              }
            }}
          />
        </Box>

        <Box flex={2}>
          <TextField
            label="Nazwa stanowiska"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
          />
        </Box>

        <Box flex={1}>
          <TextField
            label="Wynagrodzenie (PLN)"
            type="number"
            value={form.salary}
            onChange={(e) => setField("salary", parseNumberOrEmpty(e.target.value) as CreateVacancyFormState["salary"])}
            fullWidth
            slotProps={{ input: { endAdornment: <InputAdornment position="end">PLN</InputAdornment> } }}
            error={!!errors.salary}
            helperText={errors.salary}
          />
        </Box>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
        <Box flex={1}>
          <TextField
            label="Opis"
            value={form.description}
            onChange={(e) => setField("description", e.target.value.slice(0, DESCRIPTION_MAX))}
            fullWidth
            multiline
            minRows={4}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionRoundedIcon sx={{ mr: 0.75, alignSelf: "flex-start" }} />
                  </InputAdornment>
                )
              },
              htmlInput: { maxLength: DESCRIPTION_MAX }
            }}
            error={!!errors.description}
            helperText={descriptionHelper}
          />
        </Box>

        <Box flex={1}>
          <TextField
            label="Obowiązki"
            value={form.responsibilities}
            onChange={(e) => setField("responsibilities", e.target.value.slice(0, RESPONSIBILITIES_MAX))}
            fullWidth
            multiline
            minRows={4}
            error={!!errors.responsibilities}
            helperText={responsibilitiesHelper}
            slotProps={{
              htmlInput: { maxLength: RESPONSIBILITIES_MAX },
              formHelperText: { sx: { color: errors.responsibilities ? "error.main" : undefined } }
            }}
          />
        </Box>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
        <Box flex={1}>
          <TextField
            label="Data dodania"
            type="date"
            value={form.addDate}
            onChange={(e) => setField("addDate", e.target.value)}
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <TodayRoundedIcon sx={{ mr: 0.75 }} />
                  </InputAdornment>
                )
              },
              inputLabel: { shrink: true }
            }}
            error={!!errors.addDate}
            helperText={errors.addDate}
          />
        </Box>

        <Box flex={1}>
          <TextField
            label="Data zakończenia"
            type="date"
            value={form.endDate}
            onChange={(e) => setField("endDate", e.target.value)}
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <TodayRoundedIcon sx={{ mr: 0.75 }} />
                  </InputAdornment>
                )
              },
              inputLabel: { shrink: true }
            }}
            error={!!errors.endDate}
            helperText={errors.endDate}
          />
        </Box>
      </Stack>

      <Box sx={{ position: "relative" }}>
        <Typography
          sx={{
            position: "absolute",
            top: -9,
            left: 14,
            px: 0.5,
            fontSize: 12,
            bgcolor: COLORS.bg,
            color: workTypeHasError ? COLORS.error : COLORS.textMuted,
            fontWeight: 700,
            zIndex: 1
          }}
        >
          Typ pracy
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(3, minmax(0, 1fr))"
            },
            gap: 1,
            minWidth: 0
          }}
        >
          {Object.entries(WORK_TYPE).map(([id, label]) => {
            const numId = Number(id);
            const isSelected = selectedList.includes(numId);

            return (
              <ButtonBase
                key={id}
                onClick={() => toggleWorkType(numId)}
                focusRipple
                sx={{
                  width: "100%",
                  minHeight: 46,
                  borderRadius: 14,
                  backgroundColor: COLORS.inputBg,
                  border: "1px solid",
                  borderColor: workTypeHasError ? COLORS.error : COLORS.inputBorder,
                  px: 1.25,
                  py: 0.75,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  transition: "border-color 150ms ease, background-color 150ms ease, transform 150ms ease",
                  "&:hover": {
                    borderColor: alpha(COLORS.black, 0.3),
                    backgroundColor: alpha(COLORS.black, 0.02)
                  },
                  ...(isSelected
                    ? {
                      borderColor: alpha(COLORS.accent, 0.75),
                      backgroundColor: alpha(COLORS.accent, 0.14),
                      "&:hover": { backgroundColor: alpha(COLORS.accent, 0.18) }
                    }
                    : null)
                }}
                title={String(label)}
              >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: COLORS.textPrimary,
                      fontSize: { xs: 13, sm: 14 },
                      lineHeight: 1.15,
                      overflow: "hidden",
                      display: { xs: "-webkit-box", sm: "block" },
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: { xs: 2, sm: "unset" },
                      whiteSpace: { xs: "normal", sm: "nowrap" },
                      textOverflow: { sm: "ellipsis" }
                    }}
                  >
                    {label}
                  </Typography>
                </Box>

                <Box sx={{ width: 22, height: 22, display: "grid", placeItems: "center", flexShrink: 0 }}>
                  {isSelected ? <DoneRoundedIcon sx={{ fontSize: 18, color: COLORS.textPrimary }} /> : null}
                </Box>
              </ButtonBase>
            );
          })}
        </Box>

        {errors.workType ?
          <Typography sx={{ mt: 0.5, fontSize: 12, color: COLORS.error }}>{errors.workType}</Typography> : null}
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
        <Box flex={1}>
          <Autocomplete
            freeSolo
            options={COUNTRIES}
            value={country || null}
            onChange={(_, newValue) => setField("address", { country: (newValue ?? "") as string, city: "" })}
            onInputChange={(_, newInput) => setField("address", { country: newInput ?? "", city: "" })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Kraj"
                error={!!errors["address.country"]}
                helperText={errors["address.country"]}
              />
            )}
            autoHighlight
          />
        </Box>

        <Box flex={1}>
          <Autocomplete
            freeSolo
            options={cityOptions}
            value={city || null}
            onChange={(_, newValue) => setField("address", { country, city: (newValue ?? "") as string })}
            onInputChange={(_, newInput) => setField("address", { country, city: newInput ?? "" })}
            renderInput={(params) => (
              <TextField {...params} label="Miasto" error={!!errors["address.city"]}
                         helperText={errors["address.city"]} />
            )}
            autoHighlight
            disabled={!country}
          />
        </Box>
      </Stack>
    </Stack>
  );
}