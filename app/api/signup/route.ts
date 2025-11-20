import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "lib/supabase/server";
import { insertProfile, ProfileCreate } from 'lib/services/profiles-service';
import { insertAddress, AddressCreate, linkAddressToProfile } from 'lib/services/addresses-service';

interface SignUpRequest {
    email: string;
    password: string;
    name: string;
    role?: 'provider' | 'requester';
    address: {
        street: string;
        number: string;
        neighborhood: string;
        city: string;
        state: string;
        zip_code: string;
        country: string;
        complement?: string;
        latitude?: number;
        longitude?: number;
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

        const profileData: ProfileCreate = {
            auth_id: authData.user.id,
            name: body.name,
            role: body.role || 'requester'
        };

        const profile = await insertProfile(supabase, profileData);

        const addressData: AddressCreate = {
            street: body.address.street,
            number: body.address.number,
            neighborhood: body.address.neighborhood,
            city: body.address.city,
            state: body.address.state,
            zip_code: body.address.zip_code,
            country: body.address.country,
            complement: body.address.complement,
            latitude: body.address.latitude,
            longitude: body.address.longitude
        };

        const address = await insertAddress(supabase, addressData);

        await linkAddressToProfile(supabase, {
            profile_id: profile.id,
            address_id: address.id,
            is_primary: true,
            address_type: 'home'
        });

        return NextResponse.json(
            { 
                message: "Você receberá um email de confirmação",
                profile_id: profile.id 
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error('Signup error:', error);
        
        let message = "Ocorreu um erro ao criar usuário";
        if (error instanceof Error) {
            message = error.message;
        }
        
        return NextResponse.json({ error: message }, { status: 500 });
    }
}