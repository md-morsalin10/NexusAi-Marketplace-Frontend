"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HiBars3, HiXMark, HiOutlineTrash } from 'react-icons/hi2';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [checkingOut, setCheckingOut] = useState(false);

    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const user = session?.user;
    // console.log("Navbar session:", user);

    const updateCartCount = () => {
        if (typeof window !== "undefined") {
            const items = JSON.parse(localStorage.getItem("gadgethub-cart") || "[]");
            setCartItems(items);
        }
    };

    useEffect(() => {
        updateCartCount();
        window.addEventListener("cart-updated", updateCartCount);
        return () => window.removeEventListener("cart-updated", updateCartCount);
    }, []);

    const handleSignOut = async () => {
        try {
            await authClient.signOut();
            toast.success("Logged out successfully!");
            setShowDropdown(false);
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Sign out error:", error);
            toast.error("Failed to sign out");
        }
    };

    const handleCheckout = async () => {
        if (!user) {
            toast.error("Please login to buy gadgets!");
            router.push("/login");
            setShowCart(false);
            return;
        }

        setCheckingOut(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/create-checkout-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cartItems,
                    email: user.email,
                })
            });
            const data = await res.json();
            if (data.url) {
                localStorage.setItem("gadgethub-checkout-items", JSON.stringify(cartItems));
                toast.success("Redirecting to checkout...");
                window.location.href = data.url;
            } else {
                toast.error(data.error || "Failed to create checkout session");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("Checkout setup failed.");
        } finally {
            setCheckingOut(false);
        }
    };

    // ড্যাশবোর্ডে নেভবার হাইড করার লজিক
    if (pathname.includes("dashboard")) {
        return null;
    }

    // নতুন প্রজেক্টের ন্যাভিগেশন লিংকসমূহ
    const navLinks = [
        { label: "Home", href: "/" },
        { label: "All Products", href: "/all-products" },
        ...(user ? [{ label: "Dashboard", href: "/dashboard" }] : []),
        { label: "Optimizer", href: "/optimizer" },
        { label: "Analytics", href: "/analytics" },
        { label: "About", href: "/about" },
    ];

    return (
        <nav className="bg-[#030712] text-gray-300 border-b border-cyan-950/40 sticky top-0 z-50 backdrop-blur-md bg-opacity-90 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Left Side: Brand Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold tracking-wide text-white">
                            Gadget<span className="text-cyan-400">Hub</span>
                        </Link>
                    </div>

                    {/* Center: Desktop Navigation Links */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className={`relative text-sm font-semibold tracking-medium pb-2 transition-colors duration-200 hover:text-cyan-400 ${isActive ? "text-cyan-400" : "text-gray-400"
                                        }`}
                                >
                                    {link.label}
                                    {/* Active Route Indicator Underline */}
                                    {isActive && (
                                        <motion.span
                                            layoutId="activeUnderline"
                                            className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 rounded-full"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                    {/* Cart & Profile Area */}
                    <div className="flex items-center space-x-4">
                        {/* Cart Toggle Icon */}
                        <button
                            onClick={() => setShowCart(true)}
                            className="relative p-2 rounded-xl border border-cyan-950/45 bg-[#0b0f19]/35 hover:bg-cyan-950/20 text-gray-400 hover:text-cyan-400 transition-all focus:outline-none cursor-pointer"
                        >
                            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-cyan-500 text-[#030712] text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-[#030712] shadow-lg animate-pulse">
                                    {cartItems.length}
                                </span>
                            )}
                        </button>

                        {user ? (
                            <div className="flex items-center relative">
                                <button 
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="w-10 h-10 rounded-full cursor-pointer ring-2 ring-cyan-500/30 hover:ring-cyan-400 transition-all p-[2px] overflow-hidden bg-gray-900 min-w-[40px] min-h-[40px] flex items-center justify-center focus:outline-none"
                                >
                                    {user?.image ? (
                                        <img
                                            src={user.image}
                                            alt={user?.name || "User"}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-cyan-950 text-cyan-400 font-bold text-sm rounded-full">
                                            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                                        </div>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {showDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 top-12 w-56 rounded-2xl bg-[#0b0f19] border border-cyan-950/65 shadow-2xl p-4 z-50 space-y-3"
                                        >
                                            <div className="border-b border-cyan-950/40 pb-2">
                                                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-400 font-bold capitalize">
                                                    {user?.role || "user"}
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() => setShowDropdown(false)}
                                                    className="block text-sm text-gray-400 hover:text-cyan-400 py-1.5 transition-colors"
                                                >
                                                    Dashboard
                                                </Link>
                                                <button
                                                    onClick={handleSignOut}
                                                    className="w-full text-left text-sm text-red-400 hover:text-red-300 py-1.5 transition-colors focus:outline-none"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-6">
                                <Link
                                    href="/login"
                                    className="text-sm font-semibold text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                                >
                                    Login
                                </Link>
                                <motion.a
                                    href="/register"
                                    className="bg-cyan-500 text-[#030712] px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-cyan-950/20 hover:bg-cyan-400 transition-all duration-200"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Get Started
                                </motion.a>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-cyan-950/20 border border-transparent hover:border-cyan-950/40 focus:outline-none transition-colors duration-200"
                            aria-controls="mobile-menu"
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <HiXMark className="block w-6 h-6" />
                            ) : (
                                <HiBars3 className="block w-6 h-6" />
                            )}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-screen opacity-100 visible" : "max-h-0 opacity-0 invisible overflow-hidden"
                    }`}
                id="mobile-menu"
            >
                <div className="px-2 pt-2 pb-6 space-y-2 bg-[#0b0f19]/95 border-t border-cyan-950/40 backdrop-blur-lg shadow-2xl">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors duration-150 ${isActive
                                    ? "bg-cyan-950/40 text-cyan-400 font-semibold border border-cyan-500/20"
                                    : "text-gray-400 hover:bg-cyan-950/20 hover:text-white"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}

                    {/* Mobile Auth Links Splitter */}
                    <div className="pt-4 mt-4 border-t border-cyan-950/40 px-4 space-y-3">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 pb-2">
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-cyan-950 flex items-center justify-center text-cyan-400 font-bold min-w-[40px] min-h-[40px]">
                                        {user.image ? (
                                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            user.name ? user.name.charAt(0).toUpperCase() : "U"
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white truncate max-w-[150px]">{user.name}</p>
                                        <span className="text-xs text-cyan-400 capitalize">{user.role || "user"}</span>
                                    </div>
                                </div>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="block text-center bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 px-4 py-2.5 rounded-xl text-base font-bold"
                                >
                                    Go to Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        handleSignOut();
                                    }}
                                    className="w-full text-center bg-red-950/30 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-base font-bold focus:outline-none"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block text-center text-base font-medium text-gray-400 hover:text-white py-2"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="block text-center bg-cyan-500 text-[#030712] px-4 py-3 rounded-xl text-base font-bold shadow-md"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {/* Cart Drawer */}
            <AnimatePresence>
                {showCart && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end animate-fade-in"
                        onClick={() => setShowCart(false)}
                    >
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className="w-full max-w-md bg-[#0b0f19] border-l border-cyan-950/70 h-full p-6 shadow-2xl flex flex-col justify-between"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Drawer Header */}
                            <div className="flex justify-between items-center border-b border-cyan-950/40 pb-4">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <h3 className="text-base font-bold text-white uppercase tracking-wider">Your Shopping Cart</h3>
                                </div>
                                <button 
                                    onClick={() => setShowCart(false)}
                                    className="p-1 text-gray-500 hover:text-white rounded-lg border border-transparent hover:border-cyan-950/30 transition-all focus:outline-none cursor-pointer"
                                >
                                    <HiXMark className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Drawer Items list */}
                            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
                                {cartItems.length === 0 ? (
                                    <div className="h-64 flex flex-col items-center justify-center text-gray-600 gap-2">
                                        <svg className="w-12 h-12 text-cyan-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        <span className="text-xs font-semibold">Your cart is empty</span>
                                    </div>
                                ) : (
                                    cartItems.map((item, index) => (
                                        <div key={item._id + "-" + index} className="flex items-center gap-3 p-3 bg-[#030712]/50 border border-cyan-950/30 rounded-xl relative group">
                                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-cyan-950/30 shrink-0">
                                                <img src={item.image || "https://placehold.co/80"} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                                                <p className="text-[10px] text-gray-500 capitalize">{item.category}</p>
                                                <span className="text-xs font-bold text-cyan-400 block mt-1">${item.price}</span>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    const updated = [...cartItems];
                                                    updated.splice(index, 1);
                                                    localStorage.setItem("gadgethub-cart", JSON.stringify(updated));
                                                    setCartItems(updated);
                                                    window.dispatchEvent(new Event("cart-updated"));
                                                    toast.success("Removed from cart");
                                                }}
                                                className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-950/20 opacity-0 group-hover:opacity-100 transition-all focus:outline-none cursor-pointer"
                                            >
                                                <HiOutlineTrash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Drawer Footer */}
                            {cartItems.length > 0 && (
                                <div className="border-t border-cyan-950/40 pt-4 space-y-4">
                                    <div className="flex justify-between items-center text-sm font-bold text-white">
                                        <span>Total Amount:</span>
                                        <span className="text-cyan-400 text-lg font-black">
                                            ${cartItems.reduce((acc, curr) => acc + (curr.price || 0), 0).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => {
                                                localStorage.removeItem("gadgethub-cart");
                                                setCartItems([]);
                                                window.dispatchEvent(new Event("cart-updated"));
                                                toast.success("Cart cleared");
                                            }}
                                            className="py-2.5 rounded-xl border border-cyan-950 text-xs font-bold text-gray-400 hover:text-white hover:bg-cyan-950/20 transition-all text-center cursor-pointer"
                                        >
                                            Clear Cart
                                        </button>
                                        <button
                                            onClick={handleCheckout}
                                            disabled={checkingOut}
                                            className={`py-2.5 rounded-xl bg-cyan-500 text-[#030712] text-xs font-bold hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] flex items-center justify-center cursor-pointer ${
                                                checkingOut ? 'opacity-60 cursor-not-allowed' : ''
                                            }`}
                                        >
                                            {checkingOut ? "Processing..." : "Checkout Session"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;