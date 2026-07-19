"use client";
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { HiOutlineEnvelope } from 'react-icons/hi2';

const Newsletter = () => {
    const containerRef = useRef(null);

    // GSAP Entrance Animation
    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
            }
        });

        tl.from(".newsletter-card", {
            opacity: 0,
            y: 40,
            duration: 0.7,
            ease: "power3.out"
        })
        .from(".newsletter-child", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.3");

    }, { scope: containerRef });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle subscription logic here
    };

    return (
        <section ref={containerRef} className="bg-[#030712] text-gray-300 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* অ্যাম্বিয়েন্ট গ্লো ইফেক্ট */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="newsletter-card rounded-2xl bg-[#0b0f19]/65 border border-cyan-950/40 p-8 sm:p-12 lg:p-16 backdrop-blur-md text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    
                    {/* আইকন ডেকোরেশন */}
                    <div className="newsletter-child mx-auto w-fit p-4 rounded-full bg-cyan-950/25 border border-cyan-500/20 text-cyan-400 mb-6 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                        <HiOutlineEnvelope className="w-8 h-8" />
                    </div>

                    {/* হেডার টেক্সট */}
                    <h2 className="newsletter-child text-2xl font-bold text-white tracking-tight sm:text-3xl lg:text-4xl mb-4">
                        Stay Ahead of the Hardware Curve
                    </h2>
                    <p className="newsletter-child text-sm sm:text-base text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                        Subscribe to get early notifications on stock drops, hardware architecture deep-dives, and algorithmic price predictions.
                    </p>

                    {/* সাবস্ক্রিপশন ফর্ম */}
                    <form onSubmit={handleSubmit} className="newsletter-child max-w-md mx-auto">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                required
                                placeholder="Enter your professional email"
                                className="w-full px-5 py-3 rounded-xl bg-[#030712]/80 border border-cyan-950/60 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm backdrop-blur-sm"
                            />
                            <motion.button
                                type="submit"
                                className="whitespace-nowrap px-6 py-3 rounded-xl bg-cyan-500 text-[#030712] font-semibold text-sm hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                                whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(34,211,238,0.4)" }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Subscribe Now
                            </motion.button>
                        </div>
                    </form>

                </div>
            </div>
        </section>
    );
};

export default Newsletter;