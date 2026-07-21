import { verifyRole } from "@/lib/core/session";

const SellerLayout = async ({ children }) => {
    await verifyRole('seller');
    
    return children;
};

export default SellerLayout;