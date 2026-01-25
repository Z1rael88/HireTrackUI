import { Avatar, Box, Button, Divider, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";

import type { VacancyResponse } from "../../../types/vacancy";
import { useGetCompanyByIdQuery } from "../../../api/companiesApi";
import { COLORS } from "../../../style/ColorTheme";
import { isActiveByEndDate } from "../../../utils/dateUtils";

function getInitialsFromTitle(title?: string | null) {
  if (!title) return "-";

  const initials = title
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  return (initials || "-").toUpperCase();
}

function CompanyName({ companyId }: { companyId: number }) {
  const { data } = useGetCompanyByIdQuery(companyId, { skip: !companyId });
  return <>{data?.name ?? "—"}</>;
}

type VacancyLineProps = {
  vacancy: VacancyResponse;
};

type VacancyLike = VacancyResponse & {
  title?: string | null;
  location?: string | null;
  salaryFrom?: number | string | null;
  salaryTo?: number | string | null;
  salary?: number | null;
  companyId?: number | null;
  name?: string | null;
  endDate?: string | null;
};

export default function VacancyLine({ vacancy }: VacancyLineProps) {
  const v = vacancy as VacancyLike;

  if (!isActiveByEndDate(v.endDate ?? null)) return null;

  const title = String(v.title ?? v.name ?? "").trim() || "—";

  const address = v.address;
  const locationFromAddress = [address?.city?.trim(), address?.country?.trim()].filter(Boolean).join(", ");
  const location = String(v.location ?? "").trim() || locationFromAddress || "—";

  const hasSalaryFrom = v.salaryFrom !== null && v.salaryFrom !== undefined && v.salaryFrom !== "";
  const hasSalaryTo = v.salaryTo !== null && v.salaryTo !== undefined && v.salaryTo !== "";

  let salaryText = "—";
  if (hasSalaryFrom || hasSalaryTo) {
    const from = hasSalaryFrom ? String(v.salaryFrom) : "";
    const to = hasSalaryTo ? String(v.salaryTo) : "";
    salaryText = `PLN ${from}${to ? `–${to}` : ""}`;
  } else if (Number.isFinite(v.salary) && (v.salary ?? 0) > 0) {
    salaryText = `PLN ${v.salary}`;
  }

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "stretch", sm: "center" }}
      justifyContent="space-between"
      gap={{ xs: 1.25, sm: 1.5 }}
      sx={{
        p: 1.25,
        borderRadius: 2,
        overflow: "hidden",
        border: `1px solid ${COLORS.borderSoft}`,
        bgcolor: alpha(COLORS.surface, 0.94),
        transition: "transform 160ms ease, border-color 160ms ease, background-color 160ms ease",
        "&:hover": {
          transform: "translateY(-1px)",
          borderColor: COLORS.border,
          bgcolor: alpha(COLORS.surface, 0.98)
        }
      }}
    >
      <Stack direction="row" alignItems="center" gap={1.25} sx={{ minWidth: 0 }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: alpha(COLORS.accent, 0.22),
            color: COLORS.textPrimary,
            border: `1px solid ${alpha(COLORS.accent, 0.35)}`,
            fontWeight: 900,
            flex: "0 0 auto"
          }}
        >
          {getInitialsFromTitle(title)}
        </Avatar>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 800,
              color: COLORS.textPrimary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
            title={title}
          >
            {title}
          </Typography>

          <Stack
            direction="row"
            gap={1}
            alignItems="center"
            flexWrap="wrap"
            sx={{
              color: COLORS.textSecondary,
              "& .MuiDivider-root": { borderColor: COLORS.divider }
            }}
          >
            <Typography variant="body2" sx={{ color: COLORS.textSecondary }}>
              {v.companyId ? <CompanyName companyId={v.companyId} /> : "—"}
            </Typography>

            <Divider flexItem orientation="vertical" sx={{ display: { xs: "none", sm: "block" } }} />

            <Typography variant="body2" sx={{ color: COLORS.textSecondary }}>
              {location}
            </Typography>

            <Divider flexItem orientation="vertical" sx={{ display: { xs: "none", sm: "block" } }} />

            <Typography variant="body2" sx={{ color: COLORS.textSecondary }}>
              {salaryText}
            </Typography>
          </Stack>
        </Box>
      </Stack>

      <Button
        component={Link}
        to={`/hr/vacancies/${vacancy.id}`}
        size="small"
        variant="contained"
        sx={{
          fontWeight: 900,
          px: 2,
          whiteSpace: "nowrap",
          boxShadow: "none",
          width: { xs: "100%", sm: "auto" }
        }}
      >
        Szczegóły
      </Button>
    </Stack>
  );
}