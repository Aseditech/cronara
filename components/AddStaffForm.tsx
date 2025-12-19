"use client";

import { useForm } from "react-hook-form";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useState } from "react";

type StaffFormData = {
  fullName: string;
  email: string;
  role: string;
  phone: string;
};

type StaffListItem = {
  id: string;
  name: string;
  cargo: string | null;
};

interface AddStaffFormProps {
  onClose: () => void;
  businessId: string | null;
  onStaffAdded?: (member: StaffListItem) => void;
}

export default function AddStaffForm({ onClose, businessId, onStaffAdded }: AddStaffFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      role: "",
      phone: "",
    },
  });

  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: StaffFormData) => {
    if (!businessId) {
      setServerError("Debes crear tu negocio antes de agregar personal.");
      return;
    }

    setServerError(null);
    const supabase = getSupabaseClient();
    const { data: inserted, error } = await supabase
      .from("staff")
      .insert({
        business_id: businessId,
        name: data.fullName,
        email: data.email,
        role: data.role,
        cargo: data.role,
        phone: data.phone,
      })
      .select("id, name, cargo")
      .single();

    if (error) {
      setServerError(error.message);
      return;
    }

    if (inserted && onStaffAdded) {
      onStaffAdded(inserted as StaffListItem);
    }

    reset();
    onClose();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-zinc-900">Agregar empleado</h2>
        <p className="text-sm text-zinc-500">Registra a nuevas personas en tu equipo.</p>
      </div>

      <div className="space-y-1">
        <label htmlFor="fullName" className="text-sm font-medium text-zinc-700">
          Nombre completo
        </label>
        <input
          id="fullName"
          type="text"
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="Laura Martínez"
          {...register("fullName", { required: "El nombre es obligatorio" })}
        />
        {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="empleado@empresa.com"
          {...register("email", {
            required: "El correo es obligatorio",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Ingresa un correo válido",
            },
          })}
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="role" className="text-sm font-medium text-zinc-700">
          Rol
        </label>
        <input
          id="role"
          type="text"
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="Recepcionista, médico, etc."
          {...register("role", { required: "Indica un rol" })}
        />
        {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="phone" className="text-sm font-medium text-zinc-700">
          Teléfono
        </label>
        <input
          id="phone"
          type="tel"
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="55 1234 5678"
          {...register("phone", {
            required: "Incluye un teléfono de contacto",
            minLength: { value: 8, message: "Debe tener al menos 8 dígitos" },
          })}
        />
        {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
      </div>

      {serverError && <p className="text-sm text-red-500">{serverError}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isSubmitting ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
