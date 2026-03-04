"use client";

import { User, Mail, Shield, Bell, Save, Camera, Lock, Eye, EyeOff, MessageCircle, Link as LinkIcon, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [slug, setSlug] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadProfile = async () => {
            const profileId = localStorage.getItem("consultantId");
            if (profileId) {
                // Busca do Supabase caso ele já tenha perfil criado
                const { data, error } = await supabase.from('consultants').select('*').eq('id', profileId).single();
                if (data && !error) {
                    setFullName(data.full_name);
                    setEmail(data.email || "");
                    setWhatsapp(data.whatsapp_number);
                    setSlug(data.slug);
                    setAvatarUrl(data.avatar_url);
                    // Atualiza memórias visuais (sidebar)
                    localStorage.setItem("userFullName", data.full_name);
                    if (data.avatar_url) localStorage.setItem("userAvatar", data.avatar_url);
                    window.dispatchEvent(new Event("profileUpdated"));
                }
            } else {
                // Modo fallback para onboarding
                const savedName = localStorage.getItem("userFullName") || "Consultor Xpect";
                const savedEmail = localStorage.getItem("userEmail") || "consultor@xpectsolar.com";
                setFullName(savedName);
                setEmail(savedEmail);
            }
        };
        loadProfile();
    }, []);

    const handleSaveProfile = async () => {
        if (!slug || !fullName || !whatsapp) {
            alert("Por favor, preencha o Nome, WhatsApp e um Nome de Link (Slug).");
            return;
        }

        setIsSaving(true);
        try {
            let profileId = localStorage.getItem("consultantId");
            const payload = {
                // Formata o slug tirando espaços, virando url amiga
                slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                full_name: fullName,
                email: email,
                whatsapp_number: whatsapp,
                avatar_url: avatarUrl
            };

            if (profileId) {
                const { error } = await supabase.from('consultants').update(payload).eq('id', profileId);
                if (error) throw error;
            } else {
                const { data, error } = await supabase.from('consultants').insert([payload]).select().single();
                if (error) throw error;
                if (data) {
                    localStorage.setItem("consultantId", data.id);
                }
            }

            // Reflete no Sidebar Local
            localStorage.setItem("userFullName", fullName);
            window.dispatchEvent(new Event("profileUpdated"));

            alert("Sua página pública foi atualizada com sucesso!");
        } catch (error: any) {
            alert("Erro ao salvar perfil, detalhe técnico: " + (error?.message || JSON.stringify(error)));
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setAvatarUrl(base64String);
                localStorage.setItem("userAvatar", base64String);
                window.dispatchEvent(new Event("avatarUpdated"));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAvatar = () => {
        setAvatarUrl(null);
        localStorage.removeItem("userAvatar");
        window.dispatchEvent(new Event("avatarUpdated"));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[#14151C]">Configurações da Conta</h1>
                <p className="text-slate-600 mt-1">Gerencie seu perfil e ative sua página pública do simulador.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
                {/* Navigation (Internal) */}
                <div className="md:col-span-1 space-y-1">
                    <SettingsNavItem icon={<User size={18} />} label="Perfil & Página" active />
                    <SettingsNavItem icon={<Shield size={18} />} label="Segurança" />
                    <SettingsNavItem icon={<Bell size={18} />} label="Notificações" />
                </div>

                {/* Content */}
                <div className="md:col-span-3 space-y-6">
                    {/* Profile Section */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-[#FDFDFD]">
                            <h3 className="font-bold text-[#14151C]">Página Dinâmica Pública</h3>
                            <button
                                className="flex items-center gap-2 bg-[#14151C] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-black transition-all disabled:opacity-50"
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                            >
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                {isSaving ? "Salvando..." : "Salvar e Publicar"}
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Avatar Upload */}
                            <div className="flex items-center gap-6">
                                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200 group-hover:border-[#6B8C49] transition-colors overflow-hidden">
                                        {avatarUrl ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={40} className="text-slate-300 group-hover:text-[#6B8C49] transition-colors" />
                                        )}
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-2 bg-[#14151C] text-white rounded-full border-2 border-white shadow-lg transform group-hover:scale-110 transition-transform">
                                        <Camera size={14} />
                                    </button>
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/gif"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleAvatarChange}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-[#14151C]">Sua Foto Profissional</h4>
                                    <p className="text-xs text-slate-500">JPG ou PNG. (Seu cliente verá essa foto)</p>
                                    <div className="flex gap-2 mt-2">
                                        {avatarUrl && (
                                            <button
                                                className="text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-wider bg-red-50 px-2 py-1 rounded"
                                                onClick={handleRemoveAvatar}
                                            >
                                                Remover
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Form Grid */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nome de Consultor (Público)</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => {
                                                if (e.target.value.length <= 40) setFullName(e.target.value);
                                            }}
                                            maxLength={40}
                                            placeholder="Ex: Carlos Eduardo"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14151C]/10 transition-all font-medium text-[#14151C]"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1">Máximo de 40 caracteres.</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">WhatsApp de Vendas</label>
                                    <div className="relative">
                                        <MessageCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={whatsapp}
                                            onChange={(e) => {
                                                // Bloqueia qualquer coisa que não seja número na hora da digitação
                                                const apenasNumeros = e.target.value.replace(/\D/g, '');
                                                if (apenasNumeros.length <= 11) setWhatsapp(apenasNumeros);
                                            }}
                                            maxLength={11}
                                            placeholder="Ex: 11999999999"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14151C]/10 transition-all font-medium text-[#14151C]"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1">Coloque apenas números com DDD (Ex: 11999999999).</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#6B8C49] uppercase tracking-wider">Identificador Único (O seu Link)</label>
                                    <div className="relative">
                                        <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={slug}
                                            onChange={(e) => {
                                                // Força letras minúsculas sem espaços ou acentos
                                                const linkLimpo = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                                                if (linkLimpo.length <= 30) setSlug(linkLimpo);
                                            }}
                                            maxLength={30}
                                            placeholder="ex: consultor-carlos"
                                            className="w-full pl-10 pr-4 py-3 bg-[#EEF2DC]/30 border border-[#6B8C49]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B8C49]/30 transition-all font-bold text-[#14151C]"
                                        />
                                    </div>
                                    <p className="text-[10px] font-medium text-slate-500 mt-1">
                                        Seu simulador ficará em: <span className="font-bold text-[#14151C]">xpectsolar.com/s/{slug || 'nome'}</span>
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">E-mail de Login</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                if (e.target.value.length <= 60) setEmail(e.target.value);
                                            }}
                                            maxLength={60}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14151C]/10 transition-all font-medium text-[#14151C]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Section (Compact) */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                            <h3 className="font-bold text-[#14151C]">Senha e Acesso</h3>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2 max-w-md">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nova Senha</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••••••"
                                        className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14151C]/10 transition-all font-medium text-[#14151C]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-400">Use pelo menos 8 caracteres com letras e números.</p>
                            </div>
                            <button className="text-sm font-bold text-slate-500 hover:text-[#14151C] transition-colors">Alterar Senha de Acesso</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SettingsNavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${active
            ? "bg-white text-[#14151C] shadow-sm border border-slate-100"
            : "text-slate-500 hover:bg-white/60 hover:text-[#14151C]"
            }`}>
            {icon}
            {label}
        </button>
    );
}
