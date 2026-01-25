import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useGetResumeByVacancyIdQuery } from "../api/resumesApi.ts";
import { useGetOverallStatisticsByVacancyIdQuery } from "../api/statisticsApi.ts";
import { useGetCrmTechnologyTypesQuery } from "../api/crmApi.ts";
import { useSendGenericEmailMutation } from "../api/emailsApi.ts";

import type { ResumeResponse } from "../types/resume.ts";
import type { CandidateDto } from "../types/common.ts";
import type { OverallStatDto } from "../types/statistics.ts";
import { LANGUAGE, LANGUAGE_LEVEL } from "../types/enumLabels.ts";
import { COLORS } from "../style/ColorTheme.ts";

type RequirementItem = { label: string; scorePercent: number; note: string };
type Tone = "good" | "warn" | "bad";

type VacancyRef = { name?: string | null; title?: string | null };

type ResumeVm = ResumeResponse & {
  candidate?: CandidateDto | null;

  vacancy?: VacancyRef | null;
  vacancyDto?: VacancyRef | null;
  vacancyName?: string | null;
  vacancyTitle?: string | null;

  availability?: string | null;
  yearsOfExperience?: number | string | null;
  experienceYears?: number | string | null;

  languageLevels?: Array<{ language?: unknown; level?: unknown }> | null;

  jobExperiences?: Array<{
    technologies?: Array<{
      technologyTypeId?: number | string | null;
      technologyType?: { id?: number | string | null; name?: string | null } | null;
      technologyTypeDto?: { id?: number | string | null; name?: string | null } | null;
      name?: string | null;
    }> | null;
  }> | null;

  technologies?: Array<{
    name?: string | null;
    technologyType?: { name?: string | null } | null;
    technologyTypeDto?: { name?: string | null } | null;
  }> | null;

  skills?: Array<string | { name?: string | null }> | null;
};

const asText = (value: unknown) => String(value ?? "").trim();

const percent01To100 = (value: unknown) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  const percent = Math.round(numeric * 100);
  return Math.max(0, Math.min(100, percent));
};

const initials = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "K") + (parts[1]?.[0] ?? "")).toUpperCase();
};

const fitMeta = (fit: number, hasFit: boolean) => {
  if (!hasFit) return { label: "—", ringColor: COLORS.black, tone: "warn" as const };
  if (fit >= 70) return { label: "Wysokie", ringColor: COLORS.black, tone: "good" as const };
  if (fit >= 50) return { label: "Średnie", ringColor: COLORS.black, tone: "warn" as const };
  return { label: "Niskie", ringColor: COLORS.inputBorder, tone: "bad" as const };
};

