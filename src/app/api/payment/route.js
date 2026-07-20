import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';

export async function POST(request) {
    try {
        const reqHeaders = await headers();
        const origin = reqHeaders.get('origin') || 'http://localhost:3000';

        // 1. Auth Session নেওয়া
        const authSession = await auth.api.getSession({
            headers: reqHeaders,
        });
        const user = authSession?.user;

        console.log("=== CHECKING USER SESSION DETAILS ===", user);

        // 2. Form Data নেওয়া
        const formData = await request.formData();
        const title = formData.get("title");
        const productId = formData.get("productId");
        const price = formData.get("price");
        const sellerId = formData.get("sellerId");
        const sellerEmail = formData.get("sellerEmail");
        const sellerName = formData.get("sellerName");
        const buyerId = formData.get("buyerId");
        const buyerEmail = formData.get("buyerEmail");
        const buyerName = formData.get("buyerName");
        const status = formData.get("status");
        const features = formData.get("features");
        const description = formData.get("description");
        const image = formData.get("image");
       
        
        console.log("=== CHECKING FORM DATA ===", Object.fromEntries(formData));

    
        const checkoutSession = await stripe.checkout.sessions.create({
            customer_email: user?.email || buyerEmail || undefined,
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        unit_amount: Math.round(Number(price) * 100),
                        product_data: {
                            name: title || "Product",
                            images: image ? [String(image)] : [],
                        }
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                price: String(price || ''),
                title: String(title || ''),
                productId: String(productId || ''),
                buyerId: String(buyerId || user?.id || ''),
                buyerEmail: String(buyerEmail || user?.email || ''),
                buyerName: String(buyerName || user?.name || ''),
                sellerId: String(sellerId || ''),
                sellerEmail: String(sellerEmail || ''),
                sellerName: String(sellerName || ''),
                image: String(image || ''),
                status: String(status || ''),
                features: String(features || ''),
                description: String(description || ''),
            },
            mode: 'payment',
            success_url: `${origin}/success?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/dashboard/buyer?payment=cancel`,
        });

        return NextResponse.redirect(checkoutSession.url, 303);

    } catch (err) {
        console.error("Stripe Payment API Error:", err);
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 }
        );
    }
}