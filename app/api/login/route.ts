import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "../../../lib/supabase/server";

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const body: LoginRequest = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "Email e password são obrigatórios" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    revalidatePath("/", "layout");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro interno do servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}