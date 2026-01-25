import { useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import { toast } from "react-toastify";

import { useUploadResumeMutation } from "../../api/resumesApi";
import type { UploadResumeResponse } from "../../types/resume";
import { COLORS } from "../../style/ColorTheme";

type Props = {
  disabled?: boolean;
  accept?: string;
  maxSizeMb?: number;
  onParsed: (data: UploadResumeResponse, meta: { file: File }) => void | Promise<void>;
  onCleared?: () => void;
};

export default function ResumeUploadButton({
                                             disabled,
                                             accept = "application/pdf",
                                             maxSizeMb = 10,
                                             onParsed,
                                             onCleared
                                           }: Props) {
  const [fileName, setFileName] = useState("");
  const [uploadResume, { isLoading }] = useUploadResumeMutation();

  const isBusy = Boolean(disabled || isLoading);

  const validate = (file: File) => {
    if (accept === "application/pdf" && file.type !== "application/pdf") {
      return "Dozwolony jest tylko plik PDF.";
    }
    const maxBytes = maxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      return `Plik jest za duży. Maks ${maxSizeMb}MB.`;
    }
    return null;
  };

  const onPick = async (file: File | null) => {
    if (!file) {
      setFileName("");
      onCleared?.();
      return;
    }

    const err = validate(file);
    if (err) {
      toast.error(err);
      return;
    }

    setFileName(file.name);

    try {
      const parsed = (await uploadResume(file).unwrap()) as UploadResumeResponse;
      await onParsed(parsed, { file });
      toast.success("CV wczytane z PDF. Sprawdź i popraw dane.");
    } catch {
      toast.error("Nie udało się wczytać CV z PDF.");
    }
  };

  return (
    <Stack gap={0.5} sx={{ width: "100%" }}>
      <Button
        variant="outlined"
        component="label"
        startIcon={<UploadFileRoundedIcon />}
        disabled={isBusy}
        sx={{ width: { xs: "100%", sm: "fit-content" } }}
      >
        {isLoading ? "Wczytuję..." : "Załącz PDF"}
        <input
          hidden
          type="file"
          accept={accept}
          onChange={(e) => {
            void onPick(e.target.files?.[0] ?? null);
            e.currentTarget.value = "";
          }}
        />
      </Button>

      {!!fileName && (
        <Typography
          variant="caption"
          title={fileName}
          sx={{
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: COLORS.textMuted
          }}
        >
          {fileName}
        </Typography>
      )}
    </Stack>
  );
}