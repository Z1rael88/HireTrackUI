import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";

import type { ExperienceItem, ResumeExperienceSectionProps, TechnologyItem } from "../../../types/resume";

export default function ResumeExperienceSection({
                                                  items,
                                                  onChange,
                                                  technologyOptions,
                                                  technologiesLoading,
                                                  disabled
                                                }: ResumeExperienceSectionProps) {
  const experienceList: ExperienceItem[] = Array.isArray(items) ? items : [];

  const handleAddExperience = () => {
    onChange([
      ...experienceList,
      {
        nameOfCompany: "",
        startDate: "",
        endDate: null,
        description: "",
        technologies: null
      }
    ]);
  };

  const handleRemoveExperience = (indexToRemove: number) => {
    const next = experienceList.filter((_, index) => index !== indexToRemove);
    onChange(next.length ? next : null);
  };

  const handlePatchExperience = (indexToPatch: number, patch: Partial<ExperienceItem>) => {
    onChange(experienceList.map((item, index) => (index === indexToPatch ? { ...item, ...patch } : item)));
  };

  const handleAddTechnology = (experienceIndex: number) => {
    onChange(
      experienceList.map((item, index) => {
        if (index !== experienceIndex) return item;

        const currentTechnologies = Array.isArray(item.technologies) ? item.technologies : [];
        const updated: TechnologyItem[] = [...currentTechnologies, { technologyTypeId: 0, yearsOfExperience: 0 }];

        return { ...item, technologies: updated };
      })
    );
  };

  const handleRemoveTechnology = (experienceIndex: number, technologyIndex: number) => {
    onChange(
      experienceList.map((item, index) => {
        if (index !== experienceIndex) return item;

        const currentTechnologies = Array.isArray(item.technologies) ? item.technologies : [];
        const updated = currentTechnologies.filter((_, idx) => idx !== technologyIndex);

        return { ...item, technologies: updated.length ? updated : null };
      })
    );
  };

  const handlePatchTechnology = (experienceIndex: number, technologyIndex: number, patch: Partial<TechnologyItem>) => {
    onChange(
      experienceList.map((item, index) => {
        if (index !== experienceIndex) return item;

        const currentTechnologies = Array.isArray(item.technologies) ? item.technologies : [];
        const updated = currentTechnologies.map((tech, idx) => (idx === technologyIndex ? { ...tech, ...patch } : tech));

        return { ...item, technologies: updated };
      })
    );
  };

  return (
    <Stack gap={1.25} sx={{ minWidth: 0 }}>
      {!experienceList.length ? (
        <Typography variant="body2" color="error">
          Dodaj przynajmniej jedno doświadczenie.
        </Typography>
      ) : null}

      {experienceList.map((experienceItem, experienceIndex) => (
        <Paper key={experienceIndex} elevation={0} className="section" sx={{ p: 1.5, borderRadius: 2, minWidth: 0 }}>
          <Stack gap={1} sx={{ minWidth: 0 }}>
            <Stack direction={{ xs: "column", md: "row" }} gap={1.5} flexWrap="wrap" sx={{ minWidth: 0 }}>
              <Box sx={{ flex: { xs: "1 1 100%", md: "0 0 50%" }, minWidth: 0 }}>
                <TextField
                  size="small"
                  label="Firma"
                  fullWidth
                  value={experienceItem.nameOfCompany}
                  onChange={(event) => handlePatchExperience(experienceIndex, { nameOfCompany: event.target.value })}
                  disabled={disabled}
                />
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", md: "0 0 25%" }, minWidth: 0 }}>
                <TextField
                  size="small"
                  type="date"
                  label="Start"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={experienceItem.startDate || ""}
                  onChange={(event) => handlePatchExperience(experienceIndex, { startDate: event.target.value || "" })}
                  disabled={disabled}
                />
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", md: "0 0 25%" }, minWidth: 0 }}>
                <TextField
                  size="small"
                  type="date"
                  label="Koniec"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={experienceItem.endDate || ""}
                  onChange={(event) => handlePatchExperience(experienceIndex, { endDate: event.target.value || null })}
                  disabled={disabled}
                />
              </Box>
            </Stack>

            <TextField
              size="small"
              label="Opis"
              multiline
              minRows={2}
              fullWidth
              value={experienceItem.description}
              onChange={(event) => handlePatchExperience(experienceIndex, { description: event.target.value })}
              disabled={disabled}
            />

            <Divider />

            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
                Technologie
              </Typography>

              <Button
                startIcon={<AddRoundedIcon />}
                onClick={() => handleAddTechnology(experienceIndex)}
                disabled={disabled}
                variant="text"
              >
                Dodaj technologię
              </Button>
            </Stack>

            <Stack gap={1} sx={{ minWidth: 0 }}>
              {!experienceItem.technologies?.length ? (
                <Typography variant="body2" color="error">
                  Dodaj przynajmniej jedną technologię.
                </Typography>
              ) : null}


              {(experienceItem.technologies || []).map((technologyItem, technologyIndex) => (
                <Stack
                  key={technologyIndex}
                  direction={{ xs: "column", sm: "row" }}
                  gap={1}
                  alignItems={{ xs: "stretch", sm: "center" }}
                  sx={{ minWidth: 0 }}
                >
                  <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 240 } }} disabled={disabled}>
                    <Select
                      value={technologyItem.technologyTypeId ?? ""}
                      displayEmpty
                      onChange={(event) =>
                        handlePatchTechnology(experienceIndex, technologyIndex, {
                          technologyTypeId: Number(event.target.value) || 0
                        })
                      }
                    >
                      <MenuItem value="">Wybierz technologię</MenuItem>
                      {technologyOptions.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{technologiesLoading ? "Ładowanie..." : "Technologia"}</FormHelperText>
                  </FormControl>

                  <TextField
                    size="small"
                    label="Lata doświadczenia"
                    type="number"
                    value={technologyItem.yearsOfExperience ?? ""}
                    onChange={(event) => {
                      const raw = event.target.value;
                      handlePatchTechnology(experienceIndex, technologyIndex, {
                        yearsOfExperience: raw === "" ? undefined : Number(raw)
                      });
                    }}
                    sx={{ width: { xs: "100%", sm: 220 } }}
                    disabled={disabled}
                  />


                  <Box sx={{ flex: 1 }} />

                  <IconButton
                    onClick={() => handleRemoveTechnology(experienceIndex, technologyIndex)}
                    disabled={disabled}
                    color="error"
                  >
                    <DeleteRoundedIcon />
                  </IconButton>
                </Stack>
              ))}
            </Stack>

            <Stack direction="row" justifyContent="flex-end">
              <IconButton onClick={() => handleRemoveExperience(experienceIndex)} disabled={disabled} color="error">
                <DeleteRoundedIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Paper>
      ))}

      <Stack direction="row" justifyContent="flex-start">
        <Button startIcon={<AddRoundedIcon />} onClick={handleAddExperience} disabled={disabled} variant="contained">
          Dodaj doświadczenie
        </Button>
      </Stack>
    </Stack>
  );
}