import React from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import {
  resumesApi,
  useCreateResumeMutation,
  useGetResumeByUserIdQuery
} from "../../../api/resumesApi";
import { useGenerateStatisticsByResumeIdMutation } from "../../../api/statisticsApi";
import { useGetCompanyByIdQuery } from "../../../api/companiesApi";
import { useGetCrmLanguagesQuery, useGetCrmTechnologyTypesQuery } from "../../../api/crmApi";
import { useGetUserByUserIdQuery } from "../../../api/userApi";
import { useGetVacanciesQuery, useGetVacancyByIdQuery } from "../../../api/vacanciesApi";

import OfferSidebar from "../../../components/offers/OfferSidebar";
import SimilarOffers from "../../../components/offers/SimilarOffers";

import OfferApplyDialog, { type ResumePreview } from "./offerDetails/OfferApplyDialog";
import OfferHeader from "./offerDetails/OfferHeader";
import OfferMainCard from "./offerDetails/OfferMainCard";
import {
  buildOfferDetails,
  getVacancyTitle,
  type OfferDetailsData
} from "../../../utils/offerDetailsUtils.ts";

import type { AppDispatch, RootState } from "../../../store/store";
import type { CandidateDto } from "../../../types/common";
import type { CompanyResponse } from "../../../types/company";
import type { ResumeRequestDto, ResumeResponse } from "../../../types/resume";
import type { UserProfileResponse } from "../../../types/user";
import type { VacancyResponse } from "../../../types/vacancy";

type ResumeLanguageLevel = { language?: number | null; level?: number | null };

type ResumeTechnology = {
  yearsOfExperience?: number | null;
  technologyTypeId?: number | null;
  technologyType?: { id?: number | null } | null;
};

type ResumeJobExperience = {
  nameOfCompany?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
  technologies?: ResumeTechnology[] | null;
};

type ResumeEducation = {
  title?: string | null;
  educationType?: number | null;
  degree?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
};

type VacancyWithRelations = VacancyResponse & {
  hrId?: number | null;
  hr?: { id?: number | null } | null;
  companyId?: number | null;
  company?: { id?: number | null } | null;
};

function toNumber(value: unknown, fallback: number): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function normalizeResumeList(data: unknown): ResumeResponse[] {
  if (!data) return [];
  return Array.isArray(data) ? (data as ResumeResponse[]) : [data as ResumeResponse];
}

function pickAppliedResumeId(resumes: ResumeResponse[], candidateEmail: string): number {
  const email = candidateEmail.toLowerCase();

  const byEmail = resumes
    .filter((r) => {
      const c = r.candidate as CandidateDto | undefined;
      return (c?.email ?? "").toLowerCase() === email;
    })
    .slice()
    .sort((a, b) => Number(b.id) - Number(a.id))[0];

  const best =
    byEmail ??
    resumes
      .slice()
      .sort((a, b) => Number(b.id) - Number(a.id))[0];

  const id = Number(best?.id);
  return Number.isFinite(id) ? id : 0;
}

function buildPayloadFromResume(resume: ResumeResponse, vacancyId: number): ResumeRequestDto {
  const candidate = resume.candidate as CandidateDto;

  const languageLevels = (resume.languageLevels ?? []) as ResumeLanguageLevel[];
  const jobExperiences = (resume.jobExperiences ?? []) as ResumeJobExperience[];
  const educations = (resume.educations ?? []) as ResumeEducation[];

  return {
    candidate: {
      firstname: candidate.firstname ?? "",
      lastname: candidate.lastname ?? "",
      age: toNumber(candidate.age, 0),
      bio: candidate.bio ?? "",
      email: candidate.email ?? "",
      workType: candidate.workType,
      address: {
        country: candidate.address?.country ?? "",
        city: candidate.address?.city ?? ""
      }
    },
    expectedSalary: toNumber(resume.expectedSalary, 0),
    yearsOfExperience: toNumber(resume.yearsOfExperience, 0),
    languageLevels: languageLevels.map((item) => ({
      language: item.language ?? 0,
      level: item.level ?? 0
    })),
    jobExperiences: jobExperiences.map((job) => ({
      nameOfCompany: job.nameOfCompany ?? "",
      startDate: job.startDate ?? "",
      endDate: job.endDate ?? "",
      description: job.description ?? "",
      technologies: (job.technologies ?? []).map((tech) => ({
        yearsOfExperience: toNumber(tech.yearsOfExperience, 0),
        technologyTypeId: tech.technologyTypeId ?? tech.technologyType?.id ?? 0
      }))
    })),
    educations: educations.map((edu) => ({
      title: edu.title ?? "",
      educationType: edu.educationType ?? 0,
      degree: edu.degree ?? 0,
      startDate: edu.startDate ?? "",
      endDate: edu.endDate ?? "",
      description: edu.description ?? ""
    })),
    vacancyId
  };
}

