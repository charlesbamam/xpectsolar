"use client";

import { Link as LinkIcon, Copy, ExternalLink, Palette, Eye, CheckCircle2, Monitor, Smartphone, Code, X, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SimulatorConfigPage() {
    const [consultantName, setConsultantName] = useState("Consultor Carlos");
    const [offerText, setOfferText] = useState("Descubra sua Economia Solar");

    const [publicLink, setPublicLink] = useState("xpectsolar.vercel.app/s/seu-link");
    const [iframeSnippet, setIframeSnippet] = useState(`<iframe src="https://xpectsolar.vercel.app/s/seu-link" width="100%" height="600" frameborder="0" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"></iframe>`);
    const [isCopied, setIsCopied] = useState(false);
    const [isIframeCopied, setIsIframeCopied] = useState(false);
    const [viewMode, setViewMode] = useState<"desktop" | "mobile">("mobile");
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            const { data: { user } } = await import("@/lib/supabase").then(m => m.supabase.auth.getUser());
            if (user) {
                const { data } = await import("@/lib/supabase").then(m => m.supabase.from('consultants').select('full_name, slug').eq('id', user.id).single());
                if (data) {
                    setConsultantName(data.full_name);
                    if (data.slug) {
                        const link = `xpectsolar.vercel.app/s/${data.slug}`;
                        setPublicLink(link);
                        setIframeSnippet(`<iframe src="https://${link}" width="100%" height="600" frameborder="0" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"></iframe>`);
                    }
                }
            }
        };
        loadSettings();
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(publicLink);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const copyIframeToClipboard = () => {
        navigator.clipboard.writeText(iframeSnippet);
        setIsIframeCopied(true);
        setTimeout(() => setIsIframeCopied(false), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[#14151C]">Configurações do Simulador</h1>
                <p className="text-slate-600 mt-1">Personalize como os clientes visualizam seu simulador solar.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Side: Configuration Forms */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Step 1: Branding Card */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 text-[#14151C]">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#14151C] text-white font-bold text-sm shrink-0">1</div>
                            <div className="p-2 bg-[#D0F252]/10 rounded-lg">
                                <Palette size={20} className="text-[#6B8C49]" />
                            </div>
                            <h2 className="font-bold text-lg">Identidade e Branding</h2>
                        </div>
                        <p className="text-sm text-slate-500">Configure os dados iniciais que aparecerão no simulador para identificar sua agência.</p>

                        <div className="grid md:grid-cols-2 gap-6 mt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Nome de Exibição (Consultor)</label>
                                <input
                                    type="text"
                                    value={consultantName}
                                    onChange={(e) => setConsultantName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-[#14151C]/10 text-[#14151C]"
                                />
                                <p className="text-[10px] text-slate-400">Este nome aparecerá no cabeçalho do simulador.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Título Chamada (Headline)</label>
                                <input
                                    type="text"
                                    value={offerText}
                                    onChange={(e) => setOfferText(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-[#14151C]/10 text-[#14151C]"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-end">
                            <button className="bg-[#14151C] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all">
                                Salvar Alterações
                            </button>
                        </div>
                    </div>

                    {/* Step 2: Share Link Card */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 text-[#14151C]">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#14151C] text-white font-bold text-sm shrink-0">2</div>
                            <div className="p-2 bg-[#D0F252]/10 rounded-lg">
                                <LinkIcon size={20} className="text-[#6B8C49]" />
                            </div>
                            <h2 className="font-bold text-lg">Seu Link de Divulgação</h2>
                        </div>
                        <p className="text-sm text-slate-500">Compartilhe este link no seu Instagram, WhatsApp ou Site para captar leads qualificados automaticamente.</p>

                        <div className="flex gap-2 mt-4">
                            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm text-slate-600 flex items-center overflow-hidden">
                                <span className="truncate">{publicLink}</span>
                            </div>
                            <button
                                onClick={copyToClipboard}
                                className={`flex items-center gap-2 px-6 rounded-xl font-bold transition-all ${isCopied ? 'bg-green-500 text-white' : 'bg-[#14151C] text-white hover:bg-black'}`}
                            >
                                {isCopied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                                <span className="hidden sm:inline">{isCopied ? 'Copiado!' : 'Copiar'}</span>
                            </button>
                            <Link href={`https://${publicLink}`} target="_blank" className="p-3 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
                                <ExternalLink size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* Step 3: Iframe Snippet Card */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 text-[#14151C]">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#14151C] text-white font-bold text-sm shrink-0">3</div>
                            <div className="p-2 bg-[#D0F252]/10 rounded-lg">
                                <Code size={20} className="text-[#6B8C49]" />
                            </div>
                            <h2 className="font-bold text-lg">Embarque no seu Site (Iframe)</h2>
                        </div>
                        <p className="text-sm text-slate-500">Use este código HTML para inserir o simulador diretamente em qualquer página do seu site ou blog.</p>

                        <div className="relative mt-4">
                            <pre className="w-full bg-slate-800 text-slate-300 border border-slate-800 rounded-xl px-4 py-4 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
                                {iframeSnippet}
                            </pre>
                            <button
                                onClick={copyIframeToClipboard}
                                className={`absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${isIframeCopied ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'}`}
                            >
                                {isIframeCopied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                {isIframeCopied ? 'Copiado' : 'Copiar Código'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side: Live Preview (Simplified) */}
                <div className="space-y-4 flex flex-col items-center flex-1 lg:max-w-md w-full mx-auto">
                    <div className="flex items-center justify-between text-slate-500 px-2 w-full">
                        <span className="text-sm font-bold flex items-center gap-2"><Eye size={16} /> Prévia em tempo real</span>
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode("desktop")}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-[#6B8C49]' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <Monitor size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode("mobile")}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-[#6B8C49]' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <Smartphone size={16} />
                            </button>
                        </div>
                    </div>

                    <div className={`transition-all duration-300 ${viewMode === 'desktop' ? 'w-full max-w-2xl bg-slate-200 p-2 rounded-xl border-[4px] border-[#14151C] shadow-2xl aspect-[16/10] relative overflow-hidden group' : 'w-full max-w-[320px] bg-slate-200 p-3 rounded-[2.5rem] border-8 border-[#14151C] shadow-2xl aspect-[9/16] relative overflow-hidden group mx-auto'}`}>
                        <div className={`absolute inset-0 bg-white scale-[0.98] overflow-auto flex flex-col ${viewMode === 'desktop' ? 'rounded-lg' : 'rounded-[1.8rem]'}`}>
                            {/* Branded Header Mock */}
                            <div className="bg-[#14151C] p-6 text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#6B8C49] rounded-full blur-[40px] opacity-20 -mr-10 -mt-10" />
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6B8C49] to-[#79F28B] mx-auto mb-2 flex items-center justify-center shadow-lg">
                                    <Zap size={14} className="text-white" />
                                </div>
                                <h4 className="text-sm font-bold text-white leading-tight relative">{offerText}</h4>
                                <p className="text-[10px] text-slate-400 mt-1 relative">Oferecido por <strong className="text-white">{consultantName}</strong></p>
                            </div>
                            {/* Form Body Mock */}
                            <div className={`p-5 flex-1 ${viewMode === 'desktop' ? 'max-w-md mx-auto w-full pt-6' : ''}`}>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-medium text-slate-700">Seu Nome</label>
                                        <div className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-[#EEF2DC]/30 text-xs text-slate-400">Ex: João Silva</div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-medium text-slate-700">WhatsApp</label>
                                        <div className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-[#EEF2DC]/30 text-xs text-slate-400">(00) 00000-0000</div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-medium text-slate-700">Conta de Luz Média</label>
                                        <div className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-[#EEF2DC]/30 text-xs text-slate-400">R$ 500</div>
                                    </div>
                                    <button className="w-full bg-[#14151C] text-[#D0F252] font-bold py-3 mt-4 rounded-xl shadow-lg border-b-4 border-black/50 text-xs hover:-translate-y-0.5 transition-transform cursor-default">
                                        Descobrir Economia
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={() => setIsFullscreen(true)} className="bg-white text-[#14151C] px-4 py-2 rounded-full text-xs font-bold shadow-xl">Visualizar Full Screen</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Screen Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 z-50 bg-[#14151C]/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <button onClick={() => setIsFullscreen(false)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
                        <X size={24} />
                    </button>

                    <div className="flex flex-col items-center w-full max-w-5xl">
                        <div className="flex items-center gap-2 bg-[#14151C] border border-white/10 p-1 rounded-lg mb-6 shadow-xl">
                            <button
                                onClick={() => setViewMode("desktop")}
                                className={`p-2 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white text-[#14151C]' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Monitor size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode("mobile")}
                                className={`p-2 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white text-[#14151C]' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Smartphone size={20} />
                            </button>
                        </div>

                        <div className={`transition-all duration-300 w-full ${viewMode === 'desktop' ? 'max-w-4xl bg-slate-200 p-2 rounded-2xl border-[6px] border-[#14151C] shadow-2xl aspect-[16/9] relative overflow-hidden group' : 'max-w-[375px] bg-slate-200 p-3 rounded-[3rem] border-[12px] border-[#14151C] shadow-2xl aspect-[9/19] relative overflow-hidden group mx-auto'}`}>
                            <div className={`absolute inset-0 bg-white scale-[0.98] overflow-auto flex flex-col ${viewMode === 'desktop' ? 'rounded-xl' : 'rounded-[2rem]'}`}>
                                {/* Branded Header Mock */}
                                <div className="bg-[#14151C] p-8 text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#6B8C49] rounded-full blur-[80px] opacity-20 -mr-20 -mt-20" />
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6B8C49] to-[#79F28B] mx-auto mb-4 flex items-center justify-center shadow-lg">
                                        <Zap size={24} className="text-white" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-white leading-tight relative">{offerText}</h4>
                                    <p className="text-sm text-slate-400 mt-2 relative">Oferecido por <strong className="text-white">{consultantName}</strong></p>
                                </div>
                                {/* Form Body Mock */}
                                <div className={`p-8 space-y-5 flex-1 ${viewMode === 'desktop' ? 'max-w-xl mx-auto pt-10 w-full' : ''}`}>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">Seu Nome</label>
                                        <div className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#EEF2DC]/30 text-sm text-slate-400">Ex: João Silva</div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">WhatsApp</label>
                                        <div className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#EEF2DC]/30 text-sm text-slate-400">(00) 00000-0000</div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">Conta de Luz Média</label>
                                        <div className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#EEF2DC]/30 text-sm text-slate-400">R$ 500</div>
                                    </div>
                                    <button className="w-full bg-[#14151C] text-[#D0F252] font-extrabold py-4 mt-8 rounded-xl shadow-xl shadow-[#14151C]/20 border-b-4 border-black/50 text-base uppercase tracking-widest hover:-translate-y-0.5 transition-transform cursor-default">
                                        Descobrir Economia
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
