"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Calculator, CreditCard, Settings, LogOut, Bell, User } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [fullName, setFullName] = useState<string>("Consultor Solar");
    const [planType, setPlanType] = useState<string>("free");
    const [usage, setUsage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(2);

    useEffect(() => {
        const loadProfile = async () => {
            setAvatarUrl(localStorage.getItem("userAvatar"));
            const storedName = localStorage.getItem("userFullName");
            if (storedName) setFullName(storedName);

            // Tenta pegar do localStorage primeiro
            const storedPlan = localStorage.getItem("userPlan");
            if (storedPlan) {
                setPlanType(storedPlan);
                setLimit(storedPlan === 'free' ? 2 : 100);
            }

            // Fetch do banco para garantir
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // 1. Dados do Consultor
                const { data } = await supabase.from('consultants').select('full_name, avatar_url, plan_type').eq('id', user.id).single();
                if (data) {
                    if (data.full_name) {
                        setFullName(data.full_name);
                        localStorage.setItem("userFullName", data.full_name);
                    }
                    if (data.avatar_url) {
                        setAvatarUrl(data.avatar_url);
                        localStorage.setItem("userAvatar", data.avatar_url);
                    }
                    if (data.plan_type) {
                        setPlanType(data.plan_type);
                        setLimit(data.plan_type === 'free' ? 2 : 100);
                        localStorage.setItem("userPlan", data.plan_type);
                    }
                }

                // 2. Contagem de Leads
                const { count } = await supabase
                    .from('leads')
                    .select('*', { count: 'exact', head: true })
                    .eq('consultant_id', user.id);

                if (count !== null) setUsage(count);
            }
        };
        loadProfile();
        window.addEventListener("avatarUpdated", loadProfile);
        window.addEventListener("profileUpdated", loadProfile);
        return () => {
            window.removeEventListener("avatarUpdated", loadProfile);
            window.removeEventListener("profileUpdated", loadProfile);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            // Limpa todos os dados locais para garantir segurança
            localStorage.clear();
            sessionStorage.clear();
            // Redireciona via window.location para garantir limpeza de estado do Next.js
            window.location.href = "/login";
        } catch (error) {
            console.error("Erro ao sair:", error);
            window.location.href = "/login";
        }
    };

    return (
        <div className="min-h-screen bg-mesh-green text-[#14151C] font-sans flex p-4 gap-4">
            {/* Sidebar */}
            <aside className="w-64 bg-white rounded-[0.8rem] border border-slate-200/60 shadow-sm flex-shrink-0 flex flex-col z-20 sticky top-4 h-[calc(100vh-2rem)] overflow-hidden">
                <div className="h-16 flex items-center px-6 border-b border-slate-100">
                    <Link href="/dashboard" className="flex items-center group">
                        <Image src="/logo.svg" alt="Xpect Solar" width={160} height={40} className="h-8 w-auto transition-transform group-hover:scale-105" />
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                    <div className="pb-3 px-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Painel de Controle</p>
                    </div>
                    <SidebarLink href="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" active={pathname === "/dashboard"} />
                    <SidebarLink href="/dashboard/leads" icon={<Users size={20} />} label="Gestão de Leads" active={pathname === "/dashboard/leads"} />
                    <SidebarLink href="/dashboard/simulator" icon={<Calculator size={20} />} label="Simulador de Economia" active={pathname === "/dashboard/simulator"} />

                    <div className="pt-8 pb-3 px-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Configurações e Conta</p>
                    </div>
                    <SidebarLink href="/dashboard/plan" icon={<CreditCard size={20} />} label="Plano" active={pathname === "/dashboard/plan"} />
                    <SidebarLink href="/dashboard/settings" icon={<Settings size={20} />} label="Configurações" active={pathname === "/dashboard/settings"} />
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50 mt-auto">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-100 shadow-sm">
                            {avatarUrl ? (
                                <Image src={avatarUrl} alt="Avatar" width={36} height={36} className="w-full h-full object-cover" unoptimized />
                            ) : (
                                <User size={18} className="text-slate-500" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[#14151C] truncate">{fullName}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {planType === 'free' ? 'Teste Gratuito' : 'Plano Essencial'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-bold text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <LogOut size={16} /> Encerrar Sessão
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col bg-white rounded-[0.8rem] border border-slate-200/60 shadow-sm h-[calc(100vh-2rem)] overflow-y-auto relative custom-scrollbar">
                {/* Top Header */}
                <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-100/60 sticky top-0 z-10 flex items-center justify-between px-8 rounded-t-[0.8rem]">
                    <div className="flex items-center">
                        {/* Breadcrumb or Title can go here */}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200/60 shadow-sm">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Análises:</span>
                            <span className="text-sm font-bold text-[#14151C]">{usage}<span className="text-slate-400 font-normal">/{limit}</span></span>
                        </div>
                        <div className="w-px h-6 bg-slate-200 hidden md:block"></div>
                        <button className="relative p-2.5 text-slate-400 hover:text-[#14151C] transition-colors rounded-full hover:bg-slate-100">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D0F252] border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

function SidebarLink({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all relative overflow-hidden group ${active
                ? "text-[#14151C] bg-[#EEF2DC]/50"
                : "text-slate-500 hover:bg-slate-50 hover:text-[#14151C]"
                }`}
        >
            {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#6B8C49] rounded-r-full"></div>
            )}
            <div className={`transition-colors ${active ? "text-[#6B8C49]" : "text-slate-400 group-hover:text-slate-600"}`}>
                {icon}
            </div>
            {label}
        </Link>
    );
}
