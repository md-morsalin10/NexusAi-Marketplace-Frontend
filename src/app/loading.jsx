import React from 'react';
import { Loader2 } from 'lucide-react';

export default function GlobalLoading() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030712]/80 backdrop-blur-sm min-h-screen">
            <div className="relative flex items-center justify-center">
                {/* Outer Glow Ring */}
                <div className="absolute w-24 h-24 border-t-2 border-r-2 border-cyan-400 rounded-full animate-[spin_2s_linear_infinite]" />
                {/* Inner Glow Ring */}
                <div className="absolute w-16 h-16 border-b-2 border-l-2 border-purple-500 rounded-full animate-[spin_1.5s_linear_infinite_reverse]" />
                {/* Center Icon */}
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
            <p className="mt-6 text-sm font-black tracking-[0.2em] uppercase text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                Loading Nexus<span className="text-white">AI</span>
            </p>
        </div>
    );
}
