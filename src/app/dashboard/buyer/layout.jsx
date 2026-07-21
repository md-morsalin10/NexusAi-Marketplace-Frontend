import { verifyRole } from "@/lib/core/session";

const BuyerLayout = async ({ children }) => {
    await verifyRole('buyer');

    return children;
};

export default BuyerLayout;