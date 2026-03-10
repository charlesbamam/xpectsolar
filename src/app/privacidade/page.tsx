export default function Privacidade() {
    return (
        <div className="min-h-screen bg-[#F4F9F1] font-sans selection:bg-[#D4E44A]/30 text-[#111F18] p-8 md:p-16">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[32px] shadow-xl shadow-[#111F18]/5 border border-slate-100">
                <h1 className="text-3xl md:text-4xl font-black font-['Space_Grotesk'] mb-6 tracking-tight">Política de Privacidade</h1>
                <p className="text-sm text-slate-500 mb-8 font-medium tracking-wide uppercase">Última atualização: Março de 2026</p>

                <div className="space-y-6 text-slate-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-[#1A4A38] mb-3">1. Coleta de Informações Pessoais</h2>
                        <p>O <b>Xpect Solar</b> coleta informações essenciais de nossos usuários para operar os serviços de prospecção, melhorar a tomada de decisões no mapeamento satelital e personalizar as propostas geradas para seus Leads. Entre as informações armazenadas, estão: e-mail de registro, nome, telefones temporários e as coordenadas de mapeamento inseridas.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#1A4A38] mb-3">2. Uso Destes Dados</h2>
                        <p>A privacidade de clientes finais (leads cadastrados pelos consultores) é prioridade. Os dados gerados em propostas (consumo, endereço, simulações solares) não são comercializados ou cedidos a terceiros. Eles residem em bancos de dados privados para o uso exclusivo do consultor criador da conta.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#1A4A38] mb-3">3. Proteção e Segurança</h2>
                        <p>Empregamos práticas de compilação de dados adequadas, medidas físicas e de segurança cibernética (incluindo Supabase e criptografia) para proteger contra acesso não autorizado, uso, divulgação ou destruição das suas credenciais e dos dados de seus leads.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#1A4A38] mb-3">4. Gateway de Pagamento e Terceiros</h2>
                        <p>Para o processamento de seu plano de assinatura (cartões de crédito e PIX), utilizamos o provedor certificado PCI Compliance (Stripe). Nós <b>não guardamos os números completos do seu cartão de crédito</b>. Além do Gateway, utilizamos parceiros de APIs geoespaciais e de mapas satelitais em requisições de backend que nunca associam diretamente os dados pessoais de seus leads nas medições de telhados realizadas.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#1A4A38] mb-3">5. Seus Direitos e Aceite</h2>
                        <p>Ao se inscrever, você atesta a compreensão das nossas rotinas de operação. Consultores solares podem excluir suas contas a qualquer momento no Painel, com toda a exclusão perene dos dados atrelados. Fique à vontade para sanar mais dúvidas através dos canais de suporte.</p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                    <a href="/" className="text-[#2ECC8C] font-bold hover:underline">Voltar para a página inicial</a>
                </div>
            </div>
        </div>
    );
}
