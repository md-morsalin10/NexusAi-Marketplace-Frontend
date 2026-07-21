"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiOutlineHome,
    HiOutlineShoppingBag,
    HiOutlinePlusCircle,
    HiOutlineUserCircle,
    HiOutlineTrash,
    HiOutlinePencilSquare,
    HiOutlineArrowLeft,
    HiOutlineArrowLeftOnRectangle,
    HiOutlineArrowPath,
    HiOutlinePhoto,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineXCircle
} from 'react-icons/hi2';
import StatusBadge from '@/components/dashboard/StatusBadge';

const TABS = [
    { id: 'overview', label: 'Overview', icon: HiOutlineHome },
    { id: 'my-products', label: 'My Products', icon: HiOutlineShoppingBag },
    { id: 'my-sales', label: 'My Sales', icon: HiOutlineClock },
    { id: 'add-product', label: 'Add Product', icon: HiOutlinePlusCircle },
    { id: 'profile', label: 'My Profile', icon: HiOutlineUserCircle },
];

const INITIAL_FORM = { title: '', price: '', category: '', images: [], description: '', features: '' };

const CATEGORIES = [
    'AI Tools', 'Gadgets', 'Electronics', 'Smart Home', 'Wearables',
    'Cameras', 'Audio', 'Computing', 'Mobile', 'Gaming', 'Other'
];

