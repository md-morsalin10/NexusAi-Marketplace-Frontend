"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Person,
    Envelope,
    Lock,
    Eye,
    EyeSlash,
    Camera,
    CircleArrowDown
} from '@gravity-ui/icons';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        image: '', // ImgBB থেকে আসা লাইভ URL এখানে সেভ হবে
        role: 'buyer'
    });

    // ImgBB Image Upload Handler
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImagePreview(URL.createObjectURL(file));
        setUploading(true);

        // NEXT_PUBLIC_ প্রিফিক্স যুক্ত ভেরিয়েবল ক্লায়েন্ট সাইডে কাজ করবে
        const imgBbApiKey = process.env.NEXT_PUBLIC_IMAGEBB_API_KEY;

        if (!imgBbApiKey) {
            alert("ImgBB API Key is missing! Check your .env.local file.");
            setUploading(false);
            return;
        }

        const bodyData = new FormData();
        bodyData.append("image", file);

        try {
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgBbApiKey}`, {
                method: "POST",
                body: bodyData,
            });
            const data = await res.json();

            if (data.success) {
                setFormData(prev => ({ ...prev, image: data.data.url }));
                console.log("Image uploaded to ImgBB successfully:", data.data.url);
            } else {
                alert("Image upload failed. Please try again.");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Something went wrong during image upload.");
        } finally {
            setUploading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (uploading) {
            alert("Please wait until the image finishes uploading.");
            return;
        }

        try {
            const { data, error } = await authClient.signUp.email({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                image: formData.image,
                metadata: {
                    role: formData.role
                }
            });

            if (error) {
                console.error("Sign up error:", error);
                toast.error(error.message || "Registration failed.");
                return;
            }

            toast.success("Registration successful!");

        } catch (err) {
            console.error("Something went wrong:", err);
            toast.error("An unexpected error occurred.");
        }
    };

    return (
        <section className="min-h-[calc(100vh-80px)] bg-[#030712] text-gray-300 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden py-12">
            <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 blur-[130px] pointer-events-none rounded-full" />
            <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 blur-[130px] pointer-events-none rounded-full" />

            <div className="max-w-md w-full relative z-10">
                <div className="bg-[#0b0f19]/65 border border-cyan-950/40 rounded-2xl p-8 sm:p-10 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.6)]">

                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                            Create Account
                        </h2>
                        <p className="text-sm text-gray-400">
                            Join Nexus<span className="text-cyan-400">Ai</span> to optimize your tech experience
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* প্রোফাইল ইমেজ আপলোড ইনপুট */}
                        <div className="flex flex-col items-center justify-center mb-4">
                            <div className="relative w-24 h-24 rounded-full border border-cyan-950/60 bg-[#030712]/80 flex items-center justify-center overflow-hidden group">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Profile Preview"
                                        className={`w-full h-full object-cover ${uploading ? 'opacity-40' : ''}`}
                                    />
                                ) : (
                                    <Person style={{ width: '40px', height: '40px' }} className="text-gray-600" />
                                )}

                                {uploading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <CircleArrowDown style={{ width: '20px', height: '20px' }} className="text-cyan-400 animate-spin" />
                                    </div>
                                )}

                                <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                    <Camera style={{ width: '20px', height: '20px' }} className="mb-0.5" />
                                    <span className="text-[10px] font-medium tracking-wide">Upload</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <span className="text-xs text-gray-500 mt-2">Profile Picture</span>
                        </div>

                        {/* নাম ইনপুট */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-400 tracking-wider uppercase block">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                                    <Person style={{ width: '18px', height: '18px' }} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#030712]/80 border border-cyan-950/60 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        {/* ইমেইল ইনপুট */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-400 tracking-wider uppercase block">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                                    <Envelope style={{ width: '18px', height: '18px' }} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="name@example.com"
                                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#030712]/80 border border-cyan-950/60 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        {/* পাসওয়ার্ড ইনপুট */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-400 tracking-wider uppercase block">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                                    <Lock style={{ width: '18px', height: '18px' }} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-12 py-2.5 rounded-xl bg-[#030712]/80 border border-cyan-950/60 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm backdrop-blur-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeSlash style={{ width: '18px', height: '18px' }} />
                                    ) : (
                                        <Eye style={{ width: '18px', height: '18px' }} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* রোল সিলেকশন (Toggle) */}
                        <div className="space-y-2 pt-1 pb-2">
                            <label className="text-xs font-semibold text-gray-400 tracking-wider uppercase block">
                                I want to register as a
                            </label>
                            <div className="flex bg-[#030712]/80 p-1 rounded-xl border border-cyan-950/60 relative">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'buyer' })}
                                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all z-10 ${formData.role === 'buyer' ? 'text-[#030712] bg-cyan-500 shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
                                >
                                    Buyer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'seller' })}
                                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all z-10 ${formData.role === 'seller' ? 'text-[#030712] bg-cyan-500 shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
                                >
                                    Seller
                                </button>
                            </div>
                        </div>

                        {/* সাবমিট বাটন */}
                        <motion.button
                            type="submit"
                            disabled={uploading}
                            className={`w-full mt-2 py-3 rounded-xl bg-cyan-500 text-[#030712] font-semibold text-sm hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.15)] flex items-center justify-center ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            whileHover={!uploading ? { scale: 1.01, boxShadow: "0 0 25px rgba(34,211,238,0.3)" } : {}}
                            whileTap={!uploading ? { scale: 0.99 } : {}}
                        >
                            {uploading ? "Uploading Image..." : "Sign Up"}
                        </motion.button>
                    </form>

                    <div className="relative my-5 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-cyan-950/40"></div>
                        </div>
                        <span className="relative px-3 bg-[#0b0f19] text-xs text-gray-500 uppercase tracking-widest">
                            Or sign up with
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Google Button */}
                        <motion.button
                            type="button"
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#030712]/60 border border-cyan-950/60 text-sm font-medium hover:bg-cyan-950/20 hover:text-white transition-all duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.745-.075-1.32-.174-1.878H12.24z" />
                            </svg>
                            <span>Google</span>
                        </motion.button>

                        {/* GitHub Button */}
                        <motion.button
                            type="button"
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#030712]/60 border border-cyan-950/60 text-sm font-medium hover:bg-cyan-950/20 hover:text-white transition-all duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                            </svg>
                            <span>GitHub</span>
                        </motion.button>
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-cyan-400 hover:underline font-medium">
                            Sign In
                        </Link>
                    </p>

                </div>
            </div>
        </section>
    );
};

export default RegisterPage;