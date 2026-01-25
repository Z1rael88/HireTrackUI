import { useEffect, useMemo } from "react";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { useGetCrmTechnologyTypesQuery } from "../../../api/crmApi";
import {
  useCreateResumeMutation,
  useGetResumeByUserIdQuery,
  useUpdateResumeMutation
} from "../../../api/resumesApi";
import { useGetUserByUserIdQuery } from "../../../api/userApi";
import ResumeUploadButton from "../../../components/features/ResumeUploadButton";
import type { RootState } from "../../../store/store";
import type { CandidateDto } from "../../../types/common";
import { DEGREE, EDUCATION_TYPE, LANGUAGE, LANGUAGE_LEVEL, WORK_TYPE } from "../../../types/enumLabels";
import type {
  EducationItem,
  ExperienceItem,
  ResumeRequestDto,
  ResumeResponse,
  UploadResumeResponse
} from "../../../types/resume";

import ResumeCandidateSection from "./ResumeCandidateSection";
import ResumeCardSection from "./ResumeCardSection";
import ResumeEducationSection from "./ResumeEducationSection";
import ResumeExperienceSection from "./ResumeExperienceSection";
import ResumeLanguagesSection from "./ResumeLanguagesSection";
import ResumeSummarySection from "./ResumeSummarySection";
import {
  buildInitialFromProfile,
  buildResumePayload,
  mapResponseToForm,
  validateResumeForm
} from "../../../utils/resumePageUtils.ts";

type ResumeFormValues = ResumeRequestDto & { id?: number };

function normalizeResumeResponse(data: unknown): ResumeResponse | null {
  if (!data) return null;
  if (Array.isArray(data)) return (data[0] as ResumeResponse) ?? null;
  return data as ResumeResponse;
}

