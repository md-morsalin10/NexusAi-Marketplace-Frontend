"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import {
    HiOutlineHome,
    HiOutlineUsers,
    HiOutlineQueueList,
    HiOutlineShoppingBag,
    HiOutlineTrash,
    HiOutlinePencilSquare,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineArrowLeft,
    HiOutlineArrowLeftOnRectangle,
    HiOutlineArrowPath,
    HiOutlineMagnifyingGlass,
    HiOutlineCurrencyDollar,
    HiOutlineChartBar,
    HiOutlineClock,
    HiOutlineBellAlert
} from 'react-icons/hi2';
import StatusBadge from '@/components/dashboard/StatusBadge';

const TABS = [
    { id: 'overview', label: 'Overview', icon: HiOutlineHome },
    { id: 'approval-queue', label: 'Approval Queue', icon: HiOutlineBellAlert },
    { id: 'transactions', label: 'Transactions', icon: HiOutlineCurrencyDollar },
    { id: 'all-products', label: 'All Products', icon: HiOutlineShoppingBag },
    { id: 'users', label: 'User Management', icon: HiOutlineUsers },
];

const ROLES = ['buyer', 'seller', 'admin'];

export default function AdminDashboard() {
    const { data: session } = authClient.useSession();
    const user = session?.user;
    const router = useRouter();

    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalRevenue: 0, totalOrders: 0, totalPending: 0, totalPublished: 0 });
    const [salesData, setSalesData] = useState({ topSoldItems: [], monthlyData: [] });
    const [users, setUsers] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [pendingProducts, setPendingProducts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [updatingRole, setUpdatingRole] = useState(null);

    const API = process.env.NEXT_PUBLIC_API_URL;

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes, allProdsRes, pendingRes, salesRes, transactionsRes] = await Promise.all([
                fetch(`${API}/api/stats`),
                fetch(`${API}/api/users`),
                fetch(`${API}/api/products/all`),
                fetch(`${API}/api/products/pending`),
                fetch(`${API}/api/sales-stats`),
                fetch(`${API}/api/payment`)
            ]);
            const [statsData, usersData, allProdsData, pendingData, salesStatsData, transactionsData] = await Promise.all([
                statsRes.json(), usersRes.json(), allProdsRes.json(), pendingRes.json(), salesRes.json(), transactionsRes.json()
            ]);
            setStats(statsData);
            setUsers(usersData);
            setAllProducts(allProdsData);
            setPendingProducts(pendingData);
            setSalesData(salesStatsData);
            setTransactions(Array.isArray(transactionsData) ? transactionsData : (transactionsData.payments || []));
        } catch (err) {
            console.error(err);
            toast.error("Failed to load admin data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/login");
    };

    const handleApprove = async (productId) => {
        try {
            const res = await fetch(`${API}/api/products/${productId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'published' })
            });
            const data = await res.json();
            if (data.modifiedCount > 0) {
                toast.success("Product approved & published!");
                fetchAll();
            }
        } catch (err) {
            toast.error("Failed to approve product");
        }
    };

    const handleReject = async (productId) => {
        if (!confirm("Reject this product submission?")) return;
        try {
            const res = await fetch(`${API}/api/products/${productId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'rejected' })
            });
            const data = await res.json();
            if (data.modifiedCount > 0) {
                toast.success("Product rejected.");
                fetchAll();
            }
        } catch (err) {
            toast.error("Failed to reject product");
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm("Delete this product permanently?")) return;
        try {
            const res = await fetch(`${API}/api/products/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.deletedCount > 0) { toast.success("Product deleted!"); fetchAll(); }
            else toast.error("Failed to delete product.");
        } catch (err) {
            toast.error("Error deleting product.");
        }
    };

    const handleRoleChange = async (targetUser, newRole) => {
        if (targetUser.email === user?.email) { toast.error("Cannot change your own role!"); return; }
        setUpdatingRole(targetUser._id || targetUser.id);
        try {
            const res = await fetch(`${API}/api/users/${targetUser._id || targetUser.id}/role`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            });
            const data = await res.json();
            if (data.modifiedCount > 0) {
                toast.success(`Role updated to ${newRole}!`);
                fetchAll();
            } else {
                toast.error("Role update failed.");
            }
        } catch (err) {
            toast.error("Error updating role.");
        } finally {
            setUpdatingRole(null);
        }
    };

    const handleDeleteUser = async (targetUser) => {
        if (targetUser.email === user?.email) { toast.error("Cannot delete yourself!"); return; }
        if (!confirm(`Delete user ${targetUser.name}? This is irreversible.`)) return;
        try {
            const res = await fetch(`${API}/api/users/${targetUser._id || targetUser.id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.deletedCount > 0) { toast.success("User deleted!"); fetchAll(); }
            else toast.error("Failed to delete user.");
        } catch (err) {
            toast.error("Error deleting user.");
        }
    };

    const filteredUsers = users.filter(u =>
        (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredProducts = allProducts.filter(p =>
        (p.title || p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sellerEmail || p.creatorEmail || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const StatCard = ({ label, value, icon: Icon, color, sub }) => (
        <div className="bg-[#0b0f19]/60 border border-cyan-950/50 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-900/70 transition-all">
            <div className={`absolute top-0 right-0 w-32 h-32 ${color}/5 blur-3xl rounded-full`} />
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</p>
                    <h3 className="text-3xl font-extrabold text-white mt-2">{value}</h3>
                    {sub && <p className={`text-[10px] font-medium mt-3 ${color.replace('bg', 'text')}-400`}>{sub}</p>}
                </div>
                <div className={`p-3 ${color}/10 rounded-xl text-current border ${color.replace('bg', 'border')}/20`}>
                    <Icon className={`w-6 h-6 ${color.replace('bg', 'text')}-400`} />
                </div>
            </div>
        </div>
    );

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#0b0f19] border border-cyan-950/70 rounded-xl p-3 text-xs">
                    <p className="text-gray-400 font-bold mb-1">{label}</p>
                    {payload.map((p, i) => (
                        <p key={i} style={{ color: p.color }} className="font-semibold">
                            {p.name}: {p.name === 'revenue' ? `$${p.value.toFixed(2)}` : p.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-[#030712] text-gray-300 flex flex-col md:flex-row">
            {/* Ambient Glows */}
            <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-purple-500/5 blur-[130px] pointer-events-none rounded-full" />
            <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-500/5 blur-[130px] pointer-events-none rounded-full" />

            {/* ── Sidebar ── */}
            <aside className="w-full md:w-64 bg-[#080c17]/80 border-b md:border-b-0 md:border-r border-cyan-950/40 p-6 flex flex-col justify-between backdrop-blur-lg relative z-20 md:min-h-screen">
                <div className="space-y-8">
                    {/* Brand */}
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-extrabold tracking-tight text-white">
                            Nexus<span className="text-purple-400">AI</span>
                        </span>
                        <span className="text-[9px] uppercase font-extrabold tracking-widest text-purple-400 bg-purple-950/40 px-2 py-0.5 border border-purple-500/20 rounded-full">
                            Admin
                        </span>
                    </div>

                    {/* User chip */}
                    <div className="flex items-center gap-3 p-3 bg-purple-950/20 border border-purple-900/30 rounded-xl">
                        <div className="w-9 h-9 rounded-full bg-purple-950/80 flex items-center justify-center text-purple-400 font-bold overflow-hidden border border-purple-500/20 text-sm flex-shrink-0">
                            {user?.image ? <img src={user.image} alt={user.name} className="w-full h-full object-cover" /> : user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <h4 className="text-xs font-bold text-white truncate">{user?.name}</h4>
                            <p className="text-[10px] text-purple-400 font-semibold">Administrator</p>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="space-y-1">
                        {TABS.map(item => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            const pendingCount = item.id === 'approval-queue' ? pendingProducts.length : 0;
                            return (
                                <button key={item.id} onClick={() => { setActiveTab(item.id); setSearchQuery(''); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${isActive
                                        ? 'bg-purple-500/10 border border-purple-500/25 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.08)]'
                                        : 'text-gray-400 hover:bg-purple-950/20 hover:text-white border border-transparent'}`}>
                                    <Icon className="w-4 h-4 flex-shrink-0" />
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {pendingCount > 0 && (
                                        <span className="bg-amber-500 text-black text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                                            {pendingCount}
                                        </span>
                                    )}
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
                    <button onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs bg-red-950/25 border border-red-500/20 hover:bg-red-500/10 text-red-400 transition-all font-bold">
                        <HiOutlineArrowLeftOnRectangle className="w-4 h-4" /><span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <main className="flex-1 p-6 sm:p-8 md:p-10 relative z-10 overflow-y-auto md:max-h-screen">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-cyan-950/40 pb-6 mb-8 gap-4">
                    <div>
                        <p className="text-[10px] font-bold tracking-widest uppercase text-purple-400">Admin Panel</p>
                        <h1 className="text-2xl font-extrabold tracking-tight text-white mt-1 capitalize">
                            {TABS.find(t => t.id === activeTab)?.label}
                        </h1>
                    </div>
                    <button onClick={fetchAll}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-950 hover:bg-cyan-950/30 text-xs font-semibold text-gray-400 hover:text-white transition-all">
                        <HiOutlineArrowPath className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                        <span className="text-xs text-gray-500 font-semibold tracking-widest uppercase mt-4">Loading Admin Data...</span>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>

                            {/* ─── OVERVIEW TAB ─── */}
                            {activeTab === 'overview' && (
                                <div className="space-y-8">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                                        <StatCard label="Total Users" value={stats.totalUsers} icon={HiOutlineUsers} color="bg-cyan" sub="Registered platform members" />
                                        <StatCard label="Total Products" value={stats.totalProducts} icon={HiOutlineShoppingBag} color="bg-purple" sub={`${stats.totalPublished || 0} published`} />
                                        <StatCard label="Total Revenue" value={`$${(stats.totalRevenue || 0).toFixed(2)}`} icon={HiOutlineCurrencyDollar} color="bg-emerald" sub="All completed orders" />
                                        <StatCard label="Pending Approvals" value={stats.totalPending || 0} icon={HiOutlineClock} color="bg-amber" sub="Awaiting your review" />
                                    </div>

                                    {/* Charts Row */}
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                        {/* Monthly Revenue */}
                                        <div className="bg-[#0b0f19]/60 border border-cyan-950/50 rounded-2xl p-6">
                                            <h3 className="text-sm font-bold text-white mb-6">Monthly Revenue</h3>
                                            {salesData.monthlyData && salesData.monthlyData.length > 0 ? (
                                                <ResponsiveContainer width="100%" height={220}>
                                                    <BarChart data={salesData.monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" vertical={false} />
                                                        <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                                                        <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(168,85,247,0.05)' }} />
                                                        <Bar dataKey="revenue" fill="#a855f7" radius={[6, 6, 0, 0]} name="revenue" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <div className="flex items-center justify-center h-[220px] text-gray-600 text-sm font-semibold">No sales data yet</div>
                                            )}
                                        </div>

                                        {/* Top Products */}
                                        <div className="bg-[#0b0f19]/60 border border-cyan-950/50 rounded-2xl p-6">
                                            <h3 className="text-sm font-bold text-white mb-5">Top Selling Products</h3>
                                            {salesData.topSoldItems && salesData.topSoldItems.length > 0 ? (
                                                <div className="space-y-3">
                                                    {salesData.topSoldItems.slice(0, 5).map((item, i) => (
                                                        <div key={i} className="flex items-center gap-3">
                                                            <span className="text-[10px] font-extrabold text-gray-600 w-5 text-right">{i + 1}</span>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-center mb-1">
                                                                    <p className="text-xs font-bold text-white truncate">{item.title || item.name}</p>
                                                                    <p className="text-[10px] text-gray-500 flex-shrink-0 ml-2">{item.salesCount} sold</p>
                                                                </div>
                                                                <div className="h-1.5 bg-cyan-950/50 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                                                                        style={{ width: `${Math.min((item.salesCount / (salesData.topSoldItems[0]?.salesCount || 1)) * 100, 100)}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center h-[200px] text-gray-600 text-sm font-semibold">No sales data yet</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quick glance at pending */}
                                    {pendingProducts.length > 0 && (
                                        <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                                                    <HiOutlineBellAlert className="w-4 h-4" />
                                                    {pendingProducts.length} product{pendingProducts.length > 1 ? 's' : ''} awaiting approval
                                                </h3>
                                                <button onClick={() => setActiveTab('approval-queue')}
                                                    className="text-xs font-bold text-amber-400 hover:underline">Review Now →</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ─── APPROVAL QUEUE TAB ─── */}
                            {activeTab === 'approval-queue' && (
                                <div className="space-y-6">
                                    {pendingProducts.length === 0 ? (
                                        <div className="bg-[#0b0f19]/60 border border-cyan-950/50 rounded-2xl p-16 flex flex-col items-center justify-center">
                                            <HiOutlineCheckCircle className="w-12 h-12 text-emerald-500/50 mb-3" />
                                            <p className="text-sm font-bold text-gray-400">All clear! No pending submissions.</p>
                                            <p className="text-xs text-gray-600 mt-1">Sellers will appear here when they submit new products.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                            {pendingProducts.map(product => (
                                                <motion.div key={product._id} layout
                                                    className="bg-[#0b0f19]/60 border border-amber-900/30 rounded-2xl overflow-hidden hover:border-amber-700/40 transition-all">
                                                    <div className="flex gap-4 p-5">
                                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-cyan-950/40 flex-shrink-0">
                                                            <img src={product.images?.[0] || product.image || `https://placehold.co/80x80/0b0f19/22d3ee?text=${(product.title || product.name)?.charAt(0)}`}
                                                                alt={product.title || product.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <h4 className="text-sm font-bold text-white truncate">{product.title || product.name}</h4>
                                                                <StatusBadge status="pending" size="xs" />
                                                            </div>
                                                            <p className="text-xs text-cyan-400 font-semibold mt-1">${product.price}</p>
                                                            <p className="text-[10px] text-gray-500 capitalize mt-0.5">{product.category}</p>
                                                            <p className="text-[10px] text-gray-600 mt-1 truncate">
                                                                Seller: {product.sellerEmail || product.creatorEmail}
                                                            </p>
                                                            <p className="text-[10px] text-gray-700 mt-0.5">
                                                                Submitted: {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {product.description && (
                                                        <div className="px-5 pb-3">
                                                            <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
                                                        </div>
                                                    )}
                                                    <div className="flex gap-3 p-4 border-t border-amber-900/20">
                                                        <button onClick={() => handleApprove(product._id)}
                                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all">
                                                            <HiOutlineCheckCircle className="w-4 h-4" /> Approve & Publish
                                                        </button>
                                                        <button onClick={() => handleReject(product._id)}
                                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all">
                                                            <HiOutlineXCircle className="w-4 h-4" /> Reject
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ─── TRANSACTIONS TAB ─── */}
                            {activeTab === 'transactions' && (
                                <div className="space-y-5">
                                    <div className="bg-[#0b0f19]/60 border border-cyan-950/50 rounded-2xl overflow-hidden">
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-cyan-950/20 border-b border-cyan-950/50">
                                                <tr>
                                                    <th className="px-5 py-4 font-extrabold text-gray-500 uppercase tracking-widest text-[10px]">Item</th>
                                                    <th className="px-5 py-4 font-extrabold text-gray-500 uppercase tracking-widest text-[10px] hidden sm:table-cell">Buyer</th>
                                                    <th className="px-5 py-4 font-extrabold text-gray-500 uppercase tracking-widest text-[10px] hidden md:table-cell">Seller</th>
                                                    <th className="px-5 py-4 font-extrabold text-gray-500 uppercase tracking-widest text-[10px]">Price</th>
                                                    <th className="px-5 py-4 font-extrabold text-gray-500 uppercase tracking-widest text-[10px]">Date</th>
                                                    <th className="px-5 py-4 font-extrabold text-gray-500 uppercase tracking-widest text-[10px]">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transactions.length === 0 ? (
                                                    <tr><td colSpan={6} className="py-12 text-center text-gray-600 font-semibold">No transactions found</td></tr>
                                                ) : transactions.map((t, i) => (
                                                    <tr key={t._id || i} className="border-b border-cyan-950/20 hover:bg-cyan-950/10 transition-colors">
                                                        <td className="px-5 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-md overflow-hidden bg-cyan-950/50 flex-shrink-0">
                                                                    {t.image ? <img src={t.image} alt={t.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-cyan-900/30" />}
                                                                </div>
                                                                <p className="font-bold text-white truncate max-w-[120px]">{t.title || 'Product'}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-3 hidden sm:table-cell">
                                                            <p className="font-semibold text-gray-300 truncate max-w-[120px]">{t.buyerName || 'Unknown'}</p>
                                                            <p className="text-[10px] text-gray-500 truncate max-w-[120px]">{t.buyerEmail}</p>
                                                        </td>
                                                        <td className="px-5 py-3 hidden md:table-cell">
                                                            <p className="font-semibold text-gray-300 truncate max-w-[120px]">{t.sellerName || 'Unknown'}</p>
                                                            <p className="text-[10px] text-gray-500 truncate max-w-[120px]">{t.sellerEmail}</p>
                                                        </td>
                                                        <td className="px-5 py-3 font-bold text-emerald-400">${Number(t.price || 0).toFixed(2)}</td>
                                                        <td className="px-5 py-3 text-gray-400">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A'}</td>
                                                        <td className="px-5 py-3"><StatusBadge status={t.status || 'completed'} size="xs" /></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* ─── ALL PRODUCTS TAB ─── */}
                            {activeTab === 'all-products' && (
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3 bg-[#0b0f19]/60 border border-cyan-950/50 rounded-xl px-4 py-2.5">
                                        <HiOutlineMagnifyingGlass className="w-4 h-4 text-gray-500" />
                                        <input type="text" placeholder="Search products by name, category, seller..."
                                            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                            className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none" />
                                    </div>
                                    <div className="bg-[#0b0f19]/60 border border-cyan-950/50 rounded-2xl overflow-hidden">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="border-b border-cyan-950/50">
                                                    <th className="text-left text-[10px] font-extrabold text-gray-500 uppercase tracking-widest px-5 py-4">Product</th>
                                                    <th className="text-left text-[10px] font-extrabold text-gray-500 uppercase tracking-widest px-3 py-4 hidden sm:table-cell">Seller</th>
                                                    <th className="text-left text-[10px] font-extrabold text-gray-500 uppercase tracking-widest px-3 py-4 hidden md:table-cell">Price</th>
                                                    <th className="text-left text-[10px] font-extrabold text-gray-500 uppercase tracking-widest px-3 py-4">Status</th>
                                                    <th className="text-right text-[10px] font-extrabold text-gray-500 uppercase tracking-widest px-5 py-4">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredProducts.length === 0 ? (
                                                    <tr><td colSpan={5} className="py-12 text-center text-gray-600 font-semibold">No products found</td></tr>
                                                ) : filteredProducts.map(p => (
                                                    <tr key={p._id} className="border-b border-cyan-950/20 hover:bg-cyan-950/10 transition-colors">
                                                        <td className="px-5 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-lg overflow-hidden bg-cyan-950/50 flex-shrink-0">
                                                                    <img src={p.images?.[0] || p.image || 'https://placehold.co/36x36/0b0f19/22d3ee?text=?'} alt={p.title || p.name} className="w-full h-full object-cover" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-white">{p.title || p.name}</p>
                                                                    <p className="text-[10px] text-gray-600 capitalize">{p.category}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-3 text-gray-500 hidden sm:table-cell truncate max-w-[120px]">{p.sellerEmail || p.creatorEmail || '—'}</td>
                                                        <td className="px-3 py-3 text-cyan-400 font-bold hidden md:table-cell">${p.price}</td>
                                                        <td className="px-3 py-3"><StatusBadge status={p.status || 'published'} size="xs" /></td>
                                                        <td className="px-5 py-3 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                {p.status === 'pending' && (
                                                                    <button onClick={() => handleApprove(p._id)}
                                                                        className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all" title="Approve">
                                                                        <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                                                                    </button>
                                                                )}
                                                                <button onClick={() => handleDeleteProduct(p._id)}
                                                                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all" title="Delete">
                                                                    <HiOutlineTrash className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* ─── USER MANAGEMENT TAB ─── */}
                            {activeTab === 'users' && (
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3 bg-[#0b0f19]/60 border border-cyan-950/50 rounded-xl px-4 py-2.5">
                                        <HiOutlineMagnifyingGlass className="w-4 h-4 text-gray-500" />
                                        <input type="text" placeholder="Search users by name or email..."
                                            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                            className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none" />
                                    </div>
                                    <div className="bg-[#0b0f19]/60 border border-cyan-950/50 rounded-2xl overflow-hidden">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="border-b border-cyan-950/50">
                                                    <th className="text-left text-[10px] font-extrabold text-gray-500 uppercase tracking-widest px-5 py-4">User</th>
                                                    <th className="text-left text-[10px] font-extrabold text-gray-500 uppercase tracking-widest px-3 py-4 hidden md:table-cell">Email</th>
                                                    <th className="text-left text-[10px] font-extrabold text-gray-500 uppercase tracking-widest px-3 py-4">Role</th>
                                                    <th className="text-right text-[10px] font-extrabold text-gray-500 uppercase tracking-widest px-5 py-4">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredUsers.length === 0 ? (
                                                    <tr><td colSpan={4} className="py-12 text-center text-gray-600 font-semibold">No users found</td></tr>
                                                ) : filteredUsers.map(u => (
                                                    <tr key={u._id || u.id} className="border-b border-cyan-950/20 hover:bg-cyan-950/10 transition-colors">
                                                        <td className="px-5 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-cyan-950/80 flex items-center justify-center text-cyan-400 font-bold text-xs overflow-hidden flex-shrink-0 border border-cyan-950/50">
                                                                    {u.image ? <img src={u.image} alt={u.name} className="w-full h-full object-cover" /> : (u.name?.charAt(0) || '?').toUpperCase()}
                                                                </div>
                                                                <p className="font-bold text-white truncate max-w-[120px]">{u.name || 'Unnamed'}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-3 text-gray-500 hidden md:table-cell truncate max-w-[160px]">{u.email}</td>
                                                        <td className="px-3 py-3">
                                                            {u.email === user?.email ? (
                                                                <StatusBadge status="admin" size="xs" />
                                                            ) : (
                                                                <select
                                                                    value={u.role || 'buyer'}
                                                                    onChange={e => handleRoleChange(u, e.target.value)}
                                                                    disabled={updatingRole === (u._id || u.id)}
                                                                    className="bg-[#030712] border border-cyan-950/60 text-xs text-white rounded-lg px-2 py-1 outline-none cursor-pointer hover:border-purple-500/40 transition-colors disabled:opacity-50">
                                                                    {ROLES.map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
                                                                </select>
                                                            )}
                                                        </td>
                                                        <td className="px-5 py-3 text-right">
                                                            {u.email !== user?.email && (
                                                                <button onClick={() => handleDeleteUser(u)}
                                                                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all" title="Delete User">
                                                                    <HiOutlineTrash className="w-3.5 h-3.5" />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                )}
            </main>
        </div>
    );
}
