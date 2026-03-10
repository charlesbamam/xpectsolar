import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
        }

        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
        }

        // Criar a sessão de checkout do Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: 'price_1T9QCB8UJ5roGMXxkwZ1zcjQ',
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://xpectsolar.com'}/dashboard/plan?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://xpectsolar.com'}/dashboard/plan?cancel=true`,
            customer_email: user.email,
            client_reference_id: user.id,
            metadata: {
                user_id: user.id,
            },
            subscription_data: {
                metadata: {
                    user_id: user.id,
                },
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (err: unknown) {
        console.error('Stripe error:', err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
