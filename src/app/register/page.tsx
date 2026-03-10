"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Zap, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [inviteCode, setInviteCode] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (inviteCode.trim().toUpperCase() !== "XPECT-BETA-8K9V-2026") {
            setError("O Xpect Solar está em Beta Fechado. Insira um código de convite VIP válido.");
            setLoading(false);
            return;
        }

        try {
            // 1. Criar usuário no Auth com o link de confirmação tradicional
            // Passamos firstName e lastName no user_metadata para usar depois da confirmação
            const { error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                }
            });

            if (authError) throw authError;

            // Transaciona para a tela de aviso de e-mail enviado
            setIsVerifying(true); // Usamos este estado para mostrar a mensagem de sucesso de envio
            setLoading(false);

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Erro ao criar conta. Tente novamente.";
            setError(errorMessage);
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'google') => {
        setError("");
        if (inviteCode.trim().toUpperCase() !== "XPECT-BETA-8K9V-2026") {
            setError("O Xpect Solar está em Beta Fechado. Insira um código VIP acima para criar com conta do Google.");
            return;
        }

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                }
            });
            if (error) throw error;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Erro ao conectar com provedor social.";
            setError(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] font-sans selection:bg-[#D0F252]/30 p-4">
            <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl shadow-[#14151C]/10 border border-slate-100 overflow-hidden flex flex-col md:flex-row transition-all">

                {/* Left Side - Information */}
                <div className="md:w-5/12 bg-[#14151C] text-white p-8 md:p-10 flex flex-col relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#D0F252] rounded-full blur-[100px] opacity-20" />

                    <div className="relative z-10 flex flex-col h-full justify-center">
                        <Link href="/" className="inline-flex items-center mb-10 hover:opacity-80 transition-opacity w-fit">
                            <Image src="/logo.svg" alt="Xpect Solar" width={180} height={45} className="h-10 w-auto brightness-0 invert" />
                        </Link>

                        <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight tracking-tighter">Pare de perder tempo com telhados inviáveis.</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed text-base md:text-lg font-medium">
                            Qualifique leads via satélite e foque nas prospecções técnicas com alto potencial de geração de caixa.
                        </p>

                        <div className="space-y-4 mt-2">
                            <FeatureItem text="100 análises satelitais/mês" />
                            <FeatureItem text="Mapeamento por Satélite Integrado" />
                            <FeatureItem text="Link Público para Captação" />
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="md:w-7/12 p-8 md:p-10 relative bg-white flex flex-col justify-center">
                    {isVerifying ? (
                        <div className="text-center animate-in fade-in zoom-in duration-500">
                            <div className="w-24 h-24 bg-[#D0F252] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-[#D0F252]/20 border-4 border-white">
                                <CheckCircle2 size={48} className="text-[#14151C]" />
                            </div>
                            <h2 className="text-3xl font-black text-[#14151C] mb-4 tracking-tight">Verifique seu e-mail!</h2>
                            <p className="text-slate-500 text-lg mb-8 leading-relaxed font-medium">
                                Enviamos um link de confirmação para: <br />
                                <span className="font-black text-[#14151C] underline decoration-[#D0F252] decoration-4">{email}</span>
                            </p>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left">
                                <p className="text-slate-500 text-sm font-medium">
                                    <span className="text-[#14151C] font-black block mb-2 tracking-wide uppercase text-[10px]">Próximos passos:</span>
                                    • Clique no link enviado para ativar sua conta. <br />
                                    • Verifique sua pasta de Spam caso não encontre.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-md mx-auto w-full h-full flex flex-col justify-center">
                            <div className="mb-6 text-center md:text-left">
                                <h1 className="text-2xl md:text-3xl font-black text-[#14151C] tracking-tight">Crie sua conta</h1>
                                <p className="text-slate-500 mt-1 font-medium text-sm">Comece a classificar seus leads hoje mesmo.</p>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-2xl text-xs font-bold border border-red-100 mb-4 animate-in slide-in-from-top-2">
                                    {error}
                                </div>
                            )}

                            <form className="space-y-4" onSubmit={handleRegister}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="firstname" className="block text-[11px] font-black uppercase text-slate-400 ml-1">Nome</label>
                                        <input
                                            id="firstname"
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="João"
                                            required
                                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#14151C]/5 focus:border-[#14151C] transition-all text-[#14151C] font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="lastname" className="block text-[11px] font-black uppercase text-slate-400 ml-1">Sobrenome</label>
                                        <input
                                            id="lastname"
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Silva"
                                            required
                                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#14151C]/5 focus:border-[#14151C] transition-all text-[#14151C] font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-[11px] font-black uppercase text-slate-400 ml-1">Email Corporativo</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="nome@suaempresa.com.br"
                                        required
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#14151C]/5 focus:border-[#14151C] transition-all placeholder:text-slate-400 text-[#14151C] font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="inviteCode" className="block text-[11px] font-black uppercase text-[#2ECC8C] ml-1 flex items-center gap-1">
                                        <Zap size={10} fill="currentColor" /> Código de Convite VIP
                                    </label>
                                    <input
                                        id="inviteCode"
                                        type="text"
                                        value={inviteCode}
                                        onChange={(e) => setInviteCode(e.target.value)}
                                        placeholder="EX: XPECT-BETA-8K9V-2026"
                                        required
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-[#D0F252]/10 focus:bg-[#D0F252]/20 focus:outline-none focus:ring-4 focus:ring-[#D0F252]/30 focus:border-[#2ECC8C] transition-all placeholder:text-slate-400/50 text-[#14151C] font-black uppercase tracking-widest"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="password" className="block text-[11px] font-black uppercase text-slate-400 ml-1">Senha</label>
                                    <div className="relative group">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Mínimo de 8 caracteres"
                                            required
                                            minLength={8}
                                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#14151C]/5 focus:border-[#14151C] transition-all placeholder:text-slate-400 text-[#14151C] font-medium"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#14151C] transition-colors p-1"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 flex items-center justify-center gap-3 bg-[#14151C] hover:bg-black disabled:bg-slate-400 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#14151C]/20 transition-all hover:-translate-y-1 mt-2 active:scale-95"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>Criar Conta Gratuita <Zap size={16} fill="currentColor" className="text-[#D0F252]" /></>
                                    )}
                                </button>

                                <div className="relative flex items-center py-1">
                                    <div className="flex-grow border-t border-slate-100"></div>
                                    <span className="flex-shrink-0 mx-4 text-slate-300 text-[10px] font-black uppercase tracking-widest">ou crie com</span>
                                    <div className="flex-grow border-t border-slate-100"></div>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        type="button"
                                        onClick={() => handleSocialLogin('google')}
                                        className="w-full h-12 flex items-center justify-center gap-4 bg-white border-2 border-slate-100 hover:border-[#14151C] hover:bg-slate-50 text-[#14151C] rounded-2xl font-black transition-all shadow-sm active:scale-95 group"
                                    >
                                        <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        <span className="text-[13px] uppercase tracking-widest">Continuar com Google</span>
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                                <p className="text-xs text-slate-500 font-medium">
                                    Já tem uma conta? <Link href="/login" className="font-black text-[#14151C] hover:underline transition-colors decoration-[#D0F252] underline-offset-4">Fazer login</Link>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function FeatureItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors cursor-default group">
            <div className="w-8 h-8 bg-[#D0F252] rounded-xl flex items-center justify-center shadow-lg shadow-[#D0F252]/20 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="text-[#14151C]" size={16} />
            </div>
            <span className="text-sm text-slate-100 font-bold tracking-tight">{text}</span>
        </div>
    );
}
