import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabase/serverClient";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authUserId = searchParams.get("authUserId");

  if (!authUserId) {
    return NextResponse.json({ error: "Falta el identificador del usuario" }, { status: 400 });
  }

  const { data, error } = await supabaseServerClient
    .from("user")
    .select("name, email, phone")
    .eq("user_id", authUserId)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "No pudimos obtener el perfil" },
      { status: 400 }
    );
  }

  return NextResponse.json({ profile: data });
}

interface UpdateProfilePayload {
  authUserId: string;
  fullName: string;
  email: string;
  phone: string;
}

export async function PUT(request: Request) {
  const payload = (await request.json()) as UpdateProfilePayload;

  if (!payload?.authUserId) {
    return NextResponse.json({ error: "Falta el identificador del usuario" }, { status: 400 });
  }

  if (!payload.fullName || !payload.email || !payload.phone) {
    return NextResponse.json(
      { error: "Nombre, correo y teléfono son obligatorios" },
      { status: 400 }
    );
  }

  const { error } = await supabaseServerClient
    .from("user")
    .update({
      name: payload.fullName,
      email: payload.email,
      phone: payload.phone,
    })
    .eq("user_id", payload.authUserId);

  if (error) {
    return NextResponse.json(
      { error: error.message ?? "No pudimos actualizar tu perfil" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
