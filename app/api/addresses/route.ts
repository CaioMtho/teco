import { createServerSupabaseClient } from "@/../lib/supabase/server";
import { NextResponse } from "next/server";
import { insertAddress } from "@/../lib/services/addresses-services";
import { Database } from "@/../lib/types/database.types";

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: "Não autenticado" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const requiredFields = [
      'street',
      'number',
      'neighborhood',
      'city',
      'state',
      'zip_code',
      'country',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { message: `Campo obrigatório ausente: ${field}` },
          { status: 400 }
        );
      }
    }

    const addressData: Database['public']['Tables']['addresses']['Insert'] = {
      user_id: user.id,
      street: body.street,
      number: body.number,
      complement: body.complement || null,
      neighborhood: body.neighborhood,
      city: body.city,
      state: body.state,
      zip_code: body.zip_code,
      country: body.country,
      latitude: body.latitude || null,
      longitude: body.longitude || null,
    };

    const result = await insertAddress(supabase, addressData);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { message: "Erro ao criar endereço", detail: message },
      { status: 500 }
    );
  }
}