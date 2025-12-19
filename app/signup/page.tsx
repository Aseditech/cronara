"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getSupabaseClient } from "@/lib/supabase/client";
import { toast } from "react-toastify";

type SignupFormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: SignupFormData) => {
    setAuthError(null);
    const supabase = getSupabaseClient();

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.fullName },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) {
      setAuthError(error.message);
      return;
    }

    toast.info("Revisa tu correo para verificar tu cuenta antes de continuar", {
      position: "top-center",
    });

    router.push("/onboarding");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Crear cuenta</h1>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium text-zinc-700">
              Nombre completo
            </label>
            <input
              id="fullName"
              type="text"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-900 focus:border-blue-500 focus:outline-none"
              placeholder="John Doe"
              {...register("fullName", { required: "Ingresa tu nombre" })}
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
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-900 focus:border-blue-500 focus:outline-none"
              placeholder="johndoe@email.com"
              {...register("email", {
                required: "Ingresa tu correo",
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

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-zinc-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-900 focus:border-blue-500 focus:outline-none"
              placeholder="********"
              {...register("password", {
                required: "Ingresa una contraseña",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              })}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-700">
              Repite tu contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-900 focus:border-blue-500 focus:outline-none"
              placeholder="********"
              {...register("confirmPassword", {
                required: "Confirma tu contraseña",
                validate: (value) =>
                  value === watch("password") || "Las contraseñas no coinciden",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {authError && <p className="text-sm text-red-500">{authError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isSubmitting ? "Registrando..." : "Registrarme"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-600">
          ¿Ya tienes cuenta?
          <Link href="/login" className="ml-1 font-semibold text-blue-600">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}