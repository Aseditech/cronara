"use client";

import { Navbar } from "@/components/Navbar";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type SettingsFormData = {
  businessName: string;
  description: string;
  logoUrl: string;
};

export default function Settings() {
  const router = useRouter();
  const [loadingBusiness, setLoadingBusiness] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [ownerId, setOwnerId] = useState<number | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SettingsFormData>({
    defaultValues: {
      businessName: "",
      description: "",
      logoUrl: "",
    },
  });

  useEffect(() => {
    const fetchBusiness = async () => {
      const supabase = getSupabaseClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/login");
        return;
      }

      const { data: userRow, error: userRowError } = await supabase
        .from("user")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (userRowError || !userRow) {
        setServerError("No pudimos obtener la información del usuario.");
        setLoadingBusiness(false);
        return;
      }

      setOwnerId(userRow.id);

      const { data, error, status } = await supabase
        .from("business")
        .select("id, name, description, logo_url")
        .eq("owner_id", userRow.id)
        .maybeSingle();

      if (error && status !== 406) {
        setServerError("No pudimos obtener los datos del negocio.");
      }

      if (data) {
        setBusinessId(data.id);
        reset({
          businessName: data.name ?? "",
          description: data.description ?? "",
          logoUrl: data.logo_url ?? "",
        });
      }

      setLoadingBusiness(false);
    };

    fetchBusiness();
  }, [reset, router]);

  const onSubmit = async (data: SettingsFormData) => {
    if (!ownerId) {
      setServerError("No se detectó un usuario autenticado.");
      return;
    }

    setServerError(null);
    const supabase = getSupabaseClient();
    const payload = {
      name: data.businessName,
      description: data.description,
      logo_url: data.logoUrl,
      owner_id: ownerId,
    };

    if (businessId) {
      const { error } = await supabase
        .from("business")
        .update(payload)
        .eq("id", businessId);

      if (error) {
        setServerError(error.message);
        return;
      }
    } else {
      const { data: newBusiness, error } = await supabase
        .from("business")
        .insert(payload)
        .select("id")
        .single();

      if (error) {
        setServerError(error.message);
        return;
      }

      setBusinessId(newBusiness.id);
    }

    reset(data);
  };

  if (loadingBusiness) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-sm text-zinc-600">Cargando datos del negocio...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-50">
      <Navbar />
      <main className="flex-1 overflow-auto px-6 py-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto flex w-full max-w-[95%] flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="businessName" className="text-sm font-medium text-zinc-700">
              Nombre de tu negocio
            </label>
            <input
              id="businessName"
              type="text"
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              {...register("businessName", { required: "Este campo es obligatorio" })}
            />
            {errors.businessName && (
              <p className="text-xs text-red-500">{errors.businessName.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-sm font-medium text-zinc-700">
              Descripción
            </label>
            <textarea
              id="description"
              rows={4}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              {...register("description", {
                required: "Describe brevemente tu negocio",
                minLength: { value: 10, message: "Debe tener al menos 10 caracteres" },
              })}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="logoUrl" className="text-sm font-medium text-zinc-700">
              Logo (URL)
            </label>
            <input
              id="logoUrl"
              type="url"
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="https://tu-negocio.com/logo.png"
              {...register("logoUrl", {
                validate: (value) =>
                  !value || /^(https?:\/\/).+/i.test(value) || "Debe ser una URL válida",
              })}
            />
            {errors.logoUrl && (
              <p className="text-xs text-red-500">{errors.logoUrl.message}</p>
            )}
          </div>

          {serverError && <p className="text-sm text-red-500">{serverError}</p>}

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </main>
    </div>
  );
}
