import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

export type ChatMessageRow = Database['public']['Tables']['chat_messages']['Row'];
export type ChatMessageCreate = Database['public']['Tables']['chat_messages']['Insert'];
export type ProposalRow = Database['public']['Tables']['proposals']['Row'];
export type ProposalCreate = Database['public']['Tables']['proposals']['Insert'];
export type ConversationsRow = Database['public']['Tables']['conversations']['Row'];
export type ConversationsCreate = Database['public']['Tables']['conversations']['Insert'];

export async function sendMessage(supabase: SupabaseClient<Database>, message: ChatMessageCreate): Promise<ChatMessageRow> {
    const { data, error } = await supabase
        .from('chat_messages')
        .insert([message])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function sendProposal(supabase: SupabaseClient<Database>, proposal: ProposalCreate): Promise<ProposalRow> {
    const { data, error } = await supabase
        .from('proposals')
        .insert([proposal])
        .select()
        .single();
        
    if (error) throw error;
    return data;
}

export async function createChat(supabase : SupabaseClient<Database>, conversation: ConversationsCreate): Promise<ConversationsRow> {
    const { data, error } = await supabase.from('conversations')
        .insert([conversation])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteMessage(supabase: SupabaseClient<Database>, id : string): Promise<void> {
    const { error } = await supabase.from('chat_messages').delete().eq('id', id);
    if (error) throw error;
}

export async function deleteProposal(supabase: SupabaseClient<Database>, id : string): Promise<void> {
    const { error } = await supabase.from('proposals').delete().eq('id', id);
    if (error) throw error;
}