import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField
} from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;

  inviteTo: string;
  setInviteTo: (value: string) => void;

  inviteSubject: string;
  setInviteSubject: (value: string) => void;

  inviteBody: string;
  setInviteBody: (value: string) => void;

  isSendingInvite: boolean;
  onConfirmSend: () => void;
};

const pillSx = { borderRadius: 1 } as const;

const inputSx = {
  "& .MuiOutlinedInput-root": pillSx
} as const;

const sendButtonSx = {
  ...pillSx,
  bgcolor: "grey.900",
  color: "warning.main",
  "&:hover": { bgcolor: "grey.800" },
  "&.Mui-disabled": {
    bgcolor: "grey.200",
    color: "grey.600"
  }
} as const;

export default function InviteModal({
                                      open,
                                      onClose,
                                      inviteTo,
                                      setInviteTo,
                                      inviteSubject,
                                      setInviteSubject,
                                      inviteBody,
                                      setInviteBody,
                                      isSendingInvite,
                                      onConfirmSend
                                    }: Props) {
  const disabledSend =
    isSendingInvite ||
    !inviteTo.trim() ||
    !inviteSubject.trim() ||
    !inviteBody.trim();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      disableScrollLock
      slotProps={{
        paper: { elevation: 0, className: "glass" }
      }}
    >
      <DialogTitle sx={{ fontWeight: 950 }}>
        Zaproś kandydata na rozmowę
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack gap={1.5} sx={{ mt: 1 }}>
          <TextField
            label="Do"
            value={inviteTo}
            onChange={(e) => setInviteTo(e.target.value)}
            size="small"
            fullWidth
            sx={inputSx}
          />

          <TextField
            label="Temat"
            value={inviteSubject}
            onChange={(e) => setInviteSubject(e.target.value)}
            size="small"
            fullWidth
            sx={inputSx}
          />

          <TextField
            label="Treść"
            value={inviteBody}
            onChange={(e) => setInviteBody(e.target.value)}
            multiline
            minRows={10}
            fullWidth
            sx={inputSx}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, pb: 2.25, pt: 1.25 }}>
        <Button
          onClick={onClose}
          disabled={isSendingInvite}
          variant="text"
          color="inherit"
          sx={pillSx}
        >
          Anuluj
        </Button>

        <Button
          variant="contained"
          onClick={onConfirmSend}
          disabled={disabledSend}
          sx={sendButtonSx}
        >
          {isSendingInvite ? "Wysyłanie…" : "Wyślij"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}