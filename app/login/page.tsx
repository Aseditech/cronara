"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getSupabaseClient } from "@/lib/supabase/client";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    const supabase = getSupabaseClient();
    const { data: authData, error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      setAuthError(error.message);
      return;
    }

    const hasOnboarded = Boolean(
      authData?.user?.user_metadata?.onboarding_completed
    );

    router.push(hasOnboarded ? "/dashboard" : "/onboarding");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Iniciar sesión</h1>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
              {...register("password", { required: "Ingresa tu contraseña" })}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {authError && <p className="text-sm text-red-500">{authError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-600">
          ¿No tienes cuenta?
          <Link href="/signup" className="ml-1 font-semibold text-blue-600">
            Crear cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}