export default function SellerDashboard() {
    const { data: session } = authClient.useSession();
    const user = session?.user;
    const router = useRouter();

    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ total: 0, published: 0, pending: 0, rejected: 0 });
    const [myProducts, setMyProducts] = useState([]);
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    // Product form
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState(INITIAL_FORM);
    const [uploadingImg, setUploadingImg] = useState(false);
    const [imgPreview, setImgPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Profile form
    const [profileForm, setProfileForm] = useState({ name: '', image: '' });
    const [uploadingProfileImg, setUploadingProfileImg] = useState(false);
    const [profileImgPreview, setProfileImgPreview] = useState(null);
    const [updatingProfile, setUpdatingProfile] = useState(false);

    const API = process.env.NEXT_PUBLIC_API_URL;

    const fetchData = useCallback(async () => {
        if (!user?.id && !user?.email) return;
        setLoading(true);
        try {
            const [statsRes, salesRes] = await Promise.all([
                fetch(`${API}/api/seller/stats/${encodeURIComponent(user.id || user.email)}`),
                fetch(`${API}/api/payment?sellerId=${encodeURIComponent(user.id || '')}`)
            ]);
            
            const statsData = await statsRes.json();
            const salesData = await salesRes.json();
            
            setStats({ total: statsData.total, published: statsData.published, pending: statsData.pending, rejected: statsData.rejected });
            setMyProducts(statsData.products || []);
            setSales(Array.isArray(salesData) ? salesData : (salesData.payments || []));
        } catch (err) {
            console.error(err);
            toast.error("Failed to load seller data");
        } finally {
            setLoading(false);
        }
    }, [user?.id, user?.email]);

    useEffect(() => { fetchData(); }, [fetchData]);

    useEffect(() => {
        if (user) {
            setProfileForm({ name: user.name || '', image: user.image || '' });
            setProfileImgPreview(user.image || null);
        }
    }, [user]);

    const uploadToImgBB = async (file) => {
        const apiKey = process.env.NEXT_PUBLIC_IMAGEBB_API_KEY;
        if (!apiKey) { toast.error("ImgBB API key missing."); return null; }
        const formData = new FormData();
        formData.append("image", file);
        try {
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: "POST", body: formData });
            const data = await res.json();
            return data.success ? data.data.url : null;
        } catch { return null; }
    };

    const handleProductImgChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImgPreview(URL.createObjectURL(file));
        setUploadingImg(true);
        const url = await uploadToImgBB(file);
        if (url) {
            setProductForm(prev => ({ ...prev, images: [url] }));
            toast.success("Image uploaded!");
        } else {
            toast.error("Image upload failed.");
            setImgPreview(editingProduct?.images?.[0] || editingProduct?.image || null);
        }
        setUploadingImg(false);
    };

    const handleProfileImgChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setProfileImgPreview(URL.createObjectURL(file));
        setUploadingProfileImg(true);
        const url = await uploadToImgBB(file);
        if (url) {
            setProfileForm(prev => ({ ...prev, image: url }));
            toast.success("Profile image uploaded!");
        } else {
            toast.error("Upload failed.");
            setProfileImgPreview(user?.image || null);
        }
        setUploadingProfileImg(false);
    };

    const startEdit = (product) => {
        setEditingProduct(product);
        setProductForm({
            title: product.title || product.name || '',
            price: product.price || '',
            category: product.category || '',
            images: product.images || (product.image ? [product.image] : []),
            description: product.description || '',
            features: product.features || ''
        });
        setImgPreview(product.images?.[0] || product.image || null);
        setActiveTab('add-product');
    };

    const resetForm = () => {
        setEditingProduct(null);
        setProductForm(INITIAL_FORM);
        setImgPreview(null);
    };

    const handleProductSubmit = async (e, submitStatus = 'pending') => {
        e.preventDefault();
        if (uploadingImg) { toast.error("Wait for image upload to complete."); return; }
        if (!productForm.title.trim() || !productForm.price) { toast.error("Title and price are required."); return; }

        setSubmitting(true);
        const payload = {
            ...productForm,
            price: parseFloat(productForm.price),
            sellerId: user?.id,
            sellerEmail: user?.email, // for backward compat in frontend display temporarily
            sellerName: user?.name,
            status: editingProduct ? (editingProduct.status === 'rejected' ? submitStatus : editingProduct.status) : submitStatus,
            createdAt: editingProduct?.createdAt || new Date().toISOString()
        };

        try {
            let res;
            if (editingProduct) {
                res = await fetch(`${API}/api/products/${editingProduct._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...payload, status: submitStatus })
                });
            } else {
                res = await fetch(`${API}/api/products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }
            const data = await res.json();
            if (data.acknowledged || data.modifiedCount > 0 || data.insertedId) {
                toast.success(editingProduct ? "Product updated & submitted for approval!" : (submitStatus === 'pending' ? "Product submitted for approval!" : "Saved as draft!"));
                resetForm();
                fetchData();
                setActiveTab('my-products');
            } else {
                toast.error("Failed to save product.");
            }
        } catch (err) {
            toast.error("Error saving product.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this product permanently?")) return;
        try {
            const res = await fetch(`${API}/api/products/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.deletedCount > 0) { toast.success("Deleted!"); fetchData(); }
            else toast.error("Failed to delete.");
        } catch { toast.error("Error deleting."); }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        if (uploadingProfileImg) { toast.error("Wait for image upload."); return; }
        setUpdatingProfile(true);
        try {
            const res = await fetch(`${API}/api/users/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, name: profileForm.name, image: profileForm.image })
            });
            const data = await res.json();
            if (data.modifiedCount > 0 || data.acknowledged) {
                toast.success("Profile updated! Reloading...");
                setTimeout(() => window.location.reload(), 1200);
            } else {
                toast.error("No changes detected.");
            }
        } catch { toast.error("Error updating profile."); }
        finally { setUpdatingProfile(false); }
    };

    const StatCard = ({ label, value, icon: Icon, color, description }) => (
        <div className={`bg-[#0b0f19]/60 border rounded-2xl p-5 relative overflow-hidden ${color.border}`}>
            <div className={`absolute top-0 right-0 w-28 h-28 blur-3xl rounded-full ${color.glow}`} />
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</p>
                    <h3 className={`text-3xl font-extrabold mt-1 ${color.text}`}>{value}</h3>
                    <p className="text-[10px] text-gray-600 mt-2">{description}</p>
                </div>
                <div className={`p-2.5 rounded-xl border ${color.iconBg}`}>
                    <Icon className={`w-5 h-5 ${color.text}`} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#030712] text-gray-300 flex flex-col md:flex-row">
            <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-cyan-500/5 blur-[130px] pointer-events-none rounded-full" />
            <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-500/5 blur-[130px] pointer-events-none rounded-full" />

            {/* ── Sidebar ── */}
            <aside className="w-full md:w-64 bg-[#080c17]/80 border-b md:border-b-0 md:border-r border-cyan-950/40 p-6 flex flex-col justify-between backdrop-blur-lg relative z-20 md:min-h-screen">
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-extrabold tracking-tight text-white">
                            Nexus<span className="text-cyan-400">AI</span>
                        </span>
                        <span className="text-[9px] uppercase font-extrabold tracking-widest text-cyan-400 bg-cyan-950/40 px-2 py-0.5 border border-cyan-500/20 rounded-full">
                            Seller
                        </span>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-cyan-950/20 border border-cyan-900/30 rounded-xl">
                        <div className="w-9 h-9 rounded-full bg-cyan-950/80 flex items-center justify-center text-cyan-400 font-bold overflow-hidden border border-cyan-500/20 text-sm flex-shrink-0">
                            {user?.image ? <img src={user.image} alt={user.name} className="w-full h-full object-cover" /> : user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <h4 className="text-xs font-bold text-white truncate">{user?.name}</h4>
                            <p className="text-[10px] text-cyan-400 font-semibold">Seller Account</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {TABS.map(item => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button key={item.id} onClick={() => { if (item.id !== 'add-product') resetForm(); setActiveTab(item.id); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${isActive
                                        ? 'bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.08)]'
                                        : 'text-gray-400 hover:bg-cyan-950/20 hover:text-white border border-transparent'}`}>
                                    <Icon className="w-4 h-4 flex-shrink-0" />
                                    <span>{item.id === 'add-product' && editingProduct ? 'Edit Product' : item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="pt-6 border-t border-cyan-950/40 space-y-2 mt-6">
                    <button onClick={() => router.push("/")}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs border border-cyan-950/60 hover:bg-cyan-950/30 text-gray-400 hover:text-white transition-all font-semibold">
                        <HiOutlineArrowLeft className="w-3.5 h-3.5" /><span>Back to Site</span>
                    </button>
                    <button onClick={async () => { await authClient.signOut(); router.push("/login"); }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs bg-red-950/25 border border-red-500/20 hover:bg-red-500/10 text-red-400 transition-all font-bold">
                        <HiOutlineArrowLeftOnRectangle className="w-4 h-4" /><span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <main className="flex-1 p-6 sm:p-8 md:p-10 relative z-10 overflow-y-auto md:max-h-screen">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-cyan-950/40 pb-6 mb-8 gap-4">
                    <div>
                        <p className="text-[10px] font-bold tracking-widest uppercase text-cyan-400">Seller Panel</p>
                        <h1 className="text-2xl font-extrabold tracking-tight text-white mt-1">
                            {activeTab === 'add-product' && editingProduct ? 'Edit Product' : TABS.find(t => t.id === activeTab)?.label}
                        </h1>
                    </div>
                    <button onClick={fetchData}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-950 hover:bg-cyan-950/30 text-xs font-semibold text-gray-400 hover:text-white transition-all">
                        <HiOutlineArrowPath className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="w-10 h-10 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
                        <span className="text-xs text-gray-500 font-semibold tracking-widest uppercase mt-4">Loading...</span>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab + (editingProduct?._id || '')} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>

                            {/* ─── OVERVIEW ─── */}
                            {activeTab === 'overview' && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                                        <StatCard label="Total Products" value={stats.total} icon={HiOutlineShoppingBag}
                                            color={{ border: 'border-cyan-950/50', glow: 'bg-cyan-500/5', text: 'text-cyan-400', iconBg: 'bg-cyan-500/10 border-cyan-500/20' }}
                                            description="All your listings" />
                                        <StatCard label="Published" value={stats.published} icon={HiOutlineCheckCircle}
                                            color={{ border: 'border-emerald-950/50', glow: 'bg-emerald-500/5', text: 'text-emerald-400', iconBg: 'bg-emerald-500/10 border-emerald-500/20' }}
                                            description="Live on marketplace" />
                                        <StatCard label="Pending" value={stats.pending} icon={HiOutlineClock}
                                            color={{ border: 'border-amber-950/50', glow: 'bg-amber-500/5', text: 'text-amber-400', iconBg: 'bg-amber-500/10 border-amber-500/20' }}
                                            description="Awaiting admin review" />
                                        <StatCard label="Rejected" value={stats.rejected} icon={HiOutlineXCircle}
                                            color={{ border: 'border-red-950/50', glow: 'bg-red-500/5', text: 'text-red-400', iconBg: 'bg-red-500/10 border-red-500/20' }}
                                            description="Need revision" />
                                    </div>

                                    {/* Welcome banner */}
                                    <div className="bg-gradient-to-br from-cyan-950/30 to-[#0b0f19]/60 border border-cyan-900/30 rounded-2xl p-7 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />
                                        <h2 className="text-xl font-extrabold text-white">Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
                                        <p className="text-sm text-gray-400 mt-2 max-w-lg">
                                            Manage your product catalog from here. New products go to the <span className="text-amber-400 font-semibold">Admin review queue</span> before appearing publicly on the marketplace.
                                        </p>
                                        <div className="flex gap-3 mt-5">
                                            <button onClick={() => { resetForm(); setActiveTab('add-product'); }}
                                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/25 transition-all">
                                                <HiOutlinePlusCircle className="w-4 h-4" /> Add New Product
                                            </button>
                                            <button onClick={() => setActiveTab('my-products')}
                                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#030712]/60 border border-cyan-950/50 text-gray-400 hover:text-white transition-all">
                                                <HiOutlineShoppingBag className="w-4 h-4" /> View My Products
                                            </button>
                                        </div>
                                    </div>

                                    {/* Recent products preview */}
                                    {myProducts.length > 0 && (
                                        <div className="bg-[#0b0f19]/60 border border-cyan-950/50 rounded-2xl p-6">
                                            <div className="flex items-center justify-between mb-5">
                                                <h3 className="text-sm font-bold text-white">Recent Products</h3>
                                                <button onClick={() => setActiveTab('my-products')} className="text-xs font-bold text-cyan-400 hover:underline">View All →</button>
                                            </div>
                                            <div className="space-y-3">
                                                {myProducts.slice(0, 4).map(p => (
                                                    <div key={p._id} className="flex items-center gap-4 p-3 bg-[#030712]/30 rounded-xl border border-cyan-950/20">
                                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-cyan-950/50 flex-shrink-0">
                                                            <img src={p.images?.[0] || p.image || 'https://placehold.co/40'} alt={p.title || p.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-bold text-white truncate">{p.title || p.name}</p>
                                                            <p className="text-[10px] text-gray-500">${p.price} · {p.category}</p>
                                                        </div>
                                                        <StatusBadge status={p.status || 'published'} size="xs" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ─── MY PRODUCTS ─── */}
                            {activeTab === 'my-products' && (
                                <div className="space-y-5">
                                    {myProducts.length === 0 ? (
                                        <div className="bg-[#0b0f19]/60 border border-cyan-950/50 rounded-2xl p-16 flex flex-col items-center justify-center">
                                            <HiOutlineShoppingBag className="w-12 h-12 text-cyan-900 mb-3" />
                                            <p className="text-sm font-bold text-gray-400">No products yet.</p>
                                            <button onClick={() => { resetForm(); setActiveTab('add-product'); }}
                                                className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/25 transition-all">
                                                <HiOutlinePlusCircle className="w-4 h-4" /> Add Your First Product
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                            {myProducts.map(product => (
                                                <motion.div key={product._id} layout
                                                    className="bg-[#0b0f19]/60 border border-cyan-950/40 rounded-2xl overflow-hidden hover:border-cyan-900/60 transition-all group">
                                                    <div className="relative h-44 overflow-hidden bg-cyan-950/30">
                                                        <img src={product.images?.[0] || product.image || 'https://placehold.co/300x180/0b0f19/22d3ee?text=No+Image'}
                                                            alt={product.title || product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                        <div className="absolute top-3 left-3">
                                                            <StatusBadge status={product.status || 'published'} size="xs" />
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <h4 className="text-sm font-bold text-white truncate">{product.title || product.name}</h4>
                                                        <div className="flex items-center justify-between mt-1.5">
                                                            <span className="text-cyan-400 font-bold text-sm">${product.price}</span>
                                                            <span className="text-[10px] text-gray-600 capitalize">{product.category}</span>
                                                        </div>
                                                        {product.description && (
                                                            <p className="text-[11px] text-gray-500 mt-2 line-clamp-2">{product.description}</p>
                                                        )}
                                                        <div className="flex gap-2 mt-4">
                                                            <button onClick={() => startEdit(product)}
                                                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all">
                                                                <HiOutlinePencilSquare className="w-3.5 h-3.5" /> Edit
                                                            </button>
                                                            <button onClick={() => handleDelete(product._id)}
                                                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all">
                                                                <HiOutlineTrash className="w-3.5 h-3.5" /> Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ─── MY SALES ─── */}
                            {activeTab === 'my-sales' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                        <StatCard label="Total Earnings" value={`$${sales.reduce((acc, s) => acc + Number(s.price || 0), 0).toFixed(2)}`} icon={HiOutlineClock}
                                            color={{ border: 'border-emerald-950/50', glow: 'bg-emerald-500/5', text: 'text-emerald-400', iconBg: 'bg-emerald-500/10 border-emerald-500/20' }} />
                                        <StatCard label="Total Items Sold" value={sales.length} icon={HiOutlineShoppingBag}
                                            color={{ border: 'border-cyan-950/50', glow: 'bg-cyan-500/5', text: 'text-cyan-400', iconBg: 'bg-cyan-500/10 border-cyan-500/20' }} />
                                    </div>
                                    
                                    {sales.length === 0 ? (
                                        <div className="bg-[#0b0f19]/60 border border-cyan-950/50 rounded-2xl p-16 flex flex-col items-center justify-center">
                                            <HiOutlineClock className="w-12 h-12 text-cyan-900 mb-3" />
                                            <p className="text-sm font-bold text-gray-400">No sales yet.</p>
                                        </div>
                                    ) : (
                                        <div className="bg-[#0b0f19]/60 border border-cyan-950/50 rounded-2xl overflow-hidden">
                                            <table className="w-full text-xs text-left">
                                                <thead className="bg-cyan-950/20 border-b border-cyan-950/50">
                                                    <tr>
                                                        <th className="px-5 py-4 font-extrabold text-gray-500 uppercase tracking-widest text-[10px]">Product</th>
                                                        <th className="px-5 py-4 font-extrabold text-gray-500 uppercase tracking-widest text-[10px] hidden sm:table-cell">Buyer</th>
                                                        <th className="px-5 py-4 font-extrabold text-gray-500 uppercase tracking-widest text-[10px]">Price</th>
                                                        <th className="px-5 py-4 font-extrabold text-gray-500 uppercase tracking-widest text-[10px]">Date</th>
                                                        <th className="px-5 py-4 font-extrabold text-gray-500 uppercase tracking-widest text-[10px]">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sales.map((sale, i) => (
                                                        <tr key={sale._id || i} className="border-b border-cyan-950/20 hover:bg-cyan-950/10 transition-colors">
                                                            <td className="px-5 py-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-9 h-9 rounded-lg overflow-hidden bg-cyan-950/50 flex-shrink-0">
                                                                        {sale.image ? <img src={sale.image} alt={sale.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-cyan-900/30" />}
                                                                    </div>
                                                                    <p className="font-bold text-white truncate max-w-[150px]">{sale.title || 'Product'}</p>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3 hidden sm:table-cell">
                                                                <p className="font-semibold text-gray-300 truncate max-w-[120px]">{sale.buyerName || 'Unknown'}</p>
                                                                <p className="text-[10px] text-gray-500 truncate max-w-[120px]">{sale.buyerEmail}</p>
                                                            </td>
                                                            <td className="px-5 py-3 font-bold text-emerald-400">${Number(sale.price || 0).toFixed(2)}</td>
                                                            <td className="px-5 py-3 text-gray-400">{sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : 'N/A'}</td>
                                                            <td className="px-5 py-3"><StatusBadge status={sale.status || 'completed'} size="xs" /></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ─── ADD / EDIT PRODUCT ─── */}
                            {activeTab === 'add-product' && (
                                <div className="max-w-2xl mx-auto">
                                    {editingProduct && (
                                        <div className="mb-6 flex items-center gap-3 p-4 bg-amber-950/20 border border-amber-900/30 rounded-xl">
                                            <HiOutlinePencilSquare className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                            <p className="text-xs text-amber-300 font-semibold">Editing: <span className="text-white">{editingProduct.name || editingProduct.title}</span></p>
                                            <button onClick={resetForm} className="ml-auto text-xs text-gray-500 hover:text-red-400 transition-colors font-semibold">✕ Cancel</button>
                                        </div>
                                    )}
                                    <form onSubmit={(e) => handleProductSubmit(e, 'pending')} className="space-y-6">
                                        <div className="bg-[#0b0f19]/60 border border-cyan-950/50 rounded-2xl p-7 space-y-5">
                                            <h3 className="text-sm font-bold text-white border-b border-cyan-950/40 pb-4">Product Details</h3>

                                            {/* Image Upload */}
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Product Image</label>
                                                <div className="flex items-center gap-5">
                                                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-cyan-950/30 border-2 border-dashed border-cyan-900/50 flex items-center justify-center flex-shrink-0 relative">
                                                        {imgPreview ? (
                                                            <img src={imgPreview} alt="Preview" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <HiOutlinePhoto className="w-8 h-8 text-cyan-900" />
                                                        )}
                                                        {uploadingImg && (
                                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                                <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 hover:bg-cyan-500/20 transition-all">
                                                            <HiOutlinePhoto className="w-4 h-4" />
                                                            {uploadingImg ? 'Uploading...' : 'Choose Image'}
                                                            <input type="file" accept="image/*" className="hidden" onChange={handleProductImgChange} disabled={uploadingImg} />
                                                        </label>
                                                        <p className="text-[10px] text-gray-600 mt-2">PNG, JPG, WEBP · Uploaded via ImgBB</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Product Title *</label>
                                                <input type="text" required value={productForm.title} onChange={e => setProductForm(p => ({ ...p, title: e.target.value }))}
                                                    placeholder="e.g. AI Smart Assistant Pro"
                                                    className="w-full bg-[#030712]/60 border border-cyan-950/60 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 outline-none focus:border-cyan-700/60 transition-colors" />
                                            </div>

                                            {/* Price + Category */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Price (USD) *</label>
                                                    <input type="number" required min="0" step="0.01" value={productForm.price} onChange={e => setProductForm(p => ({ ...p, price: e.target.value }))}
                                                        placeholder="29.99"
                                                        className="w-full bg-[#030712]/60 border border-cyan-950/60 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 outline-none focus:border-cyan-700/60 transition-colors" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Category</label>
                                                    <select value={productForm.category} onChange={e => setProductForm(p => ({ ...p, category: e.target.value }))}
                                                        className="w-full bg-[#030712]/60 border border-cyan-950/60 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-700/60 transition-colors cursor-pointer">
                                                        <option value="">Select...</option>
                                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Description</label>
                                                <textarea rows={4} value={productForm.description} onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))}
                                                    placeholder="Describe your product's features and benefits..."
                                                    className="w-full bg-[#030712]/60 border border-cyan-950/60 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 outline-none focus:border-cyan-700/60 transition-colors resize-none" />
                                            </div>

                                            {/* Features */}
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Key Features</label>
                                                <input type="text" value={productForm.features} onChange={e => setProductForm(p => ({ ...p, features: e.target.value }))}
                                                    placeholder="Feature 1, Feature 2, Feature 3..."
                                                    className="w-full bg-[#030712]/60 border border-cyan-950/60 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 outline-none focus:border-cyan-700/60 transition-colors" />
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button type="submit" disabled={submitting || uploadingImg}
                                                className="flex-1 py-3 rounded-xl text-sm font-extrabold bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                                                {submitting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</> : `${editingProduct ? 'Update &' : ''} Submit for Approval`}
                                            </button>
                                        </div>
                                        <p className="text-center text-[10px] text-gray-600">
                                            Submitted products go to the <span className="text-amber-400">Admin Approval Queue</span> before appearing publicly.
                                        </p>
                                    </form>
                                </div>
                            )}

                            {/* ─── PROFILE ─── */}
                            {activeTab === 'profile' && (
                                <div className="max-w-lg mx-auto">
                                    <form onSubmit={handleProfileUpdate} className="bg-[#0b0f19]/60 border border-cyan-950/50 rounded-2xl p-7 space-y-6">
                                        <h3 className="text-sm font-bold text-white border-b border-cyan-950/40 pb-4">Update Profile</h3>

                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-24 h-24 rounded-full overflow-hidden bg-cyan-950/50 border-2 border-cyan-900/50 flex items-center justify-center text-3xl text-cyan-400 font-extrabold relative">
                                                {profileImgPreview
                                                    ? <img src={profileImgPreview} alt="Profile" className="w-full h-full object-cover" />
                                                    : user?.name?.charAt(0).toUpperCase()}
                                                {uploadingProfileImg && (
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
                                                        <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                                                    </div>
                                                )}
                                            </div>
                                            <label className="cursor-pointer text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1.5">
                                                <HiOutlinePhoto className="w-3.5 h-3.5" />
                                                {uploadingProfileImg ? 'Uploading...' : 'Change Photo'}
                                                <input type="file" accept="image/*" className="hidden" onChange={handleProfileImgChange} disabled={uploadingProfileImg} />
                                            </label>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Display Name</label>
                                            <input type="text" value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                                                className="w-full bg-[#030712]/60 border border-cyan-950/60 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-700/60 transition-colors" />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Email</label>
                                            <input type="email" value={user?.email || ''} disabled
                                                className="w-full bg-[#030712]/30 border border-cyan-950/30 rounded-xl px-4 py-3 text-sm text-gray-600 outline-none cursor-not-allowed" />
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-cyan-950/20 border border-cyan-900/30 rounded-xl">
                                            <div className="text-[10px] text-gray-500">
                                                <span className="font-bold text-gray-400">Role: </span>
                                                <span className="text-cyan-400 font-bold capitalize">Seller</span>
                                            </div>
                                        </div>

                                        <button type="submit" disabled={updatingProfile || uploadingProfileImg}
                                            className="w-full py-3 rounded-xl text-sm font-extrabold bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                            {updatingProfile ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</> : 'Save Profile'}
                                        </button>
                                    </form>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                )}
            </main>
        </div>
    );
}
