import { Database }  from "../types/entities/database.types";
import { createClient } from '@supabase/supabase-js'

type RequestRow = Database['public']['Tables']['requests']['Row']
type RequestInsert = Database['public']['Tables']['requests']['Insert']
type RequestUpdate = Database['public']['Tables']['requests']['Update']
type RequestQueryParams = Partial<Pick<RequestRow, 'status' | 'requester_id' | 'title'>>

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getRequests(filters?: RequestQueryParams): Promise<RequestRow[]> {
  let query = supabase.from('requests').select('*')

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.requester_id) {
    query = query.eq('requester_id', filters.requester_id)
  }

  if (filters?.title) {
    query = query.ilike('title', `%${filters.title}%`)
  }

  const { data, error } = await query

  if (error) throw error
  return data ?? []
}

export async function getRequestById(id: string) : Promise<RequestRow>{
    const { data, error } = await supabase
        .from('requests')
        .select()
        .eq('id', id).single();

    if(error) throw error;

    return data;
}

export async function createRequest(newRequest: RequestInsert): Promise<RequestRow>{
    const { data, error } = await supabase
        .from('requests')
        .insert(newRequest)
        .select()
        .single();
    
    if(error) throw error;

    return data;
}

export async function updateRequest(id:string, requestUpdate: RequestUpdate) : Promise<RequestRow> {
    const { data, error} = await supabase
        .from('requests')
        .update(requestUpdate)
        .eq('id', id)
        .select()
        .single();
    
    if(error) throw error;

    return data;
}

export async function deleteRequest(id: string): Promise<void>{
    const { error } = await supabase
        .from('requests')
        .delete().eq('id', id); 
    
    if(error) throw error;
}

