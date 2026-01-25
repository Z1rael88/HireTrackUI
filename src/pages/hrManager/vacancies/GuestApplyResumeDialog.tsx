import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography
} from "@mui/material";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useGetCrmTechnologyTypesQuery } from "../../../api/crmApi";
import { useCreateResumeMutation } from "../../../api/resumesApi";
import { useGenerateStatisticsByResumeIdMutation } from "../../../api/statisticsApi";
import ResumeUploadButton from "../../../components/features/ResumeUploadButton";
import type { UploadResumeResponse, EducationItem, ExperienceItem, ResumeRequestDto } from "../../../types/resume";
import type { CandidateDto } from "../../../types/common";
import { DEGREE, EDUCATION_TYPE, LANGUAGE, LANGUAGE_LEVEL, WORK_TYPE } from "../../../types/enumLabels";
import { COLORS } from "../../../style/ColorTheme";

import ResumeCardSection from "../../candidate/resume/ResumeCardSection";
import ResumeCandidateSection from "../../candidate/resume/ResumeCandidateSection";
import ResumeSummarySection from "../../candidate/resume/ResumeSummarySection";
import ResumeLanguagesSection from "../../candidate/resume/ResumeLanguagesSection";
import ResumeExperienceSection from "../../candidate/resume/ResumeExperienceSection";
import ResumeEducationSection from "../../candidate/resume/ResumeEducationSection";
import {
  buildInitialFromProfile,
  buildResumePayload,
  validateResumeForm
} from "../../../utils/resumePageUtils.ts";

type ResumeFormValues = ResumeRequestDto & { id?: number };

type Props = {
  open: boolean;
  onClose: () => void;
  redirectPath: string;
  vacancyId: number;
};

