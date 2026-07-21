"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiOutlineLockClosed, HiArrowLeft, HiHome } from 'react-icons/hi2';

const UnauthorizedPage = () => {
    const router = useRouter();

    return (
        <section className="min-h-[calc(100vh-80px)] bg-[#030712] text-gray-300 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden py-12">
            {/* ব্যাকগ্রাউন্ড গ্লো ইফেক্টস */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 blur-[140px] pointer-events-none rounded-full" />

            <div className="max-w-md w-full text-center relative z-10">
                {/* মেইন কার্ড */}
                <div className="bg-[#0b0f19]/65 border border-cyan-950/40 rounded-2xl p-8 sm:p-10 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                    
                    {/* লক আইকন এবং 403 ব্যাজ */}
                    <div className="relative flex items-center justify-center mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
                            <HiOutlineLockClosed className="w-10 h-10" />
                        </div>
                        <span className="absolute -top-2 -right-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md">
                            403 Error
                        </span>
                    </div>

                    {/* হেডার ও টেক্সট */}
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                        Access Denied
                    </h1>
                    <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                        You don't have permission to view this page. Please make sure you are logged in with the correct account role.
                    </p>

                    {/* বাটন অ্যাকশন */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <motion.button
                            type="button"
                            onClick={() => router.back()}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#030712]/80 border border-cyan-950/60 text-sm font-medium hover:bg-cyan-950/30 hover:text-white transition-all duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <HiArrowLeft className="w-4 h-4 text-cyan-400" />
                            <span>Go Back</span>
                        </motion.button>

                        <Link href="/" className="w-full">
                            <motion.button
                                type="button"
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-cyan-500 text-[#030712] font-semibold text-sm hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                                whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(34,211,238,0.3)" }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <HiHome className="w-4 h-4" />
                                <span>Back to Home</span>
                            </motion.button>
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default UnauthorizedPage;