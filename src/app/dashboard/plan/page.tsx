"use client";

import { useState, useEffect } from "react";
import { CreditCard, CheckCircle2, ArrowRight, Activity, AlertCircle, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function PlanPage() {
    const [showPreRegisterModal, setShowPreRegisterModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [planData, setPlanData] = useState({
        type: 'free',
        usage: 0,
        limit: 2,
        nextBilling: '---'
    });
    const router = useRouter();

    useEffect(() => {
        const fetchPlanData = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/login');
                    return;
                }

                // 1. Contagem de leads (consumo)
                const { count, error: countError } = await supabase
                    .from('leads')
                    .select('*', { count: 'exact', head: true })
                    .eq('consultant_id', user.id);

                if (countError) throw countError;

                // 2. Dados do Consultor (tipo de plano)
                const { data: consultant, error: consultantError } = await supabase
                    .from('consultants')
                    .select('plan_type, created_at')
                    .eq('id', user.id)
                    .single();

                if (consultantError) throw consultantError;

                const planType = consultant?.plan_type || 'free';
                const limit = planType === 'free' ? 2 : 100;

                setPlanData({
                    type: planType,
                    usage: count || 0,
                    limit: limit,
                    nextBilling: planType === 'free' ? '---' : '15/06/2026' // Valor fixo simulado por enquanto
                });

            } catch (err) {
                console.error("Erro ao carregar dados do plano:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlanData();
    }, [router]);

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-[#14151C]" size={32} />
                <p className="text-slate-500 font-medium">Carregando dados da sua assinatura...</p>
            </div>
        );
    }

    const isUsageOver = planData.usage >= planData.limit;
    const usagePercent = Math.min((planData.usage / planData.limit) * 100, 100);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[#14151C]">Plano e Faturamento</h1>
                <p className="text-slate-600 mt-1">Gerencie sua assinatura e acompanhe o consumo de análises.</p>
            </div>

            {/* Current Plan Overview */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="bg-[#14151C] p-8 text-white flex justify-between items-center relative overflow-hidden">
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D0F252] rounded-full blur-[60px] opacity-10 -mr-16 -mt-16" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-[40px] opacity-5 -ml-12 -mb-12" />

                            <div className="relative z-10">
                                <h3 className="text-[10px] font-bold text-[#D0F252] uppercase tracking-[0.2em]">Plano Atual</h3>
                                <p className="text-2xl font-black mt-1">{planData.type === 'free' ? 'Teste Gratuito' : 'Plano Essencial'}</p>
                            </div>
                            <div className="text-right relative z-10">
                                <p className="text-2xl font-black">
                                    {planData.type === 'free' ? 'R$ 0' : 'R$ 97'}<span className="text-xs font-medium text-slate-400">/mês</span>
                                </p>
                                <p className="text-[10px] text-slate-400 font-medium opacity-80 mt-1">
                                    {planData.type === 'free' ? 'Avaliação inicial ativa' : `Próximo vencimento: ${planData.nextBilling}`}
                                </p>
                            </div>
                        </div>

                        <div className="p-8 space-y-5">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 font-bold flex items-center gap-2">
                                    <Activity size={18} className="text-[#6B8C49]" /> Uso de análises neste ciclo
                                </span>
                                <span className="text-sm font-black text-[#14151C] bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                    {planData.usage} / {planData.limit}
                                </span>
                            </div>

                            <div className="relative">
                                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${usagePercent > 90 ? 'bg-red-500' : 'bg-[#D0F252]'}`}
                                        style={{ width: `${usagePercent}%` }}
                                    />
                                </div>
                                {usagePercent > 80 && (
                                    <div className="absolute -top-1 right-0 animate-bounce">
                                        <AlertCircle size={14} className="text-red-500" />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-xs text-slate-400 italic font-medium">
                                    {isUsageOver ? 'Limite atingido. Faça upgrade para continuar recebendo leads.' : `Você ainda possui ${planData.limit - planData.usage} análises técnicas disponíveis.`}
                                </p>
                                {planData.type === 'free' && (
                                    <span className="text-[10px] font-bold text-[#6B8C49] bg-[#D0F252]/10 px-2 py-0.5 rounded uppercase">Bônus de Cadastro</span>
                                )}
                            </div>
                        </div>

                        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
                            <button
                                onClick={() => alert("Para cancelar, entre em contato com financeiro@xpectsolar.com")}
                                className="text-xs font-bold text-slate-400 hover:text-red-600 transition-colors uppercase tracking-wider"
                            >
                                Cancelar assinatura
                            </button>
                            <button
                                onClick={async () => {
                                    if (planData.type === 'free') {
                                        setLoading(true);
                                        try {
                                            const response = await fetch('/api/stripe/checkout', { method: 'POST' });
                                            const data = await response.json();
                                            if (data.url) {
                                                window.location.href = data.url;
                                            } else {
                                                alert("Erro ao iniciar pagamento. Tente novamente.");
                                            }
                                        } catch (err) {
                                            console.error("Erro checkout:", err);
                                            alert("Erro de conexão.");
                                        } finally {
                                            setLoading(false);
                                        }
                                    } else {
                                        // Se já for plano essencial, ele deveria ir para o Customer Portal do Stripe
                                        alert("Em breve: Portal de Gerenciamento de Assinatura do Stripe.");
                                    }
                                }}
                                disabled={loading}
                                className="bg-[#14151C] text-white px-8 py-3 rounded-2xl font-bold hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#14151C]/10 text-sm flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading && planData.type === 'free' ? (
                                    <>Processando... <Loader2 className="animate-spin" size={16} /></>
                                ) : (
                                    <>{planData.type === 'free' ? 'Assinar Plano Essencial' : 'Gerenciar Assinatura'} <ArrowRight size={16} className="text-[#D0F252]" /></>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-black text-[#14151C] flex items-center gap-2 uppercase text-xs tracking-widest">
                                <CreditCard size={18} className="text-[#6B8C49]" /> Método de Pagamento
                            </h3>
                            <button
                                onClick={() => alert("Em breve: Integração com Stripe")}
                                className="text-xs font-bold text-[#6B8C49] hover:underline uppercase tracking-wider"
                            >
                                Editar
                            </button>
                        </div>
                        <div className="flex items-center gap-5 p-6 bg-[#FDFDFD] rounded-2xl border border-slate-100 group hover:border-[#D0F252]/50 transition-all">
                            <div className="w-14 h-9 bg-gradient-to-br from-[#14151C] to-slate-700 rounded-lg flex items-center justify-center text-[10px] text-white font-black shadow-lg">VISA</div>
                            <div className="flex-1">
                                <p className="text-sm font-black text-[#14151C] tracking-widest">•••• •••• •••• 4242</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Expira em 12/28</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                                <CheckCircle2 size={18} className="text-green-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits / Support Side */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#EEF2DC] to-[#F8FAFC] p-8 rounded-3xl border border-[#D0F252]/30 shadow-sm space-y-6">
                        <h4 className="font-black text-[#14151C] text-xs uppercase tracking-widest">O que inclui seu plano:</h4>
                        <ul className="space-y-4">
                            <BenefitItem text={planData.type === 'free' ? "2 análises gratuitas" : "100 análises mensais"} />
                            <BenefitItem text="Suporte Prioritário" />
                            <BenefitItem text="Dashboard de Gestão" />
                            <BenefitItem text="Mapeamento por Satélite Incluído" />
                            <BenefitItem text="Exportação CSV" />
                        </ul>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-full blur-2xl -mr-8 -mt-8" />

                        <div className="flex items-center gap-2 text-[#14151C] font-black text-xs uppercase tracking-widest relative z-10">
                            <AlertCircle size={16} className="text-yellow-500" />
                            Precisa de mais?
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium relative z-10">
                            Se o seu volume de prospecção aumentou, você pode migrar para o plano <strong>Professional</strong> (500 análises) a qualquer momento.
                        </p>
                        <button
                            onClick={() => setShowPreRegisterModal(true)}
                            className="w-full py-4 bg-[#14151C] text-white font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all hover:bg-black shadow-lg shadow-black/10 leading-tight"
                        >
                            Ver Planos Corporativos
                        </button>
                        <p className="text-[9px] text-center text-slate-400 font-medium italic">Upgrade imediato sem burocracia</p>
                    </div>
                </div>
            </div>

            {/* Pre-Register Modal */}
            {showPreRegisterModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-lg p-8 md:p-10 relative shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setShowPreRegisterModal(false)}
                            className="absolute top-6 right-6 text-slate-400 hover:bg-slate-100 hover:text-red-500 p-2 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center space-y-3 mb-8 mt-2">
                            <div className="w-16 h-16 bg-[#D0F252]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 group-hover:rotate-6 transition-transform">
                                <Activity size={32} className="text-[#6B8C49]" />
                            </div>
                            <h2 className="text-3xl font-black text-[#14151C] font-['Space_Grotesk']">
                                Planos Corporativos
                            </h2>
                            <p className="text-slate-500 text-sm font-medium px-4">Recursos exclusivos para equipes e grandes operações de energia solar.</p>
                        </div>

                        <form className="space-y-5" onSubmit={(e) => {
                            e.preventDefault();
                            setShowPreRegisterModal(false);
                            alert("Obrigado pela preferência! Interesse cadastrado com sucesso.");
                        }}>
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Nome Completo</label>
                                <input type="text" required placeholder="Ex: João da Silva" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-4 focus:ring-[#D0F252]/20 focus:border-[#D0F252] transition-all text-[#14151C] font-bold" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">E-mail Corporativo</label>
                                    <input type="email" required placeholder="joao@empresa.com" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-4 focus:ring-[#D0F252]/20 focus:border-[#D0F252] transition-all text-[#14151C] font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">WhatsApp</label>
                                    <input type="tel" required placeholder="(11) 99999-9999" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-4 focus:ring-[#D0F252]/20 focus:border-[#D0F252] transition-all text-[#14151C] font-bold" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Tamanho do Time</label>
                                <select required className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-4 focus:ring-[#D0F252]/20 focus:border-[#D0F252] transition-all text-[#14151C] font-bold appearance-none">
                                    <option value="">Selecione uma opção...</option>
                                    <option value="1_5">1 a 5 consultores</option>
                                    <option value="6_15">6 a 15 consultores</option>
                                    <option value="16_50">16 a 50 consultores</option>
                                    <option value="51_plus">Mais de 50 consultores</option>
                                </select>
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="w-full bg-[#14151C] text-white font-black py-4 rounded-2xl hover:bg-black transition-all shadow-xl shadow-black/10 uppercase tracking-[0.2em] text-xs">
                                    Entrar na Lista VIP
                                </button>
                                <p className="text-center text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-wider">Acesso prioritário garantido</p>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function BenefitItem({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-3 text-xs text-[#14151C] font-bold">
            <div className="w-5 h-5 bg-[#D0F252] rounded-lg flex items-center justify-center shadow-sm">
                <CheckCircle2 size={12} className="text-[#14151C]" />
            </div>
            {text}
        </li>
    );
}
