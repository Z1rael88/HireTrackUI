import { Outlet } from "react-router-dom";
import { Box, Container, Stack } from "@mui/material";

import CandidateSidebar from "./CandidateSidebar";

export default function CandidateLayout() {
  return (
    <Box sx={{ minHeight: "100vh", minWidth: 0, overflowX: "hidden" }}>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          mx: "auto",
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 3 },
          minWidth: 0
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="flex-start"
          sx={{ columnGap: 3, rowGap: 2, minWidth: 0 }}
        >
          <Box sx={{ flexShrink: 0, minWidth: 0 }}>
            <CandidateSidebar />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Outlet />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}