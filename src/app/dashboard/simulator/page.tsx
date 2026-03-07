"use client";

import { Link as LinkIcon, Copy, ExternalLink, Palette, Eye, CheckCircle2, Monitor, Smartphone, Code, X, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SimulatorConfigPage() {
    const [consultantName, setConsultantName] = useState("Consultor Carlos");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [offerText, setOfferText] = useState("Descubra sua Economia Solar");

    const [isCopied, setIsCopied] = useState(false);
    const [isIframeCopied, setIsIframeCopied] = useState(false);
    const [viewMode, setViewMode] = useState<"desktop" | "mobile">("mobile");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const generatedSlug = consultantName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'seu-link';
    const publicLink = `xpectsolar.vercel.app/s/${generatedSlug}`;
    const iframeSnippet = `<iframe src="https://${publicLink}" width="100%" height="600" frameborder="0" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"></iframe>`;

    useEffect(() => {
        const loadSettings = async () => {
            const storedOfferText = localStorage.getItem("offerText");
            if (storedOfferText) setOfferText(storedOfferText);

            const { data: { user } } = await import("@/lib/supabase").then(m => m.supabase.auth.getUser());
            if (user) {
                const { data } = await import("@/lib/supabase").then(m => m.supabase.from('consultants').select('full_name, avatar_url').eq('id', user.id).single());
                if (data) {
                    if (data.full_name) setConsultantName(data.full_name);
                    if (data.avatar_url) setAvatarUrl(data.avatar_url);
                }
            }
        };
        loadSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { supabase } = await import("@/lib/supabase");
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Checa se já existe o registro deste usuário
                const { data: existing } = await supabase.from('consultants').select('id').eq('id', user.id).single();

                if (!existing) {
                    // Se não existia, insere com campos obrigatórios
                    const { error } = await supabase.from('consultants').insert({
                        id: user.id,
                        full_name: consultantName,
                        slug: generatedSlug,
                        whatsapp_number: "00000000000" // Valor padrão para passar constraint
                    });
                    if (error) throw error;
                } else {
                    // Se existe, faz um update
                    const { error } = await supabase.from('consultants').update({
                        full_name: consultantName,
                        slug: generatedSlug,
                    }).eq('id', user.id);
                    if (error) throw error;
                }

                localStorage.setItem("userFullName", consultantName);
                localStorage.setItem("offerText", offerText);
                window.dispatchEvent(new Event("profileUpdated"));

                alert("Configurações do simulador salvas com sucesso!");
            }
        } catch (error: unknown) {
            console.error(error);
            const msg = error instanceof Error ? error.message : "Erro desconhecido";
            alert("Erro ao salvar: " + msg);
        } finally {
            setIsSaving(false);
        }
    };

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
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-[#14151C] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all disabled:opacity-50"
                            >
                                {isSaving ? "Salvando..." : "Salvar Alterações"}
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
                            <Link href={`/s/${generatedSlug}`} target="_blank" className="p-3 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
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
                        <div className={`absolute inset-0 bg-[#F4F9F1] scale-[0.98] overflow-auto flex flex-col ${viewMode === 'desktop' ? 'rounded-lg' : 'rounded-[1.8rem]'}`}>
                            {/* Branded Header Mock - Matching Public Simulator */}
                            <div className="p-3">
                                <div className="bg-[#111F18] rounded-2xl p-4 text-center relative overflow-hidden flex flex-col items-center justify-between gap-3 shadow-xl">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#2ECC8C] rounded-full blur-[40px] opacity-[0.08] -mr-10 -mt-10 pointer-events-none" />

                                    <div className="relative z-10 flex items-center gap-2 bg-[#1A4A38]/30 px-3 py-1.5 rounded-xl border border-white/5 w-full justify-center">
                                        <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-[#1A4A38] to-[#2ECC8C]/20 border border-white/10 flex items-center justify-center">
                                            <Zap size={10} className="text-[#2ECC8C]" fill="currentColor" />
                                        </div>
                                        <h4 className="text-[9px] font-bold text-white tracking-tight leading-tight">
                                            Saiba quanto você pode <span className="text-[#D4E44A]">economizar...</span>
                                        </h4>
                                    </div>

                                    <div className="relative z-10 flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm w-full justify-center">
                                        <div className="w-6 h-6 rounded-full bg-[#D4E44A] flex items-center justify-center shadow-lg border border-white/20 overflow-hidden shrink-0">
                                            {avatarUrl ? (
                                                <Image src={avatarUrl} alt={consultantName} width={24} height={24} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="font-black text-[#111F18] text-[8px]">{consultantName.substring(0, 2).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <div className="text-left flex items-center gap-1.5">
                                            <p className="text-[8px] font-bold text-[#6B8F72] uppercase tracking-tighter opacity-90 leading-none">Por</p>
                                            <p className="text-[10px] font-black text-white tracking-wide leading-none truncate max-w-[80px]">{consultantName}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Body Mock - Compact with new fields */}
                            <div className={`px-5 py-4 flex-1 ${viewMode === 'desktop' ? 'max-w-md mx-auto w-full' : ''}`}>
                                <div className="bg-white rounded-3xl p-5 border border-[#D8EDD5] shadow-sm space-y-4">
                                    <h3 className="text-xs font-black text-[#111F18] text-center">{offerText}</h3>
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <div className="w-full px-3 py-2 rounded-xl border border-transparent bg-[#f1f8ee] text-[10px] text-slate-400 font-medium">Seu Nome</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="w-full px-3 py-2 rounded-xl border border-transparent bg-[#f1f8ee] text-[10px] text-slate-400 font-medium">(00) 00000-0000</div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="w-full px-3 py-2 rounded-xl border border-transparent bg-[#f1f8ee] text-[10px] text-slate-400 font-medium">CEP</div>
                                            <div className="w-full px-3 py-2 rounded-xl border border-transparent bg-[#f1f8ee] text-[10px] text-slate-400 font-medium">Nº</div>
                                        </div>
                                        <div className="pt-2">
                                            <div className="h-1 w-full bg-[#EEF2F6] rounded-full relative">
                                                <div className="absolute inset-y-0 left-0 w-1/3 bg-[#D4E44A] rounded-full"></div>
                                                <div className="absolute -top-1.5 left-1/3 w-4 h-4 bg-white border border-[#D4E44A] rounded-full shadow-sm"></div>
                                            </div>
                                        </div>
                                        <button className="w-full bg-[#D4E44A] text-[#111F18] font-black py-3 rounded-xl shadow-lg shadow-[#D4E44A]/20 text-[10px] uppercase tracking-wider cursor-default">
                                            Calcular Economia
                                        </button>
                                    </div>
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
                            <div className={`absolute inset-0 bg-[#F4F9F1] scale-[0.98] overflow-auto flex flex-col ${viewMode === 'desktop' ? 'rounded-xl' : 'rounded-[2rem]'}`}>
                                {/* Branded Header Mock - FULL SIZE */}
                                <div className="p-4 md:p-6">
                                    <div className="bg-[#111F18] rounded-[2rem] p-6 md:p-10 text-center relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2ECC8C] rounded-full blur-[80px] opacity-[0.08] -mr-20 -mt-20 pointer-events-none" />

                                        <div className="relative z-10 flex items-center gap-4 bg-[#1A4A38]/30 px-6 py-4 rounded-2xl border border-white/5">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1A4A38] to-[#2ECC8C]/20 border border-white/10 flex items-center justify-center">
                                                <Zap size={20} className="text-[#2ECC8C]" fill="currentColor" />
                                            </div>
                                            <h4 className="text-base md:text-xl font-bold text-white tracking-tight">
                                                Saiba quanto você pode <span className="text-[#D4E44A]">economizar...</span>
                                            </h4>
                                        </div>

                                        <div className="relative z-10 flex items-center gap-4 px-5 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm shadow-xl shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-[#D4E44A] flex items-center justify-center shadow-lg border-2 border-white/20 overflow-hidden shrink-0">
                                                {avatarUrl ? (
                                                    <Image src={avatarUrl} alt={consultantName} width={48} height={48} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="font-black text-[#111F18] text-sm">{consultantName.substring(0, 2).toUpperCase()}</span>
                                                )}
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] font-bold text-[#6B8F72] uppercase tracking-tighter opacity-90 leading-none mb-1">Oferecido por</p>
                                                <p className="text-lg font-black text-white tracking-wide leading-none">{consultantName}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Body Mock - FULL SIZE */}
                                <div className={`px-4 md:px-12 py-8 flex-1 ${viewMode === 'desktop' ? 'max-w-3xl mx-auto w-full pt-10' : ''}`}>
                                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-[#D8EDD5] shadow-2xl space-y-8">
                                        <div className="text-center space-y-2">
                                            <div className="inline-flex items-center px-3 py-1 bg-[#EEF2DC] text-[#1A4A38] text-[10px] font-bold tracking-widest uppercase rounded-full">Simulador Ativo ⚡️</div>
                                            <h3 className="text-2xl md:text-4xl font-black text-[#111F18] leading-tight">{offerText}</h3>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="w-full bg-[#f1f8ee] border-2 border-transparent px-6 py-4 rounded-2xl font-medium text-slate-400">Seu Nome</div>
                                                <div className="w-full bg-[#f1f8ee] border-2 border-transparent px-6 py-4 rounded-2xl font-medium text-slate-400">WhatsApp</div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="col-span-2 w-full bg-[#f1f8ee] border-2 border-transparent px-6 py-4 rounded-2xl font-medium text-slate-400">CEP</div>
                                                <div className="col-span-1 w-full bg-[#f1f8ee] border-2 border-transparent px-6 py-4 rounded-2xl font-medium text-slate-400">Nº</div>
                                            </div>

                                            <div className="space-y-4 pt-4">
                                                <div className="flex justify-between text-sm font-bold text-[#1A4A38]">
                                                    <span>Consumo Médio</span>
                                                    <span className="bg-[#EEF2DC] px-4 py-1 rounded-full border border-[#D4E44A]/30">450 kWh/mês</span>
                                                </div>
                                                <div className="h-3 w-full bg-[#EEF2F6] rounded-full relative">
                                                    <div className="absolute inset-y-0 left-0 w-2/5 bg-[#D4E44A] rounded-full"></div>
                                                    <div className="absolute -top-2 left-2/5 w-7 h-7 bg-white border-2 border-[#D4E44A] rounded-full shadow-lg"></div>
                                                </div>
                                            </div>

                                            <button className="w-full bg-[#D4E44A] text-[#111F18] py-6 rounded-[2rem] font-black text-2xl flex items-center justify-center gap-3 shadow-2xl shadow-[#D4E44A]/30 cursor-default">
                                                Calcular Economia
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
