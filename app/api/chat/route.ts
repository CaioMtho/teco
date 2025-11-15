import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "../../../lib/supabase/server";
import {  
    createChat, 
    ConversationsCreate,
    ConversationsRow
} from "../../../lib/services/chat-service";

export async function POST(request: Request) {
    try{
        const supabase = await createServerSupabaseClient();
        const body : ConversationsCreate = await request.json();

        const chat : ConversationsRow = await createChat(supabase, body);

        return NextResponse.json({ chat }, { status: 201 });
    }catch(error){
        let message = "Ocorreu um erro ao criar o chat";
        if (error instanceof Error) {
            message = error.message;
        }

        return NextResponse.json({message : message}, { status : 500});
    }
}