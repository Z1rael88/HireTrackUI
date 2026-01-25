import { Box, Fab, Tooltip } from "@mui/material";
import MailOutlineRounded from "@mui/icons-material/MailOutlineRounded";
import { useNavigate } from "react-router-dom";

export default function ContactFab() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "fixed",
        left: { xs: 12, sm: 16 },
        bottom: { xs: "calc(12px + 72px + env(safe-area-inset-bottom, 0px))", sm: 16 },
        zIndex: 1200
      }}
    >
      <Tooltip title="Kontakt / Wsparcie" placement="right">
        <Fab className="ht-contact-fab" color="secondary" onClick={() => navigate("/contact")} aria-label="Kontakt">
          <MailOutlineRounded className="ht-contact-fab_icon" />
        </Fab>
      </Tooltip>
    </Box>
  );
}