"use client";

import { Navbar } from "@/components/Navbar";
import { useForm } from "react-hook-form";

type SettingsFormData = {
  businessName: string;
  description: string;
  logoUrl: string;
};

export default function Settings() {
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

  const onSubmit = async (data: SettingsFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log("Datos del formulario", data);
    reset(data);
  };

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
                required: "Incluye un enlace a tu logo",
                pattern: {
                  value: /^(https?:\/\/).+/i,
                  message: "Debe ser una URL válida",
                },
              })}
            />
            {errors.logoUrl && (
              <p className="text-xs text-red-500">{errors.logoUrl.message}</p>
            )}
          </div>

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
