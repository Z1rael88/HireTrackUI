import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Stack, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import type { RootState } from "../../../store/store";
import { useGetUserByUserIdQuery } from "../../../api/userApi";
import { useGetCompanyByIdQuery } from "../../../api/companiesApi";
import { useGetCrmLanguagesQuery, useGetCrmTechnologyTypesQuery } from "../../../api/crmApi";
import { useGetVacancyByIdQuery, useUpdateVacancyMutation } from "../../../api/vacanciesApi";

import type { CreateVacancyFormState, UpdateVacancyRequest, VacancyResponse } from "../../../types/vacancy";
import { INITIAL_CREATE_VACANCY_FORM } from "../../../types/vacancy";
import { COLORS } from "../../../style/ColorTheme";

import BasicInfoSection from "./create/BasicInfoSection";
import RequirementsSection from "./create/RequirementsSection";
import { toIsoDate, todayIso, toNumberArray, validateCreateVacancyForm } from "../../../utils/vacancyFormUtils.ts";

type ValidationErrors = Record<string, string>;

type CrmNamedItem = { id: number; name: string | null };

type ApiLanguageLevel = { language?: number | null; level?: number | null };

type ApiTechnologyRequirement = {
  yearsOfExperience?: number | null;
  technologyTypeId?: number | null;
  name?: string | null;
  technologyTypeDto?: { id?: number | null; name?: string | null } | null;
};

const normalizeName = (v: unknown) => String(v ?? "").trim().toLowerCase();

const toFormNumberOrEmpty = (v: unknown): number | "" => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : "";
};

const toFormYearsOrEmpty = (v: unknown): number | "" => {
  if (v === "" || v == null) return "";
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : "";
};

