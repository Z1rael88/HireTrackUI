import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { useGetVacancyByIdQuery } from "../api/vacanciesApi.ts";
import { useGetResumeByVacancyIdQuery } from "../api/resumesApi.ts";
import { useGetOverallStatisticsByVacancyIdQuery } from "../api/statisticsApi.ts";

import type { OverallStatDto, ResumeDto, VacancyDto } from "../types/statistics.ts";

export type FilterKey = "all" | "high" | "mid" | "low";
export type ViewMode = "cards" | "bubbles";

export type ResumeStatUi = {
  resumeId: number;
  name: string;
  email: string;
  fit: number;
  highlights: string[];
  risks: string[];
};

const EMPTY_RESUMES: ResumeDto[] = [];
const EMPTY_STATS: OverallStatDto[] = [];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  }
  return null;
}

function getByPath(root: unknown, path: string[]): unknown {
  let current: unknown = root;

  for (const key of path) {
    if (!isRecord(current)) return undefined;
    current = current[key];
  }

  return current;
}

function getFirstArrayByPaths(root: unknown, paths: string[][]): unknown[] {
  for (const path of paths) {
    const value = getByPath(root, path);
    if (Array.isArray(value)) return value;
  }
  return [];
}

function extractTechName(value: unknown): string | null {
  if (!isRecord(value)) return null;

  const directName = asString(value["name"])?.trim();
  if (directName) return directName;

  const dto = value["technologyTypeDto"];
  if (isRecord(dto)) {
    const dtoName = asString(dto["name"])?.trim();
    if (dtoName) return dtoName;
  }

  const type = value["technologyType"];
  if (isRecord(type)) {
    const typeName = asString(type["name"])?.trim();
    if (typeName) return typeName;
  }

  const fallback = asString(value["technologyTypeName"])?.trim();
  return fallback || null;
}

function extractYears(value: unknown): number {
  if (!isRecord(value)) return 0;
  return asNumber(value["yearsOfExperience"]) ?? 0;
}

export function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function initials(fullName: string) {
  const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "K";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase();
}

export function getLocation(address?: VacancyDto["address"] | null) {
  const addressObj = address as unknown;
  const city = isRecord(addressObj) ? asString(addressObj["city"]) ?? "" : "";
  const country = isRecord(addressObj) ? asString(addressObj["country"]) ?? "" : "";
  return [city, country].filter(Boolean).join(", ") || "—";
}

export function getWorkTypeLabel(workType: unknown, labels: Record<number, string>): string {
  const list = Array.isArray(workType) ? workType : workType != null ? [workType] : [];

  const mapped = list
    .map(asNumber)
    .filter((value): value is number => value != null)
    .map((value) => labels[value] ?? `Typ ${value}`);

  return mapped.length ? mapped.join(", ") : "—";
}

export function getVacancyTech(vacancy?: VacancyDto | null) {
  const techRequirements = getFirstArrayByPaths(vacancy, [
    ["requirements", "jobExperience", "technologyRequirements"],
    ["requirements", "jobExperienceRequirement", "technologyRequirements"],
    ["jobExperienceRequirement", "technologyRequirements"],
    ["requirements", "technologyRequirements"]
  ]);

  const names: string[] = [];
  for (const item of techRequirements) {
    const name = extractTechName(item);
    if (name) names.push(name);
  }

  return Array.from(new Set(names)).slice(0, 8);
}

export function getResumeHighlights(resume: ResumeDto): string[] {
  const jobExperiences = getFirstArrayByPaths(resume, [["jobExperiences"], ["experiences"]]);
  const yearsByName = new Map<string, number>();

  for (const experience of jobExperiences) {
    const technologies = getFirstArrayByPaths(experience, [["technologies"], ["technologyRequests"], ["tech"]]);

    for (const tech of technologies) {
      const name = extractTechName(tech);
      if (!name) continue;

      const years = extractYears(tech);
      const current = yearsByName.get(name) ?? 0;
      yearsByName.set(name, Math.max(current, years));
    }
  }

  return [...yearsByName.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name)
    .slice(0, 3);
}

export function getResumeRisks(statistics?: OverallStatDto): string[] {
  if (!statistics) return [];

  const total = Number(statistics.totalStatistics?.totalMatchPercent ?? NaN);
  if (!Number.isFinite(total)) return [];
  if (total === 0) return ["Brak dopasowania"];

  const education = Number(statistics.educationStatistics?.educationMatchPercent ?? 1);
  const experience = Number(statistics.experienceStatistics?.experienceMatchPercent ?? 1);
  const languages = Number(statistics.languageLevelStatistics?.matchPercent ?? 1);

  const risks: string[] = [];
  if (Number.isFinite(education) && education < 1) risks.push("Edukacja");
  if (Number.isFinite(experience) && experience < 1) risks.push("Doświadczenie");
  if (Number.isFinite(languages) && languages < 1) risks.push("Języki");

  return risks;
}

function normalizeFitPercent(totalMatchPercent: unknown): number {
  const raw = asNumber(totalMatchPercent) ?? 0;
  return clampPercent(raw <= 1 ? raw * 100 : raw);
}

