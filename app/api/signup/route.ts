import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "lib/supabase/server";
import { insertProfile, ProfileCreate, deleteProfile } from 'lib/services/profiles-service';
import { insertAddress, AddressCreate, linkAddressToProfile, updateAddress, deleteAddress } from 'lib/services/addresses-service';
import { createProviderProfile } from 'lib/services/provider-service';

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
    provider?: {
        bio?: string | null;
        price_base?: number | null;
        skills?: string[] | null;
    } | undefined;
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

        // If the user opted to be a provider, create a provider_profile record
        if (profile.role === 'provider') {
            try {
                await createProviderProfile(supabase, {
                    user_id: profile.id,
                    bio: body.provider?.bio ?? null,
                    price_base: body.provider?.price_base ?? null,
                    skills: body.provider?.skills ?? null
                })
            } catch (err) {
                console.error('Failed creating provider profile, rolling back profile/address:', err)
                // attempt rollback of created profile and address to avoid orphaned records
                try {
                    await deleteProfile(supabase, profile.id)
                } catch (e) {
                    console.error('Failed deleting profile during rollback', e)
                }
                try {
                    await deleteAddress(supabase, address.id)
                } catch (e) {
                    console.error('Failed deleting address during rollback', e)
                }

                return NextResponse.json({ error: 'Erro ao criar perfil de provider' }, { status: 500 })
            }
        }

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