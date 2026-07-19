"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FiGlobe, FiShare2 } from 'react-icons/fi';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        platform: [
            { name: 'Explore Tech', href: '#explore' },
            { name: 'AI Assistant', href: '#ai-assistant' },
            { name: 'Seller Dashboard', href: '#dashboard' },
            { name: 'Verified Program', href: '#verified' }
        ],
        resources: [
            { name: 'API Docs', href: '#api' },
            { name: 'Hardware Guide', href: '#guide' },
            { name: 'Careers', href: '#careers' },
            { name: 'Help Center', href: '#help' }
        ],
        legal: [
            { name: 'Privacy Policy', href: '#privacy' },
            { name: 'Terms of Service', href: '#terms' },
            { name: 'Cookie Policy', href: '#cookie' }
        ]
    };

    return (
        <footer className="bg-[#030712] text-gray-400 pt-20 pb-10 px-4 sm:px-6 lg:px-8 border-t border-cyan-950/40 relative overflow-hidden">
            {/* অ্যাম্বিয়েন্ট গ্লো ইফেক্ট */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-cyan-500/5 blur-[100px] pointer-events-none rounded-full" />

            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* মেইন লিংক কন্টেইনার (ড্যাশড বর্ডার রিমুভড, ক্লিন গ্লাস কার্ড লুক) */}
                <div className="bg-[#0b0f19]/40 rounded-2xl p-8 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
                    
                    {/* ব্র্যান্ড ডেসক্রিপশন */}
                    <div className="md:col-span-4 flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl font-bold tracking-wide text-white mb-4">
                                Gadget<span className="text-cyan-400">Hub</span>
                            </h2>
                            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                                The intelligence layer for hardware commerce. Revolutionizing the way the world trades technology.
                            </p>
                        </div>
                        
                        {/* সোশ্যাল আইকন সমুহ */}
                        <div className="flex items-center gap-3 mt-8">
                            <motion.a 
                                href="#globe"
                                className="p-2.5 rounded-full bg-[#030712]/80 border border-cyan-950/60 text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-colors cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiGlobe className="w-4 h-4" />
                            </motion.a>
                            <motion.a 
                                href="#share"
                                className="p-2.5 rounded-full bg-[#030712]/80 border border-cyan-950/60 text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-colors cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiShare2 className="w-4 h-4" />
                            </motion.a>
                        </div>
                    </div>

                    {/* লিংক কলাম - Platform */}
                    <div className="md:col-span-2 md:col-start-6">
                        <h3 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-5">
                            Platform
                        </h3>
                        <ul className="space-y-3.5">
                            {footerLinks.platform.map((link, idx) => (
                                <li key={idx}>
                                    <a href={link.href} className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-200">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* লিংক কলাম - Resources */}
                    <div className="md:col-span-2 md:col-start-9">
                        <h3 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-5">
                            Resources
                        </h3>
                        <ul className="space-y-3.5">
                            {footerLinks.resources.map((link, idx) => (
                                <li key={idx}>
                                    <a href={link.href} className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-200">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* লিংক কলাম - Legal */}
                    <div className="md:col-span-2 md:col-start-11">
                        <h3 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-5">
                            Legal
                        </h3>
                        <ul className="space-y-3.5">
                            {footerLinks.legal.map((link, idx) => (
                                <li key={idx}>
                                    <a href={link.href} className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-200">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* বটম কপিরাইট এরিয়া (বর্ডার রিমুভড ও টপ মার্জিন অ্যাডজাস্টেড) */}
                <div className="mt-10 text-center">
                    <p className="text-xs text-gray-500 tracking-wide">
                        © {currentYear} GadgetHub Marketplace. Powered by Intelligence.
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;