function getCandidateName(resume: ResumeDto): string {
  const firstName = resume.candidate?.firstname ?? "";
  const lastName = resume.candidate?.lastname ?? "";
  return `${firstName} ${lastName}`.trim() || "—";
}

function getCandidateEmail(resume: ResumeDto): string {
  return String(resume.candidate?.email ?? "—");
}

export function useHrVacancyStatisticsData() {
  const params = useParams();
  const paramsRecord = params as Record<string, string | undefined>;
  const vacancyIdParam = paramsRecord.vacancyId ?? paramsRecord.id;

  const vacancyIdNum = Number(vacancyIdParam);
  const hasVacancyId = Number.isFinite(vacancyIdNum) && vacancyIdNum > 0;

  const [filter, setFilter] = useState<FilterKey>("all");
  const [sortDesc, setSortDesc] = useState(true);
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<string | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<number>(0);

  const vacancyQuery = useGetVacancyByIdQuery(vacancyIdNum, { skip: !hasVacancyId });
  const resumesQuery = useGetResumeByVacancyIdQuery(vacancyIdNum, { skip: !hasVacancyId });
  const statsQuery = useGetOverallStatisticsByVacancyIdQuery(vacancyIdNum, { skip: !hasVacancyId });

  const vacancy = (vacancyQuery.data ?? null) as VacancyDto | null;

  const resumes = Array.isArray(resumesQuery.data) ? (resumesQuery.data as ResumeDto[]) : EMPTY_RESUMES;
  const overallStats = Array.isArray(statsQuery.data) ? (statsQuery.data as OverallStatDto[]) : EMPTY_STATS;

  const statsByResumeId = useMemo(() => {
    const map = new Map<number, OverallStatDto>();
    for (const statistics of overallStats) map.set(Number(statistics.resumeId), statistics);
    return map;
  }, [overallStats]);

  const candidates: ResumeStatUi[] = useMemo(() => {
    return resumes.map((resumeItem) => {
      const resumeId = Number(resumeItem.id);
      const statistics = statsByResumeId.get(resumeId);

      return {
        resumeId,
        name: getCandidateName(resumeItem),
        email: getCandidateEmail(resumeItem),
        fit: normalizeFitPercent(statistics?.totalStatistics?.totalMatchPercent),
        highlights: getResumeHighlights(resumeItem),
        risks: getResumeRisks(statistics)
      };
    });
  }, [resumes, statsByResumeId]);

  useEffect(() => {
    if (selectedResumeId) return;
    if (candidates.length) setSelectedResumeId(candidates[0].resumeId);
  }, [candidates, selectedResumeId]);

  const stats = useMemo(() => {
    let high = 0;
    let mid = 0;
    let low = 0;
    let sum = 0;
    let top = 0;

    for (const candidate of candidates) {
      const fit = candidate.fit;
      sum += fit;
      if (fit > top) top = fit;

      if (fit >= 70) high += 1;
      else if (fit >= 50) mid += 1;
      else low += 1;
    }

    const total = candidates.length;
    const avg = total ? Math.round(sum / total) : 0;

    return { total, high, mid, low, avg, top };
  }, [candidates]);

  const topCandidates = useMemo(() => {
    return [...candidates].sort((a, b) => b.fit - a.fit).slice(0, 3);
  }, [candidates]);

  const topCandidateLabel = useMemo(() => {
    const top = topCandidates[0];
    return top ? `${top.fit}% • ${top.name}` : "—";
  }, [topCandidates]);

  const frequentRisks = useMemo(() => {
    const counts = new Map<string, number>();

    for (const candidate of candidates) {
      for (const risk of candidate.risks) {
        counts.set(risk, (counts.get(risk) ?? 0) + 1);
      }
    }

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, count]) => ({ label, count }));
  }, [candidates]);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    const base = candidates.filter((candidate) => {
      const fit = candidate.fit;

      if (filter === "high" && fit < 70) return false;
      if (filter === "mid" && (fit < 50 || fit >= 70)) return false;
      if (filter === "low" && fit >= 50) return false;

      if (riskFilter && !candidate.risks.includes(riskFilter)) return false;
      if (!search) return true;

      return (
        candidate.name.toLowerCase().includes(search) ||
        candidate.email.toLowerCase().includes(search) ||
        candidate.highlights.some((item) => item.toLowerCase().includes(search)) ||
        candidate.risks.some((item) => item.toLowerCase().includes(search))
      );
    });

    return base.sort((a, b) => (sortDesc ? b.fit - a.fit : a.fit - b.fit));
  }, [candidates, filter, query, riskFilter, sortDesc]);

  const selected = useMemo(() => {
    return candidates.find((candidate) => candidate.resumeId === selectedResumeId) ?? null;
  }, [candidates, selectedResumeId]);

  const loading = vacancyQuery.isLoading || resumesQuery.isLoading || statsQuery.isLoading;

  return {
    vacancyIdNum,
    hasVacancyId,
    filter,
    setFilter,
    sortDesc,
    setSortDesc,
    query,
    setQuery,
    riskFilter,
    setRiskFilter,
    selectedResumeId,
    setSelectedResumeId,
    vacancy,
    candidates,
    stats,
    topCandidates,
    topCandidateLabel,
    frequentRisks,
    filtered,
    selected,
    loading
  };
}