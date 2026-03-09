"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Script from "next/script"; // Added Script import
import {
    Zap, Calculator, CheckCircle2, Phone,
    ArrowRight, ArrowLeft, Building2, Home as HomeIcon,
    PanelsTopLeft, TrendingUp,
    Leaf, ShieldCheck, AreaChart, DollarSign, Calendar,
    Sun, Loader2, MapPin
} from "lucide-react";

type FunnelStep = "lead" | "location" | "loading" | "result";

const TARIFAS: Record<string, { tarifa: number; distribuidora: string }> = {
    AC: { tarifa: 0.89, distribuidora: "Energisa Acre" },
    AL: { tarifa: 0.87, distribuidora: "Equatorial Alagoas" },
    AM: { tarifa: 0.79, distribuidora: "Amazonas Energia" },
    AP: { tarifa: 0.72, distribuidora: "CEA Equatorial" },
    BA: { tarifa: 0.81, distribuidora: "Coelba / Neoenergia Bahia" },
    CE: { tarifa: 0.83, distribuidora: "Enel Ceará" },
    DF: { tarifa: 0.71, distribuidora: "CEB Distribuição" },
    ES: { tarifa: 0.74, distribuidora: "EDP Espírito Santo" },
    GO: { tarifa: 0.72, distribuidora: "Enel Goiás" },
    MA: { tarifa: 0.85, distribuidora: "Equatorial Maranhão" },
    MG: { tarifa: 0.77, distribuidora: "CEMIG Distribuição" },
    MS: { tarifa: 0.73, distribuidora: "Energisa Mato Grosso do Sul" },
    MT: { tarifa: 0.79, distribuidora: "Energisa Mato Grosso" },
    PA: { tarifa: 0.81, distribuidora: "Equatorial Pará" },
    PB: { tarifa: 0.83, distribuidora: "Energisa Paraíba" },
    PE: { tarifa: 0.86, distribuidora: "Neoenergia Pernambuco" },
    PI: { tarifa: 0.88, distribuidora: "Equatorial Piauí" },
    PR: { tarifa: 0.68, distribuidora: "Copel Distribuição" },
    RJ: { tarifa: 0.91, distribuidora: "Enel Rio" },
    RN: { tarifa: 0.82, distribuidora: "Cosern / Neoenergia RN" },
    RO: { tarifa: 0.76, distribuidora: "Energisa Rondônia" },
    RR: { tarifa: 0.67, distribuidora: "Roraima Energia" },
    RS: { tarifa: 0.70, distribuidora: "RGE Sul / CPFL" },
    SC: { tarifa: 0.69, distribuidora: "Celesc Distribuição" },
    SC_ESTADO: { tarifa: 0.69, distribuidora: "Celesc Distribuição" }, // Alias for easier mapping
    SE: { tarifa: 0.84, distribuidora: "Energisa Sergipe" },
    SP: { tarifa: 0.77, distribuidora: "Enel SP / CPFL Paulista" },
    TO: { tarifa: 0.78, distribuidora: "Energisa Tocantins" }
};

const ESTADOS_MAP: Record<string, string> = {
    AC: 'Acre', AL: 'Alagoas', AM: 'Amazonas', AP: 'Amapá', BA: 'Bahia',
    CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás',
    MA: 'Maranhão', MG: 'Minas Gerais', MS: 'Mato Grosso do Sul', MT: 'Mato Grosso',
    PA: 'Pará', PB: 'Paraíba', PE: 'Pernambuco', PI: 'Piauí', PR: 'Paraná',
    RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RO: 'Rondônia', RR: 'Roraima',
    RS: 'Rio Grande do Sul', SC: 'Santa Catarina', SE: 'Sergipe', SP: 'São Paulo',
    TO: 'Tocantins'
};

const CIDADES: Record<string, string[]> = {
    AC: ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira"],
    AL: ["Maceió", "Arapiraca", "Palmeira dos Índios"],
    AM: ["Manaus", "Parintins", "Itacoatiara"],
    BA: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Juazeiro", "Barreiras"],
    CE: ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Sobral"],
    DF: ["Brasília", "Ceilândia", "Taguatinga"],
    ES: ["Vitória", "Vila Velha", "Serra", "Linhares"],
    GO: ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde"],
    MA: ["São Luís", "Imperatriz", "Timon"],
    MG: ["Belo Horizonte", "Uberlândia", "Contagem", "Belo Horizonte", "Uberaba"],
    MS: ["Campo Grande", "Dourados", "Três Lagoas"],
    MT: ["Cuiabá", "Várzea Grande", "Rondonópolis"],
    PA: ["Belém", "Ananindeua", "Santarém"],
    PB: ["João Pessoa", "Campina Grande", "Patos"],
    PE: ["Recife", "Caruaru", "Olinda", "Petrolina"],
    PI: ["Teresina", "Parnaíba", "Picos"],
    PR: ["Curitiba", "Londrina", "Maringá", "Cascavel"],
    RJ: ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Niterói", "Campos"],
    RN: ["Natal", "Mossoró", "Parnamirim", "Caicó", "Macaíba"],
    RO: ["Porto Velho", "Ji-Paraná", "Ariquemes"],
    RS: ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas"],
    SC: ["Florianópolis", "Joinville", "Blumenau", "Itajaí"],
    SP: ["São Paulo", "Guarulhos", "Campinas", "Sorocaba", "Ribeirão Preto", "Santos"],
    TO: ["Palmas", "Araguaína", "Gurupi"]
};

interface CalculationResults {
    economiaMensal: number;
    economiaAnual: number;
    paybackAnos: string;
    valorProjeto: number;
    numPlacas: number;
    potenciaReal: string;
    areaTelhado: string;
    geracaoMensal: number;
    economiaTotal25: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    solarData?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    locationData?: any;
    lat?: number;
    lng?: number;
}

