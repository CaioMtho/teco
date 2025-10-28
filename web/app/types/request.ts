import Address from "@/types/address";

interface Request {
    id: number;
    title: string;
    description: string;
    photos?: string[];
    status: Status;
    createdAt: Date;
    requesterId: number;
    requesterName?: string;
    serviceAddress?: Address;
    proposalCount: number;
}

enum Status {
    Open = "OPEN",
    Closed = "CLOSED",
}

export default Request;