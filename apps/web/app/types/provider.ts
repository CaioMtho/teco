import Address from "./address";
import Order from "./order";
import Review from "./review";
import User from "./user";

interface Provider {
    id: number;
    userId: number;
    user?: User;
    bio: string;
    skills: string[];
    workAddressId?: number;
    workAddress?: Address;
    priceBase?: number;
    orders: Order[];
    reviews: Review[];
}

export default Provider;