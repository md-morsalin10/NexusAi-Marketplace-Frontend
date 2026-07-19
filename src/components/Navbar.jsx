"use client";
import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); 
  const [activeTab, setActiveTab] = useState('Explore');

  // প্রজেক্ট রিকোয়ারমেন্ট অনুযায়ী রাউটিং এলাইনমেন্ট
  const loggedOutRoutes = [
    { name: 'Explore', path: '/explore' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'About', path: '/about' },
  ];

  const loggedInRoutes = [
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Optimizer', path: '/items/add' },
    { name: 'Analytics', path: '/ai-dashboard' },
    { name: 'About', path: '/about' },
  ];

  const activeRoutes = isLoggedIn ? loggedInRoutes : loggedOutRoutes;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#0F172A]/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Left Segment: Logo & Links */}
          <div className="flex items-center space-x-10">
            {/* Brand Logo - Updated to GadgetHub */}
            <div className="flex flex-shrink-0 items-center select-none">
              <span className="text-xl font-bold tracking-tight text-white">
                Gadget<span className="text-[#06B6D4]">Hub</span>
              </span>
            </div>

            {/* Desktop Link Layout */}
            <div className="hidden md:flex items-center space-x-6 h-16">
              {activeRoutes.map((route, index) => {
                const isActive = activeTab === route.name;
                return (
                  <a
                    key={index}
                    href={route.path}
                    onClick={() => {
                      setActiveTab(route.name);
                    }}
                    className={`relative text-sm font-medium transition-colors duration-200 h-full flex items-center px-1 ${
                      isActive ? 'text-[#06B6D4]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {route.name}
                    {/* Active Route Bottom Border Glow */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-[#06B6D4] to-cyan-400 shadow-[0_-2px_10px_rgba(6,182,212,0.5)]" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right Segment: UI Controls & Actions */}
          <div className="hidden md:flex items-center space-x-5">
            {/* Embedded Search Bar Layout */}
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="h-4 w-4 text-slate-500 group-focus-within:text-[#06B6D4] transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search tech..."
                className="w-52 rounded-full bg-slate-900/60 border border-slate-800 py-1.5 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 outline-none focus:w-60 focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]/30 transition-all duration-300"
              />
            </div>

            {/* Notification Control Indicator */}
            <button className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-900 transition-all focus:outline-none relative">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            {/* Global E-Commerce Basket Indicator */}
            <button className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-900 transition-all focus:outline-none">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </button>

            {/* Profile Node Canvas */}
            {isLoggedIn ? (
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-slate-800 p-[1px] ring-2 ring-purple-600/40 hover:ring-[#06B6D4] transition-all cursor-pointer overflow-hidden shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80" 
                    alt="User account profile" 
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
              </div>
            ) : (
              <a
                href="/login"
                className="rounded-full bg-[#06B6D4] px-4 py-1.5 text-xs font-semibold text-slate-950 transition-all duration-200 hover:bg-[#06B6D4]/90 shadow-md shadow-[#06B6D4]/15"
              >
                Login
              </a>
            )}
          </div>

          {/* Responsive Hamburger UI Switch */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-400 hover:bg-slate-900 hover:text-white transition-all focus:outline-none"
            >
              <span className="sr-only">Toggle Main Menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Component Submenu Layer */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden border-t border-slate-800 bg-[#0F172A]`}>
        <div className="space-y-1 px-3 pb-4 pt-3">
          {activeRoutes.map((route, index) => {
            const isTabActive = activeTab === route.name;
            return (
              <a
                key={index}
                href={route.path}
                onClick={() => {
                  setActiveTab(route.name);
                  setIsOpen(false);
                }}
                className={`block rounded-xl px-3 py-2.5 text-base font-medium transition-all ${
                  isTabActive 
                    ? 'bg-slate-900 text-[#06B6D4] font-semibold' 
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'
                }`}
              >
                {route.name}
              </a>
            );
          })}
          
          {/* Mobile Menu Footer */}
          <div className="mt-4 border-t border-slate-800 pt-4 px-3">
            {isLoggedIn ? (
              <div className="flex items-center justify-between bg-slate-900/40 p-2 rounded-xl border border-slate-800/40">
                <div className="flex items-center space-x-3">
                  <img 
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80" 
                    alt="User signature" 
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-purple-600/30"
                  />
                  <span className="text-sm font-semibold text-slate-200">Morsalin</span>
                </div>
                <div className="flex space-x-2 text-slate-400">
                  <button className="p-1.5 hover:text-white transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>
                  <button className="p-1.5 hover:text-white transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <a
                href="/login"
                className="block w-full text-center rounded-xl bg-[#06B6D4] py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-[#06B6D4]/15"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;