export default function GuestApplyResumeDialog({ open, onClose, redirectPath, vacancyId }: Props) {
  const navigate = useNavigate();
  const { id, vacancyId: vacancyIdFromUrl } = useParams<{ id?: string; vacancyId?: string }>();

  const paramId = Number(id ?? vacancyIdFromUrl);
  const resolvedVacancyId =
    Number(vacancyId) > 0 ? Number(vacancyId) : Number.isFinite(paramId) && paramId > 0 ? paramId : 0;

  const [fileName, setFileName] = useState("");

  const { data: technologyTypes = [], isLoading: areTechnologiesLoading } = useGetCrmTechnologyTypesQuery();

  const [createResume, { isLoading: isSending }] = useCreateResumeMutation();
  const [generateStatisticsByResumeId] = useGenerateStatisticsByResumeIdMutation();

  const { handleSubmit, watch, reset, setValue, getValues } = useForm<ResumeFormValues>({
    defaultValues: {
      ...(buildInitialFromProfile(undefined) as ResumeFormValues),
      vacancyId: resolvedVacancyId
    }
  });

  useEffect(() => {
    if (!open) return;
    const initial = buildInitialFromProfile(undefined) as ResumeFormValues;
    reset({ ...initial, vacancyId: resolvedVacancyId });
    setFileName("");
  }, [open, resolvedVacancyId, reset]);

  const resumeForm = watch();

  const technologyOptions = useMemo(
    () =>
      (technologyTypes as Array<{ id: number; name: string | null }>).map((t) => ({
        id: t.id,
        label: t.name ?? `Technologia #${t.id}`
      })),
    [technologyTypes]
  );

  const experienceItems: ExperienceItem[] | null = Array.isArray(resumeForm?.jobExperiences)
    ? (resumeForm.jobExperiences as ExperienceItem[])
    : null;

  const educationItems: EducationItem[] | null = Array.isArray(resumeForm?.educations)
    ? (resumeForm.educations as EducationItem[])
    : null;

  const handlePatchCandidate = (patch: Partial<CandidateDto>) => {
    const currentCandidate = (getValues("candidate") ?? {}) as CandidateDto;
    setValue("candidate", { ...currentCandidate, ...patch });
  };

  const onLogin = () => {
    onClose();
    navigate("/authUser", { state: { mode: "login", redirect: redirectPath } });
  };

  const onSubmit = async (values: ResumeFormValues) => {
    if (!resolvedVacancyId) {
      toast.error("Brak id вакансії. Odśwież stronę i spróbuj ponownie.");
      return;
    }

    const error = validateResumeForm(values, { isGuest: true });
    if (error) return toast.error(error);

    const base = buildResumePayload(values);
    const payload: ResumeRequestDto = { ...base, vacancyId: resolvedVacancyId };

    try {
      const created = (await createResume(payload).unwrap()) as unknown as { id?: number | string };

      const resumeId = Number(created?.id);
      if (!Number.isFinite(resumeId) || resumeId <= 0) {
        toast.error("Nie udało się odczytać id utworzonego CV.");
        return;
      }

      await generateStatisticsByResumeId({ resumeId, vacancyId: resolvedVacancyId }).unwrap();

      toast.success("Zgłoszenie wysłane.");
      onClose();
    } catch {
      toast.error("Nie udało się wysłać zgłoszenia.");
    }
  };

  const iconSx = { color: COLORS.accent };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      slotProps={{
        paper: {
          sx: { borderRadius: 4, overflow: "hidden" }
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 900, color: COLORS.textPrimary }}>Aplikuj jako gość</DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Stack gap={1.5} sx={{ mt: 1 }}>
          <Stack gap={0.5}>
            <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
              Wypełnij CV, aby aplikować. Jeśli masz już konto — zaloguj się.
            </Typography>

            <Stack direction="row" gap={1} flexWrap="wrap">
              <Button variant="outlined" onClick={onLogin} disabled={isSending}>
                Mam konto — zaloguj się
              </Button>

              <ResumeUploadButton
                disabled={isSending}
                onParsed={(parsed: UploadResumeResponse) => {
                  const currentCandidate = getValues("candidate") as CandidateDto;

                  const nextCandidate: CandidateDto = parsed?.candidate
                    ? (() => {
                      const { address: workType, ...rest } = parsed.candidate as unknown as {
                        address?: unknown;
                      };
                      return {
                        ...currentCandidate,
                        ...(rest as Partial<CandidateDto>),
                        workType: (workType ?? []) as CandidateDto["workType"]
                      };
                    })()
                    : currentCandidate;

                  reset({
                    ...(buildInitialFromProfile(undefined) as ResumeFormValues),
                    ...(parsed as unknown as Partial<ResumeFormValues>),
                    vacancyId: resolvedVacancyId,
                    languageLevels: parsed?.languageLevels ?? [],
                    jobExperiences: parsed?.jobExperiences ?? [],
                    educations: parsed?.educations ?? [],
                    candidate: nextCandidate
                  });

                  const parsedName =
                    (parsed as unknown as { fileName?: string; filename?: string; name?: string })?.fileName ??
                    (parsed as unknown as { fileName?: string; filename?: string; name?: string })?.filename ??
                    "";
                  setFileName(parsedName ? String(parsedName) : "");
                }}
              />
            </Stack>

            {!!fileName && (
              <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
                {fileName}
              </Typography>
            )}
          </Stack>

          <Divider />

          <Stack gap={2}>
            <ResumeCardSection title="Kandydat" icon={<BadgeRoundedIcon sx={iconSx} />}>
              <ResumeCandidateSection value={resumeForm} onPatch={handlePatchCandidate} workTypeLabels={WORK_TYPE}
                                      editable />
            </ResumeCardSection>

            <ResumeCardSection title="Podsumowanie" icon={<WorkOutlineRoundedIcon sx={iconSx} />}>
              <ResumeSummarySection value={resumeForm} onChange={(next) => next && reset(next)} />
            </ResumeCardSection>

            <ResumeCardSection title="Języki" icon={<TranslateRoundedIcon sx={iconSx} />}>
              <ResumeLanguagesSection
                items={resumeForm?.languageLevels ?? null}
                onChange={(next) => setValue("languageLevels", next || [])}
                languageLabels={LANGUAGE}
                levelLabels={LANGUAGE_LEVEL}
                disabled={false}
              />
            </ResumeCardSection>

            <ResumeCardSection title="Doświadczenie zawodowe" icon={<WorkOutlineRoundedIcon sx={iconSx} />}>
              <ResumeExperienceSection
                items={experienceItems}
                onChange={(next) => setValue("jobExperiences", next || [])}
                technologyOptions={technologyOptions}
                technologiesLoading={areTechnologiesLoading}
                disabled={false}
              />
            </ResumeCardSection>

            <ResumeCardSection title="Edukacja" icon={<SchoolRoundedIcon sx={iconSx} />}>
              <ResumeEducationSection
                items={educationItems}
                onChange={(next) => setValue("educations", next || [])}
                educationTypeLabels={EDUCATION_TYPE}
                degreeLabels={DEGREE}
                disabled={false}
              />
            </ResumeCardSection>
          </Stack>

          <Box />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSending}>
          Anuluj
        </Button>
        <Button variant="contained" color="warning" onClick={handleSubmit(onSubmit)} disabled={isSending}>
          Wyślij zgłoszenie
        </Button>
      </DialogActions>
    </Dialog>
  );
}