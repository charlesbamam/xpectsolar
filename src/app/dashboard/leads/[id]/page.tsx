"use client";

import { use, useEffect, useState, useRef } from "react";
import Link from "next/link";
import InteractiveSolarMap from "@/components/InteractiveSolarMap";
import { ArrowLeft, MapPin, Zap, CheckCircle2, Phone, Mail, Calendar, FileText, Home, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getScoreDetails = (score: string) => {
    switch (score) {
        case "A":
            return {
                scoreLabel: "Score Técnico Excelente",
                scoreDesc: "Viabilidade alta detectada pelo simulador. Excelente potencial.",
                scoreColor: "bg-[#D0F252]",
                scoreTextColor: "text-[#14151C]",
                scoreBorder: "border-[#D0F252]",
                scoreShadow: "shadow-[0_4px_24px_rgba(208,242,82,0.15)]",
                scoreBadgeBg: "bg-[#14151C] text-[#D0F252]",
                scoreBadgeText: "ALTO VALOR",
                savingsColor: "bg-green-50 border-green-100 text-green-700",
                savingsLabelColor: "text-green-600",
            };
        case "B":
            return {
                scoreLabel: "Score Técnico Moderado",
                scoreDesc: "Viabilidade média detectada. Possíveis desafios na instalação ou sombreamento parcial.",
                scoreColor: "bg-orange-500",
                scoreTextColor: "text-white",
                scoreBorder: "border-orange-500",
                scoreShadow: "shadow-[0_4px_24_rgba(249,115,22,0.25)]",
                scoreBadgeBg: "bg-orange-600 text-white",
                scoreBadgeText: "MÉDIO VALOR",
                savingsColor: "bg-orange-50 border-orange-100 text-orange-700",
                savingsLabelColor: "text-orange-600",
            };
        case "C":
        default:
            return {
                scoreLabel: "Score Técnico Inviável",
                scoreDesc: "Viabilidade baixa detectada. Muitas sombras ou área insuficiente.",
                scoreColor: "bg-red-500",
                scoreTextColor: "text-white",
                scoreBorder: "border-red-500",
                scoreShadow: "shadow-[0_4px_24px_rgba(239,68,68,0.25)]",
                scoreBadgeBg: "bg-red-600 text-white",
                scoreBadgeText: "BAIXO VALOR",
                savingsColor: "bg-red-50 border-red-100 text-red-700",
                savingsLabelColor: "text-red-500",
            };
    }
};

const getStatusDetails = (status: string) => {
    switch (status) {
        case "Qualificado": return { tagColor: "bg-green-50 text-green-600 border-green-200" };
        case "Pendente": return { tagColor: "bg-orange-50 text-orange-600 border-orange-200" };
        case "Arquivado": return { tagColor: "bg-slate-50 text-slate-500 border-slate-200" };
        case "Novo":
        default:
            return { tagColor: "bg-blue-50 text-blue-600 border-blue-200" };
    }
};

type LeadData = {
    name: string;
    companyName: string;
    type: string;
    initials: string;
    email: string;
    phone: string;
    address: string;
    date: string;
    tag: string;
    tagColor: string;
    score: string;
    scoreLabel: string;
    scoreDesc: string;
    scoreColor: string;
    scoreTextColor: string;
    scoreBorder: string;
    scoreShadow: string;
    scoreBadgeBg: string;
    scoreBadgeText: string;
    bill: string;
    savings: string;
    savingsColor: string;
    savingsLabelColor: string;
    capex: string;
    payback: string;
    consumption: string;
    area: string;
    modules: string;
    roofType: string;
};

export default function LeadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const { id } = resolvedParams;

    const [lead, setLead] = useState<LeadData | null>(null);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [techData, setTechData] = useState<any>(null);
    const [shouldAutoAnalyze, setShouldAutoAnalyze] = useState(false);
    const techDataRef = useRef<HTMLDivElement>(null);

    const scrollToTechData = () => {
        setTimeout(() => {
            techDataRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const search = window.location.search;
            if (search.includes('autoAnalyze=true')) {
                setShouldAutoAnalyze(true);
                window.history.replaceState(null, '', window.location.pathname);
            }
        }
    }, []);

    const fetchLead = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .eq('id', id)
                .eq('consultant_id', user.id)
                .single();

            if (error) throw error;
            if (data) {
                const sData = data.simulation_data || {};
                const initials = (data.name || "ND").substring(0, 2).toUpperCase();

                const payback = data.estimated_savings > 0
                    ? (data.estimated_capex / (data.estimated_savings * 12)).toFixed(1) + " Anos"
                    : "N/A";

                const scoreDetails = getScoreDetails(data.score || "C");
                const statusDetails = getStatusDetails(data.status || "Novo");

                setLead({
                    name: data.name || "Sem Nome",
                    companyName: sData.companyName || "",
                    type: sData.type === 'business' ? "Empresa" : "Residência",
                    initials,
                    email: data.email || "Não informado",
                    phone: data.phone || "Não informado",
                    address: `${data.city_state || ""} ${sData.cep ? `- CEP ${sData.cep}` : ""} ${sData.numeroCasa ? `- Nr. ${sData.numeroCasa}` : ""}`.trim(),
                    date: `Capturado em ${formatDate(data.created_at)}`,
                    tag: data.status || "Novo",
                    ...statusDetails,
                    score: data.score || "C",
                    ...scoreDetails,
                    bill: formatCurrency(data.monthly_bill || 0),
                    savings: formatCurrency(data.estimated_savings || 0),
                    capex: formatCurrency(data.estimated_capex || 0),
                    payback,
                    consumption: `${sData.consumo_kwh || Math.round((data.monthly_bill || 0) / 0.8)} kWh/mês`,
                    area: sData.num_placas ? `Aprox. ${Math.ceil(sData.num_placas * 2.5)} m²` : "N/A",
                    modules: sData.num_placas ? `${sData.num_placas} Placas` : "N/A",
                    roofType: "Não informado"
                });

                if (data.tech_analyzed) {
                    setTechData({
                        areaM2: data.tech_area_m2,
                        irradiance: data.tech_irradiance,
                        maxKwp: data.tech_kwp,
                        satelliteUrl: data.tech_satellite_url,
                        payback: data.tech_payback,
                        maxPanels: data.tech_data?.solarPotential?.maxArrayPanelsCount || 0,
                        solarPanels: data.tech_data?.solarPotential?.solarPanels,
                        roofSegmentSummaries: data.tech_data?.solarPotential?.roofSegmentSummaries,
                        lat: data.simulation_data?.lat || data.simulation_data?.location?.lat,
                        lng: data.simulation_data?.lng || data.simulation_data?.location?.lng
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching lead:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLead();
    }, [id]);

    useEffect(() => {
        if (shouldAutoAnalyze && lead && !techData && !analyzing) {
            setShouldAutoAnalyze(false);
            handleAnalyzeTech();
        }
    }, [shouldAutoAnalyze, lead, techData, analyzing]);

    const handleAnalyzeTech = async () => {
        setAnalyzing(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`/api/leads/${id}/analyze`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`
                }
            });
            const result = await res.json();

            if (result.success) {
                setTechData(result.data);
                await fetchLead();
                scrollToTechData();
            } else {
                alert(result.error || "Erro ao analisar viabilidade técnica.");
            }
        } catch (err) {
            console.error(err);
            alert("Erro de conexão com a API Solar.");
        } finally {
            setAnalyzing(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-[#111F18] font-black italic animate-pulse">Carregando Detalhes do Lead...</div>;
    if (!lead) return <div className="p-12 text-center text-red-500 font-bold">Erro: Lead não encontrado.</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <Link href="/dashboard/leads" className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-500 hover:text-[#14151C]">
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-[#14151C]">Detalhes do Lead #{id.substring(0, 8)}</h1>
                    <p className="text-sm text-slate-500 font-medium tracking-wide">Gerencie informações e propostas deste contato.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
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
                                <span className="truncate">{lead.email}</span>
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
                            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.address)}`} target="_blank" rel="noopener noreferrer" className="w-full bg-blue-500/10 text-blue-700 border border-blue-500/30 py-2 rounded-lg font-bold text-sm hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2">
                                <MapPin size={16} /> Abrir no Maps
                            </a>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className={`bg-white rounded-2xl border-2 ${lead.scoreBorder} ${lead.scoreShadow} overflow-hidden relative p-6 transition-all`}>
                        <div className={`absolute top-0 right-8 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-b-lg shadow-sm z-10 flex items-center gap-1.5 ${lead.scoreBadgeBg}`}>
                            <Zap size={10} fill="currentColor" /> {lead.scoreBadgeText}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-xl ${lead.scoreColor} flex items-center justify-center ${lead.scoreTextColor}`}>
                                    <span className="text-3xl font-black">{lead.score}</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-[#14151C]">{lead.scoreLabel}</h3>
                                    <p className="text-xs text-slate-500 font-medium">{lead.scoreDesc}</p>
                                </div>
                            </div>

                            {lead.score === 'A' && !techData && (
                                <button
                                    onClick={handleAnalyzeTech}
                                    disabled={analyzing}
                                    className="px-4 py-2.5 bg-[#14151C] text-[#D0F252] rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg disabled:opacity-50"
                                >
                                    {analyzing ? "Analisando..." : "Analisar Viabilidade Técnica"}
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Conta</span>
                                <span className="text-xl font-black text-[#14151C] text-sm lg:text-base xl:text-xl truncate">{lead.bill}</span>
                            </div>
                            <div className={`p-4 rounded-xl border ${lead.savingsColor}`}>
                                <span className={`text-xs font-bold uppercase tracking-wider block mb-1 ${lead.savingsLabelColor}`}>Economia</span>
                                <span className="text-xl font-black text-sm lg:text-base xl:text-xl truncate">{lead.savings}</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Invest.</span>
                                <span className="text-xl font-black text-[#14151C] text-sm lg:text-base xl:text-xl truncate">{lead.capex}</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Payback</span>
                                <span className="text-xl font-black text-[#14151C] text-sm lg:text-base xl:text-xl truncate">{lead.payback}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Home size={18} className="text-slate-400" />
                        <h3 className="text-md font-bold text-[#14151C]">Parâmetros do Sistema</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 border-t border-slate-100 pt-4">
                        <div className="flex justify-between py-2 border-b border-slate-50">
                            <span className="text-sm font-medium text-slate-500">Consumo Mensal:</span>
                            <span className="text-sm font-bold text-[#14151C]">{lead.consumption}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-50 sm:pl-4 sm:border-l">
                            <span className="text-sm font-medium text-slate-500">Área Estimada:</span>
                            <span className="text-sm font-bold text-[#14151C]">{lead.area}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-md font-bold text-[#14151C] mb-4">Jornada</h3>
                    <div className="space-y-4">
                        {techData && (
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-[#14151C] text-[#D0F252] flex items-center justify-center shrink-0">
                                    <Zap size={14} fill="currentColor" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#14151C]">Análise Técnica via Satélite</p>
                                    <p className="text-xs text-slate-500">Viabilidade técnica verificada hoje.</p>
                                </div>
                            </div>
                        )}
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-[#D0F252] text-[#14151C] flex items-center justify-center shrink-0">
                                <CheckCircle2 size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#14151C]">Simulação Finalizada</p>
                                <p className="text-xs text-slate-500">{lead.date}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {techData && (
                <div ref={techDataRef} className="relative bg-[#14151C] rounded-2xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-8 animate-in fade-in slide-in-from-top-4 duration-700 overflow-hidden mt-8">
                    {/* Decorative background flare */}
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#D0F252] opacity-10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-blue-500 opacity-[0.05] rounded-full blur-[80px] pointer-events-none" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-[#D0F252]/10 rounded-xl text-[#D0F252] border border-[#D0F252]/20 shadow-inner">
                                <Zap size={22} fill="currentColor" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tight">Viabilidade Técnica de Satélite</h3>
                                <p className="text-xs text-slate-400 font-medium tracking-wide">Tecnologia de Mapeamento por Satélite</p>
                            </div>
                        </div>
                        <div className="px-3 py-1.5 bg-[#D0F252]/20 text-[#D0F252] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#D0F252]/30 flex items-center justify-center gap-1.5 w-max">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D0F252] animate-pulse" /> Scanner 3D Concluído
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 relative z-10">
                        {/* Imagem de Satélite Expandida */}
                        <div className="relative w-full aspect-[4/3] lg:aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 group bg-slate-900 flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#14151C] via-transparent to-[#14151C]/30 z-10 pointer-events-none" />

                            {/* Crosshair / UI elements over map */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-[#D0F252]/50 rounded-full z-20 flex items-center justify-center pointer-events-none">
                                <div className="w-1 h-1 bg-[#D0F252] rounded-full" />
                            </div>
                            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/90 drop-shadow-md bg-black/50 px-2 py-1 rounded backdrop-blur-sm">REC</span>
                            </div>

                            {techData.solarPanels && techData.solarPanels.length > 0 && techData.lat && techData.lng ? (
                                <InteractiveSolarMap
                                    lat={techData.lat}
                                    lng={techData.lng}
                                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
                                    solarPanels={techData.solarPanels}
                                    panelsCount={techData.maxPanels}
                                    segmentSummaries={techData.roofSegmentSummaries}
                                    zoom={20}
                                />
                            ) : (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={techData.satelliteUrl} alt="Mapeamento de Viabilidade por Satélite" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out opacity-90 mix-blend-luminosity hover:mix-blend-normal" />
                            )}
                        </div>

                        {/* Dados Técnicos */}
                        <div className="flex flex-col justify-center gap-4">
                            <h4 className="text-slate-300 font-bold text-sm tracking-wide uppercase mb-1">Métricas Extraídas do Telhado</h4>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-1">Área Útil</span>
                                    <span className="text-2xl sm:text-3xl font-black text-white">{techData.areaM2.toFixed(0)} <span className="text-sm font-medium text-slate-500">m²</span></span>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-1">Painéis (Máx)</span>
                                    <span className="text-2xl sm:text-3xl font-black text-white">{techData.maxPanels > 0 ? techData.maxPanels : "N/A"} <span className="text-sm font-medium text-slate-500 line-clamp-1">unidades</span></span>
                                </div>
                                <div className="col-span-2 p-5 bg-gradient-to-br from-[#D0F252]/20 to-[#D0F252]/5 rounded-2xl border border-[#D0F252]/30 backdrop-blur-md shadow-lg">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className="text-[11px] text-[#D0F252]/80 font-black uppercase tracking-widest block mb-1">Potencial Máximo Técnico</span>
                                            <span className="text-3xl font-black text-[#D0F252]">{techData.maxKwp.toFixed(2)} <span className="text-base font-bold">kWp</span></span>
                                        </div>
                                        <Zap size={32} className="text-[#D0F252] opacity-50" />
                                    </div>
                                </div>
                            </div>

                            {techData.areaM2 === 0 || techData.maxKwp === 0 ? (
                                <div className="mt-4 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-xs text-yellow-500 font-medium flex gap-3 items-start">
                                    <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                                    <p><b>Leitura Parcial de Satélite:</b> O satélite localizou as coordenadas do logradouro e mensurou a incidência solar da região (<b>{Math.round(techData.irradiance)}h</b>), porém não possui dados 3D volumétricos detalhados deste telhado específico na base de dados. O cálculo detalhado da área precisará de validação humana (ex: fotos ou ida ao local).</p>
                                </div>
                            ) : (
                                <div className="mt-4 p-4 bg-green-500/10 rounded-xl border border-green-500/20 text-xs text-green-400 font-medium flex gap-3 items-start">
                                    <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-green-400" />
                                    <p><b>Conclusão Física:</b> O algoritmo do satélite confirmou área de luz desobstruída suficiente para a potência apresentada, descartando pontos de sombra contínuos.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
