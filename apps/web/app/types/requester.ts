import User from "@/types/user";
import Request from "@/types/request";
import Order from "@/types/order";
import Review from "@/types/review";

interface Requester {
    id: number;
    userId: number;
    user?: User;
    orders: Order[];
    requests: Request[];
    reviews: Review[];
}

export default Requester;