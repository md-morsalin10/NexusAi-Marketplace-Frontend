"use client";
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { HiStar } from 'react-icons/hi2';

const Testimonials = () => {
    const containerRef = useRef(null);

    // GadgetHub প্রফেশনাল রিভিউ ডেটা
    const testimonialsData = [
        {
            id: 1,
            name: "Alex Rivera",
            role: "Lead DevOps Engineer",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
            comment: "The AI Shopping Assistant changed how we source enterprise GPUs. It saved us thousands of dollars by predicting the price drops perfectly.",
            rating: 5
        },
        {
            id: 2,
            name: "Zayan Ahmed",
            role: "Full Stack Developer",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
            comment: "Cryptographic hardware authentication gives me complete peace of mind. I know exactly what I'm buying is 100% authentic silicon.",
            rating: 5
        },
        {
            id: 3,
            name: "Sarah Jenkins",
            role: "AI Research Fellow",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
            comment: "Incredible user experience. The integration of cutting-edge tech analytics with a seamless marketplace is exactly what the industry needed.",
            rating: 5
        }
    ];

    // GSAP Entrance Animation (ScrollTrigger)
    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
            }
        });

        tl.from(".testimonial-header", {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power3.out"
        })
        .from(".testimonial-card", {
            opacity: 0,
            y: 40,
            duration: 0.6,
            stagger: 0.12,
            ease: "power2.out"
        }, "-=0.2");

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="bg-[#030712] text-gray-300 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* ব্যাকগ্রাউন্ড গ্লো ইফেক্ট যা GadgetHub থিমকে ফুটিয়ে তুলবে */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/5 blur-[130px] pointer-events-none rounded-full" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* সেন্ট্রাল হেডার সেকশন */}
                <div className="testimonial-header text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-5 sm:text-4xl lg:text-5xl">
                        Trusted by Tech Leaders
                    </h2>
                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        See how developers, engineers, and creators are optimizing their workspace with GadgetHub.
                    </p>
                </div>

                {/* ৩ কলাম টেস্টীমোনিয়াল গ্রিড */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonialsData.map((item) => (
                        <motion.div
                            key={item.id}
                            className="testimonial-card flex flex-col justify-between p-8 rounded-xl bg-[#0b0f19]/60 border border-cyan-950/40 backdrop-blur-md group cursor-pointer"
                            whileHover={{ 
                                scale: 1.02, 
                                backgroundColor: "#0d1322",
                                borderColor: "rgba(34, 211, 238, 0.2)",
                                boxShadow: "0 20px 40px -15px rgba(0,0,0,0.8)"
                            }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 22 }}
                        >
                            <div>
                                {/* রেটিং স্টারস (সায়ান থিম গ্লো) */}
                                <div className="flex items-center gap-1 mb-6">
                                    {[...Array(item.rating)].map((_, i) => (
                                        <HiStar key={i} className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
                                    ))}
                                </div>
                                
                                {/* রিভিউ মেসেজ (Tailwind ক্লাসের টেক্সট কালার ফিক্সড) */}
                                <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-8 italic font-normal">
                                    {item.comment}
                                </p>
                            </div>

                            {/* ইউজার প্রোফাইল ইনফো */}
                            <div className="flex items-center gap-4 pt-4 border-t border-cyan-950/40">
                                <img 
                                    src={item.avatar} 
                                    alt={item.name} 
                                    className="w-11 h-11 rounded-full object-cover border border-cyan-500/20 group-hover:border-cyan-400/60 transition-colors duration-300"
                                    loading="lazy"
                                />
                                <div>
                                    <h4 className="text-sm font-bold text-white tracking-wide group-hover:text-cyan-400 transition-colors duration-300">
                                        {item.name}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {item.role}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Testimonials;