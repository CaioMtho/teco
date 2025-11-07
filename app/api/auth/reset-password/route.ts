import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "lib/supabase/server";

export async function POST(req: Request) {
    try {
        const { password } = await req.json();

        if (!password || password.length < 6) {
            return NextResponse.json(
                { error: "Senha deve ter no mínimo 6 caracteres" },
                { status: 400 }
            );
        }

        const supabase = await createServerSupabaseClient();

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Senha atualizada com sucesso" },
            { status: 200 }
        );
    } catch (error) {
        let message = "Ocorreu um erro ao redefinir senha";
        if(error instanceof Error){
            message = error.message;
        }

        return NextResponse.json({message: message}, {status: 500});
        }
}