import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import type { CreateVacancyFormState } from "../../../../types/vacancy";
import { Degree, EducationType, LanguageLevel } from "../../../../types/enums";

type CrmNamedItem = { id: number; name: string | null };

type RequirementsSectionProps = {
  form: CreateVacancyFormState;
  errors: Record<string, string>;
  setRequirementsField: <K extends keyof CreateVacancyFormState["requirements"]>(
    key: K,
    value: CreateVacancyFormState["requirements"][K]
  ) => void;
  languages: CrmNamedItem[];
  technologyTypes: CrmNamedItem[];
};

type LanguageRequirement = CreateVacancyFormState["requirements"]["languageLevels"][number];

type TechnologyRequirement =
  CreateVacancyFormState["requirements"]["jobExperience"]["technologyRequirements"][number];

function numberOrEmpty(value: string): number | "" {
  if (value === "") return "";
  const n = Number(value);
  return Number.isFinite(n) ? n : "";
}

export default function RequirementsSection({
                                              form,
                                              errors,
                                              setRequirementsField,
                                              languages,
                                              technologyTypes
                                            }: RequirementsSectionProps) {
  const setYearsOfExperience = (value: string) => {
    setRequirementsField("yearsOfExperience", numberOrEmpty(value));
  };

  const addLanguage = () => {
    setRequirementsField("languageLevels", [...form.requirements.languageLevels, { language: "", level: "" }]);
  };

  const removeLanguage = (indexToRemove: number) => {
    setRequirementsField(
      "languageLevels",
      form.requirements.languageLevels.filter((_, i) => i !== indexToRemove)
    );
  };

  const updateLanguage = (index: number, patch: Partial<LanguageRequirement>) => {
    setRequirementsField(
      "languageLevels",
      form.requirements.languageLevels.map((row, i) => (i === index ? { ...row, ...patch } : row))
    );
  };

  const addTechnology = () => {
    setRequirementsField("jobExperience", {
      ...form.requirements.jobExperience,
      technologyRequirements: [
        ...form.requirements.jobExperience.technologyRequirements,
        { technologyTypeId: "", name: "", yearsOfExperience: "" }
      ]
    });
  };

  const removeTechnology = (indexToRemove: number) => {
    setRequirementsField("jobExperience", {
      ...form.requirements.jobExperience,
      technologyRequirements: form.requirements.jobExperience.technologyRequirements.filter((_, i) => i !== indexToRemove)
    });
  };

  const updateTechnology = (index: number, patch: Partial<TechnologyRequirement>) => {
    setRequirementsField("jobExperience", {
      ...form.requirements.jobExperience,
      technologyRequirements: form.requirements.jobExperience.technologyRequirements.map((row, i) =>
        i === index ? { ...row, ...patch } : row
      )
    });
  };

  const setTechnologyType = (index: number, value: string) => {
    const id = numberOrEmpty(value);
    if (id === "") {
      updateTechnology(index, { technologyTypeId: "", name: "" });
      return;
    }

    const found = technologyTypes.find((t) => t.id === id);
    updateTechnology(index, { technologyTypeId: id, name: found?.name ?? "" });
  };

  const setTechnologyYears = (index: number, value: string) => {
    updateTechnology(index, { yearsOfExperience: numberOrEmpty(value) });
  };

  const setEducationType = (value: string) => {
    setRequirementsField("education", { ...form.requirements.education, educationType: numberOrEmpty(value) });
  };

  const setEducationDegree = (value: string) => {
    setRequirementsField("education", { ...form.requirements.education, degree: numberOrEmpty(value) });
  };

  return (
    <Stack spacing={2}>
      <Box>
        <TextField
          label="Lata doświadczenia (ogólnie)"
          type="number"
          value={form.requirements.yearsOfExperience}
          onChange={(e) => setYearsOfExperience(e.target.value)}
          fullWidth
          error={!!errors["requirements.yearsOfExperience"]}
          helperText={errors["requirements.yearsOfExperience"]}
        />
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={1}
      >
        <Typography sx={{ fontWeight: 700, color: "grey.900" }}>Poziomy językowe</Typography>
        <Button startIcon={<AddRoundedIcon />} onClick={addLanguage}>
          Dodaj język
        </Button>
      </Stack>

      <Stack spacing={1}>
        {form.requirements.languageLevels.map((row, index) => (
          <Paper elevation={0} key={index} sx={{ p: 1, border: "1px solid", borderColor: "grey.200" }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="flex-start">
              <Box flex={1} minWidth={220}>
                <TextField
                  select
                  label="Język"
                  value={row.language}
                  onChange={(e) => updateLanguage(index, { language: numberOrEmpty(e.target.value) })}
                  fullWidth
                  error={!!errors[`languages.${index}.language`]}
                  helperText={errors[`languages.${index}.language`]}
                >
                  <MenuItem value="">—</MenuItem>
                  {languages.map((lang) => (
                    <MenuItem key={lang.id} value={lang.id}>
                      {lang.name ?? `#${lang.id}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box flex={1} minWidth={220}>
                <TextField
                  select
                  label="Poziom"
                  value={row.level}
                  onChange={(e) => updateLanguage(index, { level: numberOrEmpty(e.target.value) })}
                  fullWidth
                  error={!!errors[`languages.${index}.level`]}
                  helperText={errors[`languages.${index}.level`]}
                >
                  <MenuItem value="">—</MenuItem>
                  {Object.entries(LanguageLevel)
                    .filter(([, v]) => typeof v === "number")
                    .map(([label, value]) => (
                      <MenuItem key={value as number} value={value as number}>
                        {label}
                      </MenuItem>
                    ))}
                </TextField>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton onClick={() => removeLanguage(index)}>
                  <DeleteOutlineRoundedIcon />
                </IconButton>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Divider sx={{ my: 1.5 }} />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={1}
      >
        <Typography sx={{ fontWeight: 700, color: "grey.900" }}>
          Doświadczenie zawodowe (wymagane technologie)
        </Typography>
        <Button startIcon={<AddRoundedIcon />} onClick={addTechnology}>
          Dodaj technologię
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ p: 1.25, border: "1px solid", borderColor: "grey.200" }}>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mb: 1 }}>
          <Chip size="small" label="Doświadczenie"
                sx={{ border: "1px solid", borderColor: "grey.200", bgcolor: "grey.50" }} />
        </Stack>

        {errors.technologies ? (
          <Typography variant="body2" color="error" sx={{ mb: 1 }}>
            {errors.technologies}
          </Typography>
        ) : null}

        <Stack spacing={1}>
          {form.requirements.jobExperience.technologyRequirements.map((row, index) => (
            <Paper elevation={0} key={index} sx={{ p: 1, border: "1px solid", borderColor: "grey.200" }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="flex-start">
                <Box flex={1} minWidth={220}>
                  <TextField
                    select
                    label="Technologia"
                    value={row.technologyTypeId}
                    onChange={(e) => setTechnologyType(index, e.target.value)}
                    fullWidth
                    error={!!errors[`technologies.${index}.type`]}
                    helperText={errors[`technologies.${index}.type`]}
                  >
                    <MenuItem value="">—</MenuItem>
                    {technologyTypes.map((t) => (
                      <MenuItem key={t.id} value={t.id}>
                        {t.name ?? `#${t.id}`}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <Box flex={1} minWidth={220}>
                  <TextField
                    label="Lata doświadczenia w tej technologii"
                    type="number"
                    value={row.yearsOfExperience}
                    onChange={(e) => setTechnologyYears(index, e.target.value)}
                    fullWidth
                    error={!!errors[`technologies.${index}.yearsOfExperience`]}
                    helperText={errors[`technologies.${index}.yearsOfExperience`]}
                  />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton onClick={() => removeTechnology(index)}>
                    <DeleteOutlineRoundedIcon />
                  </IconButton>
                </Box>
              </Stack>
            </Paper>
          ))}
        </Stack>

        <Box sx={{ mt: 1 }}>
          <Button size="small" startIcon={<AddRoundedIcon />} onClick={addTechnology}>
            Dodaj technologię
          </Button>
        </Box>
      </Paper>

      <Divider sx={{ my: 1.5 }} />

      <Typography sx={{ fontWeight: 700, color: "grey.900" }}>Wykształcenie</Typography>

      <Paper elevation={0} sx={{ p: 1, border: "1px solid", borderColor: "grey.200" }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <Box flex={1} minWidth={220}>
            <TextField
              select
              label="Typ edukacji"
              value={form.requirements.education.educationType}
              onChange={(e) => setEducationType(e.target.value)}
              fullWidth
              error={!!errors["education.type"]}
              helperText={errors["education.type"]}
            >
              <MenuItem value="">—</MenuItem>
              {Object.entries(EducationType)
                .filter(([, v]) => typeof v === "number")
                .map(([label, value]) => (
                  <MenuItem key={value as number} value={value as number}>
                    {label}
                  </MenuItem>
                ))}
            </TextField>
          </Box>

          <Box flex={1} minWidth={220}>
            <TextField
              select
              label="Stopień"
              value={form.requirements.education.degree}
              onChange={(e) => setEducationDegree(e.target.value)}
              fullWidth
              error={!!errors["education.degree"]}
              helperText={errors["education.degree"]}
            >
              <MenuItem value="">—</MenuItem>
              {Object.entries(Degree)
                .filter(([, v]) => typeof v === "number")
                .map(([label, value]) => (
                  <MenuItem key={value as number} value={value as number}>
                    {label}
                  </MenuItem>
                ))}
            </TextField>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}