const TRANSLATIONS: Array<[RegExp, string]> = [
  [/^Candidate work type does not match the vacancy requirements$/i, "Typ pracy kandydata nie spełnia wymagań oferty."],
  [/^Unfortunately candidate doesn't match any of the crucial parameters$/i, "Niestety kandydat nie spełnia żadnego z kluczowych wymagań."],
  [
    /^Candidate matches some of the crucial parameters, you can check summary for each of the parameters to decide$/i,
    "Kandydat spełnia część kluczowych wymagań — sprawdź podsumowania dla poszczególnych obszarów, aby podjąć decyzję."
  ],
  [
    /^Candidate matches most of the crucial parameters, you can check summary for each of the parameters to decide\. We would recommend this candidate for an interview$/i,
    "Kandydat spełnia większość kluczowych wymagań — sprawdź podsumowania dla poszczególnych obszarów, aby podjąć decyzję. Rekomendujemy zaproszenie kandydata na rozmowę."
  ],
  [
    /^Candidate exceeds crucial parameters\. We would recommend this candidate for an interview$/i,
    "Kandydat przewyższa kluczowe wymagania. Rekomendujemy zaproszenie kandydata na rozmowę."
  ],

  [/^No required technology experiences specified$/i, "Nie wskazano wymaganego doświadczenia technologicznego."],
  [/^Candidate does not match required experience\.$/i, "Kandydat nie spełnia wymaganego doświadczenia."],
  [/^Candidate meets experience requirements poorly\.$/i, "Kandydat słabo spełnia wymagania dotyczące doświadczenia."],
  [/^Candidate meets most experience requirements\.$/i, "Kandydat spełnia większość wymagań dotyczących doświadczenia."],
  [/^Candidate fully meets all experience requirements\.$/i, "Kandydat w pełni spełnia wymagania dotyczące doświadczenia."],
  [/^Candidate exceeds experience requirements\.$/i, "Kandydat przewyższa wymagania dotyczące doświadczenia."],
  [/^Unexpected result$/i, "Nieoczekiwany wynik."],
  [/^Aggregated experience across multiple roles\.$/i, "Zagregowane doświadczenie z wielu ról."],

  [/^No required languages specified$/i, "Nie określono wymaganych języków."],
  [/^Candidate does not match required languages\.$/i, "Kandydat nie spełnia wymaganych języków."],
  [/^Candidate matches all required languages perfectly\.$/i, "Kandydat idealnie spełnia wszystkie wymagane języki."],
  [/^Candidate matches poorly: only (\d+) languages matched\.$/i, "Kandydat spełnia wymagania językowe słabo: dopasowano tylko $1 języków."],
  [/^Candidate matches well: (\d+) languages matched \(not all\)\.$/i, "Kandydat dobrze spełnia wymagania językowe: dopasowano $1 języków (nie wszystkie)."],

  [
    /^Candidate education is critically below required:\s*(.+?)\s*\((.+?)\)\s*vs required\s*(.+?)\.$/i,
    "Wykształcenie kandydata jest krytycznie poniżej wymagań: $1 ($2) vs wymagane $3."
  ],
  [
    /^Candidate education is below required:\s*(.+?)\s*\((.+?)\)\s*vs required\s*(.+?)\s*\((.+?)\)\.$/i,
    "Wykształcenie kandydata jest poniżej wymagań: $1 ($2) vs wymagane $3 ($4)."
  ],
  [/^Candidate perfectly matches education requirement\s*\((.+?)\)\.$/i, "Kandydat idealnie spełnia wymagania edukacyjne ($1)."],
  [/^Candidate perfectly matches education requirement\s*\((.+?),\s*(.+?)\)\.$/i, "Kandydat idealnie spełnia wymagania edukacyjne ($1, $2)."],
  [
    /^Candidate exceeds education requirement:\s*(.+?)\s*\((.+?)\)\s*vs required\s*(.+?)\s*\((.+?)\)\.$/i,
    "Kandydat przewyższa wymagania edukacyjne: $1 ($2) vs wymagane $3 ($4)."
  ],
  [/^Candidate matches most of the crucial parameters,.*recommend this candidate for an interview$/i,
    "Kandydat spełnia większość kluczowych wymagań — sprawdź " +
    "podsumowania poszczególnych obszarów, aby podjąć decyzję. Rekomendujemy zaproszenie kandydata na rozmowę."]
];

const TOKEN_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bUniversity\b/g, "Studia wyższe"],
  [/\bOnlineCourse\b/g, "Kurs online"],
  [/\bOfflineCourse\b/g, "Kurs stacjonarny"],
  [/\bHighSchool\b/g, "Szkoła średnia"],
  [/\bCollege\b/g, "Kolegium"],

  [/\bBachelors\b/g, "Licencjat"],
  [/\bMasters\b/g, "Magister"],
  [/\bPhd\b/g, "Doktor"],

  [/\bBachelor\b/g, "Licencjat"],
  [/\bEngineer\b/g, "Inżynier"],
  [/\bMaster\b/g, "Magister"],
  [/\bDoctor\b/g, "Doktor"],
  [/\bAssociate\b/g, "Associate"]
];

const translateToPl = (raw: unknown) => {
  let text = asText(raw);
  if (!text) return "";

  text = text.replace(/doesnt/gi, "doesn't");

  for (const [re, repl] of TRANSLATIONS) {
    if (re.test(text)) {
      text = text.replace(re, repl);
      break;
    }
  }

  for (const [re, repl] of TOKEN_REPLACEMENTS) text = text.replace(re, repl);
  return text;
};

const candidateNameOf = (candidate?: CandidateDto | null) =>
  (`${candidate?.firstname ?? ""} ${candidate?.lastname ?? ""}`.trim() || "Kandydat");

