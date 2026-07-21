import { verifyRole } from "@/lib/core/session";

const AdminLayout = async ({ children }) => {
    await verifyRole('admin');
    
    return children;
};

export default AdminLayout;