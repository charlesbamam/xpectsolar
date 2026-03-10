"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { User } from "@supabase/supabase-js";

export default function AuthCallbackPage() {
    const router = useRouter();

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        let isMounted = true;
        const processUser = async (user: User) => {
            try {
                // 1. Verificar se o consultor já existe
                const { data: existingConsultant } = await supabase
                    .from("consultants")
                    .select("id")
                    .eq("id", user.id)
                    .single();

                if (!existingConsultant) {
                    // 2. Criar perfil de consultor usando os metadados salvos ou vindos do provedor social
                    const fullNameFromMeta = user.user_metadata?.full_name || user.user_metadata?.name || "";
                    const firstNameFromMeta = user.user_metadata?.first_name || user.user_metadata?.given_name || "";
                    const lastNameFromMeta = user.user_metadata?.last_name || user.user_metadata?.family_name || "";

                    let firstName = firstNameFromMeta || "Consultor";
                    let lastName = lastNameFromMeta || "";
                    const fullName = fullNameFromMeta || `${firstName} ${lastName}`.trim();

                    // Se vier do Google (full_name) mas não tiver first/last separados, tenta separar
                    if (fullNameFromMeta && !firstNameFromMeta) {
                        const parts = fullNameFromMeta.split(" ");
                        firstName = parts[0];
                        lastName = parts.slice(1).join(" ");
                    }

                    const slugCandidate = firstName.toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        + "-" + Math.floor(Math.random() * 1000);

                    await supabase.from("consultants").insert({
                        id: user.id,
                        full_name: fullName,
                        email: user.email,
                        whatsapp_number: "00000000000",
                        slug: slugCandidate.replace(/[^a-z0-9-]/g, ""),
                        company_name: "Xpect Solar",
                        plan_type: "free",
                    });
                }

                if (isMounted) {
                    setStatus("success");
                    // Pequena pausa para o usuário ver a mensagem de sucesso
                    setTimeout(() => {
                        if (isMounted) {
                            router.push("/dashboard");
                            router.refresh();
                        }
                    }, 2000);
                }
            } catch (err) {
                console.error("Erro ao processar perfil:", err);
                if (isMounted) setStatus("error");
            }
        };

        const handleCallback = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error("Erro na autenticação:", error);
                setStatus("error");
                setTimeout(() => router.push("/login?error=" + error.message), 3000);
                return;
            }

            if (session?.user) {
                processUser(session.user);
            } else {
                const { data: authListener } = supabase.auth.onAuthStateChange(
                    async (event, session) => {
                        if (session?.user) {
                            processUser(session.user);
                        }
                    }
                );
                return () => authListener.subscription.unsubscribe();
            }
        };

        handleCallback();

        return () => {
            isMounted = false;
        };
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
            {status === "loading" && (
                <div className="text-center animate-in fade-in duration-700">
                    <div className="relative mb-8 flex justify-center">
                        <div className="absolute inset-0 bg-[#D0F252] rounded-full blur-2xl opacity-20 animate-pulse"></div>
                        <Loader2 size={48} className="text-[#14151C] animate-spin relative z-10" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#14151C] mb-2">Finalizando seu cadastro...</h1>
                    <p className="text-slate-500">Confirmando seu e-mail e preparando seu painel.</p>
                </div>
            )}

            {status === "success" && (
                <div className="text-center animate-in zoom-in fade-in duration-500">
                    <div className="w-20 h-20 bg-[#D0F252] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-[#D0F252]/20">
                        <CheckCircle2 size={40} className="text-[#14151C]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#14151C] mb-2">Conta Ativada!</h1>
                    <p className="text-slate-500">Seja bem-vindo ao Xpect Solar. Redirecionando...</p>
                </div>
            )}

            {status === "error" && (
                <div className="text-center animate-in shake duration-500">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-red-100/20">
                        <AlertCircle size={40} className="text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#14151C] mb-2">Erro na Ativação</h1>
                    <p className="text-slate-500">Não foi possível processar seu acesso. Tente fazer login novamente.</p>
                </div>
            )}
        </div>
    );
}
