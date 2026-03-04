"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, CheckCircle2, Search, Filter, PieChart, BarChart3, TrendingUp, Zap, Sparkles, Info, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardIndex() {
    const [searchQuery, setSearchQuery] = useState("");
    const [showBanner, setShowBanner] = useState(true);

    const topLeads = [
        {
            id: "1",
            name: "Carlos Andrade",
            email: "carlos.e@gmail.com",
            date: "Hoje, 14:30",
            score: "A" as const,
            capex: "R$ 35.000",
            savings: "R$ 840,00"
        },
        {
            id: "2",
            name: "Empresa Logística Sul",
            email: "contato@logsul.com.br",
            date: "Ontem, 09:15",
            score: "A" as const,
            capex: "R$ 145.000",
            savings: "R$ 4.200,00"
        },
        {
            id: "3",
            name: "Mariana Silveira",
            email: "mari.silveira@outlook.com",
            date: "22/05/2026",
            score: "B" as const,
            capex: "R$ 18.200",
            savings: "R$ 310,00"
        }
    ];

    const filteredTopLeads = topLeads.filter(lead =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const scrollToOpportunities = () => {
        const element = document.getElementById("top-opportunities");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {/* System Banner (Controlled via Super Admin) */}
            {showBanner && (
                <div className="bg-blue-600 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-blue-600/20 text-white relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-20 w-40 h-40 bg-black/10 rounded-full blur-[60px] -mb-20"></div>

                    <div className="flex items-start md:items-center gap-4 relative z-10 w-full pr-8">
                        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm shrink-0">
                            <Info size={24} className="text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded text-white">Novo Recurso</span>
                                <h3 className="font-bold text-base md:text-lg text-white leading-tight">Atualização Xpect Solar v2</h3>
                            </div>
                            <p className="text-blue-100 text-sm max-w-2xl leading-relaxed">
                                Agora você pode personalizar as cores, logotipo e identidade visual do seu simulador solar de ponta a ponta nas Configurações.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 relative z-10 w-full md:w-auto mt-2 md:mt-0 md:mr-8">
                        <Link href="/dashboard/simulator" className="w-full md:w-auto px-5 py-2.5 bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm rounded-xl transition-colors shadow-sm whitespace-nowrap text-center">
                            Configurar Agora
                        </Link>
                    </div>

                    <button
                        onClick={() => setShowBanner(false)}
                        className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors z-20"
                        title="Fechar aviso"
                    >
                        <X size={22} strokeWidth={2.5} />
                    </button>
                </div>
            )}

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-[#D0F252] text-[#14151C] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                            <Zap size={12} fill="currentColor" /> Xpect BI
                        </span>
                        <span className="text-sm font-medium text-slate-500">Atualizado agora</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#14151C] tracking-tight">Visão Geral</h1>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2">
                        <p className="text-slate-600">Análise de performance, conversão e viabilidade financeira dos seus leads.</p>
                        <select className="border border-slate-200 bg-white rounded-xl px-4 py-1.5 text-sm font-bold text-slate-600 focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 shadow-sm cursor-pointer outline-none w-max appearance-none sm:border-l-2 sm:border-l-slate-200 sm:pl-4">
                            <option value="7d">Últimos 7 dias</option>
                            <option value="30d">Últimos 30 dias</option>
                            <option value="tw">Esta Semana</option>
                            <option value="tm">Este Mês</option>
                            <option value="ty">Este Ano</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative inline-block group hidden md:block mt-2">
                        {/* Sparkles / Estrelinhas animadas */}
                        <div className="absolute -top-3 -left-3 text-[#D0F252] animate-sparkle group-hover:scale-125 transition-transform"><Sparkles size={14} className="fill-current" /></div>
                        <div className="absolute -bottom-2 -right-2 text-[#D0F252] animate-sparkle group-hover:scale-125 transition-transform" style={{ animationDelay: '500ms' }}><Sparkles size={10} className="fill-current" /></div>
                        <div className="absolute top-1/2 -right-4 text-[#D0F252] animate-sparkle opacity-50" style={{ animationDelay: '200ms' }}><Sparkles size={8} className="fill-current" /></div>

                        <button
                            onClick={scrollToOpportunities}
                            className="bg-[#D0F252] text-[#14151C] border border-[#D0F252] px-6 py-2 rounded-xl text-sm font-black shadow-[0_0_15px_rgba(208,242,82,0.4)] hover:shadow-[0_0_25px_rgba(208,242,82,0.6)] hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                            Ver Oportunidades &darr;
                        </button>
                    </div>
                    <button onClick={() => window.print()} className="bg-[#14151C] text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-black transition-all active:scale-95">
                        Baixar Relatório PDF
                    </button>
                </div>
            </div>

            {/* Top Metrics Cards - BI Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Leads Captados"
                    value="148"
                    trend="+24%"
                    positive
                    icon={<PieChart size={20} className="text-[#6B8C49]" />}
                />
                <MetricCard
                    title="Qualificados (Score A/B)"
                    value="86%"
                    trend="+5%"
                    positive
                    icon={<CheckCircle2 size={20} className="text-blue-500" />}
                />
                <MetricCard
                    title="Volume em Potencial"
                    value="R$ 1.2M"
                    trend="+12%"
                    positive
                    icon={<BarChart3 size={20} className="text-purple-500" />}
                />
                <MetricCard
                    title="Tempo Médio Payback"
                    value="3.8 Anos"
                    trend="-2 meses"
                    positive
                    icon={<TrendingUp size={20} className="text-orange-500" />}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Graph (Bar Chart - Simulated via Tailwind) */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-[#14151C]">Volume de Leads por Semana</h3>
                            <p className="text-xs text-slate-500 font-medium">Captação via Simulador vs Inserção Manual</p>
                        </div>
                        <div className="flex gap-4 text-xs font-bold text-slate-500">
                            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-[#14151C]"></div> Simulador Link</span>
                            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-[#D0F252]"></div> Manual</span>
                        </div>
                    </div>

                    <div className="flex-1 min-h-[250px] flex items-end gap-2 md:gap-6 pt-4 relative">
                        {/* Y-Axis labels */}
                        <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-[10px] text-slate-400 font-bold border-r border-slate-100 pr-2 items-end">
                            <span>40</span>
                            <span>30</span>
                            <span>20</span>
                            <span>10</span>
                            <span>0</span>
                        </div>
                        {/* Graph bars */}
                        <div className="flex-1 flex justify-around items-end h-[200px] ml-10 border-b border-slate-100 relative">
                            {/* Horizontal guide lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                <div className="border-t border-slate-50 w-full h-0"></div>
                                <div className="border-t border-slate-50 w-full h-0"></div>
                                <div className="border-t border-slate-50 w-full h-0"></div>
                                <div className="border-t border-slate-50 w-full h-0"></div>
                                <div className="w-full h-0"></div>
                            </div>

                            <BarGroup label="Semana 1" val1={60} val2={20} />
                            <BarGroup label="Semana 2" val1={85} val2={30} />
                            <BarGroup label="Semana 3" val1={45} val2={15} />
                            <BarGroup label="Semana 4" val1={95} val2={40} active />
                        </div>
                    </div>
                </div>

                {/* Secondary Graph (Donut / Progress style) */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-[#14151C]">Classificação Técnica</h3>
                        <p className="text-xs text-slate-500 font-medium">Qualidade do telhado e viabilidade</p>
                    </div>

                    <div className="flex-1 flex flex-col justify-center gap-6">
                        <ScoreBar score="A" label="Alta Viabilidade" percentage={65} color="bg-[#6B8C49]" />
                        <ScoreBar score="B" label="Viabilidade Média" percentage={25} color="bg-orange-500" />
                        <ScoreBar score="C" label="Baixa/Inviável" percentage={10} color="bg-red-500" />
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            <strong className="text-[#14151C]">Dica:</strong> Foque seus esforços de prospecção ativa nos 65% de leads com Score A, eles possuem as maiores taxas de fechamento.
                        </p>
                    </div>
                </div>
            </div>

            {/* Lead Table (UX Requirement) */}
            <div id="top-opportunities" className="bg-white rounded-2xl border-2 border-[#D0F252] shadow-[0_4px_24px_rgba(208,242,82,0.15)] overflow-hidden relative scroll-mt-24">
                {/* Highlight Tag */}
                <div className="absolute top-0 right-8 bg-[#14151C] text-[#D0F252] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-b-lg shadow-sm z-10 flex items-center gap-1.5">
                    <Zap size={10} fill="currentColor" /> Alto Valor
                </div>

                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-[#D0F252]/10 to-transparent">
                    <div>
                        <h2 className="text-xl font-extrabold text-[#14151C] flex items-center gap-2">
                            Top Oportunidades
                        </h2>
                        <p className="text-xs text-slate-500 font-bold tracking-wide mt-1">LEADS RECÉM-CAPTURADOS COM ALTO POTENCIAL DE FECHAMENTO</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar lead..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#14151C]/20 w-full sm:w-64 bg-white shadow-sm font-medium"
                            />
                        </div>
                        <button className="p-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-[#14151C] transition-colors shadow-sm bg-white">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] text-slate-500 bg-white uppercase font-bold tracking-wider border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Lead / Contato</th>
                                <th className="px-6 py-4">Data Captura</th>
                                <th className="px-6 py-4 text-center">Score Técnico</th>
                                <th className="px-6 py-4">Investimento Est.</th>
                                <th className="px-6 py-4 text-right">Potencial (Mês)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredTopLeads.length > 0 ? (
                                filteredTopLeads.map(lead => (
                                    <LeadRow
                                        key={lead.id}
                                        id={lead.id}
                                        name={lead.name}
                                        email={lead.email}
                                        date={lead.date}
                                        score={lead.score}
                                        capex={lead.capex}
                                        savings={lead.savings}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        Nenhuma oportunidade encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 bg-white text-center">
                    <Link href="/dashboard/leads" className="text-sm font-bold text-[#6B8C49] hover:text-[#14151C] transition-colors">
                        Acessar Gestão Completa de Leads &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Subcomponents

function MetricCard({ title, value, trend, positive, icon }: { title: string, value: string, trend?: string, positive?: boolean, icon: React.ReactNode }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col relative overflow-hidden group hover:border-[#D0F252] transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-[#D0F252]/10 transition-colors">
                    {icon}
                </div>
                {trend && (
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 ${positive ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
                        }`}>
                        {positive ? <ArrowUpRight size={10} strokeWidth={3} /> : <ArrowDownRight size={10} strokeWidth={3} />}
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <span className="text-3xl font-extrabold text-[#14151C] block tracking-tight">{value}</span>
                <h3 className="text-xs font-bold text-slate-400 uppercase mt-1 tracking-wider">{title}</h3>
            </div>
        </div>
    );
}

function BarGroup({ label, val1, val2, active }: { label: string, val1: number, val2: number, active?: boolean }) {
    return (
        <div className="flex flex-col items-center gap-2 group cursor-pointer z-10">
            <div className="flex items-end gap-1.5 h-full">
                <div
                    className={`w-6 sm:w-10 rounded-t-md transition-all duration-500 ease-out ${active ? 'bg-[#14151C]' : 'bg-slate-200 group-hover:bg-slate-300'}`}
                    style={{ height: `${val1}%` }}
                ></div>
                <div
                    className={`w-6 sm:w-10 rounded-t-md transition-all duration-500 ease-out ${active ? 'bg-[#D0F252]' : 'bg-[#D0F252]/40 group-hover:bg-[#D0F252]/60'}`}
                    style={{ height: `${val2}%` }}
                ></div>
            </div>
            <span className={`text-[10px] font-bold mt-2 ${active ? 'text-[#14151C]' : 'text-slate-400'}`}>{label}</span>
        </div>
    );
}

function ScoreBar({ score, label, percentage, color }: { score: string, label: string, percentage: number, color: string }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm font-bold">
                <span className="text-[#14151C] flex items-center gap-2">
                    <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] text-white ${color}`}>{score}</span>
                    {label}
                </span>
                <span className="text-slate-500">{percentage}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
}

function LeadRow({ id, name, email, date, score, capex, savings }: { id: string, name: string, email: string, date: string, score: "A" | "B" | "C", capex: string, savings: string }) {
    const router = useRouter();
    const getBadgeColor = () => {
        switch (score) {
            case "A": return "bg-[#D0F252] text-[#14151C] border-transparent shadow-sm";
            case "B": return "bg-orange-100 text-orange-800 border-orange-200";
            case "C": return "bg-red-100 text-red-800 border-red-200";
            default: return "bg-slate-50 text-slate-800 border-slate-200";
        }
    };

    return (
        <tr className="hover:bg-slate-50 transition-colors group cursor-pointer bg-white" onClick={() => router.push(`/dashboard/leads/${id}`)}>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                    <span className="font-bold text-[#14151C]">{name}</span>
                    <span className="text-xs text-slate-400">{email}</span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs font-medium">
                {date}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`inline-block px-3 py-1 text-xs font-black rounded-lg border ${getBadgeColor()}`}>
                    {score}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">
                {capex}
            </td>
            <td className="px-6 py-4 text-right whitespace-nowrap">
                <div className="inline-flex rounded-lg px-3 py-1.5 bg-green-50 text-green-700 font-bold border border-green-100">
                    + {savings}
                </div>
            </td>
        </tr>
    );
}

