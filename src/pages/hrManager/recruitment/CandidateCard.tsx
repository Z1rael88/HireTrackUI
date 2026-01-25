import type { MouseEvent, ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  CardActionArea,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import { ResumeStatus } from "../../../types/enums";
import { RESUME_STATUS, RESUME_STATUS_COLOR } from "../../../types/enumLabels";
import { COLORS } from "../../../style/ColorTheme";

type ResumeWithVacancy = {
  id: number;
  candidate?: { firstname?: string | null; lastname?: string | null; email?: string | null } | null;
  status: ResumeStatus;
  vacancyId: number;
  vacancyTitle: string;
};

type CandidateCardProps = {
  item: ResumeWithVacancy;
  isUpdating: boolean;
  statusIcon: ReactElement;
  onChangeStatus: (resumeId: number, vacancyId: number, next: ResumeStatus, prev: ResumeStatus) => void;
};

function nextStatus(status: ResumeStatus): ResumeStatus | null {
  if (status === ResumeStatus.Sent) return ResumeStatus.Pending;
  if (status === ResumeStatus.Pending) return ResumeStatus.Accepted;
  return null;
}

function prevStatus(status: ResumeStatus): ResumeStatus | null {
  if (status === ResumeStatus.Pending) return ResumeStatus.Sent;
  if (status === ResumeStatus.Accepted) return ResumeStatus.Pending;
  if (status === ResumeStatus.Rejected) return ResumeStatus.Pending;
  return null;
}

function getInitials(firstname: string, lastname: string) {
  const first = firstname.trim().slice(0, 1);
  const last = lastname.trim().slice(0, 1);
  const initials = `${first}${last}`.toUpperCase();
  return initials || "🙂";
}

export default function CandidateCard({ item, isUpdating, statusIcon, onChangeStatus }: CandidateCardProps) {
  const navigate = useNavigate();

  const candidate = item.candidate ?? undefined;
  const firstname = candidate?.firstname?.trim() ?? "";
  const lastname = candidate?.lastname?.trim() ?? "";

  const fullName = `${firstname} ${lastname}`.trim() || `ID #${item.id}`;
  const initials = getInitials(firstname, lastname);

  const canReject = item.status !== ResumeStatus.Accepted && item.status !== ResumeStatus.Rejected;
  const next = nextStatus(item.status);
  const prev = prevStatus(item.status);

  const detailsUrl = `/hr/vacancies/${item.vacancyId}/candidates/${item.id}`;

  const stopClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const goBack = () => {
    if (!prev) return;
    onChangeStatus(item.id, item.vacancyId, prev, item.status);
  };

  const goNext = () => {
    if (!next) return;
    onChangeStatus(item.id, item.vacancyId, next, item.status);
  };

  const reject = () => {
    onChangeStatus(item.id, item.vacancyId, ResumeStatus.Rejected, item.status);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        border: `1px solid ${COLORS.borderSoft}`,
        bgcolor: alpha(COLORS.surface, 0.96),
        overflow: "hidden",
        transition: "transform 160ms ease, border-color 160ms ease, background-color 160ms ease",
        "&:hover": {
          transform: "translateY(-1px)",
          borderColor: COLORS.border,
          bgcolor: alpha(COLORS.surface, 0.98)
        }
      }}
    >
      <CardActionArea onClick={() => navigate(detailsUrl)} disableRipple sx={{ p: { xs: 1.25, sm: 1.5 } }}>
        <Stack gap={1}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            gap={1}
          >
            <Stack direction="row" alignItems="center" gap={1.25} sx={{ minWidth: 0, flex: 1 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: alpha(COLORS.accent, 0.18),
                  color: COLORS.textPrimary,
                  border: `1px solid ${alpha(COLORS.accent, 0.28)}`,
                  fontWeight: 800,
                  flex: "0 0 auto"
                }}
              >
                {initials}
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
                  title={fullName}
                >
                  {fullName}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: COLORS.textSecondary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                  title={candidate?.email ?? ""}
                >
                  {candidate?.email ?? "—"}
                </Typography>
              </Box>
            </Stack>

            <Chip
              size="small"
              label={RESUME_STATUS[item.status]}
              color={RESUME_STATUS_COLOR[item.status]}
              variant={RESUME_STATUS_COLOR[item.status] === "default" ? "outlined" : "filled"}
              icon={statusIcon}
              sx={{
                borderRadius: 999,
                fontWeight: 800,
                alignSelf: { xs: "flex-start", sm: "center" }
              }}
            />
          </Stack>

          <Divider sx={{ borderColor: COLORS.divider }} />

          <Stack gap={1}>
            <Typography
              variant="caption"
              sx={{
                color: COLORS.textSecondary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
              title={item.vacancyTitle}
            >
              Oferta: {item.vacancyTitle}
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              gap={1}
              alignItems={{ xs: "stretch", sm: "center" }}
              justifyContent="flex-end"
              onClick={stopClick}
            >
              <Button
                size="small"
                variant="outlined"
                disabled={!prev || isUpdating}
                onClick={goBack}
                sx={{
                  borderRadius: 999,
                  fontWeight: 900,
                  color: COLORS.textPrimary,
                  borderColor: COLORS.borderSoft,
                  width: { xs: "100%", sm: "auto" }
                }}
              >
                Cofnij
              </Button>

              <Button
                size="small"
                variant="contained"
                disabled={!next || isUpdating}
                onClick={goNext}
                sx={{
                  borderRadius: 999,
                  fontWeight: 900,
                  bgcolor: COLORS.accent,
                  color: COLORS.black,
                  boxShadow: "none",
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": { bgcolor: COLORS.accentHover, boxShadow: "none" }
                }}
              >
                {isUpdating ? "Zapisywanie…" : "Następny etap"}
              </Button>

              <Button
                size="small"
                variant="outlined"
                color="error"
                disabled={!canReject || isUpdating}
                onClick={reject}
                sx={{
                  borderRadius: 999,
                  fontWeight: 900,
                  width: { xs: "100%", sm: "auto" }
                }}
              >
                Odrzuć
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </CardActionArea>
    </Paper>
  );
}