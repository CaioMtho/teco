import { createServerSupabaseClient } from "@/../lib/supabase/server";
import { NextResponse } from "next/server";
import {
  RequestCreate,
  getRequestById,
  getRequests,
  createRequest,
} from "@/../lib/services/requests-service";

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient();
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { message: "Não autenticado", detail: authError?.message },
        { status: 401 }
      );
    }

    const body: Omit<RequestCreate, 'requester_id'> = await req.json();

    if (!body.description || !body.title) {
      return NextResponse.json(
        { message: "Pedidos precisam ter descrição e título" },
        { status: 400 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile error:', profileError);
      return NextResponse.json(
        { 
          message: "Perfil de usuário não encontrado",
          detail: profileError?.message,
          auth_id: user.id
        },
        { status: 404 }
      );
    }

    const requestData: RequestCreate = {
      ...body,
      requester_id: profile.id,
    };

    await createRequest(supabase, requestData);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Request creation error:', error);
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    const stack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json(
      { 
        message: "Ocorreu um erro ao criar o pedido", 
        detail: message,
        stack: process.env.NODE_ENV === 'development' ? stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const supabase = await createServerSupabaseClient();
  const url = new URL(req.url);

  const page = url.searchParams.has("page") ? Number(url.searchParams.get("page")) : undefined;
  const perPage = url.searchParams.has("perPage") ? Number(url.searchParams.get("perPage")) : undefined;
  const requester_id = url.searchParams.get("requester_id") ?? undefined;
  const status = url.searchParams.get("status") ?? undefined;
  const title = url.searchParams.get("title") ?? undefined;
  const order = url.searchParams.get("order") as "asc" | "desc" | null;
  const id = url.searchParams.get("id") ?? undefined;

  const allowedOrderFields = [
    "requester_id",
    "status",
    "title",
    "id",
    "created_at",
    "updated_at",
    "description",
    "photos",
  ] as const;

  type OrderField = (typeof allowedOrderFields)[number];

  const rawOrderBy = url.searchParams.get("orderBy");
  const orderBy: OrderField | undefined = allowedOrderFields.includes(rawOrderBy as OrderField)
    ? (rawOrderBy as OrderField)
    : undefined;

  try {
    if (id) {
      const result = await getRequestById(supabase, id);
      return NextResponse.json({
        ...result,
        latitude: result.address?.latitude ?? null,
        longitude: result.address?.longitude ?? null,
      });
    }

    const result = await getRequests(supabase, {
      requester_id,
      status,
      title,
      page,
      perPage,
      orderBy,
      order: order ?? undefined,
    });

    const dataWithCoords = result.data.map(request => ({
      ...request,
      latitude: request.address?.latitude ?? null,
      longitude: request.address?.longitude ?? null,
    }));

    return NextResponse.json(dataWithCoords);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido ao buscar dados";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}