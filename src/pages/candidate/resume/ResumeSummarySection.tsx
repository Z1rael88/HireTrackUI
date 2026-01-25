import type { ChangeEvent } from "react";
import { Box, Stack, TextField } from "@mui/material";

import type { ResumeSummarySectionProps } from "../../../types/resume";

function parseOptionalNumber(raw: string): number | null {
  if (raw === "") return null;
  const numeric = Number(raw);
  return Number.isFinite(numeric) ? numeric : null;
}

export default function ResumeSummarySection({ value, onChange }: ResumeSummarySectionProps) {
  const yearsOfExperience = value?.yearsOfExperience ?? null;
  const expectedSalary = value?.expectedSalary ?? null;
  const bio = value?.candidate?.bio ?? "";

  const handleNumberChange =
    (field: "yearsOfExperience" | "expectedSalary") => (event: ChangeEvent<HTMLInputElement>) => {
      if (!value) return;
      onChange({ ...value, [field]: parseOptionalNumber(event.target.value) } as typeof value);
    };

  const handleBioChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!value) return;
    onChange({
      ...value,
      candidate: {
        ...value.candidate,
        bio: event.target.value
      }
    });
  };

  return (
    <Stack gap={1.5} sx={{ minWidth: 0 }}>
      <Stack direction={{ xs: "column", md: "row" }} gap={1.5} flexWrap="wrap" sx={{ minWidth: 0 }}>
        <Box sx={{ flex: { xs: "1 1 100%", md: "0 0 25%" }, minWidth: 0 }}>
          <TextField
            label="Lata doświadczenia"
            type="number"
            fullWidth
            size="small"
            value={yearsOfExperience ?? ""}
            onChange={handleNumberChange("yearsOfExperience")}
            slotProps={{
              htmlInput: { min: 0, step: 1 }
            }}
          />
        </Box>

        <Box sx={{ flex: { xs: "1 1 100%", md: "0 0 25%" }, minWidth: 0 }}>
          <TextField
            label="Oczekiwane wynagrodzenie (PLN)"
            type="number"
            fullWidth
            size="small"
            value={expectedSalary ?? ""}
            onChange={handleNumberChange("expectedSalary")}
            slotProps={{
              htmlInput: { min: 0, step: 1 }
            }}
          />
        </Box>
      </Stack>

      <TextField
        label="Bio (opcjonalnie)"
        fullWidth
        size="small"
        multiline
        minRows={3}
        value={bio}
        onChange={handleBioChange}
      />
    </Stack>
  );
}
