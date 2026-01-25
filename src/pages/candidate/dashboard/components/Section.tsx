import type { ReactNode } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";

type SectionProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

export default function Section({ title, action, children }: SectionProps) {
  return (
    <Paper
      elevation={0}
      className="section"
      sx={{
        p: { xs: 2, md: 2.5 },
        width: "100%",
        minWidth: 0,
        overflow: "hidden"
      }}
    >
      <Stack gap={2} sx={{ minWidth: 0 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          gap={1.25}
          sx={{ minWidth: 0 }}
        >
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 900,
              minWidth: 0
            }}
          >
            {title}
          </Typography>

          {action ? (
            <Box
              sx={{
                flexShrink: 0,
                alignSelf: { xs: "stretch", sm: "auto" }
              }}
            >
              {action}
            </Box>
          ) : null}
        </Stack>

        <Box sx={{ minWidth: 0 }}>{children}</Box>
      </Stack>
    </Paper>
  );
}