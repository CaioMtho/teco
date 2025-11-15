import { ProposalRow, ProposalCreate, sendProposal } from "lib/services/chat-service";
import { createServerSupabaseClient } from "lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request : Request) {
    try{
        const supabase = await createServerSupabaseClient();
        const body : ProposalCreate = await request.json();

        const data : ProposalRow = await sendProposal(supabase, body);

        return NextResponse.json(data, {status : 201});
    }catch(error) { 
        let message = "Ocorreu um erro ao enviar a proposta";

        if (error instanceof Error) {
            message = error.message;
        }

        return NextResponse.json({message : message}, { status : 500});
    }
}

