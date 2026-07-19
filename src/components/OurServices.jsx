"use client";
import React, { useRef } from 'react';
import { Cpu, Terminal, ShieldKeyhole, ArrowUpRight } from '@gravity-ui/icons';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { CiSettings } from 'react-icons/ci';

gsap.registerPlugin(useGSAP);

const servicesData = [
  {
    id: 1,
    icon: <Cpu className="text-cyan-400" style={{ width: '24px', height: '24px' }} />,
    title: "Custom Silicon Design",
    tag: "Compute Units",
    description: "Engineering bespoke ASIC and FPGA architectures tailored specifically for high-frequency trading loops and AI training clusters.",
    capabilities: ["Bespoke Topology", "Thermal Vectoring", "Acceleration Rigs"]
  },
  {
    id: 2,
    icon: <Terminal className="text-purple-400" style={{ width: '24px', height: '24px' }} />,
    title: "Enterprise Deployment",
    tag: "Datacenter Nodes",
    description: "Designing and scaling high-performance bare-metal servers, quantum computational units, and state-of-the-art cooling.",
    capabilities: ["Cluster Scaling", "Immersion Cooling", "Supercomputing"]
  },
  {
    id: 3,
    icon: <ShieldKeyhole className="text-emerald-400" style={{ width: '24px', height: '24px' }} />,
    title: "Quantum Cryptography",
    tag: "Hardware Security",
    description: "Implementing zero-trust hardware security modules (HSMs) and physical cryptographic layers against next-gen interception.",
    capabilities: ["Layer Encryption", "Security Matrix", "Biometric Gates"]
  },
  {
    id: 4,
    icon: <CiSettings className="text-amber-400" style={{ width: '26px', height: '26px' }} />,
    title: "Lifecycle Management",
    tag: "Telemetry & Diagnostics",
    description: "Real-time telemetry monitoring, preventive structural updates, and automated remote component diagnostics.",
    capabilities: ["Predictive AI", "Automated Arrays", "Node Calibration"]
  }
];

const OurServices = () => {
  const pageRef = useRef(null);

  // GSAP: সেকশন এন্ট্রান্স এবং স্ট্যাগারড কার্ড অ্যানিমেশন এফেক্ট
  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from(".service-header-node", {
      opacity: 0,
      y: -30,
      duration: 0.6,
      ease: "power2.out"
    })
    .from(".service-card", {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out"
    }, "-=0.2");
  }, { scope: pageRef });

  return (
    <section ref={pageRef} className="relative w-full min-h-screen py-24 bg-[#04060C] overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Premium Ambient Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b12_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-cyan-500/5 to-purple-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Service Section Header */}
        <div className="service-header-node text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-slate-950/80 border border-slate-800/60 px-4 py-1.5 rounded-xl shadow-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Capabilities Matrix</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Next-Gen Hardware <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 bg-clip-text text-transparent">Solutions & Services</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Architecting raw computation infrastructures, physical layer defense structures, and customized silicon protocols.
          </p>
        </div>

        {/* 4-Column Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesData.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="service-card group relative p-5 rounded-2xl border border-slate-800/60 bg-slate-950/40 backdrop-blur-xl hover:border-slate-700/80 transition-colors duration-300 flex flex-col justify-between overflow-hidden shadow-2xl"
            >
              {/* Futuristic Accent Overlay Glow */}
              <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

              {/* Corner Design Accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/0 rounded-tl group-hover:border-cyan-500/40 transition-all duration-300" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-purple-500/0 rounded-br group-hover:border-purple-500/40 transition-all duration-300" />

              <div className="space-y-4">
                {/* Upper Interface: Icon & Tag */}
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 shadow-inner group-hover:scale-105 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <div className="text-slate-500 group-hover:text-cyan-400 transition-colors duration-300">
                    <ArrowUpRight style={{ width: '18px', height: '18px' }} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </div>
                </div>

                {/* Main Text Structure */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase block">
                    {service.tag}
                  </span>
                  <h3 className="text-base font-black text-white tracking-tight group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {service.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-medium min-h-[64px] line-clamp-4">
                  {service.description}
                </p>

                {/* Sub-capabilities Grid */}
                <div className="space-y-2 pt-4 border-t border-slate-900/85">
                  <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500 block">Deployable Assets</span>
                  <div className="flex flex-wrap gap-1.5">
                    {service.capabilities.map((cap, idx) => (
                      <span 
                        key={idx} 
                        className="text-[10px] font-semibold text-slate-400 bg-slate-900/30 border border-slate-900 px-2 py-0.5 rounded-md group-hover:border-slate-800 group-hover:text-slate-300 transition-all"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Node Button */}
              <div className="mt-6 pt-4 border-t border-slate-900/60">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-center rounded-xl bg-slate-900 border border-slate-800/80 hover:bg-slate-850 hover:border-slate-750 text-slate-300 font-bold text-[10px] uppercase tracking-wider py-2.5 px-3 transition-all duration-300"
                >
                  Initiate Matrix
                </motion.button>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default OurServices;