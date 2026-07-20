"use client";
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlineShoppingCart } from 'react-icons/hi2';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products`);
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Get unique categories
    const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

    // Filtered products
    const filteredProducts = products.filter(p => {
        const matchesSearch = 
            ((p.title || p.name) && (p.title || p.name).toLowerCase().includes(searchQuery.toLowerCase())) ||
            (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesCategory = 
            selectedCategory === 'all' || 
            (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

        return matchesSearch && matchesCategory;
    });

    return (
        <section className="min-h-screen bg-[#030712] text-gray-300 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background ambient glows */}
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 blur-[130px] pointer-events-none rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[130px] pointer-events-none rounded-full" />

            <div className="max-w-7xl mx-auto relative z-10 space-y-12">
                {/* Header */}
                <div className="text-center space-y-4 max-w-xl mx-auto">
                    <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">Explore Marketplace</span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                        All Available <span className="text-cyan-400">AI Gadgets</span>
                    </h1>
                    <p className="text-sm text-gray-400">
                        Discover next-generation AI interfaces, smart wearables, and augmented reality platforms loaded directly on GadgetHub.
                    </p>
                </div>

                {/* Filters & Search controls */}
                <div className="bg-[#0b0f19]/65 border border-cyan-950/40 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row gap-6 justify-between items-center shadow-lg">
                    {/* Search */}
                    <div className="relative w-full md:max-w-xs">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                            <HiOutlineMagnifyingGlass className="w-5 h-5" />
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search gadgets by keyword..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#030712]/80 border border-cyan-950/80 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all backdrop-blur-sm"
                        />
                    </div>

                    {/* Category tabs */}
                    <div className="flex flex-wrap gap-2 items-center justify-center w-full md:w-auto">
                        <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mr-2">
                            <HiOutlineFunnel className="w-4 h-4" />
                            <span>Filters:</span>
                        </span>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all border ${
                                    selectedCategory === cat
                                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                                        : 'bg-[#030712]/50 border-cyan-950/60 text-gray-400 hover:text-white'
                                }`}
                            >
                                {cat === 'all' ? 'All Gadgets' : cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full border-4 border-cyan-950"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 animate-spin"></div>
                        </div>
                        <span className="text-xs text-gray-500 font-bold tracking-widest uppercase mt-6 animate-pulse">
                            Loading Products...
                        </span>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="bg-[#0b0f19]/45 border border-cyan-950/50 rounded-2xl py-24 text-center flex flex-col items-center justify-center text-gray-500">
                        <svg className="w-16 h-16 mb-4 text-cyan-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <h3 className="text-base font-bold text-white mb-1">No Gadgets Found</h3>
                        <p className="text-xs text-gray-400 max-w-xs">No products matched your search parameters. Try expanding your search query.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map(p => (
                            <motion.div
                                key={p._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className="bg-[#0b0f19]/65 border border-cyan-950/40 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-cyan-500/25 transition-all duration-300 shadow-xl"
                            >
                                {/* Clickable Image → Product Detail */}
                                <Link href={`/products/${p._id}`}>
                                    <div className="aspect-video w-full overflow-hidden bg-cyan-950/15 relative cursor-pointer">
                                        <img
                                            src={p.images?.[0] || p.image || "https://placehold.co/500x300"}
                                            alt={p.title || p.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                                        />
                                        <span className="absolute top-3 left-3 bg-[#030712]/90 border border-cyan-950/80 text-cyan-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                                            {p.category}
                                        </span>
                                    </div>
                                </Link>

                                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <Link href={`/products/${p._id}`}>
                                                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1 cursor-pointer">{p.title || p.name}</h3>
                                            </Link>
                                            <span className="text-base font-black text-cyan-400 shrink-0">${p.price}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">{p.description}</p>
                                    </div>

                                    {/* Features badge checklist */}
                                    {p.features && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {p.features.split(',').map((f, i) => (
                                                <span key={i} className="text-[9px] font-bold px-2 py-0.5 bg-cyan-950/40 text-cyan-400 rounded-full border border-cyan-500/10 capitalize">
                                                    {f.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="border-t border-cyan-950/40 pt-5 flex items-center justify-between text-[10px]">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500">Seller:</span>
                                            <span className="text-gray-400 truncate max-w-[130px]">{p.sellerName || p.creatorName || p.sellerEmail || p.creatorEmail || 'Marketplace'}</span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const cart = JSON.parse(localStorage.getItem('gadgethub-cart') || '[]');
                                                const exists = cart.find(item => item._id === p._id);
                                                if (exists) { toast.error('Already in cart!'); return; }
                                                cart.push({ _id: p._id, title: p.title || p.name, price: p.price, images: p.images || [p.image].filter(Boolean), category: p.category });
                                                localStorage.setItem('gadgethub-cart', JSON.stringify(cart));
                                                window.dispatchEvent(new Event('storage'));
                                                toast.success(`${p.title || p.name || 'Product'} added to cart!`);
                                            }}
                                            className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-[#030712] font-black px-4 py-2 rounded-xl text-xs shadow-lg shadow-cyan-950/30 transition-all">
                                            <HiOutlineShoppingCart className="w-3.5 h-3.5" />
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default AllProducts;