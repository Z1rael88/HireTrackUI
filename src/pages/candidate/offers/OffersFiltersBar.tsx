import React from "react";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Popover,
  Stack,
  TextField,
  Typography
} from "@mui/material";

export type SortMode = "Newest" | "Company A–Z";

export type OffersFilters = {
  query: string;
  types: string[];
  cities: string[];
  sort: SortMode;
};

export type OffersFiltersBarProps = {
  filters: OffersFilters;
  onChange: (next: OffersFilters) => void;
  allTypes: string[];
  allCities: string[];
  onClear: () => void;
};

export default function OffersFiltersBar({
                                           filters,
                                           onChange,
                                           allTypes,
                                           allCities,
                                           onClear
                                         }: OffersFiltersBarProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const openPopover = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const closePopover = () => setAnchorEl(null);

  const handleClear = () => {
    onClear();
    closePopover();
  };

  const toggleType = (typeLabel: string) => {
    const isActive = filters.types.includes(typeLabel);
    onChange({
      ...filters,
      types: isActive ? filters.types.filter((value) => value !== typeLabel) : [...filters.types, typeLabel]
    });
  };

  const toggleCity = (cityLabel: string) => {
    const isActive = filters.cities.includes(cityLabel);
    onChange({
      ...filters,
      cities: isActive ? filters.cities.filter((value) => value !== cityLabel) : [...filters.cities, cityLabel]
    });
  };

  return (
    <>
      <Box className="section" sx={{ p: { xs: 1.5, sm: 2 }, minWidth: 0 }}>
        <Stack direction="row" gap={1} alignItems="center" sx={{ minWidth: 0 }}>
          <TextField
            fullWidth
            placeholder="Szukaj po tytule, firmie lub tagach…"
            value={filters.query}
            onChange={(event) => onChange({ ...filters, query: event.target.value })}
            sx={{ minWidth: 0 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon />
                  </InputAdornment>
                ),
                endAdornment: filters.query ? (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Wyczyść wyszukiwanie"
                      onClick={() => onChange({ ...filters, query: "" })}
                      size="small"
                    >
                      <ClearRoundedIcon />
                    </IconButton>
                  </InputAdornment>
                ) : undefined
              }
            }}
          />

          <Button
            variant="outlined"
            onClick={openPopover}
            sx={{ minWidth: 44, width: 44, height: 44, p: 0, borderRadius: 2.5, flexShrink: 0 }}
          >
            <TuneRoundedIcon />
          </Button>
        </Stack>
      </Box>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            className: "section",
            sx: { borderRadius: 2, p: 1.75, width: 300, maxWidth: "calc(100vw - 24px)" }
          }
        }}
      >
        <Stack gap={1.75} sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800 }}>Filtry</Typography>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary">
              Typ
            </Typography>
            <Stack direction="row" gap={1} flexWrap="wrap" mt={0.75} sx={{ minWidth: 0 }}>
              {allTypes.map((typeLabel) => (
                <FormControlLabel
                  key={typeLabel}
                  sx={{ mr: 1, ".MuiFormControlLabel-label": { fontSize: 13 } }}
                  control={
                    <Checkbox
                      size="small"
                      checked={filters.types.includes(typeLabel)}
                      onChange={() => toggleType(typeLabel)}
                    />
                  }
                  label={typeLabel}
                />
              ))}
            </Stack>
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary">
              Miasto
            </Typography>
            <Stack direction="row" gap={1} flexWrap="wrap" mt={0.75} sx={{ minWidth: 0 }}>
              {allCities.map((cityLabel) => (
                <FormControlLabel
                  key={cityLabel}
                  sx={{ mr: 1, ".MuiFormControlLabel-label": { fontSize: 13 } }}
                  control={
                    <Checkbox
                      size="small"
                      checked={filters.cities.includes(cityLabel)}
                      onChange={() => toggleCity(cityLabel)}
                    />
                  }
                  label={cityLabel}
                />
              ))}
            </Stack>
          </Box>

          <Divider />

          <Stack direction="row" gap={1} justifyContent="space-between" alignItems="center">
            <Button variant="outlined" onClick={handleClear} startIcon={<ClearRoundedIcon />}>
              Wyczyść
            </Button>

            <Button startIcon={<TuneRoundedIcon />} onClick={closePopover} variant="contained">
              Zastosuj
            </Button>
          </Stack>
        </Stack>
      </Popover>

      <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 1 }}>
        {filters.types.map((typeLabel) => (
          <Chip
            key={typeLabel}
            label={typeLabel}
            size="small"
            variant="outlined"
            onDelete={() =>
              onChange({
                ...filters,
                types: filters.types.filter((value) => value !== typeLabel)
              })
            }
            sx={{ maxWidth: "100%", "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" } }}
          />
        ))}

        {filters.cities.map((cityLabel) => (
          <Chip
            key={cityLabel}
            label={cityLabel}
            size="small"
            variant="outlined"
            onDelete={() =>
              onChange({
                ...filters,
                cities: filters.cities.filter((value) => value !== cityLabel)
              })
            }
            sx={{ maxWidth: "100%", "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" } }}
          />
        ))}
      </Stack>
    </>
  );
}