export default function HrEditVacancyPage() {
  const { vacancyId } = useParams<{ vacancyId?: string }>();
  const navigate = useNavigate();

  const vacancyIdNumber = vacancyId ? Number(vacancyId) : NaN;
  const vacancyIdOk = Number.isFinite(vacancyIdNumber) ? vacancyIdNumber : null;

  const rawUserId = useSelector((state: RootState) => state.user.id);
  const userId = rawUserId == null ? null : Number(rawUserId);
  const userIdOk = userId != null && Number.isFinite(userId) ? userId : null;

  const { data: user } = useGetUserByUserIdQuery(userIdOk ?? 0, { skip: userIdOk == null });
  const companyId = user?.companyId ?? null;

  const { data: company } = useGetCompanyByIdQuery(companyId ?? 0, { skip: companyId == null });

  const { data: vacancy, isLoading: isVacancyLoading, isError: isVacancyError } = useGetVacancyByIdQuery(
    vacancyIdOk ?? 0,
    { skip: vacancyIdOk == null }
  );

  const { data: languagesData = [] } = useGetCrmLanguagesQuery();
  const { data: technologyTypesData = [] } = useGetCrmTechnologyTypesQuery();

  const [updateVacancy, { isLoading: isSaving }] = useUpdateVacancyMutation();

  const [form, setForm] = React.useState<CreateVacancyFormState>(INITIAL_CREATE_VACANCY_FORM);
  const [validationErrors, setValidationErrors] = React.useState<ValidationErrors>({});

  const didInitForm = React.useRef(false);

  React.useEffect(() => {
    if (vacancyIdOk == null) {
      toast.error("Nieprawidłowy identyfikator oferty");
      navigate("/hr/vacancies");
    }
  }, [vacancyIdOk, navigate]);

  React.useEffect(() => {
    if (!vacancy || didInitForm.current) return;

    const v = vacancy as VacancyResponse;

    const languageLevels = (v.requirements?.languageLevels ?? []) as ApiLanguageLevel[];
    const technologies = (v.requirements?.jobExperience?.technologyRequirements ?? []) as ApiTechnologyRequirement[];
    const education = v.requirements?.education;

    setForm({
      ...INITIAL_CREATE_VACANCY_FORM,
      name: v.name ?? "",
      description: v.description ?? "",
      responsibilities: v.responsibilities ?? "",
      salary: v.salary,
      addDate: toIsoDate(v.addDate) || todayIso(),
      endDate: toIsoDate(v.endDate),
      workType: toNumberArray(v.workType) as CreateVacancyFormState["workType"],
      address: {
        country: v.address?.country ?? "",
        city: v.address?.city ?? ""
      },
      requirements: {
        yearsOfExperience: toFormYearsOrEmpty(v.requirements?.yearsOfExperience),
        languageLevels: languageLevels.length
          ? languageLevels.map((x) => ({
            language: toFormNumberOrEmpty(x.language),
            level: toFormNumberOrEmpty(x.level)
          }))
          : [{ language: "", level: "" }],
        jobExperience: {
          technologyRequirements: technologies.length
            ? technologies.map((t) => {
              const dtoName = t.technologyTypeDto?.name ?? "";
              const rawName = t.name ?? "";
              const name = String(rawName).trim() || String(dtoName).trim();

              const id = t.technologyTypeId ?? t.technologyTypeDto?.id ?? 0;

              return {
                technologyTypeId: toFormNumberOrEmpty(id),
                name,
                yearsOfExperience: toFormYearsOrEmpty(t.yearsOfExperience)
              };
            })
            : [{ technologyTypeId: "", name: "", yearsOfExperience: "" }]
        },
        education: {
          educationType: toFormNumberOrEmpty(education?.educationType),
          degree: toFormNumberOrEmpty(education?.degree)
        }
      }
    });

    setValidationErrors({});
    didInitForm.current = true;
  }, [vacancy]);

  React.useEffect(() => {
    if (!didInitForm.current) return;
    if (!technologyTypesData.length) return;

    const byName = new Map<string, CrmNamedItem>();
    for (const t of technologyTypesData as CrmNamedItem[]) {
      const key = normalizeName(t.name);
      if (key) byName.set(key, t);
    }

    setForm((prev) => {
      const rows = prev.requirements.jobExperience.technologyRequirements;
      let changed = false;

      const nextRows = rows.map((r) => {
        const hasId = r.technologyTypeId !== "";
        const key = normalizeName(r.name);
        const found = key ? byName.get(key) : undefined;

        if (!hasId && found) {
          changed = true;
          return { ...r, technologyTypeId: found.id, name: found.name ?? r.name };
        }

        if (hasId && (!r.name || !r.name.trim())) {
          const byId = (technologyTypesData as CrmNamedItem[]).find((x) => x.id === r.technologyTypeId);
          if (byId?.name) {
            changed = true;
            return { ...r, name: byId.name };
          }
        }

        return r;
      });

      if (!changed) return prev;

      return {
        ...prev,
        requirements: {
          ...prev.requirements,
          jobExperience: {
            ...prev.requirements.jobExperience,
            technologyRequirements: nextRows
          }
        }
      };
    });
  }, [technologyTypesData]);

  const setFormField = <K extends keyof CreateVacancyFormState>(key: K, value: CreateVacancyFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setRequirementsField = <K extends keyof CreateVacancyFormState["requirements"]>(
    key: K,
    value: CreateVacancyFormState["requirements"][K]
  ) => {
    setForm((prev) => ({
      ...prev,
      requirements: { ...prev.requirements, [key]: value }
    }));
  };

  const buildUpdatePayload = (f: CreateVacancyFormState): UpdateVacancyRequest => {
    if (companyId == null) throw new Error("Missing companyId");

    const techNameById = new Map<number, string>((technologyTypesData as CrmNamedItem[]).map((t) => [t.id, t.name ?? ""]));

    return {
      companyId,
      name: f.name.trim(),
      description: f.description.trim(),
      salary: Number(f.salary),
      addDate: f.addDate || todayIso(),
      endDate: f.endDate,
      requirements: {
        yearsOfExperience: Number(f.requirements.yearsOfExperience),
        languageLevels: f.requirements.languageLevels.map((x) => ({
          language: Number(x.language),
          level: Number(x.level)
        })),
        jobExperience: {
          technologyRequirements: f.requirements.jobExperience.technologyRequirements.map((x) => {
            const technologyTypeId = Number(x.technologyTypeId);
            const safeName = (x.name ?? "").trim() || techNameById.get(technologyTypeId) || "";
            return {
              name: safeName,
              yearsOfExperience: Number(x.yearsOfExperience),
              technologyTypeId
            };
          })
        },
        education: {
          educationType: Number(f.requirements.education.educationType),
          degree: Number(f.requirements.education.degree)
        }
      },
      workType: toNumberArray(f.workType),
      address: { country: f.address.country.trim(), city: f.address.city.trim() },
      responsibilities: f.responsibilities.trim()
    };
  };

  const handleSubmit = async () => {
    if (vacancyIdOk == null) return;
    if (!vacancy) return;

    if (companyId == null) return toast.error("Brak companyId dla użytkownika");
    if (userIdOk == null) return toast.error("Brak HR (userId)");

    const nextErrors = validateCreateVacancyForm(form);
    setValidationErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      const body = buildUpdatePayload(form);
      await updateVacancy({ vacancyId: vacancyIdOk, body }).unwrap();
      toast.success("Oferta została zaktualizowana");
      navigate(`/hr/vacancies/${vacancyIdOk}`);
    } catch (e) {
      const message =
        typeof e === "object" && e && "data" in e && (e as { data?: { message?: unknown } }).data?.message
          ? String((e as { data?: { message?: unknown } }).data?.message)
          : "Nie udało się zaktualizować oferty";
      toast.error(message);
    }
  };

  if (vacancyIdOk == null || isVacancyError) return null;

  if (isVacancyLoading || !vacancy) {
    return (
      <Stack gap={1.5}>
        <Typography sx={{ color: COLORS.textMuted }}>Ładowanie danych oferty…</Typography>
      </Stack>
    );
  }

  return (
    <Stack gap={2.5}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        gap={1.5}
        flexWrap="wrap"
      >
        <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.textPrimary }}>
          Edytuj ofertę
        </Typography>

        <Stack direction="row" gap={1}>
          <Button variant="outlined" onClick={() => navigate(-1)} disabled={isSaving}>
            Anuluj
          </Button>
          <Button variant="contained" color="warning" onClick={handleSubmit} disabled={isSaving}>
            Zapisz zmiany
          </Button>
        </Stack>
      </Stack>

      <BasicInfoSection form={form} errors={validationErrors} setField={setFormField}
                        companyName={company?.name ?? "—"} />

      <RequirementsSection
        form={form}
        errors={validationErrors}
        setRequirementsField={setRequirementsField}
        languages={languagesData}
        technologyTypes={technologyTypesData}
      />
    </Stack>
  );
}