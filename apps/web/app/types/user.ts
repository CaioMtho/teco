import Address from "@/types/address";
import Requester from "@/types/requester";
import Provider  from "./provider";
interface User {
    id: number;
    name: string;
    cpf?: string;
    cnpj?: string;
    email: string;
    role: Role;
    personalAddress: Address;
    createdAt: Date;
    provider?: Provider;
    requester?: Requester;
}

enum Role {
    Admin = "ADMIN",
    Requester = "REQUESTER",
    Provider = "PROVIDER"
}

export default User;