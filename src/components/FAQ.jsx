"use client";
import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronDown } from 'react-icons/hi2';

const FAQ = () => {
    const containerRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(null);

    const faqData = [
        {
            id: 1,
            question: "How does the AI smart recommendation work?",
            answer: "Our AI engine analyzes your specific professional workflow parameters—such as compilation tasks, container orchestration, or heavy rendering—to match you with components tailored exactly to your computational needs."
        },
        {
            id: 2,
            title: "Is my payment secure on GadgetHub?",
            question: "Is my payment secure on GadgetHub?",
            answer: "Absolutely. Every transaction passes through multi-layer secure cryptographic gateways, backed by automated physical network isolation protocols to guarantee absolute payment safety."
        },
        {
            id: 3,
            question: "Can I list my own tech products?",
            answer: "Yes. Once your enterprise or seller account undergoes hardware verification checking, you can safely list verified components on the global decentralized GadgetHub marketplace."
        }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    // GSAP Entrance Animation
    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
            }
        });

        tl.from(".faq-header", {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power3.out"
        })
        .from(".faq-item", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.2");

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="bg-[#030712] text-gray-300 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* অ্যাম্বিয়েন্ট ব্যাকগ্রাউন্ড গ্লো */}
            <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-cyan-500/5 blur-[140px] pointer-events-none rounded-full" />

            <div className="max-w-4xl mx-auto relative z-10">
                
                {/* হেডার সেকশন */}
                <div className="faq-header text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-4 sm:text-4xl lg:text-5xl">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-sm sm:text-base text-gray-400">
                        Got questions? We have engineered the answers.
                    </p>
                </div>

                {/* অ্যাকোর্ডিয়ন কন্টেইনার */}
                <div className="space-y-4">
                    {faqData.map((item, index) => {
                        const isOpen = activeIndex === index;
                        return (
                            <motion.div
                                layout
                                key={item.id}
                                className="faq-item rounded-xl bg-[#0b0f19]/60 border border-cyan-950/40 backdrop-blur-md overflow-hidden transition-colors duration-300"
                                style={{
                                    borderColor: isOpen ? 'rgba(34, 211, 238, 0.3)' : 'rgba(8, 47, 73, 0.4)'
                                }}
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex items-center justify-between p-6 sm:p-7 text-left focus:outline-none group select-none"
                                >
                                    <span className="text-sm sm:text-base font-medium text-white group-hover:text-cyan-400 transition-colors duration-200 pr-4">
                                        {item.question}
                                    </span>
                                    <motion.div
                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                        transition={{ duration: 0.25, ease: "easeInOut" }}
                                        className={`flex-shrink-0 p-1.5 rounded-lg border bg-cyan-950/10 text-gray-400 transition-colors ${
                                            isOpen ? 'text-cyan-400 border-cyan-500/30' : 'border-cyan-950/40 group-hover:text-white'
                                        }`}
                                    >
                                        <HiChevronDown className="w-5 h-5" />
                                    </motion.div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ height: { duration: 0.25, ease: "easeInOut" }, opacity: { duration: 0.2 } }}
                                        >
                                            <div className="px-6 pb-7 text-sm sm:text-base text-gray-400 leading-relaxed border-t border-cyan-950/20 pt-4 bg-[#030712]/30">
                                                {item.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default FAQ;