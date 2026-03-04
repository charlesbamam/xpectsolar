"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Zap, CheckCircle2, Facebook, Loader2 } from "lucide-react";

export default function RegisterPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // 1. Criar usuário no Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) throw authError;

            if (authData.user) {
                // 2. Criar perfil de consultor padrão
                const fullName = `${firstName} ${lastName}`.trim();
                const slug = firstName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") + "-" + Math.floor(Math.random() * 1000);

                const { error: profileError } = await supabase.from('consultants').insert({
                    user_id: authData.user.id,
                    full_name: fullName,
                    email: email,
                    whatsapp_number: "00000000000", // Padrão para preencher depois
                    slug: slug.replace(/[^a-z0-h-]/g, "")
                });

                if (profileError) {
                    console.error("Erro ao criar perfil:", profileError);
                    // Silenciosamente logamos o erro do perfil, o usuário já foi criado no auth
                }
            }

            // Sucesso! Redireciona
            router.push('/dashboard/settings'); // Manda para configurações para terminar o perfil
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Erro ao criar conta. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] font-sans selection:bg-[#D0F252]/30 p-4">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-[#14151C]/5 border border-slate-100 overflow-hidden flex flex-col md:flex-row">

                {/* Left Side - Information */}
                <div className="md:w-5/12 bg-[#14151C] text-white p-10 md:p-14 flex flex-col relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#D0F252] rounded-full blur-[100px] opacity-20" />

                    <div className="relative z-10 flex flex-col h-full">
                        <Link href="/" className="inline-flex items-center mb-16 hover:opacity-80 transition-opacity w-fit">
                            <Image src="/logo.svg" alt="Xpect Solar" width={180} height={45} className="h-10 w-auto brightness-0 invert" />
                        </Link>

                        <h2 className="text-3xl font-bold mb-6">Pare de perder tempo com telhados inviáveis.</h2>
                        <p className="text-slate-400 mb-10 leading-relaxed text-lg">
                            Qualifique leads via satélite e foque nas prospecções técnicas com alto potencial de geração de caixa.
                        </p>

                        <div className="space-y-6 mt-auto">
                            <div className="flex items-start gap-4">
                                <CheckCircle2 className="text-[#D0F252] shrink-0 mt-0.5" size={20} />
                                <span className="text-slate-300">2 análises completas gratuitas</span>
                            </div>
                            <div className="flex items-start gap-4">
                                <CheckCircle2 className="text-[#D0F252] shrink-0 mt-0.5" size={20} />
                                <span className="text-slate-300">Acesso ao Motor Georeferenciado (Google Solar API)</span>
                            </div>
                            <div className="flex items-start gap-4">
                                <CheckCircle2 className="text-[#D0F252] shrink-0 mt-0.5" size={20} />
                                <span className="text-slate-300">Link público com Simulador para seus clientes</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="md:w-7/12 p-10 md:p-14 lg:px-20 relative bg-white">
                    <div className="max-w-md mx-auto h-full flex flex-col justify-center">

                        <div className="mb-10 text-center md:text-left">
                            <h1 className="text-2xl md:text-3xl font-bold text-[#14151C]">Crie sua conta</h1>
                            <p className="text-slate-500 mt-2">Comece a classificar seus leads hoje mesmo.</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 mb-6">
                                {error}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleRegister}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="firstname" className="block text-sm font-medium text-slate-700">Nome</label>
                                    <input
                                        id="firstname"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="João"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14151C]/20 focus:border-[#14151C] transition-all text-[#14151C]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="lastname" className="block text-sm font-medium text-slate-700">Sobrenome</label>
                                    <input
                                        id="lastname"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Silva"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14151C]/20 focus:border-[#14151C] transition-all text-[#14151C]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Corporativo</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="nome@suaempresa.com.br"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14151C]/20 focus:border-[#14151C] transition-all placeholder:text-slate-400 text-[#14151C]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Senha</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Mínimo de 8 caracteres"
                                    required
                                    minLength={8}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14151C]/20 focus:border-[#14151C] transition-all placeholder:text-slate-400 text-[#14151C]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 flex items-center justify-center gap-2 bg-[#14151C] hover:bg-black disabled:bg-slate-400 text-white rounded-xl font-semibold shadow-md shadow-[#14151C]/10 transition-all hover:-translate-y-0.5 mt-4"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>Criar Conta Gratuita <Zap size={18} fill="currentColor" className="text-[#D0F252]" /></>
                                )}
                            </button>

                            <div className="relative flex items-center py-2">
                                <div className="flex-grow border-t border-slate-200"></div>
                                <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">ou crie com</span>
                                <div className="flex-grow border-t border-slate-200"></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button type="button" className="w-full h-12 flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-[#14151C] rounded-xl font-medium transition-all shadow-sm">
                                    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg> Google
                                </button>
                                <button type="button" className="w-full h-12 flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white rounded-xl font-medium transition-all shadow-sm">
                                    <Facebook size={18} /> Facebook
                                </button>
                            </div>

                            <p className="text-xs text-slate-500 text-center mt-4">
                                Ao se registrar, você concorda com nossos <br className="hidden md:block" /> <Link href="#" className="underline hover:text-slate-800">Termos de Serviço</Link> e <Link href="#" className="underline hover:text-slate-800">Política de Privacidade</Link>.
                            </p>
                        </form>

                        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                            <p className="text-sm text-slate-600">
                                Já tem uma conta? <Link href="/login" className="font-semibold text-[#14151C] hover:underline transition-colors">Fazer login</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
