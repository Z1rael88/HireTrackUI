import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import {
  Box,
  Button,
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

import type { EducationItem, ResumeEducationSectionProps } from "../../../types/resume";

export default function ResumeEducationSection({
                                                 items,
                                                 onChange,
                                                 educationTypeLabels,
                                                 degreeLabels,
                                                 disabled
                                               }: ResumeEducationSectionProps) {
  const educationList: EducationItem[] = Array.isArray(items) ? items : [];

  const educationTypeEntries = Object.entries(educationTypeLabels || {});
  const degreeEntries = Object.entries(degreeLabels || {});

  const defaultEducationType = educationTypeEntries.length ? Number(educationTypeEntries[0][0]) : 0;
  const defaultDegree = degreeEntries.length ? Number(degreeEntries[0][0]) : 0;

  const handleAddEducation = () => {
    onChange([
      ...educationList,
      {
        title: "",
        educationType: defaultEducationType,
        degree: defaultDegree,
        startDate: "",
        endDate: null,
        description: ""
      }
    ]);
  };

  const handleRemoveEducation = (indexToRemove: number) => {
    const next = educationList.filter((_, index) => index !== indexToRemove);
    onChange(next.length ? next : null);
  };

  const handlePatchEducation = (indexToPatch: number, patch: Partial<EducationItem>) => {
    onChange(educationList.map((item, index) => (index === indexToPatch ? { ...item, ...patch } : item)));
  };

  return (
    <Stack gap={1.25} sx={{ minWidth: 0 }}>
      {!educationList.length ? (
        <Typography variant="body2" color="error">
          Dodaj przynajmniej jedną edukację.
        </Typography>
      ) : null}

      {educationList.map((educationItem, educationIndex) => (
        <Paper key={educationIndex} elevation={0} className="section" sx={{ p: 1.5, borderRadius: 2, minWidth: 0 }}>
          <Stack gap={1.25} sx={{ minWidth: 0 }}>
            <Stack direction={{ xs: "column", md: "row" }} gap={1.5} flexWrap="wrap" sx={{ minWidth: 0 }}>
              <Box sx={{ flex: { xs: "1 1 100%", md: "0 0 50%" }, minWidth: 0 }}>
                <TextField
                  size="small"
                  label="Tytuł"
                  fullWidth
                  value={educationItem.title}
                  onChange={(event) => handlePatchEducation(educationIndex, { title: event.target.value })}
                  disabled={disabled}
                />
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", md: "0 0 25%" }, minWidth: 0 }}>
                <FormControl size="small" fullWidth disabled={disabled}>
                  <Select
                    value={educationItem.educationType}
                    onChange={(event) => handlePatchEducation(educationIndex, { educationType: Number(event.target.value) })}
                  >
                    {educationTypeEntries.map(([id, label]) => (
                      <MenuItem key={id} value={Number(id)}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Typ</FormHelperText>
                </FormControl>
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", md: "0 0 25%" }, minWidth: 0 }}>
                <FormControl size="small" fullWidth disabled={disabled}>
                  <Select
                    value={educationItem.degree}
                    onChange={(event) => handlePatchEducation(educationIndex, { degree: Number(event.target.value) })}
                  >
                    {degreeEntries.map(([id, label]) => (
                      <MenuItem key={id} value={Number(id)}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Stopień</FormHelperText>
                </FormControl>
              </Box>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} gap={1.5} sx={{ minWidth: 0 }}>
              <Box sx={{ flex: { xs: "1 1 100%", md: "0 0 25%" }, minWidth: 0 }}>
                <TextField
                  size="small"
                  type="date"
                  label="Start"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={educationItem.startDate || ""}
                  onChange={(event) => handlePatchEducation(educationIndex, { startDate: event.target.value || "" })}
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
                  value={educationItem.endDate || ""}
                  onChange={(event) => handlePatchEducation(educationIndex, { endDate: event.target.value || null })}
                  disabled={disabled}
                />
              </Box>
            </Stack>

            <TextField
              size="small"
              label="Opis"
              fullWidth
              multiline
              minRows={2}
              value={educationItem.description}
              onChange={(event) => handlePatchEducation(educationIndex, { description: event.target.value })}
              disabled={disabled}
            />

            <Stack direction="row" justifyContent="flex-end">
              <IconButton onClick={() => handleRemoveEducation(educationIndex)} disabled={disabled} color="error">
                <DeleteRoundedIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Paper>
      ))}

      <Stack direction="row" justifyContent="flex-start">
        <Button startIcon={<AddRoundedIcon />} onClick={handleAddEducation} disabled={disabled} variant="contained">
          Dodaj edukację
        </Button>
      </Stack>
    </Stack>
  );
}