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
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm?next=/reset-password`,
    });

    if (error) {
        return { error: error.message };
    }

    return { message: 'Verifique seu email para redefinir a senha.' };
}
