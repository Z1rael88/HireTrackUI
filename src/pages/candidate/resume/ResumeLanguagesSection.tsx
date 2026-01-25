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
  Typography
} from "@mui/material";

import type { LanguageLevelItem, ResumeLanguagesSectionProps } from "../../../types/resume";

export default function ResumeLanguagesSection({
                                                 items,
                                                 onChange,
                                                 languageLabels,
                                                 levelLabels,
                                                 disabled
                                               }: ResumeLanguagesSectionProps) {
  const languageLevelList: LanguageLevelItem[] = Array.isArray(items) ? items : [];

  const languageEntries = Object.entries(languageLabels || {});
  const levelEntries = Object.entries(levelLabels || {});

  const defaultLanguageId = languageEntries.length ? Number(languageEntries[0][0]) : 0;
  const defaultLevelId = levelEntries.length ? Number(levelEntries[0][0]) : 0;

  const handleAddLanguageLevel = () => {
    onChange([
      ...languageLevelList,
      {
        language: defaultLanguageId,
        level: defaultLevelId
      }
    ]);
  };

  const handleRemoveLanguageLevel = (languageIndex: number) => {
    const next = languageLevelList.filter((_, index) => index !== languageIndex);
    onChange(next.length ? next : null);
  };

  const handlePatchLanguageLevel = (languageIndex: number, patch: Partial<LanguageLevelItem>) => {
    onChange(languageLevelList.map((item, index) => (index === languageIndex ? { ...item, ...patch } : item)));
  };

  return (
    <Stack gap={1.25} sx={{ minWidth: 0 }}>
      {!languageLevelList.length ? (
        <Typography variant="body2" color="error">
          Dodaj przynajmniej jeden język.
        </Typography>
      ) : null}

      {languageLevelList.map((languageLevelItem, languageIndex) => (
        <Paper key={languageIndex} elevation={0} className="section" sx={{ p: 1.5, borderRadius: 2, minWidth: 0 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            gap={1}
            alignItems={{ xs: "stretch", sm: "center" }}
            sx={{ minWidth: 0 }}
          >
            <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 220 } }} disabled={disabled}>
              <Select
                value={languageLevelItem.language}
                onChange={(event) => handlePatchLanguageLevel(languageIndex, { language: Number(event.target.value) })}
              >
                {languageEntries.map(([id, label]) => (
                  <MenuItem key={id} value={Number(id)}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Język</FormHelperText>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 220 } }} disabled={disabled}>
              <Select
                value={languageLevelItem.level}
                onChange={(event) => handlePatchLanguageLevel(languageIndex, { level: Number(event.target.value) })}
              >
                {levelEntries.map(([id, label]) => (
                  <MenuItem key={id} value={Number(id)}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Poziom</FormHelperText>
            </FormControl>

            <Box sx={{ flex: 1 }} />

            <IconButton onClick={() => handleRemoveLanguageLevel(languageIndex)} disabled={disabled} color="error">
              <DeleteRoundedIcon />
            </IconButton>
          </Stack>
        </Paper>
      ))}

      <Stack direction="row" justifyContent="flex-start">
        <Button startIcon={<AddRoundedIcon />} onClick={handleAddLanguageLevel} disabled={disabled} variant="contained">
          Dodaj język
        </Button>
      </Stack>
    </Stack>
  );
}