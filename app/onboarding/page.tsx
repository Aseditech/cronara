"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { getSupabaseClient } from "@/lib/supabase/client";

const ROLE_OPTIONS = [
  { value: "owner", label: "Dueño de negocio" },
  { value: "client", label: "Cliente" },
];

interface OnboardingFormData {
  role: "owner" | "client";
  fullName: string;
  email: string;
  phone: string;
  businessName?: string;
  businessDescription?: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormData>({
    defaultValues: {
      role: "owner",
      fullName: "",
      email: "",
      phone: "",
      businessName: "",
      businessDescription: "",
    },
  });

  const selectedRole = watch("role");

  useEffect(() => {
    const loadSession = async () => {
      const supabase = getSupabaseClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace("/login");
        return;
      }

      setUserId(user.id);
      setCurrentEmail(user.email ?? "");
      setIsLoading(false);
    };

    loadSession();
  }, [router]);

  const onSubmit = async (formData: OnboardingFormData) => {
    if (!userId) {
      setAuthError("No se detectó una sesión válida.");
      return;
    }

    setAuthError(null);
    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authUserId: userId,
        role: formData.role,
        fullName: formData.fullName,
        email: formData.email || currentEmail,
        phone: formData.phone,
        businessName: formData.businessName,
        businessDescription: formData.businessDescription,
      }),
    });

    const supabase = getSupabaseClient();

    if (!response.ok) {
      const { error } = await response.json();
      setAuthError(error || "No pudimos completar el onboarding.");
      return;
    }

    await supabase.auth.updateUser({
      data: {
        onboarding_completed: true,
        role: formData.role,
      },
    });

    router.push("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-sm text-zinc-600">Preparando tu experiencia...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-zinc-900">
          ¡Bienvenido! Comencemos tu configuración
        </h1>
        <p className="mb-6 text-sm text-zinc-900">
          Cuéntanos un poco más para adaptar Cronara a tus necesidades.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <p className="mb-3 text-sm font-semibold text-zinc-700">
              ¿Cómo usarás Cronara?
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ROLE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`rounded-xl border p-4 text-sm font-medium transition text-zinc-900 ${
                    selectedRole === option.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-zinc-200"
                  }`}
                >
                  <input
                    type="radio"
                    className="hidden"
                    value={option.value}
                    {...register("role", { required: "Selecciona una opción" })}
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {errors.role && (
              <p className="mt-2 text-xs text-red-500">{errors.role.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="text-sm font-medium text-zinc-700">
                Nombre completo
              </label>
              <input
                id="fullName"
                type="text"
                className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-900 focus:border-blue-500 focus:outline-none"
                {...register("fullName", { required: "Ingresa tu nombre" })}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-sm font-medium text-zinc-700">
                Teléfono
              </label>
              <input
                id="phone"
                type="tel"
                className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-900 focus:border-blue-500 focus:outline-none"
                placeholder="55 1234 5678"
                {...register("phone", { required: "Ingresa tu número" })}
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-zinc-700">
              Correo (puede ser distinto al usado en el registro)
            </label>
            <input
              id="email"
              type="email"
              defaultValue={currentEmail}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-900 focus:border-blue-500 focus:outline-none"
              {...register("email", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Correo inválido",
                },
              })}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {selectedRole === "owner" && (
            <div className="space-y-4 rounded-2xl border border-zinc-200 p-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="businessName" className="text-sm font-medium text-zinc-700">
                  Nombre de tu negocio
                </label>
                <input
                  id="businessName"
                  type="text"
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-900 focus:border-blue-500 focus:outline-none"
                  placeholder="Clínica Primavera"
                  {...register("businessName", {
                    required: "Ingresa el nombre de tu negocio",
                  })}
                />
                {errors.businessName && (
                  <p className="text-xs text-red-500">{errors.businessName.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="businessDescription"
                  className="text-sm font-medium text-zinc-700"
                >
                  Descripción breve
                </label>
                <textarea
                  id="businessDescription"
                  rows={3}
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-900 focus:border-blue-500 focus:outline-none"
                  placeholder="Cuéntanos qué servicios ofreces"
                  {...register("businessDescription", {
                    minLength: {
                      value: 10,
                      message: "Describe tu negocio en al menos 10 caracteres",
                    },
                  })}
                />
                {errors.businessDescription && (
                  <p className="text-xs text-red-500">
                    {errors.businessDescription.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {authError && <p className="text-sm text-red-500">{authError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isSubmitting ? "Guardando..." : "Continuar"}
          </button>
        </form>
      </div>
    </div>
  );
}
