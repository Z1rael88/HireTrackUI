import React from "react";
import { Box, Button, Pagination, Paper, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { useCreateResumeMutation, useGetResumeByUserIdQuery } from "../../../api/resumesApi";
import { useGetVacanciesQuery } from "../../../api/vacanciesApi";
import { useGenerateStatisticsByResumeIdMutation } from "../../../api/statisticsApi";
import type { RootState } from "../../../store/store";
import type { CandidateDto } from "../../../types/common";
import type { ResumeRequestDto, ResumeResponse } from "../../../types/resume";

import OffersFiltersBar, { type OffersFilters } from "./OffersFiltersBar";
import OfferApplyDialog, { type ResumePreview } from "./offerDetails/OfferApplyDialog";
import { OfferJobCards, type VacancyOffer, getWorkTypeLabel } from "./OfferJobCards";

function toNumber(value: unknown, fallback: number): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function parseYmdDate(value?: string | null): Date | null {
  if (!value) return null;

  const [y, m, d] = value.split("-").map((v) => Number(v));
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;

  return new Date(Date.UTC(y, m - 1, d));
}

function isActiveOffer(offer: VacancyOffer, todayUtc: Date): boolean {
  const endDate = parseYmdDate(offer.endDate ?? null);
  if (!endDate) return true;
  return endDate.getTime() >= todayUtc.getTime();
}

function buildPayloadFromResume(resume: ResumeResponse, vacancyId: number): ResumeRequestDto {
  const candidate = resume.candidate as CandidateDto;

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
    languageLevels: (resume.languageLevels ?? []).map((ll) => ({
      language: ll.language,
      level: ll.level
    })),
    jobExperiences: (resume.jobExperiences ?? []).map((je) => ({
      nameOfCompany: je.nameOfCompany ?? "",
      startDate: je.startDate,
      endDate: je.endDate,
      description: je.description ?? "",
      technologies: (je.technologies ?? [])
        .map((tech) => ({
          yearsOfExperience: toNumber(tech.yearsOfExperience, 0),
          technologyTypeId: toNumber(tech.technologyTypeId, 0)
        }))
        .filter((t) => t.technologyTypeId > 0)
    })),
    educations: (resume.educations ?? []).map((ed) => ({
      title: ed.title ?? "",
      educationType: ed.educationType,
      degree: ed.degree,
      startDate: ed.startDate,
      endDate: ed.endDate,
      description: ed.description ?? ""
    })),
    vacancyId
  };
}