const candidateEmailOf = (candidate?: CandidateDto | null) =>
  asText((candidate as { email?: unknown } | null)?.email);

const candidateLocationOf = (candidate?: CandidateDto | null) => {
  const address = (candidate as { address?: { city?: unknown; country?: unknown } | null } | null)?.address;
  const city = asText(address?.city);
  const country = asText(address?.country);
  return (city && country ? `${city}, ${country}` : city || country).trim();
};

const vacancyTitleFrom = (resume?: ResumeVm, fallback?: ResumeVm) => {
  const read = (r?: ResumeVm) =>
    asText(r?.vacancy?.name) ||
    asText(r?.vacancy?.title) ||
    asText(r?.vacancyName) ||
    asText(r?.vacancyTitle) ||
    asText(r?.vacancyDto?.name) ||
    asText(r?.vacancyDto?.title);

  return read(resume) || read(fallback) || "Oferta pracy";
};

const experienceLabel = (resume: ResumeVm) => {
  const yearsRaw = Number(resume.yearsOfExperience ?? resume.experienceYears ?? 0);
  const years = Number.isFinite(yearsRaw) && yearsRaw > 0 ? yearsRaw : 0;
  return years > 0 ? `${years} lat doświadczenia` : "Doświadczenie: —";
};

const languagesLabel = (resume: ResumeVm) => {
  const levels = Array.isArray(resume.languageLevels) ? resume.languageLevels : [];
  const out = levels.map((level) => {
    const langKey = level.language as keyof typeof LANGUAGE;
    const lvlKey = level.level as keyof typeof LANGUAGE_LEVEL;

    const lang = level.language != null ? LANGUAGE[langKey] ?? "Język" : "Język";
    const lvl = level.level != null ? LANGUAGE_LEVEL[lvlKey] ?? "" : "";

    return `${lang}${lvl ? ` (${lvl})` : ""}`;
  });

  return out.length ? out.join(" • ") : "—";
};

