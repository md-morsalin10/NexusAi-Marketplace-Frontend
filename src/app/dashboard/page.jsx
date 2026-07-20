"use client";
import React from 'react';
import { authClient } from '@/lib/auth-client';
import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(() => import('./admin/page'), { ssr: false });
const SellerDashboard = dynamic(() => import('./seller/page'), { ssr: false });
const BuyerDashboard = dynamic(() => import('./buyer/page'), { ssr: false });

export default function DashboardPage() {
    const { data: session, isPending } = authClient.useSession();
    const role = session?.user?.role;

    if (isPending) {
        return (
            <div className="min-h-screen bg-[#030712] flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
            </div>
        );
    }

    if (role === 'admin') return <AdminDashboard />;
    if (role === 'seller') return <SellerDashboard />;
    // "buyer", "user" (legacy), or any other role → buyer dashboard
    return <BuyerDashboard />;
}
