'use server';

import { createServerSupabaseClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ActionState = {
    error?: string;
    message?: string
} | null

export async function login(prevState: ActionState, formData: FormData){
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const supabase = await createServerSupabaseClient();

    const {error} = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if(error) {
        return {error: error.message};
    }

    revalidatePath('/', 'layout');
    redirect('/dashboard')
}