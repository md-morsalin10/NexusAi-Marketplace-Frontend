"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Brain, Search, Zap, Shield, Network, Globe,
    ArrowRight, ChevronRight, Cpu, Lock, Layers
} from 'lucide-react';
import Link from 'next/link';

const PILLARS = [
    {
        icon: Brain,
        title: 'Autonomous Matching',
        tag: '01 // COGNITION',
        color: 'cyan',
        glow: 'rgba(0,240,255,0.12)',
        border: 'border-cyan-900/50',
        badge: 'bg-cyan-950/40 text-cyan-400 border-cyan-900/50',
        description: 'Our multi-layer neural network maps buyer intent vectors to seller inventory in real-time. Sub-millisecond matching across 500k+ product embeddings with 98.6% alignment accuracy.',
        stats: [
            { label: 'Model Parameters', value: '70B+' },
            { label: 'Match Latency', value: '<4ms' },
            { label: 'Accuracy', value: '98.6%' },
        ],
    },
    {
        icon: Search,
        title: 'Real-time Vector Search',
        tag: '02 // INDEXING',
        color: 'purple',
        glow: 'rgba(168,85,247,0.12)',
        border: 'border-purple-900/50',
        badge: 'bg-purple-950/40 text-purple-400 border-purple-900/50',
        description: 'Semantic product discovery powered by a distributed HNSW vector index. Queries traverse graph layers using cosine similarity, returning conceptually relevant listings even for vague natural-language inputs.',
        stats: [
            { label: 'Index Dimension', value: '1536-D' },
            { label: 'Throughput', value: '12k/sec' },
            { label: 'Query Recall', value: '99.1%' },
        ],
    },
    {
        icon: Zap,
        title: 'Zero-latency Transactions',
        tag: '03 // SETTLEMENT',
        color: 'cyan',
        glow: 'rgba(0,240,255,0.12)',
        border: 'border-cyan-900/50',
        badge: 'bg-cyan-950/40 text-cyan-400 border-cyan-900/50',
        description: 'End-to-end encrypted payment lanes with Stripe-powered settlement. Escrow logic, automatic refund orchestration, and webhook-driven order confirmation — all orchestrated under 200ms.',
        stats: [
            { label: 'Settlement', value: '< 200ms' },
            { label: 'Uptime', value: '99.99%' },
            { label: 'Encryption', value: 'AES-256' },
        ],
    },
];

const TEAM_NODES = [
    { role: 'Neural Architect', icon: Brain, desc: 'Designs the embedding pipelines and model fine-tuning strategies.' },
    { role: 'Systems Engineer', icon: Cpu, desc: 'Owns the distributed infrastructure and sub-millisecond SLAs.' },
    { role: 'Security Kernel', icon: Lock, desc: 'Enforces zero-trust architecture and cryptographic audit trails.' },
    { role: 'Interface Layer', icon: Layers, desc: 'Crafts the human-AI interaction surface and experience flows.' },
];

