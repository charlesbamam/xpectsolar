"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Info } from "lucide-react";

export default function BannersAdmin() {
    const [banners] = useState([
        {
            id: 1,
            title: "Aviso de Manutenção",
            message: "Faremos uma manutenção programada neste sábado às 22h. O sistema pode ficar instável por 1 hora.",
            type: "warning", // info, warning, success, error
            status: "Ativo",
            dateStart: "08/03/2026",
            dateEnd: "09/03/2026"
        },
        {
            id: 2,
            title: "Nova Atualização Xpect Solar v2",
            message: "Agora você pode personalizar as cores e logotipo do seu simulador solar de ponta a ponta.",
            type: "info",
            status: "Inativo",
            dateStart: "01/03/2026",
            dateEnd: "15/03/2026"
        }
    ]);

    const getTypeColors = (type: string) => {
        switch (type) {
            case "warning": return "bg-orange-100 text-orange-800 border-orange-200";
            case "error": return "bg-red-100 text-red-800 border-red-200";
            case "success": return "bg-green-100 text-green-800 border-green-200";
            default: return "bg-blue-100 text-blue-800 border-blue-200"; // info
        }
    };

    return (
        <div className="flex flex-col w-full text-[#14151C] h-full overflow-y-auto">
            {/* Header Superadmin Banners */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold">Gestão de Banners Globais</h2>
                    <p className="text-slate-500 text-sm mt-1">Crie comunicados e anúncios que aparecerão no painel de todos os usuários (Dashboard).</p>
                </div>
                <button className="flex items-center gap-2 bg-[#808000] hover:bg-[#606000] transition-colors text-white px-5 py-2.5 rounded-xl font-bold shadow-md">
                    <Plus size={18} /> Novo Banner
                </button>
            </div>

            {/* Listagem de Banners */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                            <th className="px-6 py-4 font-semibold">Mensagem / Título</th>
                            <th className="px-6 py-4 font-semibold">Tipo</th>
                            <th className="px-6 py-4 font-semibold">Período</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {banners.map(banner => (
                            <tr key={banner.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4 max-w-md">
                                    <h4 className="font-bold text-sm text-[#14151C] truncate">{banner.title}</h4>
                                    <p className="text-xs text-slate-500 truncate mt-0.5">{banner.message}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border uppercase tracking-wider ${getTypeColors(banner.type)}`}>
                                        {banner.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-xs font-semibold text-slate-700">{banner.dateStart}</p>
                                    <p className="text-[10px] text-slate-400">até {banner.dateEnd}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`flex items-center gap-1.5 text-xs font-bold ${banner.status === "Ativo" ? "text-emerald-600" : "text-slate-400"}`}>
                                        <div className={`w-2 h-2 rounded-full ${banner.status === "Ativo" ? "bg-emerald-500" : "bg-slate-300"}`} />
                                        {banner.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-slate-400 hover:text-blue-600 bg-white hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-lg transition-colors" title="Editar Banner">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-red-600 bg-white hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-colors" title="Desativar/Excluir">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {banners.length === 0 && (
                    <div className="p-8 text-center text-slate-500 text-sm">
                        Nenhum banner configurado.
                    </div>
                )}
            </div>

            {/* Informações Uteis */}
            <div className="mt-8 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                    <strong>Como funciona:</strong> Banners com status <strong>&quot;Ativo&quot;</strong> e cuja data esteja dentro do período vigente aparecerão automaticamente na página inicial do painel de controle (Dashboard) de todos os clientes do Xpect Solar. Isso é muito útil para informar sobre atualizações de sistema, promoções ou indisponibilidades de servidor.
                </p>
            </div>
        </div>
    );
}
