import { Stack, Typography } from "@mui/material";

import QuickActions from "./QuickActions";
import UserHeaderCard from "./components/UserHeaderCard";
import VacanciesSummaryCard from "./components/VacanciesSummaryCard";
import ProfileComplectionCard from "./components/ProfileComplectionCard";
import OutcomeCard from "./components/OutcomeCard";
import { COLORS } from "../../../style/ColorTheme";

export default function CandidateDashboardPage() {
  return (
    <Stack gap={2.5} sx={{ minWidth: 0 }}>
      <UserHeaderCard />

      <Stack gap={0.5} sx={{ minWidth: 0 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.textPrimary }}>
          Panel kandydata
        </Typography>
        <Typography variant="body1" sx={{ color: COLORS.textSecondary }}>
          Twoje ogłoszenia i feedback — w jednym miejscu.
        </Typography>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} gap={2} sx={{ minWidth: 0 }}>
        <Stack sx={{ flex: 1, minWidth: 0 }}>
          <ProfileComplectionCard />
        </Stack>

        <Stack sx={{ flex: 1, minWidth: 0, width: "100%", maxWidth: { md: 350 } }}>
          <OutcomeCard />
        </Stack>
      </Stack>

      <QuickActions />
      <VacanciesSummaryCard />
    </Stack>
  );
}