interface Review {
    id: number;
    orderId: number;
    providerId: number;
    requesterId: number;
    rating: number;
    comment?: string;
    createdAt: Date;
    providerName?: string;
    requesterName?: string;
}

export default Review;