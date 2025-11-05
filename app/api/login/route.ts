import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "../../../lib/supabase/server"; // ajuste se necessário

type Body = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    let email: string | null = null;
    let password: string | null = null;

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const json = (await request.json()) as Body;
      email = json.email ?? null;
      password = json.password ?? null;
    } else if (contentType.includes("form")) {
      const form = await request.formData();
      email = (form.get("email") as string) ?? null;
      password = (form.get("password") as string) ?? null;
    } else {
      try {
        const json = (await request.json()) as Body;
        email = json.email ?? null;
        password = json.password ?? null;
      } catch {
      }
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: "email e password são obrigatórios" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    try {
      revalidatePath("/", "layout");
    } catch {
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (err: unknown) {
    let message = "Erro interno do servidor";
    if(err instanceof Error){
        message = err.message;
    }

    return NextResponse.json({error: message}, {status: 500});
  }
}
