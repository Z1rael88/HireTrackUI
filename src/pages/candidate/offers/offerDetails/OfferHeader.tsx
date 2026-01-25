import { Button, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { COLORS } from "../../../../style/ColorTheme";

type OfferHeaderProps = {
  title: string;
  onBack: () => void;
};

export default function OfferHeader({ title, onBack }: OfferHeaderProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "flex-start", sm: "center" }}
      justifyContent="space-between"
      gap={{ xs: 1, sm: 1.25 }}
      sx={{ minWidth: 0 }}
    >
      <Button
        size="small"
        startIcon={<ArrowBackRoundedIcon />}
        onClick={onBack}
        variant="outlined"
        sx={{
          px: 1.8,
          minHeight: 40,
          flexShrink: 0,
          borderColor: COLORS.borderSoft,
          "&:hover": {
            borderColor: COLORS.border,
            backgroundColor: alpha(COLORS.black, 0.04)
          }
        }}
      >
        Wróć
      </Button>

      <Stack
        direction="row"
        alignItems="center"
        gap={0.75}
        sx={{ minWidth: 0 }}
      >
        <Typography variant="body2" sx={{ color: COLORS.textSecondary }}>
          Oferty
        </Typography>

        <Typography variant="body2" sx={{ color: COLORS.textSecondary }}>
          ›
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: COLORS.accentHover,
            fontWeight: 750,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
          title={title}
        >
          {title}
        </Typography>
      </Stack>
    </Stack>
  );
}