export default function OffersPage() {
  const { data: vacancies = [], isLoading } = useGetVacanciesQuery();

  const rawUserId = useSelector((state: RootState) => state.user.id);
  const userId = typeof rawUserId === "number" ? rawUserId : Number(rawUserId) || null;

  const { data: baseResumeData } = useGetResumeByUserIdQuery(userId ?? 0, {
    skip: userId == null
  });

  const [createResume, { isLoading: isApplying }] = useCreateResumeMutation();
  const [generateStatisticsByResumeId] = useGenerateStatisticsByResumeIdMutation();
  const [filters, setFilters] = React.useState<OffersFilters>({
    query: "",
    types: [],
    cities: [],
    sort: "Newest"
  });

  const [page, setPage] = React.useState(1);
  const pageSize = 6;

  const [isApplyOpen, setIsApplyOpen] = React.useState(false);
  const [selectedOffer, setSelectedOffer] = React.useState<VacancyOffer | null>(null);

  const resume: ResumeResponse | null = React.useMemo(() => {
    if (!baseResumeData) return null;
    const list = Array.isArray(baseResumeData) ? baseResumeData : [baseResumeData];
    return (list[list.length - 1] as ResumeResponse | undefined) ?? null;
  }, [baseResumeData]);

  const resumePreview: ResumePreview | null = React.useMemo(() => {
    if (!resume) return null;

    const candidate = resume.candidate as CandidateDto;
    const fullName = `${candidate.firstname ?? ""} ${candidate.lastname ?? ""}`.trim() || "Twoje CV";
    const location =
      [candidate.address?.city ?? "", candidate.address?.country ?? ""].filter(Boolean).join(", ") || null;

    return {
      fullName,
      email: candidate.email ?? null,
      location,
      yearsOfExperience: typeof resume.yearsOfExperience === "number" ? resume.yearsOfExperience : null,
      expectedSalary: typeof resume.expectedSalary === "number" ? resume.expectedSalary : null
    };
  }, [resume]);

  const todayUtc = React.useMemo(
    () => new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate())),
    []
  );

  const activeVacancies = React.useMemo(
    () => (vacancies as VacancyOffer[]).filter((offer) => isActiveOffer(offer, todayUtc)),
    [vacancies, todayUtc]
  );

  const allTypes = React.useMemo(() => {
    const labels = activeVacancies.map((vacancy) => getWorkTypeLabel(vacancy.workType)).filter(Boolean);
    return Array.from(new Set(labels)).sort();
  }, [activeVacancies]);

  const allCities = React.useMemo(() => {
    const cities = activeVacancies
      .map((vacancy) => vacancy.address?.city || vacancy.city || vacancy.location)
      .filter(Boolean)
      .map((value) => String(value));

    return Array.from(new Set(cities)).sort();
  }, [activeVacancies]);

  const filteredVacancies = React.useMemo(() => {
    let list = [...activeVacancies];

    if (filters.query) {
      const queryLower = filters.query.toLowerCase();

      list = list.filter((vacancy) => {
        const title = String(vacancy.name || vacancy.title || "").toLowerCase();
        const city = String(vacancy.address?.city || vacancy.city || vacancy.location || "").toLowerCase();

        const tags = Array.isArray(vacancy.tags)
          ? vacancy.tags
          : Array.isArray(vacancy.technologies)
            ? vacancy.technologies
            : [];

        const hasMatchingTag = (tags as unknown[]).some((tag) => String(tag).toLowerCase().includes(queryLower));
        return title.includes(queryLower) || city.includes(queryLower) || hasMatchingTag;
      });
    }

    if (filters.types.length) {
      list = list.filter((vacancy) => filters.types.includes(getWorkTypeLabel(vacancy.workType)));
    }

    if (filters.cities.length) {
      list = list.filter((vacancy) =>
        filters.cities.includes(String(vacancy.address?.city || vacancy.city || vacancy.location || ""))
      );
    }

    if (filters.sort === "Newest") {
      list.sort((a, b) => {
        const aDate = a.addDate || a.postedAt || a.createdAt || 0;
        const bDate = b.addDate || b.postedAt || b.createdAt || 0;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      });
    } else {
      list.sort((a, b) => String(a.name || a.title || "").localeCompare(String(b.name || b.title || "")));
    }

    return list;
  }, [activeVacancies, filters]);

  const paginatedVacancies = React.useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredVacancies.slice(startIndex, startIndex + pageSize);
  }, [filteredVacancies, page]);

  const handleClearFilters = () => {
    setFilters({ query: "", types: [], cities: [], sort: "Newest" });
    setPage(1);
  };

  const handleOpenApply = (offer: VacancyOffer) => {
    setSelectedOffer(offer);
    setIsApplyOpen(true);
  };

  const handleApply = async () => {
    if (!selectedOffer) return;

    if (!resume) {
      toast.info("Najpierw uzupełnij swoje CV w zakładce \"Twoje CV\".");
      return;
    }

    try {
      const payload = buildPayloadFromResume(resume, Number(selectedOffer.id));
      await createResume(payload).unwrap();

      const resumeId = Number(resume.id);
      const vacancyId = Number(selectedOffer.id);

      if (Number.isFinite(resumeId) && resumeId > 0 && Number.isFinite(vacancyId) && vacancyId > 0) {
        try {
          await generateStatisticsByResumeId({ resumeId, vacancyId }).unwrap();
        } catch {
          return;
        }
      }

      setIsApplyOpen(false);
      toast.success("Twoje CV zostało wysłane do tej oferty.");
    } catch (e) {
      const err = e as { data?: { errors?: string[]; message?: string }; error?: string };
      toast.error(err.data?.errors?.[0] || err.data?.message || err.error || "Błąd podczas wysyłania CV.");
    }
  };

  const bottomInset = "calc(72px + env(safe-area-inset-bottom, 0px))";

  return (
    <Stack spacing={{ xs: 2, sm: 2.5 }}
           sx={{ minWidth: 0, width: "100%", overflowX: "hidden", pb: { xs: bottomInset, sm: 0 } }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        gap={1}
        sx={{ minWidth: 0 }}
      >
        <Stack sx={{ minWidth: 0 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.15, wordBreak: "break-word" }}>
            Oferty dla Ciebie
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Przeglądaj otwarte stanowiska i aplikuj na najlepsze dopasowania.
          </Typography>
        </Stack>
      </Stack>

      <OffersFiltersBar
        filters={filters}
        onChange={(next) => {
          setFilters(next);
          setPage(1);
        }}
        allTypes={allTypes}
        allCities={allCities}
        onClear={handleClearFilters}
      />

      <Stack spacing={1.5} sx={{ minWidth: 0 }}>
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
            <Paper
              key={index}
              elevation={0}
              variant="outlined"
              className="section"
              sx={{ p: { xs: 1.75, sm: 2, md: 2.5 }, borderRadius: 3, minWidth: 0 }}
            >
              <Typography color="text.secondary">Ładowanie oferty…</Typography>
            </Paper>
          ))
          : null}

        {!isLoading
          ? paginatedVacancies.map((offer) => (
            <Box key={offer.id} sx={{ minWidth: 0, width: "100%" }}>
              <OfferJobCards offer={offer} onApply={() => handleOpenApply(offer)} />
            </Box>
          ))
          : null}

        {!isLoading && !paginatedVacancies.length ? (
          <Paper
            elevation={0}
            variant="outlined"
            className="section"
            sx={{
              p: { xs: 2.5, sm: 3, md: 4 },
              textAlign: "center",
              borderRadius: 3,
              borderStyle: "dashed",
              minWidth: 0
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Nie znaleziono ofert
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Zmień filtry lub wyczyść je, aby zobaczyć więcej wyników.
            </Typography>

            <Box mt={2} sx={{ display: "flex", justifyContent: "center" }}>
              <Button variant="contained" onClick={handleClearFilters} sx={{ px: 2.25 }}>
                Wyczyść filtry
              </Button>
            </Box>
          </Paper>
        ) : null}
      </Stack>

      {filteredVacancies.length > pageSize ? (
        <Stack alignItems="center" sx={{ pb: { xs: 0.5, sm: 0 } }}>
          <Pagination
            count={Math.max(1, Math.ceil(filteredVacancies.length / pageSize))}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            shape="rounded"
            sx={{ "& .MuiPaginationItem-root": { borderRadius: 2 } }}
          />
        </Stack>
      ) : null}

      <OfferApplyDialog
        open={isApplyOpen && Boolean(selectedOffer)}
        title={selectedOffer?.name || selectedOffer?.title || ""}
        onClose={() => setIsApplyOpen(false)}
        onSubmit={() => void handleApply()}
        isSubmitting={isApplying}
        cvName=""
        resumePreview={resumePreview}
      />
    </Stack>
  );
}