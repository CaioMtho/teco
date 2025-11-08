// app/api/requests/route.ts
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
    const body: RequestCreate = await req.json();

    if (!body.description || !body.requester_id || !body.title) {
      return NextResponse.json(
        { message: "Pedidos precisam ter descrição, id de usuário e título" },
        { status: 400 }
      );
    }

    await createRequest(supabase, body);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { message: "Ocorreu um erro ao criar o pedido", detail: message },
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