import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabase/serverClient";

interface OnboardingPayload {
  authUserId: string;
  role: "owner" | "client";
  fullName: string;
  email: string;
  phone: string;
  businessName?: string;
  businessDescription?: string;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as OnboardingPayload;

    if (!payload.authUserId) {
      return NextResponse.json({ error: "Falta el identificador del usuario" }, { status: 400 });
    }

    if (!payload.fullName || !payload.email || !payload.phone) {
      return NextResponse.json({ error: "Nombre, correo y teléfono son obligatorios" }, { status: 400 });
    }

    const supabase = supabaseServerClient;

    const { data: existingUser, error: fetchExistingUserError } = await supabase
      .from("user")
      .select("id")
      .eq("user_id", payload.authUserId)
      .maybeSingle();

    if (fetchExistingUserError) {
      return NextResponse.json(
        { error: fetchExistingUserError.message ?? "No pudimos consultar el usuario" },
        { status: 400 }
      );
    }

    let userRecordId = existingUser?.id ?? null;

    if (userRecordId) {
      const { error: updateUserError } = await supabase
        .from("user")
        .update({
          name: payload.fullName,
          email: payload.email,
          phone: payload.phone,
        })
        .eq("user_id", payload.authUserId);

      if (updateUserError) {
        return NextResponse.json(
          { error: updateUserError.message ?? "No pudimos actualizar el usuario" },
          { status: 400 }
        );
      }
    } else {
      const { data: insertedUser, error: insertUserError } = await supabase
        .from("user")
        .insert({
          user_id: payload.authUserId,
          name: payload.fullName,
          email: payload.email,
          phone: payload.phone,
        })
        .select("id")
        .single();

      if (insertUserError || !insertedUser) {
        return NextResponse.json(
          { error: insertUserError?.message ?? "No pudimos guardar el usuario" },
          { status: 400 }
        );
      }

      userRecordId = insertedUser.id;
    }

    if (payload.role === "owner") {
      const { data: existingOwner, error: fetchOwnerError } = await supabase
        .from("owner")
        .select("id")
        .eq("id", userRecordId)
        .maybeSingle();

      if (fetchOwnerError) {
        return NextResponse.json(
          { error: fetchOwnerError.message ?? "No pudimos consultar al dueño" },
          { status: 400 }
        );
      }

      if (!existingOwner) {
        const { error: insertOwnerError } = await supabase.from("owner").insert({ id: userRecordId });

        if (insertOwnerError) {
          return NextResponse.json(
            { error: insertOwnerError.message ?? "No pudimos registrar al dueño" },
            { status: 400 }
          );
        }
      }

      if (payload.businessName) {
        const { data: existingBusiness, error: fetchBusinessError } = await supabase
          .from("business")
          .select("id")
          .eq("owner_id", userRecordId)
          .maybeSingle();

        if (fetchBusinessError) {
          return NextResponse.json(
            { error: fetchBusinessError.message ?? "No pudimos consultar el negocio" },
            { status: 400 }
          );
        }

        const businessPayload = {
          owner_id: userRecordId,
          name: payload.businessName,
          description: payload.businessDescription,
          logo_url: "/assets/cronaraLogo.webp",
        };

        if (existingBusiness) {
          const { error: updateBusinessError } = await supabase
            .from("business")
            .update(businessPayload)
            .eq("id", existingBusiness.id);

          if (updateBusinessError) {
            return NextResponse.json(
              { error: updateBusinessError.message ?? "No pudimos actualizar el negocio" },
              { status: 400 }
            );
          }
        } else {
          const { error: insertBusinessError } = await supabase.from("business").insert(businessPayload);

          if (insertBusinessError) {
            return NextResponse.json(
              { error: insertBusinessError.message ?? "No pudimos registrar el negocio" },
              { status: 400 }
            );
          }
        }
      }
    } else {
      const { data: existingClient, error: fetchClientError } = await supabase
        .from("client")
        .select("id")
        .eq("user_id", userRecordId)
        .maybeSingle();

      if (fetchClientError) {
        return NextResponse.json(
          { error: fetchClientError.message ?? "No pudimos consultar al cliente" },
          { status: 400 }
        );
      }

      if (!existingClient) {
        const { error: insertClientError } = await supabase.from("client").insert({ user_id: userRecordId });

        if (insertClientError) {
          return NextResponse.json(
            { error: insertClientError.message ?? "No pudimos registrar el cliente" },
            { status: 400 }
          );
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No pudimos procesar el onboarding" },
      { status: 500 }
    );
  }
}
