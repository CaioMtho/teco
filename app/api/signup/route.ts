import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "lib/supabase/server";

export async function POST(req: Request){
    const { email, password } = await req.json();
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.auth.signUp({email, password});

    if(error){
        return NextResponse.json({error: error.message}, {status: 400});
    }

    return NextResponse.json({message: "Você receberá um email de confirmação"}, {status: 201});

}