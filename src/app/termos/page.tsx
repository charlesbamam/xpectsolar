export default function Termos() {
    return (
        <div className="min-h-screen bg-[#F4F9F1] font-sans selection:bg-[#D4E44A]/30 text-[#111F18] p-8 md:p-16">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[32px] shadow-xl shadow-[#111F18]/5 border border-slate-100">
                <h1 className="text-3xl md:text-4xl font-black font-['Space_Grotesk'] mb-6 tracking-tight">Termos de Uso</h1>
                <p className="text-sm text-slate-500 mb-8 font-medium tracking-wide uppercase">Última atualização: Março de 2026</p>

                <div className="space-y-6 text-slate-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-[#1A4A38] mb-3">1. Aceitação dos Termos</h2>
                        <p>Ao acessar e acessar o Xpect Solar ("Plataforma"), você concorda em cumprir estes Termos de Uso. Se você não concordar com algum destes termos, está proibido de usar ou acessar este site.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#1A4A38] mb-3">2. Uso da Plataforma</h2>
                        <p>A Plataforma fornece ferramentas de prospecção e análise de viabilidade solar por satélite voltada para consultores solares. É concedida permissão para o uso temporário, não exclusivo e não transferível das ferramentas, estritamente para uso comercial lícito.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#1A4A38] mb-3">3. Assinatura e Pagamentos</h2>
                        <p>Algumas funcionalidades requerem assinatura paga. Os pagamentos são processados de forma segura e não armazenamos dados diretos de cartão de crédito. As assinaturas podem ser canceladas a qualquer momento, sem reembolso pró-rata do período já iniciado.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#1A4A38] mb-3">4. Limitações e Isenção de Responsabilidade</h2>
                        <p>Os cálculos de viabilidade, áreas de telhado e potenciais gerados pela plataforma são <b>estimativas precisas, mas não substituem o projeto de engenharia final</b>. O Xpect Solar não se responsabiliza por prejuízos decorrentes de estimativas incorretas, dependendo o usuário da validação técnica apropriada.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#1A4A38] mb-3">5. Modificações</h2>
                        <p>O Xpect Solar pode revisar estes Termos de Uso a qualquer momento sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual destes Termos de Uso.</p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                    <a href="/" className="text-[#2ECC8C] font-bold hover:underline">Voltar para a página inicial</a>
                </div>
            </div>
        </div>
    );
}
