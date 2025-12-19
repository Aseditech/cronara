"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";

interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loadingUser, setLoadingUser] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = getSupabaseClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        setServerError(error?.message ?? "Inicia sesión para ver tu perfil");
        router.replace("/login");
        return;
      }

      const response = await fetch(`/api/profile?authUserId=${user.id}`);
      const json = await response.json();

      if (!response.ok) {
        setServerError(json?.error ?? "No pudimos cargar tu perfil desde la base de datos.");
        setLoadingUser(false);
        return;
      }

      reset({
        fullName: json.profile?.name ?? "",
        email: json.profile?.email ?? "",
        phone: json.profile?.phone ?? "",
      });
      setLoadingUser(false);
    };

    fetchProfile();
  }, [reset, router]);

  const onSubmit = async (data: ProfileFormData) => {
    setServerError(null);
    setSuccessMessage(null);
    const supabase = getSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setServerError("No hay sesión activa.");
      router.replace("/login");
      return;
    }

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authUserId: user.id,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
      }),
    });

    if (!response.ok) {
      const json = await response.json();
      setServerError(json?.error ?? "No pudimos actualizar tu perfil.");
      return;
    }

    setSuccessMessage("Perfil actualizado correctamente.");
    reset(data);
  };

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-sm text-zinc-600">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Navbar />
      <div className="mx-auto mt-10 w-full max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-6">
          <p className="text-sm uppercase text-blue-600">Tu información</p>
          <h1 className="text-3xl font-semibold text-zinc-900">Perfil general</h1>
          <p className="text-sm text-zinc-500">Mantén tus datos al día para mejorar la comunicación.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium text-zinc-700">
                Nombre completo
              </label>
              <input
                id="fullName"
                type="text"
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="María López"
                {...register("fullName", { required: "El nombre es obligatorio" })}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-zinc-700">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="correo@ejemplo.com"
                {...register("email", {
                  required: "El correo es obligatorio",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Correo no válido",
                  },
                })}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium text-zinc-700">
              Teléfono
            </label>
            <input
              id="phone"
              type="tel"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="55 1234 5678"
              {...register("phone", {
                required: "El teléfono es obligatorio",
                pattern: {
                  value: /^[0-9+\-\s()]{7,20}$/,
                  message: "Teléfono no válido",
                },
              })}
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          {serverError && <p className="text-sm text-red-500">{serverError}</p>}
          {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}

          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}
