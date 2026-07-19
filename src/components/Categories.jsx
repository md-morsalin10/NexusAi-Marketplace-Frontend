"use client";
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { 
  HiOutlineCpuChip, 
  HiOutlineServer, 
} from 'react-icons/hi2';
import { BiLaptop, BiMouse } from 'react-icons/bi';
import { HiOutlineDesktopComputer } from 'react-icons/hi';
import { Headphones } from '@gravity-ui/icons';
import { TbDeviceGamepad } from 'react-icons/tb';

const Categories = () => {
    const containerRef = useRef(null);

    // GadgetHub থিমের সায়ান নিওন টোনের সাথে সামঞ্জস্যপূর্ণ ডেটা
    const categoriesData = [
        { id: 1, name: 'Laptop', icon: BiLaptop },
        { id: 2, name: 'Desktop', icon: HiOutlineDesktopComputer },
        { id: 3, name: 'GPU', icon: HiOutlineCpuChip },
        { id: 4, name: 'CPU', icon: HiOutlineServer },
        { id: 5, name: 'Audio', icon: Headphones },
        { id: 6, name: 'Gaming', icon: TbDeviceGamepad },
        { id: 7, name: 'Accessories', icon: BiMouse },
    ];

    // GSAP Entrance Animation
    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from(".header-title", {
            opacity: 0,
            y: -15,
            duration: 0.5,
            ease: "power3.out"
        })
        .from(".view-all-btn", {
            opacity: 0,
            x: 15,
            duration: 0.4,
            ease: "power3.out"
        }, "-=0.3")
        .from(".category-card", {
            opacity: 0,
            y: 25,
            duration: 0.5,
            stagger: 0.06,
            ease: "power2.out"
        }, "-=0.2");

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="bg-[#030712] text-gray-300 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
            <div className="max-w-7xl mx-auto">
                
                {/* হেডার সেকশন */}
                <div className="flex justify-between items-end mb-10 border-b border-cyan-950/40 pb-6">
                    <div className="header-title">
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-2 sm:text-4xl">
                            Explore Categories
                        </h2>
                        <p className="text-sm sm:text-base text-gray-400">
                            Find the perfect hardware for your digital workspace.
                        </p>
                    </div>
                    <div className="view-all-btn">
                        <a 
                            href="#all-categories" 
                            className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 group bg-cyan-950/20 px-4 py-2 rounded-xl border border-cyan-500/20 hover:border-cyan-400/50 duration-300"
                        >
                            View All 
                            <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                        </a>
                    </div>
                </div>

                {/* গ্রিড কন্টেইনার */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4">
                    {categoriesData.map((category) => {
                        const IconComponent = category.icon;
                        return (
                            <motion.div
                                key={category.id}
                                className="category-card flex flex-col items-center justify-center p-6 rounded-xl bg-[#0b0f19]/60 border border-cyan-950/40 cursor-pointer backdrop-blur-md group"
                                whileHover={{ 
                                    scale: 1.03, 
                                    backgroundColor: "#0d1322",
                                    borderColor: "rgba(34, 211, 238, 0.2)",
                                    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.7)"
                                }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                            >
                                {/* আইকন কন্টেইনার (সায়ান থিম ও গ্লোয়িং ইফেক্ট) */}
                                <motion.div 
                                    className="p-3.5 rounded-xl border border-cyan-500/25 bg-cyan-950/20 text-cyan-400 mb-4 flex items-center justify-center transition-all duration-300 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                                    whileHover={{ y: -4, rotate: 4 }}
                                    transition={{ type: "spring", stiffness: 350, damping: 12 }}
                                >
                                    <IconComponent className="w-6 h-6" />
                                </motion.div>
                                
                                {/* ক্যাটাগরি নাম */}
                                <span className="text-sm font-medium text-gray-400 group-hover:text-cyan-400 transition-colors duration-300 tracking-wide">
                                    {category.name}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Categories;