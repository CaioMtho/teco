interface Address {
    id: number;
    street: string;
    city: string;
    state: string;
    neighborhood: string;
    postalCode: string;
    complement?: string;
}

export default Address;