function StateCard({ children }: { children: React.ReactNode }) {
  return (
    <Paper elevation={0} className="section" sx={{ p: { xs: 2, sm: 2.5 }, minWidth: 0, overflow: "hidden" }}>
      {children}
    </Paper>
  );
}

export default function OfferDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const rawUserId = useSelector((state: RootState) => state.user.id);
  const userId = typeof rawUserId === "number" ? rawUserId : toNumber(rawUserId, 0) || null;

  const vacancyId = React.useMemo(() => toNumber(id, 0), [id]);
  const canFetchOffer = Boolean(id) && vacancyId > 0;

  const { data: vacancies = [] } = useGetVacanciesQuery();
  const { data: offer, isLoading: isOfferLoading } = useGetVacancyByIdQuery(vacancyId, {
    skip: !canFetchOffer
  });

  const { data: technologyTypes = [] } = useGetCrmTechnologyTypesQuery();
  const { data: languages = [] } = useGetCrmLanguagesQuery();

  const extendedOffer = offer as VacancyWithRelations | undefined;
  const hrId = extendedOffer?.hrId ?? extendedOffer?.hr?.id ?? undefined;
  const companyId = extendedOffer?.companyId ?? extendedOffer?.company?.id ?? undefined;

  const { data: hrUser } = useGetUserByUserIdQuery(hrId ?? 0, {
    skip: hrId == null
  });

  const { data: company } = useGetCompanyByIdQuery(companyId ?? 0, {
    skip: companyId == null
  });

  const { data: resumeData } = useGetResumeByUserIdQuery(userId ?? 0, {
    skip: userId == null
  });

  const baseResume = React.useMemo<ResumeResponse | null>(() => {
    const list = normalizeResumeList(resumeData);
    return list[list.length - 1] ?? null;
  }, [resumeData]);

  const [createResume, { isLoading: isApplying }] = useCreateResumeMutation();
  const [generateStatisticsByResumeId] = useGenerateStatisticsByResumeIdMutation();

  const [isApplyOpen, setIsApplyOpen] = React.useState(false);

  const details = React.useMemo<OfferDetailsData | null>(() => {
    if (!offer) return null;
    return buildOfferDetails({ offer, languages, technologyTypes });
  }, [offer, languages, technologyTypes]);

  const resumePreview = React.useMemo<ResumePreview | null>(() => {
    if (!baseResume) return null;

    const candidate = baseResume.candidate as CandidateDto;

    const fullName =
      `${candidate.firstname ?? ""} ${candidate.lastname ?? ""}`.trim() || "Twoje CV";

    const location =
      [candidate.address?.city ?? "", candidate.address?.country ?? ""].filter(Boolean).join(", ") ||
      null;

    return {
      fullName,
      email: candidate.email ?? null,
      location,
      yearsOfExperience: typeof baseResume.yearsOfExperience === "number" ? baseResume.yearsOfExperience : null,
      expectedSalary: typeof baseResume.expectedSalary === "number" ? baseResume.expectedSalary : null
    };
  }, [baseResume]);

  const title = offer ? getVacancyTitle(offer) : "";

  const similarPool = React.useMemo(
    () => vacancies.filter((v) => String(v.id) !== String(offer?.id)),
    [vacancies, offer]
  );

  const handleBack = React.useCallback(() => navigate(-1), [navigate]);

  const handleApply = async () => {
    if (!offer) {
      toast.error("Oferta nie jest dostępna.");
      return;
    }

    if (!baseResume) {
      toast.info("Najpierw uzupełnij swoje CV w zakładce „Twoje CV”.");
      return;
    }

    const vid = Number(offer.id);
    const payload = buildPayloadFromResume(baseResume, vid);

    const candidateEmail = String((baseResume.candidate as CandidateDto | undefined)?.email ?? "").trim();

    try {
      await createResume(payload).unwrap();

      let resumes: ResumeResponse[] = [];

      try {
        const list = await dispatch(
          resumesApi.endpoints.getResumeByVacancyId.initiate(vid, { forceRefetch: true })
        ).unwrap();

        resumes = normalizeResumeList(list);
      } catch (err) {
        const e = err as { status?: number; originalStatus?: number; data?: { status?: number } };
        const status = e.status ?? e.originalStatus ?? e.data?.status;

        if (status !== 403) {
          toast.error("Błąd podczas wysyłania CV.");
          return;
        }
      }
      const resumeId = resumes.length ? pickAppliedResumeId(resumes, candidateEmail) : 0;

      if (resumeId) {
        try {
          await generateStatisticsByResumeId({ resumeId, vacancyId: vid }).unwrap();
        } catch {
          return;
        }
      }

      setIsApplyOpen(false);
      toast.success("Twoje CV zostało wysłane do tej oferty.");
    } catch (error) {
      const e = error as { data?: { errors?: string[]; message?: string }; error?: string };
      toast.error(e.data?.errors?.[0] || e.data?.message || e.error || "Błąd podczas wysyłania CV.");
    }
  };

  if (isOfferLoading) {
    return (
      <StateCard>
        <Typography variant="body2" color="text.secondary">
          Ładowanie…
        </Typography>
      </StateCard>
    );
  }

  if (!offer) {
    return (
      <StateCard>
        <Stack gap={1.5} alignItems="flex-start" sx={{ minWidth: 0 }}>
          <Button startIcon={<ArrowBackRoundedIcon />} onClick={handleBack} variant="outlined">
            Wróć
          </Button>

          <Typography variant="h6" sx={{ fontWeight: 850 }}>
            Oferta nie została znaleziona
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Sprawdź adres lub wróć do listy ofert.
          </Typography>

          <Button component={Link} to="/candidate/offers" variant="contained">
            Wróć do ofert
          </Button>
        </Stack>
      </StateCard>
    );
  }

  return (
    <Stack gap={{ xs: 2, sm: 2.5 }} sx={{ minWidth: 0 }}>
      <OfferHeader title={title} onBack={handleBack} />

      <Stack
        direction={{ xs: "column", md: "row" }}
        gap={{ xs: 2, md: 2.5 }}
        alignItems="flex-start"
        sx={{ minWidth: 0 }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {details ? (
            <OfferMainCard
              offer={offer}
              shouldClampDescription={Boolean(String(offer.description ?? "").trim())}
              requiredYears={details.requiredYears}
              languageLines={details.languageLines}
              technologyLines={details.technologyLines}
              educationLine={details.educationLine}
              workTypeLabel={details.workTypeLabel}
              salaryLabel={details.salaryLabel}
              locationLabel={details.locationLabel}
              benefits={details.benefits}
            />
          ) : null}
        </Box>

        <Box sx={{ width: { xs: "100%", md: 360 }, minWidth: 0, flexShrink: 0 }}>
          <Box sx={{ position: { md: "sticky" }, top: { md: 88 } }}>
            <OfferSidebar
              offer={offer}
              hrUser={hrUser as UserProfileResponse | undefined}
              company={company as CompanyResponse | undefined}
              onApply={() => setIsApplyOpen(true)}
            />
          </Box>
        </Box>
      </Stack>

      <SimilarOffers base={offer} pool={similarPool} />

      <OfferApplyDialog
        open={isApplyOpen}
        title={title}
        onClose={() => setIsApplyOpen(false)}
        onSubmit={() => void handleApply()}
        isSubmitting={isApplying}
        cvName=""
        resumePreview={resumePreview}
      />
    </Stack>
  );
}