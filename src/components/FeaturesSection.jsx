"use client";
import React, { useRef } from 'react';
import { Cpu, Thunderbolt, ChartBar, ShieldCheck } from '@gravity-ui/icons';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// GSAP প্লাগইন রেজিস্ট্রি
gsap.registerPlugin(useGSAP);

const featuresData = [
  {
    id: 1,
    icon: <Cpu className="text-cyan-400" style={{ width: '20px', height: '24px' }} />,
    deviceName: "MacBook Pro Node",
    model: "MBP-M3Max-2026",
    price: "$3,499",
    color: "Space Black",
    variant: "16-Core CPU / 40-Core GPU",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80",
    description: "Raw silicon dominance engineered for multi-threaded compilation and real-time cinematic render loops.",
    specifications: [
      "128GB Unified Memory",
      "2TB NVMe PCIe 4.0 SSD",
      "Liquid Retina XDR 120Hz",
      "16-Core Neural Engine"
    ]
  },
  {
    id: 2,
    icon: <Thunderbolt className="text-purple-400" style={{ width: '24px', height: '24px' }} />,
    deviceName: "Liquid GPU Rig",
    model: "RTX-5090Ti-Node",
    price: "$2,199",
    color: "Titanium Silver",
    variant: "32GB GDDR7 Extreme",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80",
    description: "Unlock uncompromised ray-tracing vectors and deep learning neural paths with massive parallel computing power.",
    specifications: [
      "24,576 CUDA Cores",
      "600W TDP Liquid Cooled",
      "PCIe 5.0 Interface Architecture",
      "DLSS 4.0 Neural Vectoring"
    ]
  },
  {
    id: 3,
    icon: <ChartBar className="text-emerald-400" style={{ width: '24px', height: '24px' }} />,
    deviceName: "Spatial Audio Array",
    model: "Studio-Node-X1",
    price: "$899",
    color: "Anodized Slate",
    variant: "Studio Master Edition",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=500&q=80",
    description: "True acoustic translation grids designed for pristine frequency response and directional wave monitoring.",
    specifications: [
      "Linear Frequency 20Hz-40kHz",
      "Quad-Amp Dynamic Drivers",
      "Spatial Audio Engine V2",
      "Ultra-Low Latency Wireless"
    ]
  },
  {
    id: 4,
    icon: <ShieldCheck className="text-amber-400" style={{ width: '24px', height: '24px' }} />,
    deviceName: "Core Security Firewall",
    model: "Crypto-Gate-Zero",
    price: "$549",
    color: "Matte Obsidian",
    variant: "Enterprise Bare-Metal",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=500&q=80",
    description: "Hardware-level cryptographic layers providing decentralized validation protocols across connected nodes.",
    specifications: [
      "Quantum-Resistant Chips",
      "Dual Hardware Token Rig",
      "Real-time Telemetry Shielding",
      "Zero-Trust Access Matrix"
    ]
  }
];

const FeaturesSection = () => {
  const containerRef = useRef(null);

  // GSAP: স্ক্রিন এন্টার করার সময় স্ট্যাগারড রিভিল অ্যানিমেশন এফেক্ট
  useGSAP(() => {
    gsap.from(".hardware-card", {
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full py-24 bg-[#04060C] overflow-hidden border-b border-slate-900 px-4 sm:px-6 lg:px-8">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b10_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-500/5 to-purple-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-slate-950/80 border border-slate-800/60 px-3.5 py-1.5 rounded-xl shadow-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Hardware Nodes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Flagship Hardware <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 bg-clip-text text-transparent">Specifications Matrix</span>
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Explore uncompromised silicon structures, thermodynamic cooling grids, and deep processing arrays.
          </p>
        </div>

        {/* 4-Column Specifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresData.map((feature) => (
            <motion.div
              key={feature.id}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="hardware-card group relative p-5 rounded-2xl border border-slate-800/60 bg-slate-950/40 backdrop-blur-xl hover:border-slate-700/80 transition-colors duration-300 flex flex-col justify-between shadow-2xl overflow-hidden"
            >
              {/* Corner Design Accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/0 rounded-tl group-hover:border-cyan-500/40 transition-all duration-300" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-purple-500/0 rounded-br group-hover:border-purple-500/40 transition-all duration-300" />
              
              <div className="space-y-4">
                {/* Visual Node: Product Image Canvas */}
                <div className="relative w-full h-40 rounded-xl bg-slate-900 overflow-hidden border border-slate-800/80 group-hover:border-slate-700/60 transition-colors">
                  <motion.img 
                    src={feature.image} 
                    alt={feature.deviceName}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100"
                  />
                  {/* Floating Badge */}
                  <div className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800/60 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <span className="absolute bottom-2 right-2 text-xs font-black tracking-tight text-white bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800/60">
                    {feature.price}
                  </span>
                </div>
                
                {/* Main Identification Fields */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 tracking-wider uppercase flex items-center justify-between">
                    <span>{feature.model}</span>
                    <span className="text-slate-400 lowercase group-hover:text-cyan-400 transition-colors">{feature.color}</span>
                  </div>
                  <h3 className="text-base font-black text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                    {feature.deviceName}
                  </h3>
                  <p className="text-[10px] font-semibold text-slate-400 tracking-wide">
                    {feature.variant}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {feature.description}
                </p>

                {/* Sub-Grid Specs */}
                <div className="pt-3 border-t border-slate-900/80 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 block">Technical Specs</span>
                  <ul className="space-y-1">
                    {feature.specifications.map((spec, index) => (
                      <li key={index} className="flex items-center text-[11px] font-medium text-slate-400">
                        <span className="w-1 h-1 rounded-full bg-slate-700 mr-2 group-hover:bg-cyan-500 transition-colors" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button: Full-width Details Row */}
              <div className="pt-4 mt-5 border-t border-slate-900/60 flex items-center justify-center">
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center space-x-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-[10px] uppercase tracking-wider py-3 px-4 hover:bg-slate-850 hover:text-white hover:border-slate-700 transition-all duration-300"
                >
                  <span>View Full Details</span>
                  <svg className="h-3 w-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </motion.button>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;