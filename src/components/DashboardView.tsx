import React from "react";
import {
  FileText,
  HardDrive,
  CheckCircle2,
  Lock,
  Download,
  FolderOpen,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { DocumentItem, Folder, Subject, AuditLog, User } from "../types";

interface DashboardViewProps {
  documents: DocumentItem[];
  folders: Folder[];
  subjects: Subject[];
  auditLogs: AuditLog[];
  currentUser: User;
  onOpenUpload: () => void;
  onOpenFolderModal: () => void;
  onNavigateToTab: (tab: string, folderId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  documents,
  folders,
  subjects,
  auditLogs,
  currentUser,
  onOpenUpload,
  onOpenFolderModal,
  onNavigateToTab,
}) => {
  // Calculations
  const totalDocs = documents.length;
  const totalSizeBytes = documents.reduce((acc, d) => acc + d.fileSize, 0);
  const totalSizeMb = (totalSizeBytes / (1024 * 1024)).toFixed(2);
  const sensitiveDocs = documents.filter((d) => d.sensitivity === "Confidencial" || d.sensitivity === "Restrito").length;
  const totalDownloads = documents.reduce((acc, d) => acc + d.downloadCount, 0);
  const avgOcrScore = totalDocs > 0
    ? (documents.reduce((acc, d) => acc + d.confidenceScore, 0) / totalDocs).toFixed(1)
    : "99.0";

  // Data for Charts
  const folderData = folders.map((fld) => {
    const count = documents.filter((d) => d.folderId === fld.id).length;
    return {
      name: fld.name,
      count: count,
      fill: fld.color || "#3b82f6",
    };
  });

  // Data by Subject
  const subjectCounts: Record<string, number> = {};
  documents.forEach((doc) => {
    doc.subjects.forEach((sbj) => {
      subjectCounts[sbj] = (subjectCounts[sbj] || 0) + 1;
    });
  });

  const subjectChartData = Object.entries(subjectCounts).map(([name, value], idx) => {
    const colors = ["#3b82f6", "#10b981", "#ec4899", "#8b5cf6", "#f59e0b", "#06b6d4", "#ef4444", "#64748b"];
    return {
      name,
      value,
      color: colors[idx % colors.length],
    };
  });

  // Weekly Trend Mock
  const weeklyData = [
    { day: "Seg", digitalizados: 12, ocrCompletos: 12 },
    { day: "Ter", digitalizados: 18, ocrCompletos: 18 },
    { day: "Qua", digitalizados: 15, ocrCompletos: 15 },
    { day: "Qui", digitalizados: 24, ocrCompletos: 24 },
    { day: "Sex", digitalizados: 29, ocrCompletos: 29 },
    { day: "Sáb", digitalizados: 8, ocrCompletos: 8 },
    { day: "Dom", digitalizados: 4, ocrCompletos: 4 },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Banner Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-semibold text-blue-300 border border-blue-400/30">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" /> OCR Inteligente Ativo
              </span>
              <span className="text-xs text-slate-300">| Perfil Atual: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role})</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Painel Geral do Repositório Digital
            </h2>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl">
              Gerencie seus documentos digitalizados com reconhecimento de texto OCR via Gemini, busca avançada, classificação por assunto e trilha de auditoria contínua.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenUpload}
              disabled={currentUser.role === "viewer"}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all disabled:opacity-40"
            >
              <Zap className="h-4 w-4" />
              <span>Digitalizar Documento</span>
            </button>
            <button
              onClick={() => onNavigateToTab("search")}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/20 transition-all"
            >
              <span>Busca OCR</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total de Documentos</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{totalDocs}</span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center">
              <TrendingUp className="h-3 w-3 mr-0.5" /> +100%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Digitalizados e indexados</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Armazenamento</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <HardDrive className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{totalSizeMb}</span>
            <span className="text-xs text-slate-500 font-semibold">MB</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Capacidade total: 10 GB</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Acurácia OCR IA</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{avgOcrScore}%</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Com Gemini 3.6 Flash</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Sigilo & Restritos</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <Lock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{sensitiveDocs}</span>
            <span className="text-xs text-slate-500 font-normal">arquivos</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Controle por perfil de usuário</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Downloads Totais</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <Download className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{totalDownloads}</span>
            <span className="text-xs text-slate-500 font-normal">acessos</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Com registro de auditoria</p>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Documents per Folder */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Distribuição de Arquivos por Pasta
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quantidade de documentos digitalizados agrupados por diretório
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab("documents")}
              className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              Ver detalhes →
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={folderData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={40} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" name="Documentos" radius={[6, 6, 0, 0]}>
                  {folderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Documents by Subject */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Documentos por Assunto / Tag
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Categorização automática e manual
            </p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {subjectChartData.map((entry, index) => (
                    <Cell key={`cell-sbj-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-1.5 text-xs">
            {subjectChartData.slice(0, 6).map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 truncate">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate text-slate-600 dark:text-slate-300 text-[11px]">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Log Recent Stream & Folder Quick Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Folders Cards */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Pastas Principais
              </h3>
            </div>
            <button
              onClick={onOpenFolderModal}
              disabled={currentUser.role === "viewer"}
              className="text-xs font-semibold text-blue-600 hover:underline disabled:opacity-40"
            >
              + Nova Pasta
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {folders.map((fld) => {
              const docCount = documents.filter((d) => d.folderId === fld.id).length;
              return (
                <div
                  key={fld.id}
                  onClick={() => onNavigateToTab("documents", fld.id)}
                  className="group cursor-pointer rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 hover:border-blue-400 hover:bg-blue-50/40 transition-all dark:border-slate-700/80 dark:bg-slate-800/60 dark:hover:border-blue-500"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-white font-bold"
                      style={{ backgroundColor: fld.color || "#3b82f6" }}
                    >
                      <FolderOpen className="h-4 w-4" />
                    </div>
                    <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                      {docCount} {docCount === 1 ? "doc" : "docs"}
                    </span>
                  </div>
                  <h4 className="mt-2.5 text-xs font-bold text-slate-800 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400 truncate">
                    {fld.name}
                  </h4>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {fld.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Stream */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Atividade Recente (Auditoria)
              </h3>
            </div>
            <button
              onClick={() => onNavigateToTab("audit")}
              className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              Ver Tudo
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 5).map((log) => {
              const formattedTime = new Date(log.timestamp).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={log.id}
                  className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 text-xs dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="mt-0.5 shrink-0">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {log.userName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">{formattedTime}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                      <strong className="text-blue-600 dark:text-blue-400">[{log.action}]</strong> {log.details}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
