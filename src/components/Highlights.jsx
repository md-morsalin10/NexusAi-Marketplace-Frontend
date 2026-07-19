"use client";
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { 
  HiOutlineCpuChip, 
  HiOutlineShieldCheck,
  HiOutlineArrowTrendingDown 
} from 'react-icons/hi2';

const Highlights = () => {
    const containerRef = useRef(null);

    // GadgetHub থিমের কালার কোডের সাথে ম্যাচ করা ডেটা
    const highlightsData = [
        {
            id: 1,
            title: "AI Shopping Assistant",
            description: "Personalized curation based on your professional needs, from coding to cinematic rendering.",
            icon: HiOutlineCpuChip,
            color: "text-cyan-400 bg-cyan-950/20 border-cyan-500/20 group-hover:border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
        },
        {
            id: 2,
            title: "Smart Price Prediction",
            description: "Our algorithms analyze global market trends to tell you the perfect time to upgrade.",
            icon: HiOutlineArrowTrendingDown,
            color: "text-cyan-400 bg-cyan-950/20 border-cyan-500/20 group-hover:border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
        },
        {
            id: 3,
            title: "Hardware Authentication",
            description: "Every high-end component is verified by our multi-step cryptographic security.",
            icon: HiOutlineShieldCheck,
            color: "text-cyan-400 bg-cyan-950/20 border-cyan-500/20 group-hover:border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
        }
    ];

    // GSAP Scroll Reveal Animation
    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
            }
        });

        tl.from(".highlight-header", {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power3.out"
        })
        .from(".highlight-card", {
            opacity: 0,
            y: 40,
            duration: 0.6,
            stagger: 0.12,
            ease: "power2.out"
        }, "-=0.2");

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="bg-[#030712] text-gray-300 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* ব্যাকগ্রাউন্ড হালকা সাইয়ান গ্লো ইফেক্ট (স্ক্রিনশটের ভাইব আনতে) */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/5 blur-[150px] pointer-events-none rounded-full" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* সেন্ট্রাল হেডার সেকশন */}
                <div className="highlight-header text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-5 sm:text-4xl lg:text-5xl font-sans">
                        Engineered for the Intelligence Era
                    </h2>
                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        We combine advanced AI with a trusted marketplace to revolutionize how you acquire and manage your technology.
                    </p>
                </div>

                {/* ৩ কলাম কার্ড গ্রিড */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {highlightsData.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <motion.div
                                key={item.id}
                                className="highlight-card flex flex-col p-8 rounded-xl bg-[#0b0f19]/60 border border-cyan-950/40 backdrop-blur-md group cursor-pointer"
                                whileHover={{ 
                                    scale: 1.02, 
                                    backgroundColor: "#0d1322",
                                    borderColor: "rgba(34, 211, 238, 0.2)"
                                }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                            >
                                {/* আইকন কন্টেইনার (GadgetHub থিম অনুযায়ী সায়ান গ্লোয়িং টোন) */}
                                <div className={`w-fit p-3.5 rounded-xl border ${item.color} mb-6 flex items-center justify-center transition-all duration-300`}>
                                    <IconComponent className="w-6 h-6" />
                                </div>
                                
                                {/* টাইটেল (হভারে নেভবারের অ্যাক্টিভ সায়ান কালার ইফেক্ট) */}
                                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300 tracking-wide">
                                    {item.title}
                                </h3>
                                
                                {/* ডেসক্রিপশন */}
                                <p className="text-sm text-gray-400 leading-relaxed font-normal">
                                    {item.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default Highlights;