"use client";
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { HiOutlineArrowRight } from 'react-icons/hi2';

const Blogs = () => {
    const containerRef = useRef(null);

    // ফিক্সড এবং ওয়ার্কিং ইমেজ ইউআরএল ডেটা
    const blogsData = [
        {
            id: 1,
            title: "The Rise of Custom Silicon: Why Next-Gen Architectures Matter",
            excerpt: "Engineering bespoke ASIC and FPGA architectures tailored specifically for high-frequency workflows and AI training.",
            date: "July 15, 2026",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60",
            category: "Hardware"
        },
        {
            id: 2,
            title: "Predicting Global Market Trends: When to Upgrade Your GPU",
            excerpt: "An in-depth analysis of supply chains and cryptographic verification trends determining hardware price cycles.",
            date: "July 12, 2026",
            readTime: "4 min read",
            image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop&q=60",
            category: "Analytics"
        },
        {
            id: 3,
            title: "Implementing Zero-Trust Hardware Security Modules",
            excerpt: "How cryptographic physical layers against next-gen interception are securing corporate deployment clusters.",
            date: "July 08, 2026",
            readTime: "7 min read",
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=60",
            category: "Security"
        }
    ];

    // GSAP Entrance Animation
    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
            }
        });

        tl.from(".blog-header", {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power3.out"
        })
        .from(".blog-card", {
            opacity: 0,
            y: 40,
            duration: 0.6,
            stagger: 0.12,
            ease: "power2.out"
        }, "-=0.2");

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="bg-[#030712] text-gray-300 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />

            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* হেডার সেকশন */}
                <div className="blog-header flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-cyan-950/40 pb-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-4 sm:text-4xl lg:text-5xl">
                            Latest Insights & Articles
                        </h2>
                        <p className="text-sm sm:text-base text-gray-400">
                            Stay updated with deep dives into architecture optimization, tech analytics, and marketplace trends.
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <a 
                            href="#all-blogs" 
                            className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 group bg-cyan-950/20 px-4 py-2 rounded-xl border border-cyan-500/20 hover:border-cyan-400/50 duration-300"
                        >
                            Read All Articles 
                            <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                        </a>
                    </div>
                </div>

                {/* ৩ কলাম কার্ড গ্রিড */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogsData.map((post) => (
                        <motion.article
                            key={post.id}
                            className="blog-card flex flex-col overflow-hidden rounded-xl bg-[#0b0f19]/60 border border-cyan-950/40 backdrop-blur-md group cursor-pointer"
                            whileHover={{ 
                                y: -6,
                                backgroundColor: "#0d1322",
                                borderColor: "rgba(34, 211, 238, 0.2)",
                                boxShadow: "0 20px 40px -15px rgba(0,0,0,0.8)"
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 22 }}
                        >
                            {/* ইমেজ কন্টেইনার */}
                            <div className="relative h-48 w-full overflow-hidden border-b border-cyan-950/30 bg-[#070b14]">
                                <img 
                                    src={post.image} 
                                    alt={post.title} 
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <span className="absolute top-4 left-4 text-xs font-semibold bg-[#030712]/80 text-cyan-400 px-3 py-1.5 rounded-md border border-cyan-500/20 backdrop-blur-sm z-10">
                                    {post.category}
                                </span>
                            </div>

                            {/* কার্ড কনটেন্ট */}
                            <div className="flex flex-col flex-1 p-6">
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                    <span>{post.date}</span>
                                    <span className="w-1 h-1 bg-cyan-500/40 rounded-full" />
                                    <span>{post.readTime}</span>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2 tracking-wide leading-snug">
                                    {post.title}
                                </h3>

                                <p className="text-sm text-gray-400 leading-relaxed mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>

                                <div className="mt-auto pt-4 border-t border-cyan-950/30 flex items-center justify-between text-sm font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                                    <span>Read Article</span>
                                    <HiOutlineArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Blogs;