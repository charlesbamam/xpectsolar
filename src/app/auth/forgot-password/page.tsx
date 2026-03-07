"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, Send, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (resetError) throw resetError;
            setSuccess(true);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : "Erro ao enviar email de recuperação.";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] font-sans p-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <Link href="/login" className="flex items-center group">
                        <Image src="/logo.svg" alt="Xpect Solar" width={180} height={45} className="h-10 w-auto transition-transform group-hover:scale-105" />
                    </Link>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl shadow-[#14151C]/5 border border-slate-100 p-8 space-y-6">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-[#14151C]">Recuperar senha</h1>
                        <p className="text-slate-500 mt-2">Enviaremos um link de recuperação para o seu e-mail</p>
                    </div>

                    {success ? (
                        <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-[#D0F252]/20 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="text-[#14151C]" size={40} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-bold text-[#14151C] text-lg">E-mail enviado!</h3>
                                <p className="text-slate-500 text-sm">Verifique sua caixa de entrada (e a pasta de spam) para redefinir sua senha.</p>
                            </div>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-sm font-black text-[#14151C] hover:underline decoration-[#D0F252] underline-offset-4"
                            >
                                <ArrowLeft size={16} /> Voltar para o login
                            </Link>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 animate-in fade-in slide-in-from-top-2">
                                    {error}
                                </div>
                            )}

                            <form className="space-y-5" onSubmit={handleReset}>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 ml-1">Seu Email Corporativo</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="nome@suaempresa.com.br"
                                        required
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#14151C]/5 focus:border-[#14151C] transition-all placeholder:text-slate-400 text-[#14151C]"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 flex items-center justify-center gap-2 bg-[#14151C] hover:bg-black disabled:bg-slate-400 text-white rounded-2xl font-bold shadow-lg shadow-[#14151C]/20 transition-all hover:-translate-y-0.5 mt-2 active:scale-95"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>Enviar Link <Send size={18} /></>
                                    )}
                                </button>
                            </form>

                            <div className="text-center pt-2">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#14151C] transition-colors"
                                >
                                    <ArrowLeft size={16} /> Voltar para o login
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
