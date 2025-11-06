import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "lib/supabase/server";
import { insertProfile, ProfileCreate } from 'lib/services/profiles-service';
import { insertAddress, AddressCreate } from 'lib/services/addresses-services';

interface SignUpRequest {
    email: string;
    password: string;
    name: string;
    address: {
        street: string;
        number: string;
        neighborhood: string;
        city: string;
        state: string;
        zip_code: string;
        country: string;
        complement?: string;
    };
}

export async function POST(req: Request) {
    const supabase = await createServerSupabaseClient();
    
    try {
        const body: SignUpRequest = await req.json();

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: body.email,
            password: body.password
        });

        if (authError || !authData.user) {
            return NextResponse.json(
                { error: authError?.message || "Erro ao criar usuário" },
                { status: 400 }
            );
        }

        const addressData: AddressCreate = {
            street: body.address.street,
            number: body.address.number,
            neighborhood: body.address.neighborhood,
            city: body.address.city,
            state: body.address.state,
            zip_code: body.address.zip_code,
            country: body.address.country,
            complement: body.address.complement
        };

        const address = await insertAddress(supabase, addressData);

        const profileData: ProfileCreate = {
            auth_id: authData.user.id,
            name: body.name,
            address_id: address.id
        };

        await insertProfile(supabase, profileData);

        return NextResponse.json(
            { message: "Você receberá um email de confirmação" },
            { status: 201 }
        );
    } catch (error: unknown) {
        let message = "Ocorreu um erro ao criar usuário";
        if(error instanceof Error){
            message = error.message;
        }

        return NextResponse.json({error: message}, {status: 500});
    }
}