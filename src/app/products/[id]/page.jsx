"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
    ArrowLeft, ShoppingCart, Zap, Tag, User,
    Package, ChevronRight, CheckCircle, AlertCircle
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

// ── Skeleton Loader ────────────────────────────────────────────────────────
const ProductSkeleton = () => (
    <section className="min-h-screen bg-[#030712] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[130px] pointer-events-none rounded-full" />
        <div className="max-w-6xl mx-auto relative z-10">
            <div className="h-4 w-32 bg-slate-800 rounded-full animate-pulse mb-10" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="w-full h-[420px] rounded-2xl bg-slate-800/50 animate-pulse" />
                <div className="space-y-6 animate-pulse">
                    <div className="h-3 w-24 bg-slate-800 rounded-full" />
                    <div className="h-8 w-3/4 bg-slate-700 rounded-xl" />
                    <div className="h-6 w-24 bg-slate-800 rounded-full" />
                    <div className="h-4 w-40 bg-slate-800 rounded-full" />
                    <div className="space-y-2">
                        <div className="h-3 bg-slate-800 rounded-full" />
                        <div className="h-3 bg-slate-800 rounded-full w-5/6" />
                        <div className="h-3 bg-slate-800 rounded-full w-4/6" />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <div className="flex-1 h-12 bg-slate-800 rounded-xl" />
                        <div className="flex-1 h-12 bg-slate-800 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// ── Not Found Fallback ─────────────────────────────────────────────────────
const ProductNotFound = () => (
    <section className="min-h-screen bg-[#030712] flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
            <div className="w-20 h-20 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-slate-600" />
            </div>
            <h2 className="text-2xl font-black text-white">Product Not Found</h2>
            <p className="text-sm text-slate-400">This product may have been removed or the link is invalid.</p>
            <Link href="/all-products">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-[#030712] font-bold text-sm shadow-[0_0_20px_rgba(34,211,238,0.3)] mt-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Marketplace
                </motion.button>
            </Link>
        </div>
    </section>
);

// ── Main Page ──────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [activeImage, setActiveImage] = useState(0);
    const [addingToCart, setAddingToCart] = useState(false);

    const { data: session } = authClient.useSession();

    const user = session?.user;

    useEffect(() => {
        if (!id) return;
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products/${id}`
                );
                if (!res.ok) { setNotFound(true); return; }
                const data = await res.json();
                if (!data || !data._id) { setNotFound(true); return; }
                setProduct(data);
            } catch (err) {
                console.error('Product fetch error:', err);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        setAddingToCart(true);
        try {
            const existing = JSON.parse(localStorage.getItem('gadgethub-cart') || '[]');
            const idx = existing.findIndex(i => i._id === product._id);
            if (idx > -1) {
                existing[idx].quantity = (existing[idx].quantity || 1) + 1;
            } else {
                existing.push({
                    _id: product._id,
                    title: product.title || product.name,
                    price: product.price,
                    image: product.images?.[0] || product.image || null,
                    quantity: 1,
                });
            }
            localStorage.setItem('gadgethub-cart', JSON.stringify(existing));
            // Trigger cart re-render in Navbar
            window.dispatchEvent(new Event('storage'));
            toast.success('Added to cart!');
        } catch (err) {
            toast.error('Failed to add to cart.');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleOrderNow = () => {
        handleAddToCart();
        router.push('/');  // Navbar cart icon handles checkout
        setTimeout(() => toast('Open your cart to complete checkout →', { icon: '🛒' }), 600);
    };

    if (loading) return <ProductSkeleton />;
    if (notFound || !product) return <ProductNotFound />;

    const title = product.title || product.name || 'Unnamed Product';
    const images = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : product.image
            ? [product.image]
            : ['https://placehold.co/700x480/0a0f1e/22d3ee?text=No+Image'];
    const specs = Array.isArray(product.specifications) ? product.specifications : [];
    const price = product.price != null ? `$${product.price}` : 'Contact Seller';
    const category = product.category || 'Gadget';
    const seller = product.sellerEmail || product.creatorEmail || 'NexusAI Store';
    const status = product.status || 'published';

    return (
        <section className="min-h-screen bg-[#030712] text-gray-300 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[160px] pointer-events-none rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[160px] pointer-events-none rounded-full" />
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-10 font-medium">
                    <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link href="/all-products" className="hover:text-slate-300 transition-colors">Marketplace</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-slate-400 truncate max-w-[200px]">{title}</span>
                </nav>

                {/* Back Button */}
                <Link href="/all-products">
                    <motion.button
                        whileHover={{ x: -2 }}
                        className="flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 transition-colors mb-8 font-semibold"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Products
                    </motion.button>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* ── LEFT: Image Panel ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                    >
                        {/* Main Image */}
                        <div className="relative rounded-2xl overflow-hidden border border-cyan-900/30 bg-slate-950/60 backdrop-blur-md shadow-[0_0_60px_rgba(0,240,255,0.06)]" style={{ aspectRatio: '4/3' }}>
                            {/* Top accent line */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent z-10" />
                            <motion.img
                                key={activeImage}
                                initial={{ opacity: 0, scale: 1.02 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                src={images[activeImage]}
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                            {/* Corner accents */}
                            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-sm" />
                            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-purple-500/40 rounded-br-sm" />
                            {/* Status badge */}
                            <div className={`absolute top-3 right-3 text-[9px] font-black px-2.5 py-1 rounded-full border uppercase tracking-widest ${status === 'published'
                                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-900/60'
                                : 'bg-amber-950/80 text-amber-400 border-amber-900/60'
                                }`}>
                                {status === 'published' ? '● In Stock' : `● ${status}`}
                            </div>
                        </div>

                        {/* Thumbnail Strip */}
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-1">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-cyan-500/70 shadow-[0_0_12px_rgba(0,240,255,0.25)]' : 'border-slate-800/60 hover:border-slate-700'
                                            }`}
                                    >
                                        <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* ── RIGHT: Product Info ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="space-y-6"
                    >
                        {/* Category Badge */}
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border bg-cyan-950/30 text-cyan-400 border-cyan-900/50">
                            <Tag className="w-3 h-3" /> {category}
                        </span>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                            {title}
                        </h1>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                                {price}
                            </span>
                        </div>

                        {/* Seller */}
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <div className="w-7 h-7 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
                                <User className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                            <span>Sold by <span className="text-white font-semibold">{seller}</span></span>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Description</p>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                {product.description || 'No description provided for this product.'}
                            </p>
                        </div>

                        {/* Specs */}
                        {specs.length > 0 && (
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-2">
                                    <Package className="w-3.5 h-3.5 text-cyan-400" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Technical Specifications</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {specs.map((spec, i) => (
                                        <span
                                            key={i}
                                            className="inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-slate-900/70 border border-slate-800/60 text-slate-300 hover:border-cyan-900/50 hover:text-cyan-400 transition-colors"
                                        >
                                            <CheckCircle className="w-3 h-3 text-cyan-500/70 flex-shrink-0" />
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="border-t border-slate-800/60 pt-6 space-y-3">
                            {/* Order Now */}
                            <form action="/api/payment" method="POST">
                                <input name="price" value={product.price || ''} type="hidden" />
                                <input name="title" value={product.title || ''} type="hidden" />
                                <input name="productId" value={product._id || ''} type="hidden" />
                                <input name="sellerId" value={product.sellerId || ''} type="hidden" />
                                <input name="sellerEmail" value={product.sellerEmail || ''} type="hidden" />
                                <input name="sellerName" value={product.sellerName || ''} type="hidden" />
                                <input name="buyerName" value={user?.name || ''} type="hidden" />
                                <input name="buyerEmail" value={user?.email || ''} type="hidden" />
                                <input name="buyerId" value={user?.id || ''} type="hidden" />
                                <input name="image" value={images[0] || product.image || ''} type="hidden" />
                                 <input name="status" value={product.status || ''} type="hidden" />
                                 <input name="features" value={product.features || ''} type="hidden" />
                                 <input name="description" value={product.description || ''} type="hidden" />

                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.01, boxShadow: '0 0 30px rgba(0,240,255,0.3)' }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-sm shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all"
                                >
                                    <Zap className="w-4 h-4" /> Order Now
                                </motion.button>
                            </form>

                            {/* Add to Cart */}
                            <motion.button
                                onClick={handleAddToCart}
                                disabled={addingToCart}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300 font-bold text-sm hover:border-cyan-900/60 hover:text-white transition-all disabled:opacity-60"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                {addingToCart ? 'Adding...' : 'Add to Cart'}
                            </motion.button>
                        </div>

                        {/* Security note */}
                        <p className="text-[10px] text-slate-600 text-center">
                            🔒 Secured by Stripe · AES-256 Encrypted · Zero-trust Payment Lane
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
