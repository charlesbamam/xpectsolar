"use client";

import { useState } from "react";
import { CreditCard, CheckCircle2, ArrowRight, Activity, AlertCircle, X } from "lucide-react";

export default function PlanPage() {
    const [showPreRegisterModal, setShowPreRegisterModal] = useState(false);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[#14151C]">Plano e Faturamento</h1>
                <p className="text-slate-600 mt-1">Gerencie sua assinatura e acompanhe o consumo de análises.</p>
            </div>

            {/* Current Plan Overview */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="bg-[#14151C] p-6 text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-sm font-semibold text-[#D0F252] uppercase tracking-wider">Plano Atual</h3>
                                <p className="text-2xl font-bold mt-1">Plano Essencial</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold">R$ 97<span className="text-sm font-normal text-slate-400">/mês</span></p>
                                <p className="text-[10px] text-slate-400">Próximo vencimento: 15/06/2026</p>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 font-medium flex items-center gap-2">
                                    <Activity size={16} className="text-[#6B8C49]" /> Uso de análises neste ciclo
                                </span>
                                <span className="text-sm font-bold text-[#14151C]">42 / 100</span>
                            </div>
                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#D0F252] rounded-full w-[42%] transition-all" />
                            </div>
                            <p className="text-xs text-slate-400 italic font-medium">Você ainda possui 58 análises técnicas disponíveis até a renovação.</p>
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                            <button className="text-sm font-bold text-slate-600 hover:text-[#14151C] transition-colors">Cancelar assinatura</button>
                            <button className="bg-[#14151C] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black transition-all text-sm flex items-center gap-2">
                                Alterar Plano <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-[#14151C] flex items-center gap-2">
                                <CreditCard size={18} className="text-[#6B8C49]" /> Método de Pagamento
                            </h3>
                            <button className="text-sm font-bold text-[#6B8C49] hover:underline">Editar</button>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="w-12 h-8 bg-[#14151C] rounded flex items-center justify-center text-[10px] text-white font-bold">VISA</div>
                            <div>
                                <p className="text-sm font-bold text-[#14151C]">•••• •••• •••• 4242</p>
                                <p className="text-xs text-slate-500">Expira em 12/28</p>
                            </div>
                            <div className="ml-auto">
                                <CheckCircle2 size={18} className="text-green-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits / Support Side */}
                <div className="space-y-6">
                    <div className="bg-[#D0F252]/10 p-6 rounded-2xl border border-[#D0F252]/30 space-y-4">
                        <h4 className="font-bold text-[#14151C] text-sm">O que inclui seu plano:</h4>
                        <ul className="space-y-3">
                            <BenefitItem text="100 análises mensais" />
                            <BenefitItem text="Suporte Prioritário" />
                            <BenefitItem text="Dashboard de Gestão" />
                            <BenefitItem text="Google Solar API Incluída" />
                            <BenefitItem text="Exportação CSV" />
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-[#14151C] font-bold text-sm">
                            <AlertCircle size={16} className="text-yellow-500" />
                            Precisa de mais análises?
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Se o seu volume de prospecção aumentou, você pode migrar para o plano <strong>Professional</strong> (500 análises) a qualquer momento.
                        </p>
                        <button
                            onClick={() => setShowPreRegisterModal(true)}
                            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-[#14151C] font-bold rounded-xl text-sm transition-all px-4 leading-tight"
                        >
                            Em breve Planos Corporativos.<br /><span className="text-[#6B8C49] text-xs">Clique para cadastrar previamente</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Pre-Register Modal */}
            {showPreRegisterModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 md:p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowPreRegisterModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:bg-slate-100 hover:text-red-500 p-2 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center space-y-2 mb-6 mt-2">
                            <h2 className="text-2xl font-bold text-[#14151C] flex items-center justify-center gap-2">
                                <Activity size={24} className="text-[#808000]" />
                                Planos Corporativos
                            </h2>
                            <p className="text-slate-500 text-sm px-4">Cadastre-se na lista de espera para ter acesso antecipado a recursos exclusivos para equipes e grandes volumes de simulações.</p>
                        </div>

                        <form className="space-y-4" onSubmit={(e) => {
                            e.preventDefault();
                            setShowPreRegisterModal(false);
                            alert("Obrigado pela preferência! Interesse cadastrado com sucesso.");
                        }}>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome Completo</label>
                                <input type="text" required placeholder="Ex: João da Silva" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-[#808000]/20 transition-all text-[#14151C]" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail Corporativo</label>
                                    <input type="email" required placeholder="joao@empresa.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-[#808000]/20 transition-all text-[#14151C]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">WhatsApp</label>
                                    <input type="tel" required placeholder="(11) 99999-9999" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-[#808000]/20 transition-all text-[#14151C]" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Quantos consultores no seu time?</label>
                                <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-[#808000]/20 transition-all text-[#14151C]">
                                    <option value="">Selecione...</option>
                                    <option value="1_5">1 a 5 consultores (Equipe Pequena)</option>
                                    <option value="6_15">6 a 15 consultores (Médio Porte)</option>
                                    <option value="16_50">16 a 50 consultores (Grande Porte)</option>
                                    <option value="51_plus">Mais de 50 consultores (Enterprise)</option>
                                </select>
                            </div>

                            <div className="pt-2">
                                <button type="submit" className="w-full bg-[#808000] text-white font-bold py-3.5 rounded-xl hover:bg-[#008138] transition-colors shadow-lg shadow-[#808000]/20">
                                    Entrar na Lista de Espera VIP
                                </button>
                                <p className="text-center text-[10px] text-slate-400 mt-3">Prometemos não enviar spam. Você será avisado assim que os planos lançarem.</p>
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
        <li className="flex items-center gap-2 text-xs text-slate-700 font-medium">
            <CheckCircle2 size={14} className="text-[#6B8C49]" />
            {text}
        </li>
    );
}
