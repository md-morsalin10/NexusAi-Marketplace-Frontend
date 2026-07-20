"use client";
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Copy, Check, Zap, Target, Sliders, BarChart3,
    Hash, ArrowRight, ChevronDown, RefreshCw
} from 'lucide-react';

const TONES = ['Professional', 'Casual', 'Technical', 'Persuasive', 'Minimalist'];
const PERSONAS = ['Tech Enthusiasts', 'Business Professionals', 'Students', 'Gamers', 'Creators'];

const SEOMeter = ({ score }) => {
    const color = score >= 80 ? '#00f0ff' : score >= 60 ? '#a855f7' : '#ef4444';
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    return (
        <div className="flex flex-col items-center gap-2">
            <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
                <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="8" fill="none" />
                <circle
                    cx="50" cy="50" r="40"
                    stroke={color} strokeWidth="8" fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease', filter: `drop-shadow(0 0 6px ${color})` }}
                />
            </svg>
            <div className="text-center -mt-16 mb-8">
                <span className="text-2xl font-extrabold text-white">{score}</span>
                <span className="text-xs text-slate-400 block">SEO Score</span>
            </div>
        </div>
    );
};

export default function OptimizerPage() {
    const [title, setTitle] = useState('');
    const [specs, setSpecs] = useState('');
    const [persona, setPersona] = useState(PERSONAS[0]);
    const [tone, setTone] = useState(TONES[0]);
    const [output, setOutput] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleOptimize = async () => {
        if (!title.trim()) return;
        setLoading(true);
        // Simulate AI optimization with a delay
        await new Promise(r => setTimeout(r, 1800));

        const keywords = [
            title.toLowerCase().split(' ')[0],
            tone.toLowerCase(),
            persona.toLowerCase().split(' ')[0],
            'AI-powered', 'next-gen', 'smart'
        ].filter(Boolean);

        const seoScore = Math.floor(60 + Math.random() * 38);

        setOutput({
            optimizedTitle: `[${tone.toUpperCase()}] ${title} — Built for ${persona}`,
            description: `Unlock peak performance with the ${title}. Engineered for ${persona.toLowerCase()}, this cutting-edge device delivers ${specs ? specs.slice(0, 80) + '...' : 'unparalleled AI-driven capabilities'}. Designed with a ${tone.toLowerCase()} approach for the modern digital era.`,
            keywords,
            seoScore,
        });
        setLoading(false);
    };

    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(`${output.optimizedTitle}\n\n${output.description}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="min-h-screen bg-[#030712] text-gray-300 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[160px] pointer-events-none rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/6 blur-[160px] pointer-events-none rounded-full" />

            <div className="max-w-7xl mx-auto relative z-10 space-y-12">
                {/* Header */}
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] text-cyan-400 uppercase border border-cyan-900/50 bg-cyan-950/20 px-4 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                        TACTILE PRODUCTION MODULES
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
                        <span className="text-white">AI Prompt &amp; </span>
                        <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Listing Optimizer</span>
                    </h1>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Feed your raw product data into the neural optimization matrix. Our LLM transforms your specs into conversion-maximized, SEO-tuned listings.
                    </p>
                </div>

                {/* Split View */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* LEFT: Input Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-[#0b0f19]/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md space-y-5 shadow-[0_0_40px_rgba(0,240,255,0.04)]"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Sliders className="w-4 h-4 text-cyan-400" />
                            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Input Parameters</h2>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Product Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="e.g. Neural AR Headset Pro X"
                                className="w-full px-4 py-2.5 rounded-xl bg-[#030712]/80 border border-slate-700/60 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Raw Specs / Features</label>
                            <textarea
                                rows={4}
                                value={specs}
                                onChange={e => setSpecs(e.target.value)}
                                placeholder="List raw specs, features, weight, battery life, connectivity..."
                                className="w-full px-4 py-2.5 rounded-xl bg-[#030712]/80 border border-slate-700/60 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Target Persona</label>
                                <div className="relative">
                                    <select
                                        value={persona}
                                        onChange={e => setPersona(e.target.value)}
                                        className="w-full appearance-none px-4 py-2.5 rounded-xl bg-[#030712]/80 border border-slate-700/60 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all cursor-pointer"
                                    >
                                        {PERSONAS.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Tone</label>
                                <div className="relative">
                                    <select
                                        value={tone}
                                        onChange={e => setTone(e.target.value)}
                                        className="w-full appearance-none px-4 py-2.5 rounded-xl bg-[#030712]/80 border border-slate-700/60 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all cursor-pointer"
                                    >
                                        {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <motion.button
                            onClick={handleOptimize}
                            disabled={loading || !title.trim()}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-sm shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:shadow-[0_0_30px_rgba(0,240,255,0.35)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Processing Neural Matrix...</> : <><Sparkles className="w-4 h-4" /> Optimize Listing</>}
                        </motion.button>
                    </motion.div>

                    {/* RIGHT: Output Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-[#0b0f19]/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-[0_0_40px_rgba(168,85,247,0.04)] flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-purple-400" />
                                <h2 className="text-sm font-bold text-white uppercase tracking-widest">Optimized Output Matrix</h2>
                            </div>
                            {output && (
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50 text-slate-300 hover:text-cyan-400 hover:border-cyan-800/50 transition-all"
                                >
                                    {copied ? <><Check className="w-3.5 h-3.5 text-green-400" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                                </button>
                            )}
                        </div>

                        {!output && !loading && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 border border-dashed border-slate-800 rounded-xl p-10">
                                <div className="w-14 h-14 rounded-full bg-slate-800/50 flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-slate-600" />
                                </div>
                                <p className="text-xs text-slate-500">Fill in the parameters and run the optimizer to generate your AI-enhanced listing.</p>
                            </div>
                        )}

                        {loading && (
                            <div className="flex-1 flex flex-col items-center justify-center gap-4">
                                <div className="relative w-20 h-20">
                                    <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
                                    <div className="absolute inset-2 rounded-full border-2 border-purple-500/30 animate-ping" style={{ animationDelay: '0.3s' }} />
                                    <div className="absolute inset-4 rounded-full bg-cyan-500/10 animate-pulse flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-cyan-400" />
                                    </div>
                                </div>
                                <p className="text-xs text-cyan-400 animate-pulse tracking-widest font-bold uppercase">Calibrating neural pathways...</p>
                            </div>
                        )}

                        <AnimatePresence>
                            {output && !loading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-5 flex-1"
                                >
                                    {/* SEO Score */}
                                    <div className="flex items-center justify-between bg-[#030712]/60 rounded-xl p-4 border border-slate-800/60">
                                        <SEOMeter score={output.seoScore} />
                                        <div className="flex-1 pl-4 space-y-3">
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Signal Strength</p>
                                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${output.seoScore}%` }}
                                                        transition={{ duration: 1 }}
                                                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full shadow-[0_0_8px_rgba(0,240,255,0.5)]"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Conversion Index</p>
                                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${output.seoScore - 8}%` }}
                                                        transition={{ duration: 1, delay: 0.2 }}
                                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Optimized Title */}
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Optimized Title</p>
                                        <p className="text-sm font-bold text-white bg-[#030712]/60 rounded-lg px-3 py-2 border border-slate-800/60">{output.optimizedTitle}</p>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Generated Description</p>
                                        <p className="text-xs text-slate-300 leading-relaxed bg-[#030712]/60 rounded-lg px-3 py-2 border border-slate-800/60">{output.description}</p>
                                    </div>

                                    {/* Keywords */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-1.5">
                                            <Hash className="w-3 h-3 text-cyan-400" />
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Suggested Keywords</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {output.keywords.map((kw, i) => (
                                                <span key={i} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-900/50 text-cyan-400">
                                                    #{kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
