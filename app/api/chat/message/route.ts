import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/../lib/supabase/server";

import {  
    ChatMessageRow, 
    ChatMessageCreate,
    sendMessage,
    deleteMessage
} from "@/../lib/services/chat-service";

export async function POST(request:Request) {
    try{
        const supabase = await createServerSupabaseClient();
        const body : ChatMessageCreate = await request.json();

        const message : ChatMessageRow = await sendMessage(supabase, body);

        return NextResponse.json({ message }, { status: 201 });
    }catch(error){
        let message = "Ocorreu um erro ao enviar a mensagem";
        if (error instanceof Error) {
            message = error.message;
        }

        return NextResponse.json({message : message}, { status : 500});
    }
}

export async function DELETE(request:Request) {
    try{
        const supabase = await createServerSupabaseClient();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if(!id){
            return NextResponse.json({message : "ID da mensagem não fornecido"}, { status : 400});
        }

        await deleteMessage(supabase, id);

        return NextResponse.json({ message : "Mensagem deletada"}, { status : 204})
        
    }catch(error){
        let message = "Ocorreu um erro ao deletar a mensagem";
        if (error instanceof Error) {
            message = error.message;
        }

        return NextResponse.json({message : message}, { status : 500});
    }
}