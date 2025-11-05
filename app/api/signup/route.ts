import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "lib/supabase/server";
import { insertProfile, ProfileCreate } from 'lib/services/profiles-service';
import { insertAddress, AddressCreate } from 'lib/services/addresses-services'

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
    const body: SignUpRequest = await req.json();
    const supabase = await createServerSupabaseClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: body.email,
        password: body.password
    });

    if (authError || !authData.user) {
        return NextResponse.json({ error: authError?.message || "Erro ao criar usuário" }, { status: 400 });
    }

    try {
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

        const address = await insertAddress(addressData);

        const profileData: ProfileCreate = {
            auth_id: authData.user.id,
            name: body.name,
            address_id: address.id
        };

        await insertProfile(profileData);

        return NextResponse.json({ message: "Você receberá um email de confirmação" }, { status: 201 });
    } catch (error) {
        await supabase.auth.admin.deleteUser(authData.user.id);
        return NextResponse.json({ error: "Erro ao criar perfil" }, { status: 500 });
    }
}