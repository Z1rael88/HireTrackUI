import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Button, Divider, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import { toast } from "react-toastify";

import type { RootState } from "../../../store/store";
import { Roles, type Degree, type EducationType, type LanguageLevel } from "../../../types/enums";
import { useGetVacancyByIdQuery } from "../../../api/vacanciesApi";
import { useGetCompanyByIdQuery } from "../../../api/companiesApi";
import { useGetCrmTechnologyTypesQuery, useGetCrmLanguagesQuery } from "../../../api/crmApi";
import { DEGREE, EDUCATION_TYPE, LANGUAGE_LEVEL, WORK_TYPE } from "../../../types/enumLabels";
import type { CrmNamedItem } from "../../../types/crm";
import GuestApplyResumeDialog from "./GuestApplyResumeDialog";

type TechDtoLike = { id?: number | string | null; name?: string | null };

type TechnologyRequirementLike = {
  name?: string | null;
  yearsOfExperience?: number | null;
  technologyTypeId?: number | string | null;
  technologyTypeDto?: TechDtoLike | null;
  technologyType?: TechDtoLike | null;
};

const getWorkTypeLabel = (workType: unknown) => {
  const labels = WORK_TYPE as Record<number, string>;
  const raw = Array.isArray(workType) ? workType : workType == null ? [] : [workType];
  const ids = raw.map(Number).filter(Number.isFinite);
  return ids.length ? ids.map((id) => labels[id] ?? String(id)).join(", ") : "—";
};

const yearsSuffixPl = (years: number) => {
  if (years === 1) return "rok";
  if (years >= 2 && years <= 4) return "lata";
  return "lat";
};

const toIdNameMap = (items: Array<{ id: number; name?: string | null }>) =>
  items.reduce((acc, item) => {
    acc[item.id] = item.name ?? `#${item.id}`;
    return acc;
  }, {} as Record<number, string>);

const getTechnologyLabel = (requirement: TechnologyRequirementLike, technologyNamesById: Record<number, string>) => {
  const nameFromApi = String(requirement.name ?? "").trim();
  const nameFromDto = String(requirement.technologyTypeDto?.name ?? requirement.technologyType?.name ?? "").trim();

  const typeIdRaw = requirement.technologyTypeId ?? requirement.technologyTypeDto?.id ?? requirement.technologyType?.id;
  const typeId = Number(typeIdRaw);
  const nameFromDict = Number.isFinite(typeId) ? technologyNamesById[typeId] : undefined;

  const baseName = nameFromApi || nameFromDto || nameFromDict || "Technologia";

  const years = Number(requirement.yearsOfExperience);
  return Number.isFinite(years) && years > 0 ? `${baseName}: min. ${years} ${yearsSuffixPl(years)} doświadczenia` : baseName;
};

