'use server';

import { createServerSupabaseClient } from "../../utils/supabase/server";
import { revalidatePath } from 'next/cache'

type ActionState = {
    error?: string;
    message?: string
} | null


export async function resetPassword(prevState: ActionState, formData: FormData) {
    const email = formData.get('email') as string;

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    });

    if (error) {
        return { error: error.message };
    }

    return { message: 'Verifique seu email para redefinir a senha.' };
}

export async function updatePassword(prevState: ActionState, formData: FormData) {
    const password = formData.get('password') as string;

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.auth.updateUser({
        password: password,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/', 'layout');
    return { message: 'Senha atualizada com sucesso!' };
}