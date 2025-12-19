"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";

interface ProfileFormData {
  fullName: string;
  avatarUrl: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loadingUser, setLoadingUser] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    defaultValues: {
      fullName: "",
      avatarUrl: "",
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
        setAuthError(error?.message ?? "Inicia sesión para ver tu perfil");
        router.push("/login");
        return;
      }

      reset({
        fullName: (user.user_metadata?.full_name as string) ?? "",
        avatarUrl: (user.user_metadata?.avatar_url as string) ?? "",
      });
      setLoadingUser(false);
    };

    fetchProfile();
  }, [reset, router]);

  const onSubmit = async (data: ProfileFormData) => {
    setAuthError(null);
    const supabase = getSupabaseClient();

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: data.fullName,
        avatar_url: data.avatarUrl,
      },
    });

    if (error) {
      setAuthError(error.message);
      return;
    }
  };

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-sm text-zinc-600">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-50">
      <Navbar />
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-zinc-900">Perfil</h1>
          <p className="text-sm text-zinc-500">
            Actualiza tu información visible para tu equipo.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
            <label htmlFor="avatarUrl" className="text-sm font-medium text-zinc-700">
              Foto (URL)
            </label>
            <input
              id="avatarUrl"
              type="url"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="https://tu-dominio.com/avatar.png"
              {...register("avatarUrl", {
                pattern: {
                  value: /^(https?:\/\/).+/i,
                  message: "Proporciona una URL válida",
                },
              })}
            />
            {errors.avatarUrl && (
              <p className="text-xs text-red-500">{errors.avatarUrl.message}</p>
            )}
          </div>

          {authError && <p className="text-sm text-red-500">{authError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}
