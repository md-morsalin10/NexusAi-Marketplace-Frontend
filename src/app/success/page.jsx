import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight, Home, LayoutDashboard, Mail, FileText } from 'lucide-react';
import { serverMutation } from '@/lib/action/payment';

export default async function PaymentSuccessPage({ searchParams }) {
    const resolvedSearchParams = await searchParams;
    const sessionId = resolvedSearchParams?.session_id;

    if (!sessionId) {
        throw new Error('Valid session_id missing');
    }

    // Retrieve checkout session with expanded metadata and payment details
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items', 'payment_intent'],
    });

    if (session.status === 'open') {
        return redirect('/');
    }

    if (session.status !== 'complete') {
        return redirect('/dashboard/buyer?payment=failed');
    }

    const customerEmail = session.customer_details?.email || session.metadata?.userEmail || 'N/A';
    const metadata = session.metadata || {};
    const amountTotal = (session.amount_total / 100).toFixed(2);
    const currency = session.currency?.toUpperCase() || 'USD';

    console.log(metadata, "from susscess page")

    await serverMutation({
        ...metadata,
        sessionId: sessionId,

    })

    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            {/* Background Decorative Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[160px] pointer-events-none rounded-full" />
            <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />

            {/* Main Glassmorphism Card */}
            <div className="max-w-2xl w-full bg-slate-950/80 border border-slate-800/80 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative z-10 space-y-8">

                {/* Top Success Badge */}
                <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                        <CheckCircle2 className="w-9 h-9 text-emerald-400" />
                    </div>
                    <span className="inline-block text-[10px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                        Payment Completed
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        Thank You for Your Purchase!
                    </h1>
                    <p className="text-sm text-slate-400 max-w-md mx-auto">
                        A confirmation receipt has been dispatched to{' '}
                        <span className="text-slate-200 font-semibold underline decoration-emerald-500/50">{customerEmail}</span>.
                    </p>
                </div>

                {/* Order Summary Box */}
                <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                            <Package className="w-4 h-4 text-cyan-400" />
                            <span>Order Details</span>
                        </div>
                        <span className="text-xs font-mono text-slate-500">
                            ID: {sessionId.slice(0, 14)}...
                        </span>
                    </div>

                    <div className="space-y-3 text-sm">
                        {metadata.title && (
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Product Title</span>
                                <span className="text-white font-semibold">{metadata.title}</span>
                            </div>
                        )}

                        {metadata.sellerName && (
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Seller</span>
                                <span className="text-slate-300 font-medium">{metadata.sellerName}</span>
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-2 border-t border-slate-800/40 font-bold">
                            <span className="text-slate-300">Total Paid</span>
                            <span className="text-xl text-emerald-400 font-mono">
                                ${amountTotal} {currency}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="flex items-start gap-3 p-3.5 bg-slate-900/30 border border-slate-800/40 rounded-xl">
                        <Mail className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-slate-300">Digital Receipt</p>
                            <p className="text-slate-500 text-[11px]">Sent directly to your account email.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3.5 bg-slate-900/30 border border-slate-800/40 rounded-xl">
                        <FileText className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-slate-300">Access Granted</p>
                            <p className="text-slate-500 text-[11px]">Your item is now available in buyer panel.</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Link href="/dashboard/buyer" className="flex-1">
                        <button className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-slate-950 font-bold text-sm shadow-[0_0_25px_rgba(16,185,129,0.2)] hover:opacity-95 transition-all">
                            <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                        </button>
                    </Link>

                    <Link href="/" className="flex-1">
                        <button className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-slate-900 border border-slate-700/60 text-slate-300 font-bold text-sm hover:bg-slate-800 hover:text-white transition-all">
                            <Home className="w-4 h-4" /> Home Page
                        </button>
                    </Link>
                </div>

            </div>
        </div>
    );
}