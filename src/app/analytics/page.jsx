"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp, Users, Cpu, DollarSign, Activity,
    ArrowUpRight, ArrowDownRight, Zap, Circle
} from 'lucide-react';

const METRIC_CARDS = [
    { label: 'Total Revenue', value: '$248,390', change: '+18.4%', up: true, icon: DollarSign, color: 'cyan', glow: 'rgba(0,240,255,0.15)' },
    { label: 'Conversion Rate', value: '7.83%', change: '+2.1%', up: true, icon: TrendingUp, color: 'purple', glow: 'rgba(168,85,247,0.15)' },
    { label: 'Neural Accuracy', value: '98.6%', change: '+0.4%', up: true, icon: Cpu, color: 'cyan', glow: 'rgba(0,240,255,0.15)' },
    { label: 'Active Users', value: '14,820', change: '-3.2%', up: false, icon: Users, color: 'purple', glow: 'rgba(168,85,247,0.15)' },
];

const TRANSACTIONS = [
    { id: 'TXN-9821', product: 'Quantum Neural Headset', buyer: 'alex@nexus.io', amount: '$499', time: '2m ago', status: 'completed' },
    { id: 'TXN-9820', product: 'HoloLens Mk-IV', buyer: 'maya@synth.dev', amount: '$1,299', time: '11m ago', status: 'completed' },
    { id: 'TXN-9819', product: 'AR Glove Interface', buyer: 'rion@pulse.ai', amount: '$329', time: '28m ago', status: 'processing' },
    { id: 'TXN-9818', product: 'Nano Compute Chip', buyer: 'zel@vecto.io', amount: '$89', time: '1h ago', status: 'completed' },
    { id: 'TXN-9817', product: 'Synaptic Drive 2TB', buyer: 'nova@grid.co', amount: '$219', time: '2h ago', status: 'flagged' },
];

const BAR_DATA = [
    { label: 'Mon', value: 72 }, { label: 'Tue', value: 58 }, { label: 'Wed', value: 91 },
    { label: 'Thu', value: 65 }, { label: 'Fri', value: 88 }, { label: 'Sat', value: 44 }, { label: 'Sun', value: 77 },
];

const statusColors = {
    completed: 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50',
    processing: 'text-cyan-400 bg-cyan-950/40 border-cyan-900/50',
    flagged: 'text-rose-400 bg-rose-950/40 border-rose-900/50',
};

export default function AnalyticsPage() {
    const [animatedBars, setAnimatedBars] = useState(false);
    const [pulse, setPulse] = useState(0);

    useEffect(() => {
        const t = setTimeout(() => setAnimatedBars(true), 300);
        const interval = setInterval(() => setPulse(p => (p + 1) % TRANSACTIONS.length), 2200);
        return () => { clearTimeout(t); clearInterval(interval); };
    }, []);

    return (
        <section className="min-h-screen bg-[#030712] text-gray-300 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-purple-500/5 blur-[180px] pointer-events-none rounded-full" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[160px] pointer-events-none rounded-full" />

            <div className="max-w-7xl mx-auto relative z-10 space-y-10">
                {/* Header */}
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] text-purple-400 uppercase border border-purple-900/50 bg-purple-950/20 px-4 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                        LIVE TELEMETRY FEEDS
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
                        <span className="text-white">System Performance &amp; </span>
                        <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Telemetry Feeds</span>
                    </h1>
                    <p className="text-sm text-slate-400">Real-time marketplace intelligence. All metrics pulled from live neural network telemetry.</p>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {METRIC_CARDS.map((card, i) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            className="bg-[#0b0f19]/70 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-slate-700/80 transition-all"
                            style={{ boxShadow: `0 0 30px ${card.glow}` }}
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 ${card.color === 'cyan' ? 'bg-cyan-400' : 'bg-purple-400'}`} />
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color === 'cyan' ? 'bg-cyan-950/60 text-cyan-400' : 'bg-purple-950/60 text-purple-400'}`}>
                                    <card.icon className="w-5 h-5" />
                                </div>
                                <span className={`flex items-center gap-0.5 text-xs font-bold ${card.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {card.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                                    {card.change}
                                </span>
                            </div>
                            <p className="text-2xl font-black text-white">{card.value}</p>
                            <p className="text-[11px] text-slate-500 mt-1 font-medium">{card.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Chart + Feed Row */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Bar Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="lg:col-span-3 bg-[#0b0f19]/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Weekly Revenue Waveform</p>
                                <p className="text-lg font-black text-white">$248,390 <span className="text-xs text-emerald-400 font-semibold">↑ 18.4%</span></p>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-bold border border-cyan-900/40 bg-cyan-950/20 px-3 py-1.5 rounded-full">
                                <Activity className="w-3 h-3" /> LIVE
                            </div>
                        </div>
                        {/* Bar Chart Visual */}
                        <div className="flex items-end gap-3 h-44">
                            {BAR_DATA.map((bar, i) => (
                                <div key={bar.label} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full flex items-end justify-center" style={{ height: '140px' }}>
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: animatedBars ? `${(bar.value / 100) * 140}px` : 0 }}
                                            transition={{ duration: 0.7, delay: i * 0.08, ease: 'easeOut' }}
                                            className="w-full rounded-t-lg relative overflow-hidden"
                                            style={{ background: 'linear-gradient(to top, rgba(0,240,255,0.7), rgba(168,85,247,0.4))', boxShadow: '0 0 12px rgba(0,240,255,0.2)' }}
                                        >
                                            <div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)' }} />
                                        </motion.div>
                                    </div>
                                    <span className="text-[10px] text-slate-500">{bar.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Transaction Feed */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="lg:col-span-2 bg-[#0b0f19]/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md"
                    >
                        <div className="flex items-center gap-2 mb-5">
                            <Zap className="w-4 h-4 text-cyan-400" />
                            <p className="text-sm font-bold text-white">Live AI Conversions</p>
                            <span className="ml-auto flex items-center gap-1 text-[9px] font-bold text-emerald-400">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> LIVE
                            </span>
                        </div>
                        <div className="space-y-3">
                            {TRANSACTIONS.map((tx, i) => (
                                <motion.div
                                    key={tx.id}
                                    animate={{ backgroundColor: pulse === i ? 'rgba(0,240,255,0.04)' : 'transparent' }}
                                    transition={{ duration: 0.4 }}
                                    className="flex items-center gap-3 p-2.5 rounded-xl border border-transparent hover:border-slate-800/50 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-slate-800/60 flex items-center justify-center flex-shrink-0">
                                        <DollarSign className="w-4 h-4 text-cyan-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-white truncate">{tx.product}</p>
                                        <p className="text-[10px] text-slate-500 truncate">{tx.buyer} · {tx.time}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-xs font-black text-white">{tx.amount}</p>
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusColors[tx.status]}`}>{tx.status}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