export default function AboutPage() {
    const [hoveredPillar, setHoveredPillar] = useState(null);

    return (
        <section className="min-h-screen bg-[#030712] text-gray-300 relative overflow-hidden">
            <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-cyan-500/4 blur-[200px] pointer-events-none rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[180px] pointer-events-none rounded-full" />

            {/* ── HERO ── */}
            <div className="py-24 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-5xl mx-auto text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] text-cyan-400 uppercase border border-cyan-900/50 bg-cyan-950/20 px-4 py-1.5 rounded-full mb-6">
                            <Network className="w-3 h-3" />
                            NEXUS ARCHITECTURE v4.1
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none"
                    >
                        <span className="text-white">The Nexus </span>
                        <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%] animate-[shimmer_4s_linear_infinite]">Architecture</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        NexusAI Marketplace is built on a tripartite AI infrastructure — a self-optimizing lattice of autonomous matching, semantic retrieval, and instantaneous settlement. We did not build a marketplace. We built a cognitive commerce engine.
                    </motion.p>

                    {/* Infrastructure Badge Row */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                        className="flex flex-wrap items-center justify-center gap-3 pt-2"
                    >
                        {['MongoDB Atlas', 'Groq LPU', 'Next.js 16', 'Stripe', 'Better Auth', 'HNSW Index'].map(tech => (
                            <span key={tech} className="text-[10px] font-bold text-slate-400 border border-slate-800/80 bg-slate-900/40 px-3 py-1 rounded-full">
                                {tech}
                            </span>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* ── CORE PILLARS ── */}
            <div className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 space-y-3">
                        <p className="text-[10px] font-bold tracking-[0.25em] text-purple-400 uppercase">Core Technology Pillars</p>
                        <h2 className="text-3xl font-black text-white">Three Systems. One Nexus.</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {PILLARS.map((pillar, i) => (
                            <motion.div
                                key={pillar.title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.15 }}
                                onHoverStart={() => setHoveredPillar(i)}
                                onHoverEnd={() => setHoveredPillar(null)}
                                className={`relative bg-[#0b0f19]/80 border ${pillar.border} rounded-2xl p-7 backdrop-blur-md cursor-default group transition-all duration-300`}
                                style={{ boxShadow: hoveredPillar === i ? `0 0 50px ${pillar.glow}` : `0 0 20px ${pillar.glow}` }}
                            >
                                {/* Top accent line */}
                                <div className={`absolute top-0 left-8 right-8 h-px ${pillar.color === 'cyan' ? 'bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent' : 'bg-gradient-to-r from-transparent via-purple-500/50 to-transparent'}`} />

                                <span className={`inline-flex items-center text-[9px] font-black tracking-[0.2em] px-2.5 py-1 rounded-full border ${pillar.badge} mb-5`}>
                                    {pillar.tag}
                                </span>

                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${pillar.color === 'cyan' ? 'bg-cyan-950/60 text-cyan-400' : 'bg-purple-950/60 text-purple-400'}`}
                                    style={{ boxShadow: `0 0 20px ${pillar.glow}` }}
                                >
                                    <pillar.icon className="w-6 h-6" />
                                </div>

                                <h3 className="text-xl font-black text-white mb-3">{pillar.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed mb-6">{pillar.description}</p>

                                {/* Stats row */}
                                <div className="grid grid-cols-3 gap-2 pt-5 border-t border-slate-800/60">
                                    {pillar.stats.map(stat => (
                                        <div key={stat.label} className="text-center">
                                            <p className={`text-base font-black ${pillar.color === 'cyan' ? 'text-cyan-400' : 'text-purple-400'}`}>{stat.value}</p>
                                            <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── TEAM NODES ── */}
            <div className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10 space-y-3">
                        <p className="text-[10px] font-bold tracking-[0.25em] text-cyan-400 uppercase">Engineering Nodes</p>
                        <h2 className="text-3xl font-black text-white">Built by Specialists</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {TEAM_NODES.map((node, i) => (
                            <motion.div
                                key={node.role}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className="bg-[#0b0f19]/70 border border-slate-800/70 rounded-2xl p-5 group hover:border-cyan-900/60 transition-all duration-300"
                            >
                                <div className="w-10 h-10 rounded-xl bg-slate-800/60 text-cyan-400 flex items-center justify-center mb-4 group-hover:bg-cyan-950/60 transition-colors">
                                    <node.icon className="w-5 h-5" />
                                </div>
                                <h4 className="text-sm font-black text-white mb-2">{node.role}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">{node.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── CTA BLOCK ── */}
            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden border border-cyan-900/40"
                    style={{ background: 'linear-gradient(135deg, #0b0f19 0%, #0a0e1a 50%, #0d0a1e 100%)' }}
                >
                    {/* Grid overlay */}
                    <div className="absolute inset-0 opacity-[0.04]" style={{
                        backgroundImage: 'linear-gradient(rgba(0,240,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }} />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-cyan-500/15 blur-[60px]" />
                    <div className="absolute bottom-0 left-1/4 w-48 h-24 bg-purple-500/15 blur-[60px]" />

                    <div className="relative z-10 p-12 sm:p-16 text-center space-y-7">
                        <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] text-cyan-400 uppercase border border-cyan-900/50 bg-cyan-950/30 px-4 py-1.5 rounded-full">
                            <Globe className="w-3 h-3" /> ENTER THE NEXUS
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                            Ready to transact at the<br />
                            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">speed of thought?</span>
                        </h2>
                        <p className="text-sm text-slate-400 max-w-lg mx-auto">
                            Join 14,820+ buyers and sellers already operating on the NexusAI network. Your AI-powered commerce journey starts with a single click.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                            <Link href="/register">
                                <motion.button
                                    whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(0,240,255,0.35)' }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-sm shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all"
                                >
                                    Join the Nexus <ArrowRight className="w-4 h-4" />
                                </motion.button>
                            </Link>
                            <Link href="/all-products">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-slate-700/60 bg-slate-900/40 text-slate-300 font-bold text-sm hover:border-cyan-900/50 hover:text-white transition-all"
                                >
                                    Browse Marketplace <ChevronRight className="w-4 h-4" />
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
