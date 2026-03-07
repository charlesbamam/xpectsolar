"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Eye, EyeOff, CheckCircle2, Lock } from "lucide-react";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Verifica se existe uma sessão ativa (o Supabase coloca na URL o token)
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                setError("Link de recuperação inválido ou expirado.");
            }
        };
        checkSession();
    }, []);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        if (password.length < 8) {
            setError("A senha deve ter pelo menos 8 caracteres.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) throw updateError;

            setSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : "Erro ao atualizar senha.";
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
                        <h1 className="text-2xl font-bold text-[#14151C]">Nova senha</h1>
                        <p className="text-slate-500 mt-2">Crie uma senha forte e segura</p>
                    </div>

                    {success ? (
                        <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-[#D0F252]/20 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="text-[#14151C]" size={40} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-bold text-[#14151C] text-lg">Senha alterada!</h3>
                                <p className="text-slate-500 text-sm">Sua senha foi atualizada com sucesso. Redirecionando para o login...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 animate-in fade-in slide-in-from-top-2">
                                    {error}
                                </div>
                            )}

                            <form className="space-y-4" onSubmit={handleUpdatePassword}>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700 ml-1">Nova Senha</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Mínimo 8 caracteres"
                                            required
                                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#14151C]/5 focus:border-[#14151C] transition-all text-[#14151C]"
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

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700 ml-1">Confirmar Nova Senha</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repita a senha"
                                        required
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#14151C]/5 focus:border-[#14151C] transition-all text-[#14151C]"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 flex items-center justify-center gap-3 bg-[#14151C] hover:bg-black disabled:bg-slate-400 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#14151C]/20 transition-all hover:-translate-y-1 mt-4 active:scale-95"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>Salvar Nova Senha <Lock size={18} className="text-[#D0F252]" /></>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
