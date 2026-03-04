import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight, CheckCircle2, Zap, MapPin,
  BarChart3, ShieldCheck, Clock,
  Target, Users
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#14151C] font-sans selection:bg-[#D0F252]/50">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-[#6B8C49]/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Image src="/logo.svg" alt="Xpect Solar" width={160} height={40} className="h-8 w-auto" />
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#problema" className="hover:text-[#14151C] transition-colors">O Problema</Link>
            <Link href="#como-funciona" className="hover:text-[#14151C] transition-colors">Como Funciona</Link>
            <Link href="#precos" className="hover:text-[#14151C] transition-colors">Preços</Link>
            <Link href="#faq" className="hover:text-[#14151C] transition-colors">FAQ</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-[#14151C] transition-colors"> Entrar </Link>
            <Link href="/register" className="text-sm font-medium bg-[#D0F252] hover:bg-[#79F28B] text-[#14151C] px-4 py-2 rounded-full transition-all shadow-sm flex items-center gap-2 border border-[#6B8C49]/20">
              Começar Agora
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[#D0F252]/20 to-transparent -z-10" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#79F28B]/20 blur-3xl rounded-full mix-blend-multiply -z-10" />

        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14151C] text-[#D0F252] text-xs font-medium tracking-wide shadow-sm">
              <span className="text-sm">👋</span> De consultor para consultor
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B8C49]/10 text-[#6B8C49] text-xs font-semibold uppercase tracking-wider border border-[#6B8C49]/20 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#6B8C49] animate-pulse" />
              Filtro de Viabilidade Técnica
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#14151C] mb-6 max-w-4xl leading-[1.1]">
            Descubra em <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B8C49] to-[#79F28B]">15 segundos</span> se o lead de energia solar vale sua visita.
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
            Análise satelital automática do telhado antes da visita presencial. Pare de perder tempo com leads tecnicamente inviáveis.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link href="/register" className="h-14 px-8 rounded-full bg-[#14151C] hover:bg-black text-white font-semibold flex items-center gap-2 text-lg shadow-xl shadow-black/10 transition-all hover:-translate-y-0.5 w-full sm:w-auto justify-center">
              Começar Agora <ArrowRight size={20} />
            </Link>
            <Link href="#como-funciona" className="h-14 px-8 rounded-full bg-white border border-[#6B8C49]/20 hover:border-[#6B8C49]/40 hover:bg-slate-50 text-[#14151C] font-semibold flex items-center gap-2 text-lg transition-all w-full sm:w-auto justify-center">
              Ver como funciona
            </Link>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3">
            <div className="flex -space-x-3">
              <img className="w-10 h-10 rounded-full border-2 border-[#F8FAFC] bg-[#6B8C49]/20" src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=F8FAFC" alt="Usuário 1" />
              <img className="w-10 h-10 rounded-full border-2 border-[#F8FAFC] bg-[#6B8C49]/20" src="https://api.dicebear.com/7.x/notionists/svg?seed=Ane&backgroundColor=F8FAFC" alt="Usuário 2" />
              <img className="w-10 h-10 rounded-full border-2 border-[#F8FAFC] bg-[#6B8C49]/20" src="https://api.dicebear.com/7.x/notionists/svg?seed=John&backgroundColor=F8FAFC" alt="Usuário 3" />
              <img className="w-10 h-10 rounded-full border-2 border-[#F8FAFC] bg-[#14151C] p-1.5" src="https://api.dicebear.com/7.x/initials/svg?seed=XD&backgroundColor=14151C&textColor=D0F252" alt="Mais Usuários" />
            </div>
            <div className="text-sm text-slate-600 font-medium text-center leading-tight">
              Junte-se a <strong className="text-[#14151C]">centenas de consultores</strong><br />que já economizam tempo e combustível hoje.
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-[#6B8C49]" /> 2 análises grátis</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-[#6B8C49]" /> Sem cartão de crédito</div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problema" className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#14151C] mb-6 leading-tight">
                O problema não é falta de leads de energia solar. <span className="text-[#6B8C49]">É visita errada.</span>
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Consultores solares recebem leads todos os dias do Instagram, tráfego pago e indicações. Mas só descobrem se o telhado é realmente viável quando já estão no local.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-700 font-medium bg-[#F8FAFC] p-3 rounded-xl border border-slate-200">
                  <span className="text-xl">😩</span> Visitas improdutivas debaixo de sol
                </div>
                <div className="flex items-center gap-3 text-slate-700 font-medium bg-[#F8FAFC] p-3 rounded-xl border border-slate-200">
                  <span className="text-xl">💸</span> Gasolina e tempo desperdiçados no trânsito
                </div>
                <div className="flex items-center gap-3 text-slate-700 font-medium bg-[#F8FAFC] p-3 rounded-xl border border-slate-200">
                  <span className="text-xl">📉</span> Baixa taxa de fechamento por inviabilidade do local
                </div>
                <div className="flex items-center gap-3 text-slate-700 font-medium bg-[#F8FAFC] p-3 rounded-xl border border-slate-200">
                  <span className="text-xl">😮‍💨</span> Desgaste comercial e desmotivação nas vendas
                </div>
              </div>
            </div>
            <div className="bg-[#14151C] text-white p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px]" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-[#D0F252] mb-4">O gargalo não é marketing.</h3>
                <p className="text-3xl font-light text-white leading-snug">É a falta de um <strong className="font-bold">filtro técnico</strong> antes de sair de casa.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 bg-[#F8FAFC] relative border-y border-[#6B8C49]/10">
        <div className="container mx-auto px-4 text-center max-w-3xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#14151C] mb-6">Filtro Satelital de Viabilidade Técnica</h2>
          <p className="text-lg text-slate-600">O Xpect Solar analisa automaticamente o telhado do seu lead usando dados satelitais reais. Antes da visita, você já sabe:</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
          <FeatureCard icon={<MapPin />} title="Área Útil Estimada" desc="Aproximação da área do telhado livre para instalação de painéis." />
          <FeatureCard icon={<Zap />} title="Nível de Irradiância" desc="Capacidade de captação solar anual no exato local do lead." />
          <FeatureCard icon={<ShieldCheck />} title="Potência (kWp)" desc="Cálculo do sistema referencial estimado para a necessidade." />
          <FeatureCard icon={<BarChart3 />} title="Economia Mensal" desc="Projeção financeira e economia aproximada no bolso do cliente." />
          <FeatureCard icon={<Clock />} title="Payback Estimado" desc="Tempo para retorno do investimento sobre a instalação." />
          <FeatureCard icon={<Target />} title="Score Técnico A/B/C" desc="Nota unificada para você priorizar os melhores telhados." />
        </div>

        <div className="text-center mt-12 px-4">
          <p className="text-xl font-medium text-[#14151C] bg-white inline-block px-8 py-4 rounded-full shadow-sm border border-[#6B8C49]/20">
            Você decide com base técnica. Não no achismo.
          </p>
        </div>
      </section>

      {/* How it Works / Steps */}
      <section id="como-funciona" className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#14151C] mb-16">Como funciona</h2>

          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#6B8C49]/5 before:via-[#6B8C49] before:to-[#6B8C49]/5">

            {/* Step 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-[#14151C] text-[#D0F252] font-bold text-xl shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 absolute left-0 md:left-1/2">
                1
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] ml-auto md:ml-0 p-6 rounded-2xl bg-[#F8FAFC] border border-[#6B8C49]/10 shadow-sm">
                <h3 className="font-bold text-xl text-[#14151C] mb-2">O cliente preenche o simulador</h3>
                <p className="text-slate-600">O cliente acessa seu link exclusivo e informa: Nome, endereço e valor médio da conta de luz. <strong className="text-[#14151C] bg-[#6B8C49]/10 px-1 rounded">Ele recebe um simulador só para ele, gerando respostas precisas exclusivas para o seu telhado.</strong></p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-[#14151C] text-[#D0F252] font-bold text-xl shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 absolute left-0 md:left-1/2">
                2
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] ml-auto md:ml-0 p-6 rounded-2xl bg-[#F8FAFC] border border-[#6B8C49]/10 shadow-sm">
                <h3 className="font-bold text-xl text-[#14151C] mb-2">O Xpect analisa o telhado via satélite</h3>
                <p className="text-slate-600">Geolocalização precisa e análise técnica automatizada através de motores de processamento em nuvem.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-[#D0F252] text-[#14151C] font-bold text-xl shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 absolute left-0 md:left-1/2">
                3
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] ml-auto md:ml-0 p-6 rounded-2xl bg-[#14151C] text-white border border-[#6B8C49] shadow-lg shadow-[#6B8C49]/20">
                <h3 className="font-bold text-xl text-[#D0F252] mb-2">Diagnóstico no seu dashboard</h3>
                <p className="text-slate-300">Você recebe o score claro e uma recomendação objetiva. Decisão totalmente segura e embasada antes da visita.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-[#14151C] text-[#D0F252] font-bold text-xl shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 absolute left-0 md:left-1/2">
                4
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] ml-auto md:ml-0 p-6 rounded-2xl bg-[#F8FAFC] border border-[#6B8C49]/10 shadow-sm">
                <h3 className="font-bold text-xl text-[#14151C] mb-2">Você economiza tempo</h3>
                <p className="text-slate-600">E tempo não é só dinheiro, é <strong className="text-[#6B8C49] bg-[#6B8C49]/10 px-1 rounded">qualidade de vida</strong>.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Target Audience / Identity */}
      <section className="py-24 bg-[#14151C] text-white relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#6B8C49] rounded-full blur-[100px] opacity-20" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold">O que você ganha</h2>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-lg text-slate-300">
                  <CheckCircle2 className="text-[#D0F252] shrink-0" size={24} /> Redução de visitas improdutivas
                </li>
                <li className="flex items-center gap-3 text-lg text-slate-300">
                  <CheckCircle2 className="text-[#D0F252] shrink-0" size={24} /> Foco nos leads com maior probabilidade técnica
                </li>
                <li className="flex items-center gap-3 text-lg text-slate-300">
                  <CheckCircle2 className="text-[#D0F252] shrink-0" size={24} /> Melhor uso do seu tempo comercial
                </li>
                <li className="flex items-center gap-3 text-lg text-slate-300">
                  <CheckCircle2 className="text-[#D0F252] shrink-0" size={24} /> Aumento da taxa de fechamento
                </li>
              </ul>
              <div className="pt-6 border-t border-slate-700">
                <p className="text-[#79F28B] font-medium text-lg border border-[#79F28B]/20 p-4 rounded-xl inline-block bg-[#79F28B]/10">
                  Não é um CRM. Não é um gerador de leads.<br />
                  <span className="text-white">É um <strong className="font-bold text-white">filtro técnico</strong> de viabilidade para energia solar.</span>
                </p>
              </div>
            </div>

            <div className="bg-[#EEF2DC]/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#6B8C49] rounded-xl flex items-center justify-center">
                  <Users className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold">Para quem é?</h3>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="bg-[#14151C] p-4 rounded-xl border border-white/10 font-medium text-slate-200 shadow-inner">
                  Consultores individuais de energia solar
                </li>
                <li className="bg-[#14151C] p-4 rounded-xl border border-white/10 font-medium text-slate-200 shadow-inner">
                  Pequenas integradoras
                </li>
              </ul>
              <p className="text-slate-400 text-center text-sm">
                Profissionais que buscam conversão baseada em <strong className="text-white font-bold">dados precisos</strong>.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-24 relative bg-[url('/bg-pricing.png')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-white/70"></div>
        <div className="container mx-auto px-4 max-w-lg relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#14151C] mb-4">Simples e direto.</h2>
            <p className="text-slate-800 font-medium">Sem contrato. Sem complicação.</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-[#6B8C49]/20 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#6B8C49] to-[#D0F252]" />
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-[#6B8C49] uppercase tracking-wider mb-2">Plano Essencial</h3>
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-start justify-center text-[#14151C] tracking-tight">
                  <span className="text-3xl font-bold mt-2 mr-2">R$</span>
                  <span className="text-8xl font-black">97</span>
                </div>
                <div className="text-slate-500 font-medium mt-1">por mês (ou R$ 999 / ano)</div>
              </div>
            </div>

            <ul className="space-y-4 mb-10">
              <li className="flex gap-3 text-slate-700">
                <CheckCircle2 size={20} className="text-[#6B8C49] shrink-0 mt-0.5" />
                <span><strong className="text-[#14151C]">Simulador de link personalizado:</strong> crie um simulador para divulgar e captar seus leads.</span>
              </li>
              <li className="flex gap-3 text-slate-700">
                <CheckCircle2 size={20} className="text-[#6B8C49] shrink-0 mt-0.5" />
                <span><strong className="text-[#14151C]">Filtro satelital técnico:</strong> use o seu dashboard para fazer avaliações com base em satélite para decidir quem visitar aumentando seus acertos e contratos assinados.</span>
              </li>
              <li className="flex gap-3 text-slate-700">
                <CheckCircle2 size={20} className="text-[#6B8C49] shrink-0 mt-0.5" />
                <span><strong className="text-[#14151C]">Dashboard completo:</strong> saiba tudo que acontece com seus prospectos e pare de arriscar e contar somente com a sorte.</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700 font-bold bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0]">
                <CheckCircle2 size={20} className="text-[#6B8C49] shrink-0" /> 2 análises gratuitas para teste
              </li>
            </ul>

            <Link href="/register" className="w-full h-14 flex items-center justify-center bg-[#14151C] hover:bg-black text-white font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Começar agora
            </Link>
            <p className="text-center text-sm mt-4 text-slate-600 font-medium">Crie sua conta gratuita e faça <strong className="text-[#14151C]">dois testes grátis</strong> para constatar que vale a pena!</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#14151C] mb-4">Perguntas Frequentes (FAQ)</h2>
          </div>

          <div className="space-y-4">
            <FaqItem
              question="Como funciona a análise satelital?"
              answer="O Xpect utiliza dados geoespaciais e APIs especializadas para estimar área útil, irradiância e potencial de geração do telhado."
            />
            <FaqItem
              question="Funciona em qualquer cidade?"
              answer="Funciona nas regiões cobertas pelas APIs de dados solares (Ampla cobertura em locais urbanos)."
            />
            <FaqItem
              question="A ferramenta substitui a visita técnica?"
              answer={<>Não. Ele filtra previamente a viabilidade técnica para você <strong className="text-[#6B8C49] bg-[#6B8C49]/10 px-1.5 py-0.5 rounded-md">decidir se a visita comercial e/ou técnica de ponta vale a pena</strong>.</>}
            />
            <FaqItem
              question="É um CRM?"
              answer="Não. É um filtro técnico de leads para energia solar. O foco é qualificar o lead geograficamente."
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-[#6B8C49] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D0F252] rounded-full blur-[120px] opacity-20 -mr-40" />
        <div className="container mx-auto px-4 text-center max-w-3xl relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Evite a próxima visita improdutiva.</h2>
          <p className="text-xl text-[#F8FAFC] mb-10">Descubra agora se o lead de energia solar realmente vale sua visita.</p>
          <Link href="/register" className="h-16 inline-flex px-10 rounded-full bg-[#14151C] hover:bg-white text-white hover:text-[#14151C] font-bold items-center gap-3 text-xl shadow-2xl transition-all hover:-translate-y-1">
            Começar Agora <ArrowRight strokeWidth={2.5} size={24} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#14151C] py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500">
          <div className="flex items-center">
            <Image src="/logo.svg" alt="Xpect Solar" width={140} height={32} className="h-8 w-auto brightness-0 invert opacity-80 hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-sm border-l border-white/10 pl-4">Filtro Técnico Satelital para energia solar.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-2xl bg-[#14151C] border border-white/5 shadow-lg shadow-[#14151C]/10 hover:shadow-[0_0_25px_rgba(208,242,82,0.2)] hover:border-[#D0F252]/30 transition-all duration-300 relative overflow-hidden group">
      <div className="w-12 h-12 rounded-xl bg-[#2A2B36] text-[#D0F252] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#D0F252] group-hover:text-[#14151C] transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string, answer: React.ReactNode }) {
  return (
    <div className="border border-[#6B8C49]/20 rounded-2xl p-6 bg-[#F8FAFC] hover:bg-slate-50 transition-colors">
      <h3 className="text-lg font-bold text-[#14151C] mb-2">{question}</h3>
      <div className="text-slate-600 leading-relaxed">{answer}</div>
    </div>
  );
}
