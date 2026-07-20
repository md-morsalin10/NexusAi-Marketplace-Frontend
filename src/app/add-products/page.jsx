"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AddProducts = () => {
    const router = useRouter();

    useEffect(() => {
        // Redirect users directly to the dashboard page where they can add products
        router.push("/dashboard");
    }, [router]);

    return (
        <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-gray-300">
            <div className="w-10 h-10 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
            <p className="mt-4 text-xs font-semibold text-cyan-400/80 uppercase tracking-widest animate-pulse">
                Redirecting to dashboard...
            </p>
        </div>
    );
};

export default AddProducts;