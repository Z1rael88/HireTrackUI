import {useState, type ReactNode} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {
    Avatar,
    Box,
    Button,
    Chip,
    Divider,
    InputAdornment,
    LinearProgress,
    Paper,
    Stack,
    TextField,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import {toast} from "react-toastify";

import {useGetVacancyByIdQuery, useDeleteVacancyMutation} from "../../../api/vacanciesApi";
import {useGetCompanyByIdQuery} from "../../../api/companiesApi";
import {useGetCrmTechnologyTypesQuery, useGetCrmLanguagesQuery} from "../../../api/crmApi";
import {useGetResumeByVacancyIdQuery} from "../../../api/resumesApi";

import type {ResumeResponse} from "../../../types/resume";
import type {CandidateDto, TechnologyRequirementDto} from "../../../types/common";
import type {VacancyResponse} from "../../../types/vacancy";
import type {CrmNamedItem} from "../../../types/crm";
import type {ResumeStatus} from "../../../types/enums";
import {
    DEGREE,
    EDUCATION_TYPE,
    LANGUAGE_LEVEL,
    RESUME_STATUS,
    RESUME_STATUS_COLOR,
    WORK_TYPE
} from "../../../types/enumLabels";

type VacancyCandidate = {
    resumeId: number;
    name: string;
    email: string;
    yearsOfExperience: number | null;
    expectedSalary: number | null;
    status: ResumeStatus | null;
};

type TechDtoLike = { id?: number | string | null; name?: string | null };

type TechRequirementLike = TechnologyRequirementDto & {
    technologyTypeId?: number | string | null;
    technologyTypeDto?: TechDtoLike | null;
    yearsOfExperience?: number | null;
};

const toDict = (items: CrmNamedItem[]) =>
    items.reduce((acc, item) => {
        acc[item.id] = item.name;
        return acc;
    }, {} as Record<number, string>);

const yearsSuffixPl = (years: number) => {
    if (years === 1) return "rok";
    if (years >= 2 && years <= 4) return "lata";
    return "lat";
};

const mapResumeToCandidate = (resume: ResumeResponse): VacancyCandidate => {
    const candidate = resume.candidate as CandidateDto | undefined;
    const fullName = `${candidate?.firstname ?? ""} ${candidate?.lastname ?? ""}`.trim() || "Kandydat";

    return {
        resumeId: Number(resume.id),
        name: fullName,
        email: candidate?.email ?? "",
        yearsOfExperience: typeof resume.yearsOfExperience === "number" ? resume.yearsOfExperience : null,
        expectedSalary: typeof resume.expectedSalary === "number" ? resume.expectedSalary : null,
        status: typeof resume.status === "number" ? (resume.status as ResumeStatus) : null
    };
};

const getWorkTypeLabel = (workType: unknown) => {
    const labels = WORK_TYPE as Record<number, string>;
    const raw = Array.isArray(workType) ? workType : workType == null ? [] : [workType];
    const ids = raw.map(Number).filter(Number.isFinite);
    return ids.length ? ids.map((id) => labels[id] ?? String(id)).join(", ") : "—";
};

const getTechnologyLabel = (requirement: TechRequirementLike, technologyNamesById: Record<number, string>) => {
    const nameFromApi = String(requirement.name ?? "").trim();

    const typeIdRaw = requirement.technologyTypeId ?? requirement.technologyTypeDto?.id;
    const typeId = Number(typeIdRaw);
    const nameFromDict = Number.isFinite(typeId) ? technologyNamesById[typeId] : undefined;

    const nameFromDto = String(requirement.technologyTypeDto?.name ?? "").trim();

    const baseName = nameFromApi || nameFromDto || nameFromDict || "Technologia";
    const years = Number(requirement.yearsOfExperience);

    return Number.isFinite(years) && years > 0
        ? `${baseName}: min. ${years} ${yearsSuffixPl(years)} doświadczenia`
        : baseName;
};

function Section({title, children}: { title: string; children: ReactNode }) {
    return (
        <Paper elevation={0} className="section" sx={{p: 2}}>
            <Typography fontWeight={900} mb={1}>
                {title}
            </Typography>
            {children}
        </Paper>
    );
}

function EmptyDashed({title, text}: { title: string; text: string }) {
    return (
        <Paper elevation={0} className="section" sx={{p: 4, textAlign: "center", borderStyle: "dashed"}}>
            <Typography fontWeight={900} mb={1}>
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {text}
            </Typography>
        </Paper>
    );
}

function DetailRow({label, value}: { label: string; value: string }) {
    return (
        <Stack direction="row" gap={0.5} sx={{minWidth: 0, flexWrap: "wrap"}}>
            <Typography variant="body2" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="body2" fontWeight={800}>
                {value}
            </Typography>
        </Stack>
    );
}

function BulletLines({title, lines}: { title: string; lines: string[] }) {
    if (!lines.length) return null;

    return (
        <Box>
            <Typography variant="subtitle2" fontWeight={800} mb={0.25}>
                {title}
            </Typography>
            <Stack component="ul" sx={{pl: 2, m: 0}} gap={0.25}>
                {lines.map((line) => (
                    <Typography key={line} component="li" variant="body2" color="text.secondary">
                        {line}
                    </Typography>
                ))}
            </Stack>
        </Box>
    );
}

export default function HrVacancyDetailsPage() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();

    const vacancyId = Number(id);
    const isValidVacancyId = Number.isFinite(vacancyId) && vacancyId > 0;

    const {data: vacancyRaw, isLoading, isError} = useGetVacancyByIdQuery(vacancyId, {skip: !isValidVacancyId});
    const vacancy = vacancyRaw as VacancyResponse | undefined;

    const companyId = vacancy?.companyId ?? null;
    const {data: company} = useGetCompanyByIdQuery(companyId ?? 0, {skip: companyId == null});

    const {data: technologyTypes = []} = useGetCrmTechnologyTypesQuery();
    const {data: languages = []} = useGetCrmLanguagesQuery();

    const technologyNamesById = toDict(technologyTypes as CrmNamedItem[]);
    const languageNamesById = toDict(languages as CrmNamedItem[]);

    const [deleteVacancy, {isLoading: isDeleting}] = useDeleteVacancyMutation();

    const {data: resumesByVacancy, isLoading: isCandidatesLoading} = useGetResumeByVacancyIdQuery(vacancyId, {
        skip: !isValidVacancyId
    });

    const resumes: ResumeResponse[] = Array.isArray(resumesByVacancy)
        ? (resumesByVacancy as ResumeResponse[])
        : resumesByVacancy
            ? ([resumesByVacancy] as ResumeResponse[])
            : [];

    const candidates = resumes.map(mapResumeToCandidate);

    const [candidateSearch, setCandidateSearch] = useState("");
    const searchQuery = candidateSearch.trim().toLowerCase();

    const filteredCandidates = searchQuery
        ? candidates.filter((candidate) => candidate.name.toLowerCase().includes(searchQuery) || candidate.email.toLowerCase().includes(searchQuery))
        : candidates;

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link skopiowany.");
        } catch {
            toast.error("Nie udało się skopiować linku.");
        }
    };

    const handleDelete = async () => {
        if (!vacancy?.id) return;

        try {
            await deleteVacancy(Number(vacancy.id)).unwrap();
            toast.success("Ogłoszenie zostało usunięte.");
            navigate("/hr/vacancies");
        } catch (error) {
            toast.error((error as {
                data?: { message?: string }
            })?.data?.message || "Nie udało się usunąć ogłoszenia.");
        }
    };

    if (!isValidVacancyId) {
        return (
            <Paper elevation={0} className="section" sx={{p: 4, textAlign: "center"}}>
                <Typography fontWeight={900} mb={1}>
                    Nie znaleziono ogłoszenia
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Sprawdź adres URL lub wróć do listy.
                </Typography>
                <Box mt={2}>
                    <Button component={Link} to="/hr/vacancies" variant="contained" color="warning">
                        Wróć do listy
                    </Button>
                </Box>
            </Paper>
        );
    }

    if (isLoading) {
        return (
            <Paper elevation={0} className="section" sx={{p: 2}}>
                <LinearProgress/>
            </Paper>
        );
    }

    if (isError || !vacancy) {
        return (
            <Paper elevation={0} className="section" sx={{p: 4, textAlign: "center"}}>
                <Typography fontWeight={900} mb={1}>
                    Nie znaleziono ogłoszenia
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Sprawdź adres URL lub wróć do listy.
                </Typography>
                <Box mt={2}>
                    <Button component={Link} to="/hr/vacancies" variant="contained" color="warning">
                        Wróć do listy
                    </Button>
                </Box>
            </Paper>
        );
    }

    const requirements = vacancy.requirements;

    const title = vacancy.name ?? "—";
    const description = vacancy.description ?? "—";
    const workTypeLabel = getWorkTypeLabel(vacancy.workType);
    const salaryLabel = Number.isFinite(vacancy.salary) && vacancy.salary > 0 ? `${vacancy.salary} PLN` : "—";

    const city = vacancy.address?.city ?? "";
    const country = vacancy.address?.country ?? "";
    const locationLabel = city && country ? `${city}, ${country}` : city || country || "—";

    const requiredYears = requirements?.yearsOfExperience ?? null;
    const requiredYearsLabel = requiredYears && requiredYears > 0 ? `Min. ${requiredYears} lat doświadczenia` : "—";

    const addDate = vacancy.addDate ?? "—";
    const endDate = vacancy.endDate ?? "—";

    const languageLines = (requirements?.languageLevels ?? [])
        .map((level) => {
            const languageId = Number(level?.language);
            const languageLevelId = Number(level?.level);
            if (!Number.isFinite(languageId) || !Number.isFinite(languageLevelId)) return null;

            const languageName = languageNamesById[languageId] ?? `Język #${languageId}`;
            const levelName = (LANGUAGE_LEVEL as Record<number, string>)[languageLevelId] ?? `Poziom ${languageLevelId}`;
            return `${languageName}: ${levelName}`;
        })
        .filter(Boolean) as string[];

    const technologyLines = (requirements?.jobExperience?.technologyRequirements ?? [])
        .filter(Boolean)
        .map((item) => getTechnologyLabel(item as TechRequirementLike, technologyNamesById));

    const education = requirements?.education;
    const educationLine = education
        ? `Wykształcenie: ${(EDUCATION_TYPE as Record<number, string>)[education.educationType] ?? `Typ ${education.educationType}`}, stopień: ${
            (DEGREE as Record<number, string>)[education.degree] ?? `Stopień ${education.degree}`
        }`
        : "";

    const tags = Array.from(
        new Set(
            (requirements?.jobExperience?.technologyRequirements ?? [])
                .filter(Boolean)
                .map((item) => {
                    const requirement = item as TechRequirementLike;
                    const nameFromApi = String(requirement.name ?? "").trim();
                    const nameFromDto = String(requirement.technologyTypeDto?.name ?? "").trim();
                    const typeId = Number(requirement.technologyTypeId ?? requirement.technologyTypeDto?.id);
                    const nameFromDict = Number.isFinite(typeId) ? technologyNamesById[typeId] : "";
                    return nameFromApi || nameFromDto || nameFromDict || "";
                })
                .filter(Boolean)
        )
    ).slice(0, 6);

    const companyInitials = (company?.name ?? "—").slice(0, 2).toUpperCase();

    return (
        <Stack gap={2}>
            <Paper elevation={0} className="glass" sx={{p: 2}}>
                <Stack
                    direction={{xs: "column", md: "row"}}
                    alignItems={{xs: "flex-start", md: "center"}}
                    justifyContent="space-between"
                    gap={1.5}
                >
                    <Stack direction="row" alignItems="center" gap={1.25}>
                        <Avatar
                            variant="rounded"
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 3,
                                bgcolor: "secondary.main",
                                color: "secondary.contrastText",
                                fontWeight: 900
                            }}
                        >
                            {companyInitials}
                        </Avatar>

                        <Box sx={{minWidth: 0}}>
                            <Stack direction="row" alignItems="center" gap={1} sx={{minWidth: 0}}>
                                <Typography fontWeight={900} fontSize={18} noWrap title={title}>
                                    {title}
                                </Typography>
                                <Chip size="small" label="Aktywna" color="success" variant="outlined"
                                      sx={{fontWeight: 800}}/>
                            </Stack>

                            <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap" color="text.secondary">
                                <Stack direction="row" gap={0.5} alignItems="center">
                                    <WorkOutlineRoundedIcon sx={{fontSize: 18}}/>
                                    <Typography variant="body2" color="text.secondary">
                                        {workTypeLabel} • {requiredYearsLabel}
                                    </Typography>
                                </Stack>

                                <Divider orientation="vertical" flexItem/>

                                <Stack direction="row" gap={0.5} alignItems="center">
                                    <PlaceRoundedIcon sx={{fontSize: 18}}/>
                                    <Typography variant="body2" color="text.secondary">
                                        {locationLabel}
                                    </Typography>
                                </Stack>

                                <Divider orientation="vertical" flexItem/>

                                <Stack direction="row" gap={0.5} alignItems="center">
                                    <GroupRoundedIcon sx={{fontSize: 18}}/>
                                    <Typography variant="body2" color="text.secondary">
                                        {candidates.length} aplikacji
                                    </Typography>
                                </Stack>
                            </Stack>

                            {tags.length ? (
                                <Stack direction="row" gap={0.5} flexWrap="wrap" sx={{mt: 0.5}}>
                                    {tags.map((tag) => (
                                        <Chip key={tag} size="small" label={tag} variant="outlined"
                                              sx={{fontWeight: 700}}/>
                                    ))}
                                </Stack>
                            ) : null}
                        </Box>
                    </Stack>

                    <Stack direction="row" gap={1} flexWrap="wrap">
                        <Button variant="contained" color="warning" onClick={handleCopyLink}
                                startIcon={<ContentCopyRoundedIcon/>}>
                            Kopiuj link
                        </Button>

                        <Button component={Link} to={`/hr/vacancies/${vacancy.id}/edit`} variant="outlined"
                                startIcon={<EditRoundedIcon/>}>
                            Edytuj
                        </Button>

                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteOutlineRoundedIcon/>}
                            onClick={() => setIsDeleteDialogOpen(true)}
                            disabled={isDeleting}
                        >
                            Usuń
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            <Stack direction={{xs: "column", md: "row"}} alignItems="flex-start" gap={2}>
                <Box sx={{flex: 2, minWidth: 0}}>
                    <Section title="Opis stanowiska">
                        <Typography variant="body2" color="text.secondary">
                            {description}
                        </Typography>
                    </Section>

                    <Box mt={2}>
                        <Section title="Wymagania">
                            <Stack gap={1}>
                                {requiredYears && requiredYears > 0 ? (
                                    <Typography variant="body2" color="text.secondary">
                                        Ogólne doświadczenie: min. {requiredYears} lat na podobnym stanowisku.
                                    </Typography>
                                ) : null}

                                <BulletLines title="Języki" lines={languageLines}/>
                                <BulletLines title="Technologie" lines={technologyLines}/>

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
                        </Section>
                    </Box>
                </Box>

                <Box sx={{flex: 1, minWidth: 0}}>
                    <Section title="Szczegóły">
                        <Stack gap={0.75}>
                            <DetailRow label="Firma:" value={company?.name ?? "—"}/>
                            <DetailRow label="Typ pracy:" value={workTypeLabel}/>
                            <DetailRow label="Lokalizacja:" value={locationLabel}/>
                            <DetailRow label="Wynagrodzenie:" value={salaryLabel}/>
                            <DetailRow label="Dodano:" value={addDate}/>
                            <DetailRow label="Data zakończenia:" value={endDate}/>
                            <DetailRow label="Aplikacje:" value={String(candidates.length)}/>
                        </Stack>
                    </Section>
                </Box>
            </Stack>

            <Paper elevation={0} className="section" sx={{p: {xs: 2, md: 2.5}}}>
                <Stack
                    direction={{xs: "column", sm: "row"}}
                    alignItems={{xs: "flex-start", sm: "center"}}
                    justifyContent="space-between"
                    gap={1}
                    sx={{mb: 1}}
                >
                    <Typography fontWeight={900}>Kandydaci</Typography>

                    {candidates.length ? (
                        <TextField
                            size="small"
                            placeholder="Szukaj kandydatów…"
                            value={candidateSearch}
                            onChange={(event) => setCandidateSearch(event.target.value)}
                            sx={{width: {xs: "100%", sm: 260}}}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchRoundedIcon/>
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />
                    ) : null}
                </Stack>

                {isCandidatesLoading ? (
                    <Box sx={{py: 2}}>
                        <LinearProgress/>
                    </Box>
                ) : !filteredCandidates.length ? (
                    <EmptyDashed title="Brak kandydatów" text="Aktualnie brak aplikacji na tę ofertę."/>
                ) : (
                    <Stack gap={1.25}>
                        {filteredCandidates.map((candidate) => (
                            <Paper key={candidate.resumeId} elevation={0} className="glass-soft" sx={{p: 1.5}}>
                                <Stack
                                    direction={{xs: "column", sm: "row"}}
                                    alignItems={{xs: "flex-start", sm: "center"}}
                                    justifyContent="space-between"
                                    gap={1}
                                >
                                    <Stack gap={0.25}>
                                        <Typography variant="subtitle1" fontWeight={800}>
                                            {candidate.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {candidate.email}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Doświadczenie:{" "}
                                            {candidate.yearsOfExperience != null
                                                ? `${candidate.yearsOfExperience} ${yearsSuffixPl(candidate.yearsOfExperience)}`
                                                : "brak danych"}
                                            {" • "}
                                            Oczekiwania: {candidate.expectedSalary != null ? `${candidate.expectedSalary} PLN` : "brak danych"}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                                        {candidate.status != null ? (
                                            <Chip
                                                size="small"
                                                label={RESUME_STATUS[candidate.status] ?? "Status"}
                                                color={RESUME_STATUS_COLOR[candidate.status] ?? "default"}
                                                sx={{fontWeight: 800}}
                                            />
                                        ) : null}

                                        <Button
                                            component={Link}
                                            to={`/hr/vacancies/${vacancy.id}/candidates/${candidate.resumeId}`}
                                            variant="contained"
                                            color="warning"
                                            size="small"
                                        >
                                            Szczegóły
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                )}
            </Paper>

            <Dialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                maxWidth="xs"
                fullWidth
                disableScrollLock
            >
                <DialogTitle sx={{fontWeight: 900}}>Usuń ofertę</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        Na pewno chcesz usunąć tę ofertę? Tej operacji nie można cofnąć.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
                        Anuluj
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={async () => {
                            setIsDeleteDialogOpen(false);
                            await handleDelete();
                        }}
                        disabled={isDeleting}
                    >
                        Usuń
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}