export default function PublicVacancyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuth, role } = useSelector((state: RootState) => state.user);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  const vacancyId = Number(id);
  const isValidVacancyId = Number.isFinite(vacancyId) && vacancyId > 0;

  const { data: vacancy, isLoading, isError, refetch } = useGetVacancyByIdQuery(vacancyId, { skip: !isValidVacancyId });

  const companyId = vacancy?.companyId ?? null;
  const { data: company } = useGetCompanyByIdQuery(companyId ?? 0, { skip: companyId == null });

  const { data: technologyTypes = [] } = useGetCrmTechnologyTypesQuery();
  const { data: languages = [] } = useGetCrmLanguagesQuery();

  const technologyNamesById = toIdNameMap(technologyTypes as Array<{ id: number; name?: string | null }>);
  const languageNamesById = toIdNameMap(languages as CrmNamedItem[]);

  const handleApply = () => {
    if (!isValidVacancyId) return;

    if (!isAuth) {
      setIsApplyOpen(true);
      return;
    }

    if (role === Roles.Candidate) {
      navigate(`/candidate/offers/${vacancyId}`);
      return;
    }

    toast.info("Aplikowanie jest dostępne tylko dla konta kandydata.");
  };

  if (!isValidVacancyId) {
    return (
      <Paper elevation={0} className="section" sx={{ p: 3 }}>
        <Typography sx={{ fontWeight: 800, color: "error.main" }}>Nieprawidłowy link.</Typography>
      </Paper>
    );
  }

  if (isLoading) {
    return (
      <Paper elevation={0} className="section" sx={{ p: 2 }}>
        <LinearProgress />
      </Paper>
    );
  }

  if (isError || !vacancy) {
    return (
      <Paper elevation={0} className="section" sx={{ p: 3 }}>
        <Stack gap={1.25}>
          <Typography sx={{ fontWeight: 800, color: "error.main" }}>Nie udało się pobrać oferty.</Typography>
          <Stack direction="row" gap={1} flexWrap="wrap">
            <Button variant="outlined" onClick={() => refetch()}>
              Spróbuj ponownie
            </Button>
            <Button variant="contained" color="warning" onClick={() => navigate("/")}>
              Strona główna
            </Button>
          </Stack>
        </Stack>
      </Paper>
    );
  }

  const title = vacancy.name ?? "—";
  const description = vacancy.description ?? "—";

  const workTypeLabel = getWorkTypeLabel(vacancy.workType);
  const salaryLabel = typeof vacancy.salary === "number" && vacancy.salary > 0 ? `${vacancy.salary} PLN` : "—";

  const city = vacancy.address?.city ?? "";
  const country = vacancy.address?.country ?? "";
  const locationLabel = city && country ? `${city}, ${country}` : city || country || "—";

  const requiredYears = vacancy.requirements?.yearsOfExperience ?? null;
  const requiredYearsLabel = requiredYears && requiredYears > 0 ? `Min. ${requiredYears} lat doświadczenia` : "—";

  const languageLines = (vacancy.requirements?.languageLevels ?? [])
    .map((item) => {
      const languageId = Number(item?.language);
      const levelId = Number(item?.level);
      if (!Number.isFinite(languageId) || !Number.isFinite(levelId)) return null;

      const languageLabel = languageNamesById[languageId] ?? `Język #${languageId}`;
      const levelLabel = LANGUAGE_LEVEL[levelId as LanguageLevel] ?? `Poziom ${levelId}`;
      return `${languageLabel}: ${levelLabel}`;
    })
    .filter(Boolean) as string[];

  const technologyLines = (vacancy.requirements?.jobExperience?.technologyRequirements ?? [])
    .filter(Boolean)
    .map((item) => getTechnologyLabel(item as TechnologyRequirementLike, technologyNamesById));

  const educationLine = (() => {
    const education = vacancy.requirements?.education;
    if (!education) return "";

    const type =
      typeof education.educationType === "number"
        ? EDUCATION_TYPE[education.educationType as EducationType] ?? `Typ ${education.educationType}`
        : "—";

    const degree =
      typeof education.degree === "number" ? DEGREE[education.degree as Degree] ?? `Stopień ${education.degree}` : "—";

    return `Wykształcenie: ${type}, stopień: ${degree}`;
  })();

  return (
    <Box sx={{ flex: 1, bgcolor: "background.default", p: { xs: 2, md: 3 } }}>
      <Stack gap={2}>
        <Paper elevation={0} className="glass" sx={{ p: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={1.5}>
            <Stack gap={0.75} sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 900, fontSize: 18 }} noWrap title={title}>
                {title}
              </Typography>

              <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap" sx={{ color: "text.secondary" }}>
                <Stack direction="row" gap={0.5} alignItems="center">
                  <WorkOutlineRoundedIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2" color="text.secondary">
                    {workTypeLabel} • {requiredYearsLabel}
                  </Typography>
                </Stack>

                <Divider orientation="vertical" flexItem />

                <Stack direction="row" gap={0.5} alignItems="center">
                  <PlaceRoundedIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2" color="text.secondary">
                    {locationLabel}
                  </Typography>
                </Stack>

                <Divider orientation="vertical" flexItem />

                <Typography variant="body2" color="text.secondary">
                  Firma:{" "}
                  <Typography component="span" sx={{ fontWeight: 800, color: "text.primary" }}>
                    {company?.name ?? "—"}
                  </Typography>
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
              <Button variant="contained" color="warning" onClick={handleApply}>
                Aplikuj
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Stack direction={{ xs: "column", md: "row" }} alignItems="flex-start" gap={2}>
          <Stack gap={2} sx={{ flex: 2, minWidth: 0 }}>
            <Paper elevation={0} className="section" sx={{ p: 2 }}>
              <Typography sx={{ fontWeight: 900, mb: 1 }}>Opis stanowiska</Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Paper>

            <Paper elevation={0} className="section" sx={{ p: 2 }}>
              <Typography sx={{ fontWeight: 900, mb: 1 }}>Wymagania</Typography>

              <Stack gap={1}>
                {requiredYears && requiredYears > 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Ogólne doświadczenie: min. {requiredYears} lat na podobnym stanowisku.
                  </Typography>
                ) : null}

                {languageLines.length ? (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={800} mb={0.25}>
                      Języki
                    </Typography>
                    <Stack component="ul" sx={{ pl: 2, m: 0 }} gap={0.25}>
                      {languageLines.map((line, index) => (
                        <Typography key={`${line}-${index}`} component="li" variant="body2" color="text.secondary">
                          {line}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                ) : null}

                {technologyLines.length ? (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={800} mb={0.25}>
                      Technologie
                    </Typography>
                    <Stack component="ul" sx={{ pl: 2, m: 0 }} gap={0.25}>
                      {technologyLines.map((line, index) => (
                        <Typography key={`${line}-${index}`} component="li" variant="body2" color="text.secondary">
                          {line}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                ) : null}

                {educationLine ? (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={800} mb={0.25}>
                      Wykształcenie
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {educationLine}
                    </Typography>
                  </Box>
                ) : null}

                {!requiredYears && !languageLines.length && !technologyLines.length && !educationLine ? (
                  <Typography variant="body2" color="text.secondary">
                    Brak zdefiniowanych wymagań.
                  </Typography>
                ) : null}
              </Stack>
            </Paper>
          </Stack>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper elevation={0} className="section" sx={{ p: 2 }}>
              <Typography sx={{ fontWeight: 900, mb: 1 }}>Szczegóły</Typography>

              <Stack gap={0.75}>
                <Typography variant="body2" color="text.secondary">
                  Firma:{" "}
                  <Typography component="span" sx={{ fontWeight: 800, color: "text.primary" }}>
                    {company?.name ?? "—"}
                  </Typography>
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Typ pracy:{" "}
                  <Typography component="span" sx={{ fontWeight: 800, color: "text.primary" }}>
                    {workTypeLabel}
                  </Typography>
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Lokalizacja:{" "}
                  <Typography component="span" sx={{ fontWeight: 800, color: "text.primary" }}>
                    {locationLabel}
                  </Typography>
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Wynagrodzenie:{" "}
                  <Typography component="span" sx={{ fontWeight: 800, color: "text.primary" }}>
                    {salaryLabel}
                  </Typography>
                </Typography>
              </Stack>

              <Divider sx={{ my: 1.5 }} />

              <Button variant="contained" color="warning" onClick={handleApply} fullWidth>
                Aplikuj
              </Button>

              <Typography variant="caption" sx={{ mt: 1, display: "block", color: "text.secondary" }}>
                Jeśli nie masz konta kandydata — zaloguj się/załóż konto, aby aplikować.
              </Typography>
            </Paper>

            <GuestApplyResumeDialog
              open={isApplyOpen}
              onClose={() => setIsApplyOpen(false)}
              redirectPath={location.pathname}
              vacancyId={vacancyId}
            />
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}