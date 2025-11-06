'use server';

import { createServerSupabaseClient } from "../../lib/supabase/server";
import { revalidatePath } from 'next/cache'

type ActionState = {
    error?: string;
    message?: string
} | null

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