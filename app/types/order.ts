import Review from "@/types/review";

interface Order {
    id: number;
    proposalId: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    totalPrice: number;
    createdAt: Date;
    startedAt: Date;
    finishedAt: Date;
    clientConfirmed: boolean;
    review?: Review
}

enum OrderStatus {
    Pending = "PENDING",
    Starting = "STARTING",
    Completed = "COMPLETED",
    Cancelled = "CANCELLED"
}

enum PaymentStatus {
    Held = "HELD",
    Released = "RELEASED",
    Refunded = "REFUNDED"
}

export default Order;