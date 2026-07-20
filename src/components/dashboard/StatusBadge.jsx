"use client";
import React from 'react';

const STATUS_CONFIG = {
    published: {
        label: 'Published',
        className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        dot: 'bg-emerald-400'
    },
    pending: {
        label: 'Pending Approval',
        className: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        dot: 'bg-amber-400'
    },
    rejected: {
        label: 'Rejected',
        className: 'bg-red-500/15 text-red-400 border-red-500/30',
        dot: 'bg-red-400'
    },
    completed: {
        label: 'Completed',
        className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        dot: 'bg-emerald-400'
    },
    admin: {
        label: 'Admin',
        className: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
        dot: 'bg-purple-400'
    },
    seller: {
        label: 'Seller',
        className: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
        dot: 'bg-cyan-400'
    },
    buyer: {
        label: 'Buyer',
        className: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        dot: 'bg-blue-400'
    },
    user: {
        label: 'Buyer',
        className: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        dot: 'bg-blue-400'
    }
};

export default function StatusBadge({ status, size = 'sm' }) {
    const config = STATUS_CONFIG[status] || {
        label: status || 'Unknown',
        className: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
        dot: 'bg-gray-400'
    };

    const sizeClass = size === 'xs'
        ? 'text-[9px] px-1.5 py-0.5'
        : 'text-[10px] px-2.5 py-1';

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border font-bold uppercase tracking-wider ${config.className} ${sizeClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
            {config.label}
        </span>
    );
}
