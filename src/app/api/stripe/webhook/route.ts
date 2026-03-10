import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

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
            // Atualizar o plano do consultor para 'essential'
            const { error } = await supabase
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