export default function PublicSimulator() {
    const params = useParams();
    const slug = params?.id as string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [consultant, setConsultant] = useState<any>(null);
    const [loadingConsultant, setLoadingConsultant] = useState(true);

    const [step, setStep] = useState<FunnelStep>("lead");
    const [formData, setFormData] = useState({
        name: "",
        type: "domiciliar",
        companyName: "",
        email: "",
        phone: "",
        cep: "",
        rua: "",
        numeroCasa: "",
        complemento: "",
        estado: "",
        cidade: "",
        consumo: "350",
        lat: 0 as number,
        lng: 0 as number
    });

    const [mapReady, setMapReady] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInitialized = useRef(false);

    const [results, setResults] = useState<CalculationResults | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const openMap = async () => {
        setIsGeocoding(true);
        const addressString = `${formData.rua}, ${formData.numeroCasa}, ${formData.cidade} - ${formData.estado}, ${formData.cep}, Brasil`;
        try {
            const res = await fetch("/api/geocode", {
                method: "POST",
                body: JSON.stringify({ address: addressString }),
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();
            if (data.success) {
                updateData('lat', data.location.lat);
                updateData('lng', data.location.lng);
                setShowMap(true);
            }
        } catch (e) {
            console.error(e);
        }
        setIsGeocoding(false);
    };

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (showMap && mapReady && mapRef.current && (window as any).google && !mapInitialized.current) {
            mapInitialized.current = true;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const google = (window as any).google;
            const map = new google.maps.Map(mapRef.current, {
                center: { lat: formData.lat, lng: formData.lng },
                zoom: 19,
                mapTypeId: 'satellite',
                disableDefaultUI: true,
                zoomControl: true
            });
            const marker = new google.maps.Marker({
                position: { lat: formData.lat, lng: formData.lng },
                map,
                draggable: true,
                title: "Arraste para o seu telhado",
                animation: google.maps.Animation.DROP,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            marker.addListener("dragend", (e: any) => {
                updateData('lat', e.latLng.lat());
                updateData('lng', e.latLng.lng());
            });
        }
    }, [showMap, mapReady, formData.lat, formData.lng]);

    useEffect(() => {
        if (!slug) return;
        const fetchConsultant = async () => {
            setLoadingConsultant(true);
            const { data, error } = await supabase.from('consultants').select('*').eq('slug', slug).single();
            if (data && !error) {
                setConsultant(data);
            }
            setLoadingConsultant(false);
        };
        fetchConsultant();
    }, [slug]);

    if (loadingConsultant) {
        return (
            <div className="min-h-screen bg-[#F4F9F1] flex flex-col items-center justify-center space-y-4">
                <Loader2 size={40} className="animate-spin text-[#2ECC8C]" />
                <p className="text-[#1A4A38] font-bold">Carregando simulador do consultor...</p>
            </div>
        );
    }

    if (!consultant) {
        return (
            <div className="min-h-screen bg-[#F4F9F1] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6 text-red-500">
                    <span className="font-black text-3xl">!</span>
                </div>
                <h1 className="text-2xl font-black text-[#111F18] font-['Space_Grotesk'] mb-2">Simulador Indisponível</h1>
                <p className="text-[#1A4A38] opacity-80 mb-8 max-w-sm">O link da página <b>{slug}</b> que você tentou acessar não está vinculado a nenhum consultor ativo.</p>
                <button onClick={() => window.location.href = '/'} className="px-6 py-3 bg-[#111F18] text-[#D4E44A] rounded-xl font-bold hover:bg-black transition-colors">Voltar para a Home</button>
            </div>
        );
    }

    const updateData = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Limpa erro ao digitar
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handlePhoneChange = (val: string) => {
        const raw = val.replace(/\D/g, '').slice(0, 11);
        let formatted = raw;
        if (raw.length > 2) {
            formatted = `(${raw.slice(0, 2)}) ` + raw.slice(2);
        }
        if (raw.length > 7) {
            formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
        }
        updateData("phone", formatted);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const calculateResults = (solarData: any = null, locationData: any = null) => {
        const consumo = Number(formData.consumo);
        const tarifa = TARIFAS[formData.estado]?.tarifa || 0.82;

        // Simulação de cálculo técnica (baseada no script.js fornecido)
        const horasSolPico = 4.5;
        const perdaSistema = 0.20;
        const potenciaPlaca = 0.56;
        const areaPlaca = 2.6;
        const precoPorKwp = 2500;
        const reajusteAnualEnergia = 0.08;

        const consumoCompensavel = consumo * 0.95;
        const potenciaSistema = consumoCompensavel / (horasSolPico * 30 * (1 - perdaSistema));
        let numPlacas = Math.ceil(potenciaSistema / potenciaPlaca);

        // Ajuste pelo Google Solar
        if (solarData && solarData.solarPotential) {
            const maxPanels = solarData.solarPotential.maxArrayPanelsCount;
            if (maxPanels && numPlacas > maxPanels) {
                numPlacas = maxPanels;
            }
        }

        const potenciaReal = numPlacas * potenciaPlaca;
        const areaTelhado = numPlacas * areaPlaca;
        const geracaoMensal = potenciaReal * horasSolPico * 30 * (1 - perdaSistema);
        const valorProjeto = potenciaReal * precoPorKwp;
        const contaAtual = consumo * tarifa;

        // Economia mensal garantindo economia de ~95%
        const economiaMensal = contaAtual * 0.93;
        const paybackAnos = valorProjeto / (economiaMensal * 12);

        let economiaTotal25 = 0;
        let economiaAcumuladaAnual = economiaMensal * 12;
        for (let ano = 1; ano <= 25; ano++) {
            economiaTotal25 += economiaAcumuladaAnual;
            economiaAcumuladaAnual *= (1 + reajusteAnualEnergia);
        }

        const newResults: CalculationResults = {
            economiaMensal,
            economiaAnual: economiaMensal * 12,
            paybackAnos: paybackAnos.toFixed(1),
            valorProjeto,
            numPlacas,
            potenciaReal: potenciaReal.toFixed(2),
            areaTelhado: areaTelhado.toFixed(1),
            geracaoMensal: Math.round(geracaoMensal),
            economiaTotal25,
            solarData,
            locationData
        };

        setResults(newResults);
        return newResults;
    };

    const validateLead = () => {
        const newErrors: Record<string, string> = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name.trim() || formData.name.trim().length < 3) {
            newErrors.name = "Informe seu nome completo.";
        }

        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Informe um e-mail válido (ex: nome@servidor.com).";
        }

        // (00) 00000-0000 has 15 characters
        if (formData.phone.length < 15) {
            newErrors.phone = "Informe o WhatsApp completo com DDD.";
        }

        if (formData.type === 'empresarial' && (!formData.companyName.trim() || formData.companyName.trim().length < 2)) {
            newErrors.companyName = "Informe o nome da empresa.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const saveLead = async (resultsData: CalculationResults) => {
        if (!consultant?.id) return;

        try {
            const { error } = await supabase.from('leads').insert({
                consultant_id: consultant.id,
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                city_state: `${formData.cidade} - ${formData.estado}`,
                monthly_bill: Number(formData.consumo) * (TARIFAS[formData.estado]?.tarifa || 0.82),
                solar_potential: Number(resultsData.geracaoMensal),
                estimated_capex: resultsData.valorProjeto,
                estimated_savings: resultsData.economiaMensal,
                score: Number(resultsData.economiaMensal) > 500 ? 'A' : (Number(resultsData.economiaMensal) > 200 ? 'B' : 'C'),
                status: 'Novo',
                simulation_data: {
                    type: formData.type,
                    companyName: formData.companyName,
                    cep: formData.cep,
                    numeroCasa: formData.numeroCasa,
                    consumo_kwh: formData.consumo,
                    num_placas: resultsData.numPlacas,
                    potencia: resultsData.potenciaReal,
                    google_solar_available: !!resultsData.solarData,
                    location: resultsData.locationData || null,
                    lat: formData.lat || null,
                    lng: formData.lng || null
                }
            });

            if (error) throw error;
            console.log("Lead capturado com sucesso!");
        } catch (err) {
            console.error("Erro ao salvar lead:", err);
        }
    };

    const handleNext = async () => {
        if (step === "lead") {
            if (validateLead()) setStep("location");
        }
        else if (step === "location") {
            if (!formData.estado || !formData.cidade || !formData.cep || !formData.rua || !formData.numeroCasa) {
                setErrors({ location: "Preencha todos os campos corretamente para continuar." });
                return;
            }
            setStep("loading");

            try {
                const addressString = `${formData.rua}, ${formData.numeroCasa}, ${formData.cidade} - ${formData.estado}, ${formData.cep}, Brasil`;
                const payload = formData.lat && formData.lng
                    ? { address: addressString, lat: formData.lat, lng: formData.lng }
                    : { address: addressString };

                const res = await fetch("/api/simulate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                let solarData = null;
                let locationData = null;

                if (res.ok) {
                    const data = await res.json();
                    solarData = data.solarData;
                    locationData = data.location;
                }

                const calculatedResults = calculateResults(solarData, locationData);
                setResults(calculatedResults);
                await saveLead(calculatedResults);
                setStep("result");

            } catch (err) {
                console.error("Erro na simulação Solar API:", err);
                const calculatedResults = calculateResults();
                setResults(calculatedResults);
                await saveLead(calculatedResults);
                setStep("result");
            }
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    };

    return (
        <div className="min-h-screen bg-[#F4F9F1] font-sans selection:bg-[#D4E44A]/30 flex flex-col items-center">
            {/* Maps API Script */}
            <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
                strategy="lazyOnload"
                onLoad={() => setMapReady(true)}
            />

            {/* Header / Branding do Consultor */}
            <div className="w-full max-w-4xl mx-auto px-4 pt-6">
                <div className="bg-[#111F18] rounded-[32px] p-6 text-center relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Decorative gradients */}
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#2ECC8C] rounded-full blur-[80px] opacity-[0.08] -mr-32 -mt-32 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#D4E44A] rounded-full blur-[60px] opacity-[0.05] -ml-20 -mb-20 pointer-events-none" />

                    <div className="relative z-10 flex items-center gap-3 shrink-0 bg-[#1A4A38]/30 px-5 py-3 rounded-2xl border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1A4A38] to-[#2ECC8C]/20 border border-white/10 shadow-2xl flex items-center justify-center pointer-events-none">
                            <Zap size={16} className="text-[#2ECC8C] drop-shadow-[0_0_8px_rgba(46,204,140,0.5)]" fill="currentColor" />
                        </div>
                        <h1 className="text-sm md:text-base font-bold text-white tracking-tight">
                            Saiba quanto você pode <span className="text-[#D4E44A]">economizar...</span>
                        </h1>
                    </div>

                    <div className="relative z-10 flex items-center gap-4 px-4 py-2 bg-gradient-to-r from-white/5 to-transparent border border-white/10 rounded-full backdrop-blur-sm shadow-xl shadow-black/20 shrink-0">
                        <div className="w-10 h-10 rounded-full bg-[#D4E44A] flex items-center justify-center shadow-lg border-2 border-white/20 overflow-hidden shrink-0">
                            {consultant.avatar_url ? (
                                <Image
                                    src={consultant.avatar_url}
                                    alt={consultant.full_name}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="font-black text-[#111F18] text-sm">{consultant.full_name.substring(0, 2).toUpperCase()}</span>
                            )}
                        </div>
                        <div className="text-left flex items-center gap-2">
                            <p className="text-[10px] sm:text-xs font-bold text-[#6B8F72] uppercase tracking-tighter opacity-90 leading-none">Oferecido por</p>
                            <p className="text-sm sm:text-base font-black text-white tracking-wide leading-none">{consultant.full_name}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-4xl mx-auto px-4 mt-6 pb-20">
                {/* Step Content */}
                <div className="bg-white rounded-[32px] shadow-2xl shadow-[#111F18]/5 border border-[#D8EDD5] overflow-hidden">

                    {step === "lead" && (
                        <div className="p-8 md:p-12 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center space-y-3">
                                <div className="inline-flex items-center px-3 py-1 bg-[#EEF2DC] text-[#1A4A38] text-[10px] font-bold tracking-widest uppercase rounded-full">Simulador de consumo</div>
                                <h2 className="text-3xl font-black text-[#111F18] font-['Space_Grotesk'] leading-tight">Calcule a sua economia na conta de energia 👇</h2>
                                <p className="text-[#6B8F72] font-medium">Preencha seus dados para liberar a simulação gratuita</p>
                            </div>

                            <div className="space-y-6">
                                {/* Radio Group Type */}
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`cursor-pointer group flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${formData.type === 'domiciliar' ? 'border-[#2ECC8C] bg-[#2ECC8C]/5' : 'border-[#F4F9F1] bg-[#F4F9F1]/50 hover:border-slate-200'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${formData.type === 'domiciliar' ? 'bg-[#2ECC8C] text-white' : 'bg-white text-[#6B8F72]'}`}>
                                                <HomeIcon size={20} />
                                            </div>
                                            <span className={`font-bold transition-colors ${formData.type === 'domiciliar' ? 'text-[#111F18]' : 'text-[#6B8F72]'}`}>Residencial</span>
                                        </div>
                                        <input type="radio" className="hidden" name="type" onClick={() => updateData('type', 'domiciliar')} />
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.type === 'domiciliar' ? 'border-[#2ECC8C]' : 'border-slate-300'}`}>
                                            {formData.type === 'domiciliar' && <div className="w-2.5 h-2.5 bg-[#2ECC8C] rounded-full" />}
                                        </div>
                                    </label>
                                    <label className={`cursor-pointer group flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${formData.type === 'empresarial' ? 'border-[#2ECC8C] bg-[#2ECC8C]/5' : 'border-[#F4F9F1] bg-[#F4F9F1]/50 hover:border-slate-200'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${formData.type === 'empresarial' ? 'bg-[#2ECC8C] text-white' : 'bg-white text-[#6B8F72]'}`}>
                                                <Building2 size={20} />
                                            </div>
                                            <span className={`font-bold transition-colors ${formData.type === 'empresarial' ? 'text-[#111F18]' : 'text-[#6B8F72]'}`}>Empresarial</span>
                                        </div>
                                        <input type="radio" className="hidden" name="type" onClick={() => updateData('type', 'empresarial')} />
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.type === 'empresarial' ? 'border-[#2ECC8C]' : 'border-slate-300'}`}>
                                            {formData.type === 'empresarial' && <div className="w-2.5 h-2.5 bg-[#2ECC8C] rounded-full" />}
                                        </div>
                                    </label>
                                </div>

                                <div className="space-y-5">
                                    {formData.type === 'empresarial' && (
                                        <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                                            <label className="text-[13px] font-bold text-[#111F18] ml-1">Nome da empresa</label>
                                            <input
                                                type="text"
                                                placeholder="Sua empresa"
                                                className={`w-full bg-[#f1f8ee] border-2 px-5 py-4 rounded-2xl focus:bg-white focus:outline-none transition-all font-medium text-[#111F18] placeholder:text-[#6B8F72]/40 ${errors.companyName ? 'border-red-500 shadow-sm shadow-red-100' : 'border-transparent focus:border-[#2ECC8C]/30'}`}
                                                value={formData.companyName}
                                                onChange={(e) => updateData('companyName', e.target.value)}
                                            />
                                            {errors.companyName && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1 animate-in fade-in slide-in-from-left-2 duration-300">{errors.companyName}</p>}
                                        </div>
                                    )}
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-bold text-[#111F18] ml-1">Seu nome</label>
                                        <input
                                            type="text"
                                            placeholder="Seu nome"
                                            className={`w-full bg-[#f1f8ee] border-2 px-5 py-4 rounded-2xl focus:bg-white focus:outline-none transition-all font-medium text-[#111F18] placeholder:text-[#6B8F72]/40 ${errors.name ? 'border-red-500 shadow-sm shadow-red-100' : 'border-transparent focus:border-[#2ECC8C]/30'}`}
                                            value={formData.name}
                                            onChange={(e) => updateData('name', e.target.value)}
                                        />
                                        {errors.name && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1 animate-in fade-in slide-in-from-left-2 duration-300">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-bold text-[#111F18] ml-1">E-mail</label>
                                        <input
                                            type="email"
                                            placeholder="seu@email.com"
                                            className={`w-full bg-[#f1f8ee] border-2 px-5 py-4 rounded-2xl focus:bg-white focus:outline-none transition-all font-medium text-[#111F18] placeholder:text-[#6B8F72]/40 ${errors.email ? 'border-red-500 shadow-sm shadow-red-100' : 'border-transparent focus:border-[#2ECC8C]/30'}`}
                                            value={formData.email}
                                            onChange={(e) => updateData('email', e.target.value)}
                                        />
                                        {errors.email && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1 animate-in fade-in slide-in-from-left-2 duration-300">{errors.email}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-bold text-[#111F18] ml-1">WhatsApp</label>
                                        <div className="flex gap-2">
                                            <div className="flex items-center gap-2 bg-[#f1f8ee] px-4 py-4 rounded-2xl font-bold text-[#6B8F72] text-sm">
                                                <Image
                                                    src="https://flagcdn.com/w20/br.png"
                                                    alt="BR"
                                                    width={20}
                                                    height={15}
                                                    className="w-5 h-auto rounded-sm"
                                                />
                                                +55
                                            </div>
                                            <input
                                                type="tel"
                                                placeholder="(00) 00000-0000"
                                                className={`flex-1 bg-[#f1f8ee] border-2 px-5 py-4 rounded-2xl focus:bg-white focus:outline-none transition-all font-medium text-[#111F18] placeholder:text-[#6B8F72]/40 ${errors.phone ? 'border-red-500 shadow-sm shadow-red-100' : 'border-transparent focus:border-[#2ECC8C]/30'}`}
                                                value={formData.phone}
                                                onChange={(e) => handlePhoneChange(e.target.value)}
                                            />
                                        </div>
                                        {errors.phone && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1 animate-in fade-in slide-in-from-left-2 duration-300">{errors.phone}</p>}
                                    </div>
                                </div>

                                <div className="pt-4 space-y-4">
                                    <button
                                        onClick={handleNext}
                                        className="w-full bg-[#D4E44A] hover:bg-[#C0CF33] text-[#111F18] py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#D4E44A]/25 group"
                                    >
                                        Ver minha simulação grátis <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <p className="text-[12px] text-[#6B8F72] text-center font-medium flex items-center justify-center gap-2">
                                        <span className="text-base">🔒</span> Seus dados não serão compartilhados. Sem spam.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === "location" && (
                        <div className="p-8 md:p-12 space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <div className="text-center space-y-3">
                                <div className="inline-flex items-center px-3 py-1 bg-[#EEF2DC] text-[#1A4A38] text-[10px] font-bold tracking-widest uppercase rounded-full">ETAPA 2 DE 3</div>
                                <h2 className="text-3xl font-bold text-[#111F18] font-['Space_Grotesk']">Onde fica o imóvel?</h2>
                                <p className="text-[#6B8F72] max-w-md mx-auto">Usamos a tarifa oficial da distribuidora local para calcular sua economia exata.</p>
                            </div>

                            <div className="space-y-6">
                                {errors.location && (
                                    <div className="bg-red-50 text-red-500 font-bold p-3 rounded-xl text-center text-sm border border-red-100">
                                        {errors.location}
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#111F18] ml-1">CEP*</label>
                                        <input
                                            type="text"
                                            placeholder="00000-000"
                                            value={formData.cep}
                                            onChange={async (e) => {
                                                const raw = e.target.value.replace(/\D/g, '').slice(0, 8);
                                                const formatted = raw.length > 5 ? `${raw.slice(0, 5)}-${raw.slice(5)}` : raw;
                                                updateData('cep', formatted);

                                                if (raw.length === 8) {
                                                    try {
                                                        const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
                                                        const data = await res.json();
                                                        if (!data.erro) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                rua: data.logradouro || '',
                                                                estado: data.uf || prev.estado,
                                                                cidade: data.localidade || prev.cidade
                                                            }));
                                                            setErrors(prev => {
                                                                const newErrors = { ...prev };
                                                                delete newErrors.location;
                                                                return newErrors;
                                                            });
                                                        }
                                                    } catch (err) {
                                                        console.error("Erro ao buscar CEP", err);
                                                    }
                                                }
                                            }}
                                            className="w-full bg-[#f8faf7] border-2 border-slate-100 px-4 py-3.5 rounded-xl focus:bg-white focus:outline-none focus:border-[#2ECC8C] transition-all font-medium text-[#111F18]"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-bold text-[#111F18] ml-1">Rua*</label>
                                        <input
                                            type="text"
                                            placeholder="Nome da rua"
                                            value={formData.rua}
                                            onChange={(e) => updateData('rua', e.target.value)}
                                            className="w-full bg-[#f8faf7] border-2 border-slate-100 px-4 py-3.5 rounded-xl focus:bg-white focus:outline-none focus:border-[#2ECC8C] transition-all font-medium text-[#111F18]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#111F18] ml-1">Número*</label>
                                        <input
                                            type="text"
                                            placeholder="Número ou S/N"
                                            value={formData.numeroCasa}
                                            onChange={(e) => updateData('numeroCasa', e.target.value)}
                                            className="w-full bg-[#f8faf7] border-2 border-slate-100 px-4 py-3.5 rounded-xl focus:bg-white focus:outline-none focus:border-[#2ECC8C] transition-all font-medium text-[#111F18]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#111F18] ml-1">Complemento (Opcional)</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Condomínio, Lote 4, Bloco B"
                                            value={formData.complemento}
                                            onChange={(e) => updateData('complemento', e.target.value)}
                                            className="w-full bg-[#f8faf7] border-2 border-slate-100 px-4 py-3.5 rounded-xl focus:bg-white focus:outline-none focus:border-[#2ECC8C] transition-all font-medium text-[#111F18]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#111F18] ml-1">Estado (UF)*</label>
                                        <select
                                            value={formData.estado}
                                            onChange={(e) => updateData('estado', e.target.value)}
                                            className="w-full bg-[#f8faf7] border-2 border-slate-100 px-4 py-3.5 rounded-xl focus:bg-white focus:outline-none focus:border-[#2ECC8C] transition-all font-medium text-[#111F18] appearance-none cursor-pointer"
                                        >
                                            <option value="">Selecione o Estado</option>
                                            {Object.entries(ESTADOS_MAP).map(([sigla, nome]) => (
                                                <option key={sigla} value={sigla}>{nome} ({sigla})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#111F18] ml-1">Cidade*</label>
                                        <select
                                            disabled={!formData.estado}
                                            value={formData.cidade}
                                            onChange={(e) => updateData('cidade', e.target.value)}
                                            className="w-full bg-[#f8faf7] border-2 border-slate-100 px-4 py-3.5 rounded-xl focus:bg-white focus:outline-none focus:border-[#2ECC8C] transition-all font-medium text-[#111F18] disabled:opacity-40 appearance-none"
                                        >
                                            <option value="">Selecione a Cidade</option>
                                            {formData.estado && formData.cidade && (!CIDADES[formData.estado] || !CIDADES[formData.estado].includes(formData.cidade)) && (
                                                <option value={formData.cidade}>{formData.cidade}</option>
                                            )}
                                            {formData.estado && CIDADES[formData.estado]?.map(cid => (
                                                <option key={cid} value={cid}>{cid}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-12 py-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-[13px] font-bold text-[#111F18] ml-1">Consumo médio mensal (kWh)</label>
                                        <div className="flex items-center gap-2 bg-[#f1f8ee] px-3 py-2 rounded-xl border border-[#2ECC8C]/20">
                                            <input
                                                type="number"
                                                value={formData.consumo}
                                                onChange={(e) => updateData('consumo', e.target.value)}
                                                className="w-16 bg-transparent text-right font-black text-[#111F18] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <span className="text-[10px] font-bold text-[#6B8F72] uppercase">kWh</span>
                                        </div>
                                    </div>

                                    <div className="relative pt-6">
                                        <input
                                            type="range"
                                            min="100"
                                            max="3000"
                                            step="10"
                                            className="w-full h-2.5 bg-[#EEF2F6] rounded-lg appearance-none cursor-pointer relative z-10 solar-slider"
                                            style={{
                                                background: `linear-gradient(to right, #D4E44A 0%, #D4E44A ${(Number(formData.consumo) - 100) / (2900) * 100}%, #EEF2F6 ${(Number(formData.consumo) - 100) / (2900) * 100}%, #EEF2F6 100%)`
                                            }}
                                            value={formData.consumo}
                                            onChange={(e) => updateData('consumo', e.target.value)}
                                        />

                                        <div className="flex justify-between mt-4 text-[11px] font-bold text-[#6B8F72] opacity-60">
                                            <span>100 kWh</span>
                                            <span>3000 kWh</span>
                                        </div>

                                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-[#EEF2DC] text-[#1A4A38] px-4 py-1.5 rounded-full text-xs font-black whitespace-nowrap shadow-sm border border-[#D4E44A]/30">
                                            {formData.consumo} kWh/mês
                                        </div>
                                    </div>
                                </div>

                                {formData.estado && TARIFAS[formData.estado] && (
                                    <div className="flex items-center gap-3 p-4 bg-[#2ECC8C]/5 rounded-2xl border border-[#2ECC8C]/20 animate-in fade-in duration-500">
                                        <div className="p-2 bg-[#2ECC8C] text-white rounded-lg"><Zap size={16} /></div>
                                        <div className="text-xs">
                                            <p className="text-[#1A4A38] font-bold">Distribuidora detectada: {TARIFAS[formData.estado].distribuidora}</p>
                                            <p className="text-[#6B8F72]">Tarifa base oficial: R$ {TARIFAS[formData.estado].tarifa.toFixed(2)} / kWh (incl. impostos)</p>
                                        </div>
                                    </div>
                                )}

                                {/* Map Section */}
                                {(!showMap && formData.rua && formData.numeroCasa && formData.cidade) ? (
                                    <div className="pt-4 border-t border-slate-100 mt-4">
                                        <div className="bg-[#EEF2DC] rounded-xl p-5 border border-[#1A4A38]/10 text-center">
                                            <p className="text-[#1A4A38] text-sm font-medium mb-3">Mora em condomínio, chácara ou local com numeração interna?</p>
                                            <button
                                                onClick={openMap}
                                                disabled={isGeocoding}
                                                className="bg-white border-2 border-[#1A4A38]/20 px-4 py-2 text-[#1A4A38] font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors shadow-sm inline-flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {isGeocoding ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
                                                Confirmar no Mapa (Opcional)
                                            </button>
                                        </div>
                                    </div>
                                ) : showMap ? (
                                    <div className="pt-4 border-t border-slate-100 mt-4 animate-in fade-in slide-in-from-top-4">
                                        <div className="bg-[#1A4A38] text-white p-4 rounded-t-xl">
                                            <h4 className="font-bold text-sm flex items-center gap-2"><MapPin size={16} className="text-[#D4E44A]" /> Ajuste Fino de GPS</h4>
                                            <p className="text-xs text-[#D8EDD5] mt-1">Deslize o mapa e coloque o pino vermelho <b>exatamente em cima do seu telhado</b> para melhorar a precisão da avaliação do satélite.</p>
                                        </div>
                                        <div
                                            ref={mapRef}
                                            className="w-full h-[300px] bg-slate-200 rounded-b-xl overflow-hidden border-x border-b border-slate-200"
                                        />
                                    </div>
                                ) : null}

                                <div className="flex flex-col gap-4 pt-4">
                                    <button
                                        onClick={handleNext}
                                        disabled={!formData.estado || !formData.cidade || !formData.cep || !formData.rua || !formData.numeroCasa || Number(formData.consumo) < 50}
                                        className="w-full bg-[#D4E44A] hover:bg-[#C0CF33] disabled:opacity-50 disabled:cursor-not-allowed text-[#111F18] py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all hover:-translate-y-1 shadow-xl shadow-[#D4E44A]/20 group"
                                    >
                                        <Calculator className="group-hover:rotate-12 transition-transform" /> Calcular Economia Agora
                                    </button>
                                    <button onClick={() => setStep('lead')} className="flex items-center justify-center gap-2 text-[#6B8F72] font-semibold hover:text-[#111F18] transition-colors py-2">
                                        <ArrowLeft size={16} /> Voltar para Perfil
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === "loading" && (
                        <div className="p-16 flex flex-col items-center justify-center min-h-[500px] text-center space-y-10 animate-in fade-in duration-500">
                            <div className="relative">
                                {/* SVG Sun Animation Baseada no MinhaContaLeve */}
                                <div className="w-40 h-40 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-[#D4E44A]/10 rounded-full animate-ping"></div>
                                    <div className="w-24 h-24 bg-gradient-to-br from-[#D4E44A] to-[#2ECC8C] rounded-full flex items-center justify-center shadow-xl shadow-[#D4E44A]/40 relative z-10 animate-bounce">
                                        <Sun size={48} className="text-[#111F18]" fill="currentColor" />
                                    </div>
                                    {/* Raios solares animados */}
                                    {[...Array(8)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-1 h-3 bg-[#D4E44A] rounded-full"
                                            style={{
                                                transform: `rotate(${i * 45}deg) translateY(-40px)`,
                                                opacity: 0.6
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-[#111F18] font-['Space_Grotesk']">Gerando sua economia...</h3>
                                <div className="flex flex-col items-center gap-4 text-slate-500 font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-[#2ECC8C] rounded-full animate-pulse"></div>
                                        <span className="text-sm">Buscando tarifa da {formData.estado ? TARIFAS[formData.estado].distribuidora : 'distribuidora'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-60">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                        <span className="text-sm">Dimensionando número ideal de painéis</span>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-40">
                                        <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                                        <span className="text-sm">Estimando ROI e Fluxo de Caixa</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === "result" && results && (
                        <div className="animate-in slide-in-from-bottom-8 duration-700 bg-[#F4F9F1]">
                            {/* Header do Resultado Refinado */}
                            <div className="bg-white border-b border-slate-100 p-8 md:p-12 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,#D4E44A15_0%,transparent_70%)] opacity-50" />
                                <div className="relative z-10 space-y-5">
                                    <div className="w-16 h-16 bg-[#2ECC8C]/10 rounded-full flex items-center justify-center mx-auto border-2 border-[#2ECC8C]/20 shadow-inner">
                                        <CheckCircle2 size={32} className="text-[#2ECC8C]" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-3xl md:text-5xl font-black text-[#111F18] font-['Space_Grotesk'] leading-tight tracking-tight">
                                            Olá, <span className="text-[#2ECC8C]">{formData.name ? formData.name.split(' ')[0] : 'José'}</span>! <br />
                                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#111F18] to-[#1A4A38]">Sua estimativa está pronta.</span>
                                        </h2>
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#f1f8ee] rounded-full border border-[#2ECC8C]/10">
                                            <span className="text-xs font-black text-[#1A4A38] uppercase tracking-wider">Perfil Técnico:</span>
                                            <span className="text-xs font-bold text-[#6B8F72]">{formData.consumo} kWh/mês • {formData.cidade}/{formData.estado}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* GRID DE RESULTADOS (MinhaContaLeve Style) */}
                            <div className="px-6 md:px-10 py-10 -mt-10">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                    {/* Card Principal: ECONOMIA */}
                                    <div className="md:col-span-3 bg-white border-2 border-[#2ECC8C] p-8 rounded-[32px] shadow-2xl shadow-[#111F18]/10 flex flex-col md:flex-row items-center justify-between gap-8 group hover:scale-[1.01] transition-all">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 bg-[#2ECC8C] text-[#111F18] rounded-2xl flex items-center justify-center shadow-lg shadow-[#2ECC8C]/20 group-hover:rotate-6 transition-transform">
                                                <TrendingUp size={32} />
                                            </div>
                                            <div className="text-center md:text-left">
                                                <p className="text-xs font-black text-[#6B8F72] uppercase tracking-widest mb-1">Economia Mensal Estimada</p>
                                                <div className="text-5xl md:text-6xl font-black text-[#111F18] font-['Space_Grotesk'] tracking-tighter">
                                                    {formatCurrency(results.economiaMensal)}
                                                </div>
                                                <p className="text-[#2ECC8C] font-bold mt-1">~ {formatCurrency(results.economiaAnual)} por ano</p>
                                            </div>
                                        </div>
                                        <div className="w-full md:w-px h-px md:h-20 bg-slate-100"></div>
                                        <div className="text-center md:text-right flex flex-col items-center md:items-end">
                                            <span className="text-xs font-bold text-[#6B8F72] mb-1">REDUÇÃO DE ATÉ</span>
                                            <span className="text-5xl font-black text-[#D4E44A] font-['Space_Grotesk']">95%</span>
                                            <span className="text-xs font-bold text-[#111F18] mt-1">NA CONTA DE LUZ</span>
                                        </div>
                                    </div>

                                    {/* Google Satélite Info */}
                                    {results.solarData?.solarPotential && (
                                        <div className="md:col-span-3 bg-[#EEF2DC] p-6 rounded-[24px] border border-[#D4E44A]/50 flex items-start gap-4 animate-in fade-in duration-500">
                                            <div className="p-3 bg-white rounded-xl shadow-sm text-[#1A4A38]">
                                                <Sun size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-[#1A4A38] font-black text-lg mb-1">Satélite do Google detectou o seu telhado!</h4>
                                                <p className="text-[#1A4A38]/80 text-sm font-medium">Análise de IA identificou que seu telhado suporta um limite de <b>{results.solarData.solarPotential.maxArrayPanelsCount} painéis</b>, numa área máxima de <b>{Math.round(results.solarData.solarPotential.maxArrayAreaMeters2)}m²</b> (com incidência de luz ideal). O cálculo acima considerou essas limitações reais físicas da sua casa.</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Outros Cards de Info */}
                                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 space-y-2 flex flex-col justify-center">
                                        <div className="w-10 h-10 bg-slate-50 text-[#6B8F72] rounded-xl flex items-center justify-center mb-4"><Calendar size={20} /></div>
                                        <p className="text-xs font-bold text-[#6B8F72] uppercase tracking-wider">Payback</p>
                                        <div className="text-3xl font-black text-[#111F18] font-['Space_Grotesk']">{results.paybackAnos} <span className="text-sm font-bold text-slate-400">anos</span></div>
                                        <p className="text-[10px] text-slate-400 leading-tight">Tempo estimado para o sistema se pagar.</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 space-y-2 flex flex-col justify-center">
                                        <div className="w-10 h-10 bg-slate-50 text-[#6B8F72] rounded-xl flex items-center justify-center mb-4"><DollarSign size={20} /></div>
                                        <p className="text-xs font-bold text-[#6B8F72] uppercase tracking-wider">Investimento Estimado</p>
                                        <div className="text-3xl font-black text-[#111F18] font-['Space_Grotesk']">{formatCurrency(results.valorProjeto)}</div>
                                        <p className="text-[10px] text-slate-400 leading-tight">Valor aproximado do projeto completo.</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 space-y-2 flex flex-col justify-center">
                                        <div className="w-10 h-10 bg-slate-50 text-[#6B8F72] rounded-xl flex items-center justify-center mb-4"><Leaf size={20} /></div>
                                        <p className="text-xs font-bold text-[#6B8F72] uppercase tracking-wider">Geração Mensal</p>
                                        <div className="text-3xl font-black text-[#111F18] font-['Space_Grotesk']">{results.geracaoMensal} <span className="text-sm font-bold text-slate-400">kWh</span></div>
                                        <p className="text-[10px] text-slate-400 leading-tight">Energia limpa gerada no telhado.</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 space-y-2 flex flex-col justify-center">
                                        <div className="w-10 h-10 bg-slate-50 text-[#6B8F72] rounded-xl flex items-center justify-center mb-4"><PanelsTopLeft size={20} /></div>
                                        <p className="text-xs font-bold text-[#6B8F72] uppercase tracking-wider">Sistema Solar</p>
                                        <div className="text-3xl font-black text-[#111F18] font-['Space_Grotesk']">{results.numPlacas} <span className="text-sm font-bold text-slate-400">placas</span></div>
                                        <p className="text-[10px] text-slate-400 leading-tight">Potência aproximada {results.potenciaReal} kWp.</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 space-y-2 flex flex-col justify-center">
                                        <div className="w-10 h-10 bg-slate-50 text-[#6B8F72] rounded-xl flex items-center justify-center mb-4"><AreaChart size={20} /></div>
                                        <p className="text-xs font-bold text-[#6B8F72] uppercase tracking-wider">Área de Telhado</p>
                                        <div className="text-3xl font-black text-[#111F18] font-['Space_Grotesk']">{results.areaTelhado} <span className="text-sm font-bold text-slate-400">m²</span></div>
                                        <p className="text-[10px] text-slate-400 leading-tight">Espaço necessário para instalação.</p>
                                    </div>

                                    {/* Economia 25 anos Highlight (Refatorado para FULL WIDTH e evitar quebras) */}
                                    <div className="md:col-span-3 bg-[#111F18] p-8 md:p-10 rounded-[32px] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative group shadow-2xl shadow-black/20 mt-4">
                                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#2ECC8C]/10 rounded-full blur-[80px] group-hover:bg-[#2ECC8C]/20 transition-all"></div>
                                        <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                                            <div className="w-16 h-16 bg-gradient-to-br from-[#2ECC8C] to-[#1A4A38] text-[#111F18] rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-[#2ECC8C]/30 group-hover:scale-110 transition-transform">
                                                <Calculator size={32} className="text-white" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-base md:text-lg font-black text-[#2ECC8C] uppercase tracking-widest">Economia em 25 anos</p>
                                                <p className="text-slate-400 text-sm mt-1">Vida útil mínima dos painéis solares</p>
                                            </div>
                                        </div>
                                        <div className="text-left md:text-right relative z-10 w-full md:w-auto">
                                            <div className="text-5xl md:text-6xl font-black text-[#F8FFD0] font-['Space_Grotesk'] tracking-tighter">
                                                {formatCurrency(results.economiaTotal25)}
                                            </div>
                                            <div className="inline-block px-3 py-1 mt-3 bg-[#D4E44A] text-[#111F18] text-[10px] font-black rounded-lg uppercase tracking-wider">Gatilho Oculto de Lucratividade</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Desafio / Call to Action (Estilo MinhaContaLeve) */}
                                <div className="mt-12 bg-[#D4E44A]/10 border-2 border-dashed border-[#D4E44A] rounded-[32px] p-8 md:p-12 text-center space-y-8 animate-in fade-in zoom-in duration-700">
                                    <div className="space-y-3">
                                        <div className="w-14 h-14 bg-[#D4E44A] text-[#111F18] rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                                            <ShieldCheck size={32} />
                                        </div>
                                        <h3 className="text-3xl font-black text-[#111F18] font-['Space_Grotesk']">Não deixe dinheiro na mesa!</h3>
                                        <p className="text-[#1A4A38] text-lg max-w-lg mx-auto leading-tight">
                                            Sua empresa está perdendo cerca de <span className="bg-[#111F18] text-[#D4E44A] font-black px-2 py-0.5 rounded italic">{formatCurrency(results.economiaAnual)} por ano</span> enquanto não instala energia solar.
                                        </p>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4">
                                        <button
                                            onClick={() => window.open(`https://wa.me/55${consultant.whatsapp_number.replace(/\D/g, '')}?text=Olá ${consultant.full_name}, acabei de realizar a simulação solar da minha empresa e os resultados foram incríveis! Economia estimada de ${formatCurrency(results.economiaAnual)} por ano. Gostaria de um orçamento especializado.`, '_blank')}
                                            className="w-full md:w-auto px-10 py-5 bg-[#111F18] text-[#D4E44A] rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:-translate-y-1 transition-all shadow-xl shadow-black/20"
                                        >
                                            <Phone size={24} fill="currentColor" /> Falar com um Consultor
                                        </button>
                                        <button onClick={() => setStep('location')} className="text-[#111F18] font-bold py-2 border-b-2 border-transparent hover:border-[#111F18] transition-all">
                                            Refazer Simulação
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-center gap-6 pt-6 opacity-60 grayscale hover:grayscale-0 transition-all">
                                        <span className="text-[10px] font-black text-[#1A4A38] uppercase tracking-widest">Tecnologia Certificada</span>
                                        <div className="w-px h-6 bg-[#1A4A38]/20"></div>
                                        <span className="text-[10px] font-black text-[#1A4A38] uppercase tracking-widest">Base de Dados ANEEL</span>
                                        <div className="w-px h-6 bg-[#1A4A38]/20"></div>
                                        <span className="text-[10px] font-black text-[#1A4A38] uppercase tracking-widest">Garantia 25 Anos</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer do Simulador */}
                <div className="mt-8 pb-12 text-center space-y-6">
                    <p className="text-[#6B8F72] text-[10px] max-w-md mx-auto leading-relaxed">
                        Este simulador utiliza algoritmos baseados na incidência solar da sua região e tarifas médias das distribuidoras. Orçamento definitivo após visita técnica gratuita.
                    </p>
                    <div className="flex items-center justify-center gap-4 text-[#111F18]/30">
                        <div className="w-20 h-0.5 bg-current rounded-full" />
                        <Zap size={16} />
                        <div className="w-20 h-0.5 bg-current rounded-full" />
                    </div>
                    <div className="pt-2">
                        <a
                            href="https://xpectsolar.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#111F18]/50 hover:text-[#2ECC8C] transition-colors group"
                        >
                            Feito com
                            <span className="text-[#111F18]/70 group-hover:text-[#2ECC8C] transition-colors flex items-center gap-1">
                                <Zap size={12} fill="currentColor" /> Xpect Solar
                            </span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Injeção de Fontes Especiais do Layout Solicitado */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700;800&display=swap');

                body {
                    font-family: 'Inter', sans-serif;
                }

                 input[type="range"].solar-slider::-webkit-slider-thumb {
                     -webkit-appearance: none;
                     appearance: none;
                     width: 28px;
                     height: 28px;
                     background: #D4E44A;
                     border: 4px solid #111F18;
                     border-radius: 50%;
                     cursor: pointer;
                     box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                     transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                 }

                 input[type="range"].solar-slider::-webkit-slider-thumb:hover {
                     transform: scale(1.15);
                 }

                 input[type="range"].solar-slider::-moz-range-thumb {
                     width: 28px;
                     height: 28px;
                     background: #D4E44A;
                     border: 4px solid #111F18;
                     border-radius: 50%;
                     cursor: pointer;
                     box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                     border: none;
                 }

                .bg-gradient-solar {
                    background: linear-gradient(135deg, #111F18 0%, #1A4A38 100%);
                }
            `}</style>
        </div >
    );
}

