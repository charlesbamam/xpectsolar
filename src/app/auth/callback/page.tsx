"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        let isMounted = true;
        const processUser = async (user: any) => {
            try {
                // 1. Verificar se o consultor já existe
                const { data: existingConsultant } = await supabase
                    .from("consultants")
                    .select("id")
                    .eq("id", user.id)
                    .single();

                if (!existingConsultant) {
                    // 2. Criar perfil de consultor usando os metadados salvos no registro
                    const firstName = user.user_metadata?.first_name || "Consultor";
                    const lastName = user.user_metadata?.last_name || "";
                    const fullName = `${firstName} ${lastName}`.trim();

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
                        company_name: "Xpect Solar"
                    });
                }
                if (isMounted) {
                    router.push("/dashboard");
                    router.refresh();
                }
            } catch (err) {
                console.error("Erro ao processar perfil:", err);
                if (isMounted) router.push("/dashboard");
            }
        };

        const handleCallback = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error("Erro na autenticação:", error);
                router.push("/login?error=" + error.message);
                return;
            }

            if (session?.user) {
                processUser(session.user);
            } else {
                // It might take a moment to parse PKCE response
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
            <div className="text-center animate-in fade-in duration-700">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-[#D0F252] rounded-full blur-2xl opacity-20 animate-pulse"></div>
                    <Loader2 size={48} className="text-[#14151C] animate-spin relative z-10" />
                </div>
                <h1 className="text-2xl font-bold text-[#14151C] mb-2">Finalizando seu cadastro...</h1>
                <p className="text-slate-500">Confirmando seu e-mail e preparando seu painel.</p>
            </div>
        </div>
    );
}
