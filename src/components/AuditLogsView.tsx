import React, { useState } from "react";
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Laptop,
  FileText,
} from "lucide-react";
import { AuditLog, AuditAction, AuditSeverity } from "../types";

interface AuditLogsViewProps {
  auditLogs: AuditLog[];
  onLogAction: (action: string, details: string) => void;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ auditLogs, onLogAction }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("ALL");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = auditLogs.filter((log) => {
    if (actionFilter !== "ALL" && log.action !== actionFilter) return false;
    if (severityFilter !== "ALL" && log.severity !== severityFilter) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchUser = log.userName.toLowerCase().includes(q) || log.userEmail.toLowerCase().includes(q);
      const matchDetails = log.details.toLowerCase().includes(q);
      const matchDoc = log.documentTitle?.toLowerCase().includes(q) || false;
      const matchAction = log.action.toLowerCase().includes(q);

      if (!matchUser && !matchDetails && !matchDoc && !matchAction) return false;
    }

    return true;
  });

  const getSeverityBadge = (sev: AuditSeverity) => {
    switch (sev) {
      case "danger":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/60 dark:text-red-300";
      case "warning":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300";
      case "success":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300";
    }
  };

  const handleExportAuditCsv = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,DataHora,Usuario,Funcao,Email,Acao,Documento,Detalhes,IP,Dispositivo"]
        .concat(
          filteredLogs.map(
            (l) =>
              `"${l.id}","${l.timestamp}","${l.userName}","${l.userRole}","${l.userEmail}","${l.action}","${(l.documentTitle || "").replace(/"/g, '""')}","${l.details.replace(/"/g, '""')}","${l.ipAddress}","${l.device}"`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `trilha_auditoria_documind_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onLogAction("DOWNLOAD", `Exportou a trilha de auditoria contendo ${filteredLogs.length} registros em CSV.`);
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" /> Conformidade & Rastreabilidade LGPD/ISO 27001
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Trilha de Auditoria & Logs de Alterações
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Registro imutável de todas as operações de upload, visualização, download, exclusão, re-indexação OCR e alterações de permissões.
            </p>
          </div>

          <button
            onClick={handleExportAuditCsv}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 shrink-0"
          >
            <Download className="h-4 w-4" />
            <span>Exportar Trilha (CSV)</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por usuário, documento ou IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="ALL">Todas as Ações</option>
              <option value="UPLOAD">UPLOAD</option>
              <option value="VIEW">VIEW (Visualização)</option>
              <option value="DOWNLOAD">DOWNLOAD</option>
              <option value="DELETE">DELETE (Exclusão)</option>
              <option value="OCR_RUN">OCR_RUN (Gemini)</option>
              <option value="CHANGE_PERMISSION">CHANGE_PERMISSION</option>
              <option value="CREATE_FOLDER">CREATE_FOLDER</option>
            </select>
          </div>

          <div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="ALL">Todas as Severidades</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="danger">Danger</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Registros de Eventos ({filteredLogs.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
              <tr>
                <th className="py-3 px-4 font-bold">Data & Hora</th>
                <th className="py-3 px-3 font-bold">Usuário / Papel</th>
                <th className="py-3 px-3 font-bold">Operação</th>
                <th className="py-3 px-3 font-bold">Documento</th>
                <th className="py-3 px-4 font-bold">Detalhes da Alteração</th>
                <th className="py-3 px-3 font-bold">IP / Origem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{new Date(log.timestamp).toLocaleString("pt-BR")}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-bold">{log.userName}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">[{log.userRole.toUpperCase()}]</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-bold ${getSeverityBadge(log.severity)}`}>
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3 px-3 max-w-[200px]">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                      {log.documentTitle || "—"}
                    </span>
                  </td>

                  <td className="py-3 px-4 max-w-[300px]">
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] line-clamp-2">
                      {log.details}
                    </p>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap text-[11px] font-mono text-slate-500">
                    <div>{log.ipAddress}</div>
                    <div className="text-[10px] text-slate-400">{log.device}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Detalhes do Registro de Auditoria #{selectedLog.id}
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Data / Hora:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {new Date(selectedLog.timestamp).toLocaleString("pt-BR")}
                  </span>
                </div>

                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Operação:</span>
                  <span className={`inline-block mt-0.5 rounded px-2 py-0.5 text-[10px] font-bold ${getSeverityBadge(selectedLog.severity)}`}>
                    {selectedLog.action}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Usuário Responsável:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedLog.userName} ({selectedLog.userEmail}) — Papel: {selectedLog.userRole.toUpperCase()}
                </span>
              </div>

              {selectedLog.documentTitle && (
                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Documento Afetado:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedLog.documentTitle}
                  </span>
                </div>
              )}

              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold mb-1">Descrição do Evento:</span>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                  {selectedLog.details}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800 font-mono text-[10px] text-slate-500">
                <div>Endereço IP: {selectedLog.ipAddress}</div>
                <div>Dispositivo / Navegador: {selectedLog.device}</div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