export function useResumeStatisticsUtils() {
  const { vacancyId: vacancyIdParam, resumeId: resumeIdParam } = useParams<{ vacancyId: string; resumeId: string }>();

  const vacancyId = Number(vacancyIdParam ?? 0);
  const resumeId = Number(resumeIdParam ?? 0);

  const hasValidParams = Number.isFinite(vacancyId) && vacancyId > 0 && Number.isFinite(resumeId) && resumeId > 0;

  const resumesQuery = useGetResumeByVacancyIdQuery(vacancyId, { skip: !hasValidParams });
  const statsQuery = useGetOverallStatisticsByVacancyIdQuery(vacancyId, { skip: !hasValidParams });

  const resumes = useMemo<ResumeVm[]>(() => {
    const data = resumesQuery.data;
    if (Array.isArray(data)) return data as ResumeVm[];
    return data ? ([data] as ResumeVm[]) : [];
  }, [resumesQuery.data]);

  const currentResume = useMemo(() => {
    if (!hasValidParams) return undefined;
    return resumes.find((item) => Number((item as { id?: unknown }).id) === resumeId);
  }, [hasValidParams, resumes, resumeId]);

  const candidate = currentResume?.candidate ?? undefined;

  const statsList = useMemo<OverallStatDto[]>(
    () => (Array.isArray(statsQuery.data) ? (statsQuery.data as OverallStatDto[]) : []),
    [statsQuery.data]
  );

  const statForResume = useMemo(
    () => statsList.find((item) => Number(item.resumeId) === resumeId),
    [statsList, resumeId]
  );

  const crmTechQuery = useGetCrmTechnologyTypesQuery();
  const techNameById = useMemo(() => {
    const map = new Map<number, string>();
    const list = Array.isArray(crmTechQuery.data) ? crmTechQuery.data : [];
    for (const item of list as Array<{ id?: number; name?: string | null }>) {
      const id = Number(item.id);
      if (Number.isFinite(id) && id > 0) map.set(id, asText(item.name) || `Technologia #${id}`);
    }
    return map;
  }, [crmTechQuery.data]);

  const [sendGenericEmail, sendState] = useSendGenericEmailMutation();

  const [inviteSent, setInviteSent] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteTo, setInviteTo] = useState("");
  const [inviteSubject, setInviteSubject] = useState("");
  const [inviteBody, setInviteBody] = useState("");

  useEffect(() => setInviteSent(false), [vacancyId, resumeId]);

  const candidateName = candidateNameOf(candidate);
  const candidateEmail = candidateEmailOf(candidate);
  const candidateLocation = candidateLocationOf(candidate);

  const vacancyTitle = vacancyTitleFrom(currentResume, resumes[0]);

  const fit = percent01To100(statForResume?.totalStatistics?.totalMatchPercent);
  const hasFit = statForResume?.totalStatistics?.totalMatchPercent != null;
  const meta = fitMeta(fit, hasFit);

  const summaryText =
    translateToPl(statForResume?.totalStatistics?.summaryDto?.totalSummary) ||
    (statsQuery.isLoading ? "Ładowanie statystyk…" : statsQuery.isError ? "Nie udało się pobrać statystyk." : "—");

  const requirements = useMemo<RequirementItem[]>(() => {
    const education = percent01To100(statForResume?.educationStatistics?.educationMatchPercent);
    const experience = percent01To100(statForResume?.experienceStatistics?.experienceMatchPercent);
    const languages = percent01To100(statForResume?.languageLevelStatistics?.matchPercent);

    const educationNote = translateToPl(
      statForResume?.educationStatistics?.educationSummary ??
      statForResume?.totalStatistics?.summaryDto?.educationSummary
    );

    const experienceNote = translateToPl(
      statForResume?.experienceStatistics?.experienceSummary ??
      statForResume?.totalStatistics?.summaryDto?.experienceSummary
    );

    const languagesNote = translateToPl(
      statForResume?.languageLevelStatistics?.languageLevelSummary ??
      statForResume?.totalStatistics?.summaryDto?.languageLevelSummary
    );

    return [
      { label: "Edukacja", scorePercent: education, note: educationNote || "—" },
      { label: "Doświadczenie", scorePercent: experience, note: experienceNote || "—" },
      { label: "Języki", scorePercent: languages, note: languagesNote || "—" }
    ];
  }, [statForResume]);

  const requirementsSorted = useMemo(
    () => [...requirements].sort((a, b) => b.scorePercent - a.scorePercent),
    [requirements]
  );

  const weakestRequirements = useMemo(
    () => [...requirements].sort((a, b) => a.scorePercent - b.scorePercent).slice(0, 2),
    [requirements]
  );

  const requirementCounters = useMemo(() => {
    const scores = requirementsSorted.map((r) => r.scorePercent);
    return {
      high: scores.filter((p) => p >= 70).length,
      mid: scores.filter((p) => p >= 50 && p < 70).length,
      low: scores.filter((p) => p < 50).length
    };
  }, [requirementsSorted]);

  const strengths = useMemo(
    () => requirements.filter((r) => r.scorePercent >= 70 && r.note !== "—").map((r) => r.note).slice(0, 6),
    [requirements]
  );

  const risks = useMemo(
    () => requirements.filter((r) => r.scorePercent < 50 && r.note !== "—").map((r) => r.note).slice(0, 6),
    [requirements]
  );

  const quickInsights = useMemo(() => {
    const best = requirementsSorted[0];
    const worst = requirementsSorted[requirementsSorted.length - 1];

    const items: Array<{ label: string; tone: Tone }> = [
      { label: hasFit ? `Dopasowanie: ${fit}%` : "Dopasowanie: —", tone: meta.tone }
    ];

    if (best?.label) items.push({ label: `Najmocniej: ${best.label}`, tone: "good" });
    if (worst?.label) items.push({ label: `Najsłabiej: ${worst.label}`, tone: "warn" });

    return items.slice(0, 5);
  }, [requirementsSorted, hasFit, fit, meta.tone]);

  const keySkills = useMemo(() => {
    if (!currentResume) return [];

    const unique = new Set<string>();
    const add = (value: unknown) => {
      const s = asText(value);
      if (s) unique.add(s);
    };

    const jobExperiences = Array.isArray(currentResume.jobExperiences) ? currentResume.jobExperiences : [];
    for (const job of jobExperiences) {
      const technologies = Array.isArray(job?.technologies) ? job.technologies : [];
      for (const tech of technologies) {
        const techId = Number(tech?.technologyTypeId ?? tech?.technologyType?.id ?? tech?.technologyTypeDto?.id);
        const fromDict = Number.isFinite(techId) ? techNameById.get(techId) : undefined;
        const fromApi = asText(tech?.technologyType?.name ?? tech?.technologyTypeDto?.name ?? tech?.name);
        add(fromDict || fromApi);
      }
    }

    const technologies = Array.isArray(currentResume.technologies) ? currentResume.technologies : [];
    for (const tech of technologies) add(tech?.name ?? tech?.technologyType?.name ?? tech?.technologyTypeDto?.name);

    const skills = Array.isArray(currentResume.skills) ? currentResume.skills : [];
    for (const skill of skills) add(typeof skill === "string" ? skill : skill?.name);

    return Array.from(unique).slice(0, 12);
  }, [currentResume, techNameById]);

  const experienceLabelText = currentResume ? experienceLabel(currentResume) : "Doświadczenie: —";
  const languagesText = currentResume ? languagesLabel(currentResume) : "—";
  const availability = asText(currentResume?.availability) || "Dostępność: —";

  const ringHex = !hasFit ? COLORS.black : fit >= 70 ? COLORS.black : fit >= 50 ? COLORS.black : COLORS.inputBorder;

  const canInvite = Boolean(candidateEmail && !inviteSent && !sendState.isLoading);

  const openInviteModal = () => {
    if (!candidateEmail) {
      toast.error("Brak email kandydata — nie można wysłać zaproszenia.");
      return;
    }

    setInviteTo(candidateEmail);
    setInviteSubject(`Zaproszenie na rozmowę — ${vacancyTitle}`);
    setInviteBody(
      `Cześć ${candidateName}!\n\n` +
      `Dziękujemy za aplikację na ofertę: ${vacancyTitle}.\n` +
      `Chcielibyśmy zaprosić Cię na rozmowę rekrutacyjną.\n\n` +
      `Link do spotkania (Teams): \n\n` +
      `Prosimy o odpowiedź z dostępnymi terminami.\n\n` +
      `Pozdrawiamy`
    );
    setInviteModalOpen(true);
  };

  const closeInviteModal = () => setInviteModalOpen(false);

  const confirmInviteSend = async () => {
    const to = inviteTo.trim();
    const subject = inviteSubject.trim();
    const body = inviteBody.trim();
    if (!to || !subject || !body) return;

    try {
      await sendGenericEmail({ to, subject, body }).unwrap();
      toast.success("Zaproszenie wysłane.");
      setInviteSent(true);
      setInviteModalOpen(false);
    } catch {
      toast.error("Nie udało się wysłać zaproszenia.");
    }
  };

  const copyToClipboard = async (value: string, label: string) => {
    if (!value.trim()) {
      toast.info("Brak wartości do skopiowania.");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      toast.info(`${label} skopiowano.`);
    } catch {
      toast.info("Nie udało się skopiować w tej przeglądarce.");
    }
  };

  const loading = resumesQuery.isLoading || statsQuery.isLoading;

  const error =
    !hasValidParams || (!loading && (resumesQuery.isError || statsQuery.isError || !currentResume || !candidate));

  const refetchAll = () => {
    if (!hasValidParams) return;
    resumesQuery.refetch();
    statsQuery.refetch();
    toast.info("Odświeżam dane…");
  };

  return {
    vacancyId,
    resumeId,
    hasValidParams,

    loading,
    error,
    refetchAll,

    resume: currentResume,
    candidate,

    candidateName,
    candidateEmail,
    candidateLocation,
    availability,

    vacancyTitle,

    fit,
    hasFit,
    meta,
    ringHex,

    experienceLabel: experienceLabelText,
    languagesText,
    keySkills,

    summaryText,
    requirements,
    requirementsSorted,
    weakestRequirements,
    requirementCounters,
    strengths,
    risks,
    quickInsights,

    inviteSent,
    canInvite,

    inviteModalOpen,
    inviteTo,
    inviteSubject,
    inviteBody,
    setInviteTo,
    setInviteSubject,
    setInviteBody,
    openInviteModal,
    closeInviteModal,
    confirmInviteSend,
    isSendingInvite: sendState.isLoading,

    initials,
    copyToClipboard
  };
}