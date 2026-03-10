import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature') as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || ''
        );
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Lógica para lidar com o evento
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const userId = session.client_reference_id || session.metadata.user_id;

        if (userId) {
            // Atualizar o plano do consultor para 'essential' usando o Admin Client (By-pass RLS)
            const { error } = await supabaseAdmin
                .from('consultants')
                .update({ plan_type: 'essential' })
                .eq('id', userId);

            if (error) {
                console.error('Erro ao atualizar plano no Supabase:', error);
            } else {
                console.log(`Plano atualizado para o usuário: ${userId}`);
            }
        }
    }

    return NextResponse.json({ received: true });
}
