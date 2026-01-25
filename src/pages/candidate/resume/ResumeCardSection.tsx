import { Divider, Paper, Stack, Typography } from "@mui/material";
import type { ResumeCardSectionProps } from "../../../types/resume";

export default function ResumeCardSection({ title, icon, action, children }: ResumeCardSectionProps) {
  return (
    <Paper elevation={0} className="section" sx={{ p: 2, borderRadius: 2, minWidth: 0 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} sx={{ mb: 2, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 0 }}>
          {icon}
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }} noWrap>
            {title}
          </Typography>
        </Stack>
        {action}
      </Stack>

      <Divider sx={{ mb: 2 }} />
      {children}
    </Paper>
  );
}