export default function ResumePage() {
  const rawUserId = useSelector((state: RootState) => state.user.id);
  const authUser = useSelector((state: RootState) => state.user.user);

  const userId = rawUserId != null ? Number(rawUserId) : null;
  const canFetch = userId != null && !Number.isNaN(userId);

  const { data: userDetails } = useGetUserByUserIdQuery(userId ?? 0, {
    skip: !canFetch
  });

  const {
    data: resumesByUser,
    isLoading: isResumeLoading,
    refetch: refetchResume
  } = useGetResumeByUserIdQuery(userId ?? 0, { skip: !canFetch });

  const { data: technologyTypes = [], isLoading: areTechnologiesLoading } = useGetCrmTechnologyTypesQuery();

  const [createResume, { isLoading: isCreating }] = useCreateResumeMutation();
  const [updateResume, { isLoading: isUpdating }] = useUpdateResumeMutation();

  const isSaving = isCreating || isUpdating;
  const isBusy = isSaving || isResumeLoading;

  const rawProfile = (userDetails ?? authUser) as Partial<CandidateDto> | null;

  const candidateProfile = useMemo<Partial<CandidateDto> | undefined>(() => {
    if (!rawProfile) return undefined;
    return {
      ...rawProfile,
      age: typeof rawProfile.age === "number" ? rawProfile.age : undefined
    };
  }, [rawProfile]);

  const resumeData = useMemo(() => normalizeResumeResponse(resumesByUser), [resumesByUser]);

  const { handleSubmit, watch, reset, setValue, getValues } = useForm<ResumeFormValues>({
    defaultValues: buildInitialFromProfile(candidateProfile)
  });

  useEffect(() => {
    if (resumeData) {
      reset(mapResponseToForm(resumeData, candidateProfile) as ResumeFormValues);
      return;
    }
    reset(buildInitialFromProfile(candidateProfile) as ResumeFormValues);
  }, [resumeData, candidateProfile, reset]);

  useEffect(() => {
    if (!isResumeLoading) return;
    toast.info("Ładowanie danych…");
  }, [isResumeLoading]);

  const resumeForm = watch();

  const handlePatchCandidate = (patch: Partial<CandidateDto>) => {
    const currentCandidate = (getValues("candidate") ?? {}) as CandidateDto;
    setValue("candidate", { ...currentCandidate, ...patch });
  };

  const handleReset = () => {
    if (resumeData) {
      reset(mapResponseToForm(resumeData, candidateProfile) as ResumeFormValues);
      return;
    }
    reset(buildInitialFromProfile(candidateProfile) as ResumeFormValues);
  };

  const handleSubmitForm = async (values: ResumeFormValues) => {
    const validationError = validateResumeForm(values);
    if (validationError) return toast.error(validationError);

    const payload = buildResumePayload(values);

    try {
      if (resumeData) {
        await updateResume({ resumeId: resumeData.id, data: payload }).unwrap();
      } else {
        await createResume(payload).unwrap();
      }

      await refetchResume();
      toast.success("Zapisano.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : typeof error === "string" ? error : "Wystąpił błąd.";

      if (message.includes("IX_Candidates_Email") || message.includes("23505")) {
        toast.error(
          "CV dla tego adresu email już istnieje. Odśwież stronę lub wprowadź zmiany – kolejne zapisy będą aktualizacją istniejącego CV."
        );
        return;
      }

      toast.error(message);
    }
  };

  const technologyOptions = (technologyTypes as Array<{ id: number; name: string | null }>).map((technologyType) => ({
    id: technologyType.id,
    label: technologyType.name ?? `Technologia #${technologyType.id}`
  }));

  const experienceItems: ExperienceItem[] | null = Array.isArray(resumeForm?.jobExperiences)
    ? (resumeForm.jobExperiences as ExperienceItem[])
    : null;

  const educationItems: EducationItem[] | null = Array.isArray(resumeForm?.educations)
    ? (resumeForm.educations as EducationItem[])
    : null;

  return (
    <Stack gap={2.5} sx={{ minWidth: 0 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        gap={1}
        sx={{ minWidth: 0 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Twoje CV
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          gap={1}
          sx={{ flexShrink: 0 }}
        >
          <ResumeUploadButton
            disabled={isBusy}
            onParsed={(parsed: UploadResumeResponse) => {
              const currentCandidate = (getValues("candidate") ?? {}) as CandidateDto;

              const nextCandidate: CandidateDto = parsed?.candidate
                ? (() => {
                  const { address: workType, ...rest } = parsed.candidate;
                  return {
                    ...currentCandidate,
                    ...rest,
                    workType: (workType ?? []) as CandidateDto["workType"]
                  };
                })()
                : currentCandidate;

              reset({
                ...(buildInitialFromProfile(candidateProfile) as ResumeFormValues),
                ...parsed,
                id: resumeData?.id,
                languageLevels: parsed?.languageLevels ?? [],
                jobExperiences: parsed?.jobExperiences ?? [],
                educations: parsed?.educations ?? [],
                candidate: nextCandidate
              });
            }}
          />

          <Button variant="text" onClick={handleReset} disabled={isBusy}>
            Anuluj zmiany
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit(handleSubmitForm)}
            disabled={isBusy}
            startIcon={isBusy ? <CircularProgress size={16} /> : undefined}
          >
            Zapisz
          </Button>
        </Stack>
      </Stack>

      <ResumeCardSection title="Kandydat" icon={<BadgeRoundedIcon color="primary" />}>
        <ResumeCandidateSection
          value={resumeForm}
          onPatch={handlePatchCandidate}
          workTypeLabels={WORK_TYPE}
          readOnlySx={{
            "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "unset" },
            "& .Mui-disabled": { opacity: 1 }
          }}
        />
      </ResumeCardSection>

      <ResumeCardSection title="Podsumowanie" icon={<WorkOutlineRoundedIcon color="primary" />}>
        <ResumeSummarySection value={resumeForm} onChange={(next) => next && reset(next)} />
      </ResumeCardSection>

      <ResumeCardSection title="Języki" icon={<TranslateRoundedIcon color="primary" />}>
        <ResumeLanguagesSection
          items={resumeForm?.languageLevels ?? null}
          onChange={(next) => setValue("languageLevels", next || [])}
          languageLabels={LANGUAGE}
          levelLabels={LANGUAGE_LEVEL}
          disabled={isBusy}
        />
      </ResumeCardSection>

      <ResumeCardSection title="Doświadczenie zawodowe" icon={<WorkOutlineRoundedIcon color="primary" />}>
        <ResumeExperienceSection
          items={experienceItems}
          onChange={(next) => setValue("jobExperiences", next || [])}
          technologyOptions={technologyOptions}
          technologiesLoading={areTechnologiesLoading}
          disabled={isBusy}
        />
      </ResumeCardSection>

      <ResumeCardSection title="Edukacja" icon={<SchoolRoundedIcon color="primary" />}>
        <ResumeEducationSection
          items={educationItems}
          onChange={(next) => setValue("educations", next || [])}
          educationTypeLabels={EDUCATION_TYPE}
          degreeLabels={DEGREE}
          disabled={isBusy}
        />
      </ResumeCardSection>
    </Stack>
  );
}