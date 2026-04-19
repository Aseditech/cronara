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
      // allow flow to continue if we can derive the id from the authenticated session below,
      // but return a clear error early if neither is available later
    }

    if (!payload.fullName || !payload.email || !payload.phone) {
      return NextResponse.json({ error: "Nombre, correo y teléfono son obligatorios" }, { status: 400 });
    }

    // simple email validation
    const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
    if (!validateEmail(payload.email)) {
      return NextResponse.json({ error: "El correo no tiene un formato válido" }, { status: 400 });
    }

    const supabase = supabaseServerClient;

    // Try to get authenticated user from Supabase server client (if available).
    // If we obtain a session user, prefer that over the client-provided authUserId.
    try {
      // supabase.auth.getUser() returns { data: { user }, error }
      const { data: authData, error: authGetUserError } = await supabase.auth.getUser();

      if (authGetUserError) {
        // non-fatal: continue but log
        console.warn("supabase.auth.getUser() returned error:", authGetUserError.message ?? authGetUserError);
      }

      const sessionUserId = authData?.user?.id;

      if (sessionUserId) {
        // if client provided a different id, reject the request
        if (payload.authUserId && payload.authUserId !== sessionUserId) {
          return NextResponse.json({ error: "Identificador de usuario no coincide con la sesión autenticada" }, { status: 401 });
        }
        payload.authUserId = sessionUserId;
      }
    } catch (err) {
      // if auth.getUser is not supported in this server client or fails, continue using provided authUserId
      console.warn("No se pudo obtener usuario autenticado desde supabase: ", err);
    }

    if (!payload.authUserId) {
      return NextResponse.json({ error: "Falta el identificador del usuario autenticado" }, { status: 400 });
    }

    // Use upsert to create or update the user atomically (by user_id). This reduces race conditions
    // and avoids doing a separate SELECT -> INSERT/UPDATE.
    const { data: upsertedUser, error: upsertUserError } = await supabase
      .from("user")
      .upsert(
        {
          user_id: payload.authUserId,
          name: payload.fullName,
          email: payload.email,
          phone: payload.phone,
        },
        { onConflict: "user_id" }
      )
      .select("id")
      .single();

    if (upsertUserError || !upsertedUser) {
      console.error("Error upserting user:", upsertUserError);
      return NextResponse.json({ error: "No pudimos guardar o actualizar el usuario" }, { status: 400 });
    }

    const userRecordId = upsertedUser.id;

    if (payload.role === "owner") {
      const { data: existingOwner, error: fetchOwnerError } = await supabase
        .from("owner")
        .select("id")
        .eq("id", userRecordId)
        .maybeSingle();

      if (fetchOwnerError) {
        console.error("Error consultando owner:", fetchOwnerError);
        return NextResponse.json({ error: "No pudimos consultar al dueño" }, { status: 400 });
      }

      if (!existingOwner) {
        const { error: insertOwnerError } = await supabase.from("owner").insert({ id: userRecordId });

        if (insertOwnerError) {
          console.error("Error insertando owner:", insertOwnerError);
          return NextResponse.json({ error: "No pudimos registrar al dueño" }, { status: 400 });
        }
      }

      if (payload.businessName) {
        const { data: existingBusiness, error: fetchBusinessError } = await supabase
          .from("business")
          .select("id")
          .eq("owner_id", userRecordId)
          .maybeSingle();

        if (fetchBusinessError) {
          console.error("Error consultando business:", fetchBusinessError);
          return NextResponse.json({ error: "No pudimos consultar el negocio" }, { status: 400 });
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
            console.error("Error actualizando business:", updateBusinessError);
            return NextResponse.json({ error: "No pudimos actualizar el negocio" }, { status: 400 });
          }
        } else {
          const { error: insertBusinessError } = await supabase.from("business").insert(businessPayload);

          if (insertBusinessError) {
            console.error("Error insertando business:", insertBusinessError);
            return NextResponse.json({ error: "No pudimos registrar el negocio" }, { status: 400 });
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
        console.error("Error consultando client:", fetchClientError);
        return NextResponse.json({ error: "No pudimos consultar al cliente" }, { status: 400 });
      }

      if (!existingClient) {
        const { error: insertClientError } = await supabase.from("client").insert({ user_id: userRecordId });

        if (insertClientError) {
          console.error("Error insertando client:", insertClientError);
          return NextResponse.json({ error: "No pudimos registrar el cliente" }, { status: 400 });
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
