'user server';

import { createServerSupabaseClient } from "../../utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData){
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

export async function signup(formData: FormData){
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = await createServerSupabaseClient();

    const {error} = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return {error: error.message};
    }

    return { message: 'Você receberá um email para confirmação.'}
}