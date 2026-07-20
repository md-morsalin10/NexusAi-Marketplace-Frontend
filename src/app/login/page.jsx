"use client";
import React, { useState } from 'react';

import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, } from 'react-icons/hi2';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import { HiEyeOff, HiOutlineMailOpen } from 'react-icons/hi';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await authClient.signIn.email({
            email: formData.email,
            password: formData.password,
        });

        if (data) {
            toast.success('Welcome Back!');
        }
        if (error) {
            toast.error(error.message || "Invalid credentials");
        }
        console.log("Login Submitting: ", formData);
    };

    return (
        <section className="min-h-[calc(100vh-80px)] bg-[#030712] text-gray-300 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden py-12">
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 blur-[130px] pointer-events-none rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-100 h-[400px] bg-cyan-500/5 blur-[130px] pointer-events-none rounded-full" />

            <div className="max-w-md w-full relative z-10">
                {/* মেইন লগইন কার্ড */}
                <div className="bg-[#0b0f19]/65 border border-cyan-950/40 rounded-2xl p-8 sm:p-10 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.6)]">

                    {/* হেডার */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-sm text-gray-400">
                            Log in to access your Gadget<span className="text-cyan-400">Hub</span> account
                        </p>
                    </div>

                    {/* ফর্ম */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* ইমেইল ইনপুট */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 tracking-wider uppercase block">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                                    <HiOutlineMailOpen className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="name@example.com"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#030712]/80 border border-cyan-950/60 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        {/* পাসওয়ার্ড ইনপুট */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-gray-400 tracking-wider uppercase block">
                                    Password
                                </label>
                                <Link href="/forgot-password" className="text-xs text-cyan-400 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                                    <HiOutlineLockClosed className="w-5 h-5" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-12 py-3 rounded-xl bg-[#030712]/80 border border-cyan-950/60 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm backdrop-blur-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 focus:outline-none"
                                >
                                    {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* সাবমিট বাটন */}
                        <motion.button
                            type="submit"
                            className="w-full mt-2 py-3 rounded-xl bg-cyan-500 text-[#030712] font-semibold text-sm hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.15)] flex items-center justify-center"
                            whileHover={{ scale: 1.01, boxShadow: "0 0 25px rgba(34,211,238,0.3)" }}
                            whileTap={{ scale: 0.99 }}
                        >
                            Sign In
                        </motion.button>
                    </form>

                    {/* ডিভাইডার */}
                    <div className="relative my-6 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-cyan-950/40"></div>
                        </div>
                        <span className="relative px-3 bg-[#0b0f19] text-xs text-gray-500 uppercase tracking-widest">
                            Or continue with
                        </span>
                    </div>

                    {/* সোশ্যাল লগইন বাটন সমূহ */}
                    <div className="grid grid-cols-2 gap-3">
                        <motion.button
                            type="button"
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#030712]/60 border border-cyan-950/60 text-sm font-medium hover:bg-cyan-950/20 hover:text-white transition-all duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FaGoogle className="w-4 h-4 text-gray-400 group-hover:text-white" />
                            <span>Google</span>
                        </motion.button>
                        <motion.button
                            type="button"
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#030712]/60 border border-cyan-950/60 text-sm font-medium hover:bg-cyan-950/20 hover:text-white transition-all duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FaGithub className="w-4 h-4 text-gray-400 group-hover:text-white" />
                            <span>GitHub</span>
                        </motion.button>
                    </div>

                    {/* রেজিস্টার লিংক */}
                    <p className="text-center text-sm text-gray-500 mt-8">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-cyan-400 hover:underline font-medium">
                            Sign up for free
                        </Link>
                    </p>

                </div>
            </div>
        </section>
    );
};

export default LoginPage;