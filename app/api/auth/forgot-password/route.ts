import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "lib/supabase/server";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email é obrigatório" },
                { status: 400 }
            );
        }

        const supabase = await createServerSupabaseClient();

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/confirm?next=/reset-password`,
        });

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Verifique seu email para redefinir a senha" },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Erro interno no servidor" },
            { status: 500 }
        );
    }
}