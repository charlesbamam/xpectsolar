"use client";

import { Search, Filter, Download, CheckCircle2, AlertTriangle, XCircle, MapPin, Calendar, ArrowUpRight, Zap } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Lead = {
    id: string;
    name: string;
    email: string;
    city_state: string;
    score: string;
    estimated_savings: number;
    estimated_capex: number;
    status: string;
    tech_analyzed: boolean;
    created_at: string;
};

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [scoreFilter, setScoreFilter] = useState("Todos");
    const [statusFilter, setStatusFilter] = useState("Todos");
    const [periodFilter, setPeriodFilter] = useState("Todos");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .eq('consultant_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setLeads(data);
        } catch (err) {
            console.error("Erro ao buscar leads:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    const filteredLeads = useMemo(() => {
        return leads.filter((lead) => {
            const matchesSearch =
                lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (lead.city_state && lead.city_state.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesScore = scoreFilter === "Todos" || lead.score === scoreFilter;
            const matchesStatus = statusFilter === "Todos" || lead.status === statusFilter;

            let matchesPeriod = true;
            if (periodFilter !== "Todos") {
                const leadDate = new Date(lead.created_at);
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - leadDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (periodFilter === "7dias") matchesPeriod = diffDays <= 7;
                if (periodFilter === "30dias") matchesPeriod = diffDays <= 30;
            }

            return matchesSearch && matchesScore && matchesStatus && matchesPeriod;
        });
    }, [leads, searchTerm, scoreFilter, statusFilter, periodFilter]);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ", " +
            date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const activeFiltersCount = (scoreFilter !== "Todos" ? 1 : 0) + (statusFilter !== "Todos" ? 1 : 0) + (periodFilter !== "Todos" ? 1 : 0);

    const exportCSV = () => {
        const headers = ["ID", "Nome", "Email", "Cidade/Estado", "Score", "Economia Est. (Mensal)", "Investimento Est.", "Status", "Data Captada"];
        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + filteredLeads.map(lead => `${lead.id},"${lead.name}",${lead.email || ""},"${lead.city_state || ""}",${lead.score},"${lead.estimated_savings}","${lead.estimated_capex}",${lead.status || "Novo"},"${lead.created_at}"`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "xpect_leads_export.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#14151C]">Gestão de Leads</h1>
                    <p className="text-slate-600 mt-1">Gerencie e qualifique os leads captados pelo seu simulador.</p>
                </div>
                <button onClick={exportCSV} className="flex items-center gap-2 bg-[#14151C] text-white px-4 py-2.5 rounded-xl font-medium hover:bg-black transition-all shadow-sm active:scale-95">
                    <Download size={18} /> Exportar CSV
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nome, email ou endereço..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14151C]/10 focus:border-[#14151C] transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium relative bg-white outline-none"
                        >
                            <Filter size={18} /> Filtros
                            {activeFiltersCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#D0F252] text-[#14151C] w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold border-2 border-white">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>

                        {isFilterOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-20 p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-[#14151C]">Mais Filtros</h3>
                                    <button onClick={() => setIsFilterOpen(false)} className="text-slate-400 hover:text-slate-600">
                                        <XCircle size={16} />
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status do Lead</label>
                                    <select
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14151C]/20 text-slate-700 font-medium"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="Todos">Todos</option>
                                        <option value="Novo">Novo</option>
                                        <option value="Qualificado">Qualificado</option>
                                        <option value="Pendente">Pendente</option>
                                        <option value="Arquivado">Arquivado</option>
                                    </select>
                                </div>

                                <hr className="border-slate-100" />

                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => { setStatusFilter("Todos"); setScoreFilter("Todos"); setPeriodFilter("Todos"); setSearchTerm(""); setIsFilterOpen(false); }}
                                        className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        Limpar Tudo
                                    </button>
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="text-xs font-bold bg-[#14151C] text-white px-4 py-2 rounded-lg hover:bg-black transition-colors"
                                    >
                                        Aplicar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <select
                        className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium bg-white outline-none"
                        value={periodFilter}
                        onChange={(e) => setPeriodFilter(e.target.value)}
                    >
                        <option value="Todos">Período: Todos</option>
                        <option value="7dias">Últimos 7 dias</option>
                        <option value="30dias">Últimos 30 dias</option>
                    </select>

                    <select
                        className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium bg-white outline-none"
                        value={scoreFilter}
                        onChange={(e) => setScoreFilter(e.target.value)}
                    >
                        <option value="Todos">Score: Todos</option>
                        <option value="A">Score A</option>
                        <option value="B">Score B</option>
                        <option value="C">Score C</option>
                    </select>
                </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lead / Contato</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Endereço</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score Técnico</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estimativa</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        Carregando seus leads...
                                    </td>
                                </tr>
                            ) : filteredLeads.length > 0 ? (
                                filteredLeads.map((lead) => (
                                    <LeadRow
                                        key={lead.id}
                                        id={lead.id}
                                        name={lead.name}
                                        email={lead.email || "Sem e-mail"}
                                        address={lead.city_state || "Local não informado"}
                                        score={lead.score}
                                        savings={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.estimated_savings)}
                                        status={lead.status || "Novo"}
                                        date={formatDate(lead.created_at)}
                                        techAnalyzed={lead.tech_analyzed}
                                        onAnalyzeSuccess={fetchLeads}
                                        onError={(msg) => setErrorModal({ isOpen: true, message: msg })}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        Nenhum lead encontrado com os filtros atuais.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Error Modal */}
            {errorModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
                        <div className="p-6 text-center space-y-6">
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-red-50/50">
                                <XCircle size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#14151C] mb-2">Análise Recusada</h3>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                    {errorModal.message}
                                </p>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
                            <button
                                onClick={() => setErrorModal({ isOpen: false, message: "" })}
                                className="w-full sm:w-auto px-8 py-2.5 bg-[#14151C] text-white rounded-xl font-bold text-sm hover:bg-black transition-colors"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function LeadRow({ id, name, email, address, score, savings, status, date, techAnalyzed, onAnalyzeSuccess, onError }: {
    id: string, name: string, email: string, address: string, score: string, savings: string, status: string, date: string, techAnalyzed: boolean, onAnalyzeSuccess: () => void, onError: (msg: string) => void
}) {
    const router = useRouter();
    const [analyzing, setAnalyzing] = useState(false);

    const getScoreStyles = (s: string) => {
        switch (s) {
            case "A": return "bg-[#D0F252]/20 text-slate-800 border-[#D0F252]";
            case "B": return "bg-orange-50 text-orange-700 border-orange-200";
            case "C": return "bg-red-50 text-red-600 border-red-200";
            default: return "bg-slate-100 text-slate-600";
        }
    };

    const getStatusStyles = (st: string) => {
        switch (st) {
            case "Novo": return "text-blue-600 bg-blue-50 border-blue-200";
            case "Qualificado": return "text-green-600 bg-green-50 border-green-200";
            case "Pendente": return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "Arquivado": return "text-slate-500 bg-slate-50 border-slate-200";
            default: return "text-slate-500 bg-slate-100 border-slate-200";
        }
    };

    const handleAnalyze = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setAnalyzing(true);
        router.push(`/dashboard/leads/${id}?autoAnalyze=true`);
    };

    return (
        <tr className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => router.push(`/dashboard/leads/${id}`)}>
            <td className="px-6 py-4">
                <div className="flex flex-col items-start gap-1">
                    <span className="font-bold text-[#14151C]">{name}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">{email}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${getStatusStyles(status)}`}>
                            {status}
                        </span>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <MapPin size={14} className="shrink-0" />
                    <span className="truncate max-w-[200px]">{address}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${getScoreStyles(score)}`}>
                        Score {score}
                    </span>
                    {score === "A" && <CheckCircle2 size={16} className="text-[#6B8C49]" />}
                    {score === "B" && <AlertTriangle size={16} className="text-orange-500" />}
                    {score === "C" && <XCircle size={16} className="text-red-500" />}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col">
                    <span className="font-semibold text-[#14151C] flex items-center gap-1">
                        {savings} <ArrowUpRight size={14} className="text-green-500" />
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                        <Calendar size={10} /> {date}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    {/* Botão Analisar (Ainda não analisado) */}
                    {!techAnalyzed && (
                        <button
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 bg-[#14151C] text-[#D0F252] hover:bg-black`}
                        >
                            <Zap size={14} className="fill-current" />
                            {analyzing ? "Analisando..." : "Analisar"}
                        </button>
                    )}

                    {/* Botão Analisado */}
                    {techAnalyzed && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D0F252]/10 text-[#6B8C49] border border-[#D0F252]/30 text-[10px] font-bold uppercase">
                            <CheckCircle2 size={14} /> Analisado
                        </div>
                    )}

                    <button className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-[#14151C] transition-colors shadow-sm">
                        <ArrowUpRight size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
}
