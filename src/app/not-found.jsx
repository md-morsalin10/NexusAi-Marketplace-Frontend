"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiExclamationTriangle, HiArrowLeft, HiHome, HiMagnifyingGlass } from 'react-icons/hi2';

const PageNotFound = () => {
    const router = useRouter();

    return (
        <section className="min-h-[calc(100vh-80px)] bg-[#030712] text-gray-300 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden py-12">
            {/* ব্যাকগ্রাউন্ড গ্লো ইফেক্টস */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-cyan-500/10 blur-[150px] pointer-events-none rounded-full" />

            <div className="max-w-md w-full text-center relative z-10">
                {/* মেইন কার্ড */}
                <div className="bg-[#0b0f19]/65 border border-cyan-950/40 rounded-2xl p-8 sm:p-10 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                    
                    {/* 404 ব্যাজ ও আইকন */}
                    <div className="relative flex flex-col items-center justify-center mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.15)] mb-3">
                            <HiExclamationTriangle className="w-10 h-10 text-cyan-400" />
                        </div>
                        <h1 className="text-6xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-200 to-blue-500">
                            404
                        </h1>
                    </div>

                    {/* টাইটেল ও বিবরণ */}
                    <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                        Page Not Found
                    </h2>
                    <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                        Oops! The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
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

                    {/* অতিরিক্ত সার্চ লিংক */}
                    <div className="mt-8 pt-6 border-t border-cyan-950/40">
                        <Link 
                            href="/products" 
                            className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-cyan-400 transition-colors"
                        >
                            <HiMagnifyingGlass className="w-4 h-4 text-cyan-400" />
                            <span>Looking for products? Explore Marketplace</span>
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default PageNotFound;