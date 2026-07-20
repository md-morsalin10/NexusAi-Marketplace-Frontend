"use client";
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import { ArrowRight, Cpu } from 'lucide-react';

gsap.registerPlugin(useGSAP);

// ── Skeleton card shown while loading ──────────────────────────────────────
const SkeletonCard = () => (
  <div className="hardware-card group relative p-5 rounded-2xl border border-slate-800/40 bg-slate-950/40 backdrop-blur-xl flex flex-col justify-between shadow-2xl overflow-hidden animate-pulse">
    <div className="space-y-4">
      <div className="relative w-full h-40 rounded-xl bg-slate-800/60" />
      <div className="space-y-2">
        <div className="h-2.5 w-24 bg-slate-800/80 rounded-full" />
        <div className="h-3.5 w-36 bg-slate-700/60 rounded-full" />
        <div className="h-2 w-20 bg-slate-800/50 rounded-full" />
      </div>
      <div className="h-8 bg-slate-800/40 rounded-lg" />
      <div className="pt-3 border-t border-slate-900/80 space-y-2">
        <div className="h-2 w-16 bg-slate-800/60 rounded-full mb-2" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-2 bg-slate-800/40 rounded-full" />
        ))}
      </div>
    </div>
    <div className="pt-4 mt-5 border-t border-slate-900/60">
      <div className="h-9 bg-slate-800/50 rounded-xl" />
    </div>
  </div>
);

// ── Main Section ───────────────────────────────────────────────────────────
const FeaturesSection = () => {
  const containerRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products`
        );
        const data = await res.json();
        // Sort by createdAt descending, take latest 8
        const sorted = Array.isArray(data)
          ? [...data]
              .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
              .slice(0, 8)
          : [];
        setProducts(sorted);
      } catch (err) {
        console.error('FeaturesSection fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useGSAP(() => {
    if (!loading) {
      gsap.from('.hardware-card', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      });
    }
  }, { scope: containerRef, dependencies: [loading] });

  return (
    <section
      ref={containerRef}
      className="relative w-full py-24 bg-[#04060C] overflow-hidden border-b border-slate-900 px-4 sm:px-6 lg:px-8"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b10_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-500/5 to-purple-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-slate-950/80 border border-slate-800/60 px-3.5 py-1.5 rounded-xl shadow-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Latest Hardware Nodes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Flagship Hardware{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 bg-clip-text text-transparent">
              Specifications Matrix
            </span>
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Explore uncompromised silicon structures, thermodynamic cooling grids, and deep processing arrays — pulled live from the Nexus inventory.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
            : products.map((product) => {
                const title = product.title || product.name || 'Unknown Device';
                const price = product.price ? `$${product.price}` : 'N/A';
                const image = product.images?.[0] || product.image || 'https://placehold.co/500x320/0a0f1e/22d3ee?text=No+Image';
                const category = product.category || 'Gadget';
                const description = product.description || 'No description available.';
                const specs = Array.isArray(product.specifications)
                  ? product.specifications.slice(0, 4)
                  : [];

                return (
                  <motion.div
                    key={product._id}
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="hardware-card group relative p-5 rounded-2xl border border-slate-800/60 bg-slate-950/40 backdrop-blur-xl hover:border-slate-700/80 transition-colors duration-300 flex flex-col justify-between shadow-2xl overflow-hidden"
                  >
                    {/* Corner Design Accents */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/0 rounded-tl group-hover:border-cyan-500/40 transition-all duration-300" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-purple-500/0 rounded-br group-hover:border-purple-500/40 transition-all duration-300" />

                    <div className="space-y-4">
                      {/* Image — wrapped in Link */}
                      <Link href={`/products/${product._id}`}>
                        <div className="relative w-full h-40 rounded-xl bg-slate-900 overflow-hidden border border-slate-800/80 group-hover:border-slate-700/60 transition-colors cursor-pointer">
                          <motion.img
                            src={image}
                            alt={title}
                            whileHover={{ scale: 1.06 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100"
                          />
                          {/* Floating category badge */}
                          <div className="absolute top-2 left-2 h-7 px-2 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800/60 flex items-center gap-1">
                            <Cpu className="w-3 h-3 text-cyan-400" />
                            <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider">{category}</span>
                          </div>
                          {/* Price badge */}
                          <span className="absolute bottom-2 right-2 text-xs font-black tracking-tight text-white bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800/60">
                            {price}
                          </span>
                        </div>
                      </Link>

                      {/* Title & meta */}
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                          {category}
                        </div>
                        <Link href={`/products/${product._id}`}>
                          <h3 className="text-base font-black text-white tracking-tight group-hover:text-cyan-400 transition-colors line-clamp-1 cursor-pointer">
                            {title}
                          </h3>
                        </Link>
                        <p className="text-[10px] font-semibold text-slate-400 tracking-wide">
                          {product.sellerEmail || 'NexusAI Store'}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-400 leading-relaxed font-medium line-clamp-2">
                        {description}
                      </p>

                      {/* Specs */}
                      {specs.length > 0 && (
                        <div className="pt-3 border-t border-slate-900/80 space-y-2">
                          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 block">
                            Technical Specs
                          </span>
                          <ul className="space-y-1">
                            {specs.map((spec, i) => (
                              <li key={i} className="flex items-center text-[11px] font-medium text-slate-400">
                                <span className="w-1 h-1 rounded-full bg-slate-700 mr-2 group-hover:bg-cyan-500 transition-colors" />
                                {spec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4 mt-5 border-t border-slate-900/60">
                      <Link href={`/products/${product._id}`} className="block">
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-[10px] uppercase tracking-wider py-3 px-4 hover:bg-slate-800/80 hover:text-white hover:border-slate-700 transition-all duration-300"
                        >
                          <span>View Full Details</span>
                          <ArrowRight className="h-3 w-3" />
                        </motion.button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
        </div>

        {/* View all link */}
        {!loading && products.length > 0 && (
          <div className="text-center mt-12">
            <Link href="/all-products">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,240,255,0.2)' }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-cyan-900/50 bg-cyan-950/20 text-cyan-400 font-bold text-sm hover:bg-cyan-950/40 transition-all"
              >
                Explore Full Marketplace <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturesSection;