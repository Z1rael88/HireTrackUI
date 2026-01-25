import * as React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import { useCreateVacancyMutation } from "../../../../api/vacanciesApi";
import { useGetCrmLanguagesQuery, useGetCrmTechnologyTypesQuery } from "../../../../api/crmApi";
import { useGetCompanyByIdQuery } from "../../../../api/companiesApi";
import { useGetUserByUserIdQuery } from "../../../../api/userApi";

import type { RootState } from "../../../../store/store.ts";
import type { CreateVacancyFormState } from "../../../../types/vacancy";
import { INITIAL_CREATE_VACANCY_FORM } from "../../../../types/vacancy";
import { COLORS } from "../../../../style/ColorTheme";

import BasicInfoSection from "./BasicInfoSection";
import RequirementsSection from "./RequirementsSection";
import { buildCreateVacancyPayload, validateCreateVacancyForm } from "../../../../utils/vacancyFormUtils.ts";

type ValidationErrors = Record<string, string>;

export default function HrCreateVacancyPage() {
  const rawUserId = useSelector((state: RootState) => state.user.id);
  const userId = rawUserId == null ? null : Number(rawUserId);

  const [form, setForm] = React.useState<CreateVacancyFormState>(INITIAL_CREATE_VACANCY_FORM);
  const [errors, setErrors] = React.useState<ValidationErrors>({});

  const { data: user } = useGetUserByUserIdQuery(userId ?? 0, { skip: !Number.isFinite(userId) });
  const companyId = user?.companyId;

  const { data: company } = useGetCompanyByIdQuery(companyId ?? 0, { skip: !companyId });
  const { data: languages = [] } = useGetCrmLanguagesQuery();
  const { data: technologyTypes = [] } = useGetCrmTechnologyTypesQuery();

  const [createVacancy, { isLoading }] = useCreateVacancyMutation();

  const reset = () => {
    setForm(INITIAL_CREATE_VACANCY_FORM);
    setErrors({});
  };

  const setField = <K extends keyof CreateVacancyFormState>(key: K, value: CreateVacancyFormState[K]) => {
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

  const handleSubmit = async () => {
    if (!companyId) {
      toast.error("Brak companyId na profilu użytkownika.");
      return;
    }

    const nextErrors = validateCreateVacancyForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await createVacancy(buildCreateVacancyPayload(companyId, form)).unwrap();
      toast.success("Oferta została utworzona");
      reset();
    } catch (error) {
      toast.error((error as { data?: { message?: string } })?.data?.message || "Nie udało się utworzyć oferty");
    }
  };

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
          Nowa oferta
        </Typography>

        <Stack direction="row" gap={1}>
          <Button variant="outlined" onClick={reset} disabled={isLoading}>
            Wyczyść
          </Button>
          <Button variant="contained" color="warning" onClick={handleSubmit} disabled={isLoading}>
            Zapisz
          </Button>
        </Stack>
      </Stack>

      <BasicInfoSection form={form} errors={errors} setField={setField} companyName={company?.name ?? "—"} />

      <RequirementsSection
        form={form}
        errors={errors}
        setRequirementsField={setRequirementsField}
        languages={languages}
        technologyTypes={technologyTypes}
      />
    </Stack>
  );
}