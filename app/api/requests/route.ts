import { createServerSupabaseClient } from "@/../lib/supabase/server";
import { NextResponse } from "next/server";
import { RequestCreate, getRequestById, getRequests, createRequest } from "@/../lib/services/requests-service";

const supabase = await createServerSupabaseClient();

export async function POST(req : Request){
    try {
        const body : RequestCreate = await req.json();
        if(!body.description || !body.requester_id || !body.title){
            return NextResponse.json(
                {message: "Pedidos precisam ter descrição, id de usuário e título"},
                {status : 400}
            );
        }
        await createRequest(supabase, body);
        return NextResponse.json({sucess: true}, {status: 201});
    }catch(error){
        let message = "Ocorreu um erro "
        if(error instanceof Error){
            message = error.message;
        }

        return NextResponse.json(
            {message : "Ocorreu um erro ao criar o pedido"},
            {status : 500}
        );
    }

}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const page = url.searchParams.has('page') ? Number(url.searchParams.get('page')) : undefined
  const perPage = url.searchParams.has('perPage') ? Number(url.searchParams.get('perPage')) : undefined
  const requester_id = url.searchParams.get('requester_id') ?? undefined
  const status = url.searchParams.get('status') ?? undefined
  const title = url.searchParams.get('title') ?? undefined
  const orderBy = (url.searchParams.get('orderBy') ?? undefined) as any
  const order = (url.searchParams.get('order') as 'asc' | 'desc') ?? undefined
  const id = url.searchParams.get('id') ?? undefined

  try {
    if (id) {
      const result = await getRequestById(supabase, id)
      return NextResponse.json(result)
    }

    const result = await getRequests(supabase, { requester_id, status, title, page, perPage, orderBy, order })
    return NextResponse.json(result)
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ error: err.message ?? 'error' }), { status: 500 })
  }
}