"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ChevronLeft, ChevronRight } from '@gravity-ui/icons';

const slidesData = [
  {
    id: 1,
    badge: "Architectural Workstations",
    title: "Premium MacBook Pro & Core Laptop Ecosystems",
    description: "Empower computational workflow density with raw silicon dominance. Discover pristine workspace layouts engineered for multi-threaded compilation and cinema-grade rendering loops.",
    bgImage: "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?q=80&w=2000&auto=format&fit=crop",
    productImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
    primaryCta: "Deploy Ultimate Silicon",
    secondaryCta: "System Profiler",
    accentGlow: "from-[#06B6D4]/20 to-[#38BDF8]/5"
  },
  {
    id: 2,
    badge: "Extreme Ray-Tracing Vectors",
    title: "Flagship Custom PC Nodes & Liquid GPUs",
    description: "Unlock uncompromised vector calculation paths and real-time parallel processing arrays. Source high-tier bare-metal components engineered to scale.",
    bgImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2000&auto=format&fit=crop",
    productImage: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop",
    primaryCta: "Acquire Power Units",
    secondaryCta: "Telemetry Feeds",
    accentGlow: "from-[#7C3AED]/20 to-[#EC4899]/5"
  },
  {
    id: 3,
    badge: "Tactile Production Modules",
    title: "High-Tier iPad Outfits & Spatial Audio Systems",
    description: "Tap into true acoustic translation grids and ultra-responsive precision glass setups. Engineered carefully for professional audio mastering and raw asset sketching.",
    bgImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000&auto=format&fit=crop",
    productImage: "https://images.unsplash.com/photo-1545127398-14699f92334b?q=80&w=800&auto=format&fit=crop",
    primaryCta: "Calibrate Studio Rig",
    secondaryCta: "Acoustic Nodes",
    accentGlow: "from-[#F59E0B]/20 to-[#EF4444]/5"
  }
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const bannerRef = useRef(null);
  const particleContainerRef = useRef(null);
  const cardFrameRef = useRef(null);
  const bgImageRef = useRef(null);
  const titleRef = useRef(null);
  const spotlightRef = useRef(null);

  // GSAP: Ambient Particles & Background Orbit Drifting
  useGSAP(() => {
    const particles = particleContainerRef.current?.children;
    if (particles) {
      Array.from(particles).forEach((p) => {
        gsap.to(p, {
          y: "random(-100, 100)",
          x: "random(-50, 50)",
          opacity: "random(0.15, 0.75)",
          scale: "random(0.6, 1.4)",
          duration: "random(5, 8)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });
    }

    if (bgImageRef.current) {
      gsap.to(bgImageRef.current, {
        scale: 1.04,
        x: "random(-15, 15)",
        y: "random(-10, 10)",
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, [current]);

  // GSAP: Title Character Split Reveal Animation
  useEffect(() => {
    if (!titleRef.current) return;
    const chars = titleRef.current.querySelectorAll('.char-node');
    gsap.fromTo(chars, 
      { opacity: 0, y: 35, rotateX: -40 },
      { opacity: 1, y: 0, rotateX: 0, duration: 0.75, stagger: 0.02, ease: "power4.out" }
    );
  }, [current]);

  // Combined Interaction: 3D Parallax & Spotlight Positioning
  const handleMouseMove = (e) => {
    if (!bannerRef.current) return;
    const { clientX, clientY } = e;
    const bounds = bannerRef.current.getBoundingClientRect();
    const x = clientX - bounds.left;
    const y = clientY - bounds.top;

    if (spotlightRef.current) {
      gsap.to(spotlightRef.current, {
        x: x - 250,
        y: y - 250,
        duration: 0.4,
        ease: "power2.out"
      });
    }

    if (cardFrameRef.current) {
      const xPos = (clientX / window.innerWidth - 0.5) * 30; 
      const yPos = (clientY / window.innerHeight - 0.5) * -30;
      gsap.to(cardFrameRef.current, {
        rotationY: xPos,
        rotationX: yPos,
        transformPerspective: 1200,
        ease: "power2.out",
        duration: 0.5
      });
    }
  };

  const handleMouseLeave = () => {
    if (cardFrameRef.current) {
      gsap.to(cardFrameRef.current, { rotationY: 0, rotationX: 0, ease: "power3.out", duration: 0.8 });
    }
  };

  const handleNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev === slidesData.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? slidesData.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(handleNext, 9000);
    return () => clearInterval(timer);
  }, [current]);

  const activeSlide = slidesData[current];

  return (
    <section 
      ref={bannerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[88vh] min-h-[660px] flex items-center bg-[#04060C] overflow-hidden border-b border-slate-900 px-4 sm:px-6 lg:px-8"
    >
      
      {/* Interactive Laser Spotlight Layer */}
      <div 
        ref={spotlightRef}
        className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-cyan-500/5 to-purple-500/5 blur-[100px] pointer-events-none z-10 mix-blend-screen"
        style={{ left: 0, top: 0 }}
      />

      {/* Cinematic Full Screen Background Layer */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={`bg-${current}`}
            initial={{ opacity: 0, filter: "brightness(40%) blur(4px)" }}
            animate={{ opacity: 0.45, filter: "brightness(80%) blur(0px)" }}
            exit={{ opacity: 0, filter: "brightness(30%) blur(6px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full absolute inset-0 perspective-1000"
          >
            <img
              ref={bgImageRef}
              src={activeSlide.bgImage}
              alt="GadgetHub Premium Grid Canvas"
              className="w-full h-full object-cover select-none pointer-events-none filter contrast-125"
            />
          </motion.div>
        </AnimatePresence>

        {/* Premium Geometric Studio Grading */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#04060C] via-[#04060C]/90 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04060C] via-transparent to-[#04060C]/70 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] z-10" />
      </div>

      {/* High-Density Ambient Particle Grid */}
      <div ref={particleContainerRef} className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {[...Array(22)].map((_, i) => (
          <div 
            key={i} 
            suppressHydrationWarning
            className="absolute w-1 h-1 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-400" 
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Dynamic Structural Ambient Plasma Glow */}
      <div className={`absolute top-[-10%] right-1/4 w-[650px] h-[650px] bg-gradient-to-br ${activeSlide.accentGlow} rounded-full blur-[180px] pointer-events-none z-10 transition-all duration-1000`} />

      {/* Main Core Presentation Context */}
      <div className="mx-auto max-w-7xl w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-20">
        
        {/* Left Typography Matrix Column */}
        <div className="md:col-span-7 flex flex-col justify-center space-y-7">
          
          {/* Cyber Micro Badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`badge-${current}`}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="inline-flex items-center space-x-2.5 bg-slate-950/80 border border-slate-800 backdrop-blur-2xl px-4 py-2 rounded-xl w-fit shadow-2xl shadow-black/60"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                {activeSlide.badge}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Premium Character Splitting Reveal Title */}
          <h1 
            ref={titleRef}
            className="text-4xl sm:text-5xl lg:text-[56px] font-black text-white tracking-tight leading-[1.08] perspective-1000"
          >
            {activeSlide.title.split(' ').map((word, wordIdx) => {
              const wordLower = word.toLowerCase();
              const isAccent = wordLower.includes('macbook') || 
                              wordLower.includes('pc') || 
                              wordLower.includes('gpu') || 
                              wordLower.includes('ipad') || 
                              wordLower.includes('audio') ||
                              wordLower.includes('gadgethub');
              return (
                <span key={wordIdx} className="inline-block mr-3 whitespace-nowrap">
                  {word.split('').map((char, charIdx) => (
                    <span 
                      key={charIdx} 
                      className={`char-node inline-block origin-bottom ${
                        isAccent 
                          ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 bg-clip-text text-transparent font-black drop-shadow-[0_2px_15px_rgba(34,211,238,0.15)]' 
                          : ''
                      }`}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              );
            })}
          </h1>

          {/* Luxury Description Block */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${current}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="text-sm sm:text-base text-slate-400 font-medium leading-relaxed max-w-xl"
            >
              {activeSlide.description}
            </motion.p>
          </AnimatePresence>

          {/* System Control Interface Trigger Blocks */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`ctas-${current}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center space-x-4.5 pt-2"
            >
              <button className="relative group overflow-hidden px-7 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 font-black text-xs uppercase tracking-wider text-slate-950 shadow-2xl shadow-cyan-500/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/25 active:translate-y-0">
                <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                {activeSlide.primaryCta}
              </button>
              <button className="px-7 py-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 text-slate-300 hover:text-white font-black text-xs uppercase tracking-wider transition-all duration-300 backdrop-blur-xl shadow-lg hover:-translate-y-0.5">
                {activeSlide.secondaryCta}
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side Column: Hyper-Premium 3D Floating Component Showcase */}
        <div className="hidden md:col-span-5 md:flex justify-end items-center perspective-1200">
          <AnimatePresence mode="wait">
            <motion.div
              key={`product-${current}`}
              ref={cardFrameRef}
              initial={{ opacity: 0, scale: 0.9, rotateY: direction * 20, z: -100 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0, z: 0 }}
              exit={{ opacity: 0, scale: 0.92, rotateY: direction * -20, z: -50 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="relative p-3 rounded-2xl border border-slate-800/60 bg-slate-950/40 backdrop-blur-2xl shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)] w-[390px] h-[390px] lg:w-[430px] lg:h-[430px] flex items-center justify-center group"
            >
              <div className="w-full h-full rounded-xl overflow-hidden bg-[#070A12] border border-slate-900 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#04060C]/90 z-10 transition-opacity group-hover:opacity-80" />
                <motion.img 
                  src={activeSlide.productImage} 
                  alt="GadgetHub Hardware Showcase Node" 
                  className="w-full h-full object-cover opacity-90 transition-transform duration-1000 ease-out group-hover:scale-108"
                />
              </div>

              {/* Technical Precision Target Accents */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyan-500/60 rounded-tl-lg group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-cyan-500/20 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-purple-500/20 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-purple-500/60 rounded-br-lg group-hover:scale-110 transition-transform duration-300" />
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Cyber Steering Slider Direction Controllers */}
      <div className="absolute bottom-8 right-8 flex items-center space-x-3.5 z-30">
        <button 
          onClick={handlePrev}
          className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/90 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 transition-all focus:outline-none backdrop-blur-xl shadow-2xl active:scale-90"
        >
          <ChevronLeft style={{ width: '20px', height: '20px' }} />
        </button>
        <button 
          onClick={handleNext}
          className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/90 text-slate-400 hover:text-sky-400 hover:border-sky-400/30 transition-all focus:outline-none backdrop-blur-xl shadow-2xl active:scale-90"
        >
          <ChevronRight style={{ width: '20px', height: '20px' }} />
        </button>
      </div>

      {/* Bottom Interface Segment Track Matrix */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
        {slidesData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > current ? 1 : -1);
              setCurrent(idx);
            }}
            className={`h-1 rounded-full transition-all duration-500 ease-out ${
              idx === current 
                ? 'w-11 bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_15px_rgba(34,211,238,0.6)]' 
                : 'w-2 bg-slate-800 hover:bg-slate-700'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;