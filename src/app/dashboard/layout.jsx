"use client";
import React, { useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/login");
        }
    }, [session, isPending, router]);

    if (isPending) {
        return (
            <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-cyan-950"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 animate-spin"></div>
                </div>
                <p className="mt-6 text-sm font-semibold text-cyan-400/80 tracking-widest uppercase animate-pulse">
                    Authenticating Session...
                </p>
            </div>
        );
    }

    if (!session) return null;

    // Dashboard has its own sidebar — suppress the global Navbar/Footer
    return (
        <div className="min-h-screen bg-[#030712] text-gray-300">
            {children}
        </div>
    );
}
