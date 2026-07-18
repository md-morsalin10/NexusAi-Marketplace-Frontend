"use client";
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { useRef } from 'react';

const statsData = [
  { id: 1, value: 3400, suffix: "+", label: "TOTAL PRODUCTS" },
  { id: 2, value: 26, suffix: "%", label: "AI ACCURACY" },
  { id: 3, value: 12240, suffix: "", label: "VERIFIED SELLERS" },
  { id: 4, value: 0, suffix: "M", label: "DAILY TRADES" } // ইমেজ অনুযায়ী OM বা 0M
];

const Counter = ({ value, suffix }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1],
      });
      return controls.stop;
    }
  }, [inView, value, count]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
};

const StatsSection = () => {
  return (
    <section className="w-full bg-[#04060C] py-16 border-b border-slate-900/60 relative overflow-hidden">
      {/* Background Micro Grid Layer for Luxury Touch */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b10_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 items-center justify-center text-center">
          {statsData.map((stat) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: stat.id * 0.1, ease: "easeOut" }}
              className="flex flex-col space-y-3 p-4 group"
            >
              {/* Stat Number with Cyber Gradient */}
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(34,211,238,0.1)]">
                <Counter value={stat.value} suffix={stat.suffix} />
              </h2>

              {/* Stat Label */}
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-slate-400 font-mono transition-colors duration-300 group-hover:text-slate-200">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;