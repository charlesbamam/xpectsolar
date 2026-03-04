"use client";

import { User, Mail, Shield, Bell, Save, Camera, Lock, Eye, EyeOff } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function SettingsPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const savedAvatar = localStorage.getItem("userAvatar");
        if (savedAvatar) setAvatarUrl(savedAvatar);

        const savedName = localStorage.getItem("userFullName");
        if (savedName) setFullName(savedName);
        else setFullName("Consultor Solar Xpect");

        const savedEmail = localStorage.getItem("userEmail");
        if (savedEmail) setEmail(savedEmail);
        else setEmail("consultor@xpectsolar.com");
    }, []);

    const handleSaveProfile = () => {
        localStorage.setItem("userFullName", fullName);
        localStorage.setItem("userEmail", email);
        alert("Informações de perfil salvas com sucesso!");
        window.dispatchEvent(new Event("profileUpdated"));
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
                <p className="text-slate-600 mt-1">Gerencie suas informações pessoais e segurança da conta.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
                {/* Navigation (Internal) */}
                <div className="md:col-span-1 space-y-1">
                    <SettingsNavItem icon={<User size={18} />} label="Perfil" active />
                    <SettingsNavItem icon={<Shield size={18} />} label="Segurança" />
                    <SettingsNavItem icon={<Bell size={18} />} label="Notificações" />
                </div>

                {/* Content */}
                <div className="md:col-span-3 space-y-6">
                    {/* Profile Section */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-[#14151C]">Informações de Perfil</h3>
                            <button className="flex items-center gap-2 bg-[#14151C] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-black transition-all" onClick={handleSaveProfile}>
                                <Save size={16} /> Salvar Tudo
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Avatar Upload */}
                            <div className="flex items-center gap-6">
                                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200 group-hover:border-[#6B8C49] transition-colors overflow-hidden">
                                        {avatarUrl ? (
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
                                    <h4 className="font-bold text-[#14151C]">Sua Foto</h4>
                                    <p className="text-xs text-slate-500">JPG, GIF ou PNG. Máximo de 2MB.</p>
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
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nome Completo</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14151C]/10 transition-all font-medium text-[#14151C]"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">E-mail</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
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
                            <button className="text-sm font-bold text-[#6B8C49] hover:underline">Alterar Senha de Acesso</button>
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
