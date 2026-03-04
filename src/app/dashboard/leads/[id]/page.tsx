"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Zap, CheckCircle2, Phone, Mail, Calendar, FileText, Home } from "lucide-react";

export default function LeadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    // We need to unwrap params since Next.js 15
    const resolvedParams = use(params);
    const { id } = resolvedParams;

    const isBadLead = id === "4";
    const isMediumLead = id === "3";

    const lead = isBadLead ? {
        name: "Condomínio Residencial",
        initials: "CR",
        email: "sindico.jose@condo.com",
        phone: "(21) 9988-7766",
        address: "Rua das Águias, 800 - RJ",
        date: "Há 1 semana",
        tag: "Inviável",
        tagColor: "bg-red-50 text-red-600 border-red-200",
        score: "C",
        scoreLabel: "Score Técnico Inviável",
        scoreDesc: "Viabilidade baixa detectada. Muitas sombras ou área insuficiente.",
        scoreColor: "bg-red-500",
        scoreTextColor: "text-white",
        scoreBorder: "border-red-500",
        scoreShadow: "shadow-[0_4px_24px_rgba(239,68,68,0.25)]",
        scoreBadgeBg: "bg-red-600 text-white",
        scoreBadgeText: "BAIXO VALOR",
        bill: "R$ 120,00",
        savings: "R$ 0,00",
        savingsColor: "bg-red-50 border-red-100 text-red-700",
        savingsLabelColor: "text-red-500",
        capex: "N/A",
        payback: "Inviável",
        consumption: "120 kWh/mês",
        area: "Aprox. 8 m²",
        modules: "Nenhum",
        roofType: "Metálico"
    } : isMediumLead ? {
        name: "Mariana Silveira",
        initials: "MS",
        email: "mari.silveira@outlook.com",
        phone: "(31) 98877-6655",
        address: "Rua dos Jacarandás, 55 - MG",
        date: "22/05/2026",
        tag: "Pendente",
        tagColor: "bg-orange-50 text-orange-600 border-orange-200",
        score: "B",
        scoreLabel: "Score Técnico Moderado",
        scoreDesc: "Viabilidade média detectada. Possíveis desafios na instalação ou sombreamento parcial.",
        scoreColor: "bg-orange-500",
        scoreTextColor: "text-white",
        scoreBorder: "border-orange-500",
        scoreShadow: "shadow-[0_4px_24px_rgba(249,115,22,0.25)]",
        scoreBadgeBg: "bg-orange-600 text-white",
        scoreBadgeText: "MÉDIO VALOR",
        bill: "R$ 310,00",
        savings: "R$ 250,00",
        savingsColor: "bg-orange-50 border-orange-100 text-orange-700",
        savingsLabelColor: "text-orange-600",
        capex: "R$ 18.2k",
        payback: "5.2 Anos",
        consumption: "310 kWh/mês",
        area: "Aprox. 20 m²",
        modules: "6 Placas (550W)",
        roofType: "Cerâmico"
    } : {
        name: "Carlos Andrade",
        initials: "CA",
        email: "carlos.e@gmail.com",
        phone: "(11) 98765-4321",
        address: "Rua das Oliveiras, 145 - Morumbi, São Paulo/SP",
        date: "Capturado em 14/05/2026",
        tag: "Qualificado",
        tagColor: "bg-green-50 text-green-600 border-green-200",
        score: "A",
        scoreLabel: "Score Técnico Excelente",
        scoreDesc: "Viabilidade alta detectada pelo simulador para esta residência.",
        scoreColor: "bg-[#D0F252]",
        scoreTextColor: "text-[#14151C]",
        scoreBorder: "border-[#D0F252]",
        scoreShadow: "shadow-[0_4px_24px_rgba(208,242,82,0.15)]",
        scoreBadgeBg: "bg-[#14151C] text-[#D0F252]",
        scoreBadgeText: "ALTO VALOR",
        bill: "R$ 950,00",
        savings: "R$ 840,00",
        savingsColor: "bg-green-50 border-green-100 text-green-700",
        savingsLabelColor: "text-green-600",
        capex: "R$ 35k",
        payback: "3.8 Anos",
        consumption: "950 kWh/mês",
        area: "Aprox. 45 m²",
        modules: "16 Placas (550W)",
        roofType: "Cerâmico"
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12">
            {/* Header / Nav */}
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <Link href="/dashboard/leads" className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-500 hover:text-[#14151C]">
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-[#14151C]">Detalhes do Lead #{id}</h1>
                    <p className="text-sm text-slate-500 font-medium tracking-wide">Gerencie informações e propostas deste contato.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Coluna Esquerda: Info do Lead */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-slate-100/50 rounded-bl-full border-b border-l border-slate-100"></div>
                        <div className="flex flex-col items-center text-center space-y-4 pt-2">
                            <div className="w-20 h-20 rounded-full bg-slate-100 border-4 border-white shadow-sm flex items-center justify-center text-2xl font-black text-slate-400">
                                {lead.initials}
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-[#14151C]">{lead.name}</h2>
                                <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest border ${lead.tagColor}`}>{lead.tag}</span>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Mail size={16} className="text-slate-400" />
                                <span>{lead.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Phone size={16} className="text-slate-400" />
                                <span>{lead.phone}</span>
                            </div>
                            <div className="flex items-start gap-3 text-sm text-slate-600">
                                <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                                <span>{lead.address}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Calendar size={16} className="text-slate-400 shrink-0" />
                                <span>{lead.date}</span>
                            </div>
                        </div>

                        <div className="mt-8 w-full p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-2">
                            <a href={`mailto:${lead.email}`} target="_blank" rel="noopener noreferrer" className="w-full bg-[#14151C] text-white py-2 rounded-lg font-bold text-sm hover:bg-black transition-colors text-center inline-block">
                                Enviar E-mail
                            </a>
                            <a href={`https://wa.me/55${lead.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="w-full bg-[#25D366]/10 text-[#075E54] border border-[#25D366]/30 py-2 rounded-lg font-bold text-sm hover:bg-[#25D366]/20 transition-colors flex items-center justify-center gap-2">
                                Iniciar WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                {/* Coluna Direita: Análise Técnica e Comercial */}
                <div className="md:col-span-2 space-y-6">
                    {/* Score Analytics */}
                    <div className={`bg-white rounded-2xl border-2 ${lead.scoreBorder} ${lead.scoreShadow} overflow-hidden relative p-6 transition-all`}>
                        <div className={`absolute top-0 right-8 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-b-lg shadow-sm z-10 flex items-center gap-1.5 ${lead.scoreBadgeBg}`}>
                            <Zap size={10} fill="currentColor" /> {lead.scoreBadgeText}
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className={`w-14 h-14 rounded-xl ${lead.scoreColor} flex items-center justify-center ${lead.scoreTextColor}`}>
                                <span className="text-3xl font-black">{lead.score}</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#14151C]">{lead.scoreLabel}</h3>
                                <p className="text-xs text-slate-500 font-medium">{lead.scoreDesc}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Conta de Luz</span>
                                <span className="text-xl font-black text-[#14151C]">{lead.bill}</span>
                            </div>
                            <div className={`p-4 rounded-xl border ${lead.savingsColor}`}>
                                <span className={`text-xs font-bold uppercase tracking-wider block mb-1 ${lead.savingsLabelColor}`}>Economia Mês</span>
                                <span className="text-xl font-black">{lead.savings}</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">CAPEX Est.</span>
                                <span className="text-xl font-black text-[#14151C]">{lead.capex}</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Payback</span>
                                <span className="text-xl font-black text-[#14151C]">{lead.payback}</span>
                            </div>
                        </div>
                    </div>

                    {/* System Parameters */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Home size={18} className="text-slate-400" />
                            <h3 className="text-md font-bold text-[#14151C]">Parâmetros do Sistema (Estimado)</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 border-t border-slate-50 pt-4">
                            <div className="flex items-center justify-between py-2 border-b border-slate-50">
                                <span className="text-sm font-medium text-slate-500">Consumo Mensal:</span>
                                <span className="text-sm font-bold text-[#14151C]">{lead.consumption}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-slate-50 sm:pl-4 sm:border-l border-slate-50">
                                <span className="text-sm font-medium text-slate-500">Área Disponível:</span>
                                <span className="text-sm font-bold text-[#14151C]">{lead.area}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-slate-50">
                                <span className="text-sm font-medium text-slate-500">Módulos Solares:</span>
                                <span className="text-sm font-bold text-[#14151C]">{lead.modules}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-slate-50 sm:pl-4 sm:border-l border-slate-50">
                                <span className="text-sm font-medium text-slate-500">Tipo de Telhado:</span>
                                <span className="text-sm font-bold text-[#14151C]">{lead.roofType}</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Activity */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h3 className="text-md font-bold text-[#14151C] mb-6">Jornada no Simulador</h3>
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                            {/* Item */}
                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-green-100 bg-[#D0F252] text-[#14151C] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    <CheckCircle2 size={16} />
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-bold text-sm text-[#14151C]">Simulação Finalizada</h4>
                                        <time className="text-[10px] text-slate-400 font-bold uppercase">Ontem, 14:30</time>
                                    </div>
                                    <p className="text-xs text-slate-500">Lead concluiu o funil do simulador com Score A gerado automaticamente.</p>
                                </div>
                            </div>
                            {/* Item */}
                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    <FileText size={14} />
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-slate-50">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-bold text-sm text-[#14151C]">Acesso ao Simulador</h4>
                                        <time className="text-[10px] text-slate-400 font-bold uppercase">Ontem, 14:15</time>
                                    </div>
                                    <p className="text-xs text-slate-500">Lead iniciou preenchimento dos dados do consumo de energia.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
