import React, { useState } from "react";
import {
  X,
  FileText,
  Download,
  Copy,
  Check,
  Trash2,
  Sparkles,
  Lock,
  Calendar,
  User,
  Tag,
  Shield,
  Eye,
  RefreshCw,
  HardDrive,
  FileSpreadsheet,
  Image as ImageIcon,
} from "lucide-react";
import { DocumentItem, User as UserType } from "../../types";

interface DocumentViewerModalProps {
  document: DocumentItem | null;
  currentUser: UserType;
  onClose: () => void;
  onDownload: (doc: DocumentItem) => void;
  onDelete: (doc: DocumentItem) => void;
  onReRunOcr: (doc: DocumentItem) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  currentUser,
  onClose,
  onDownload,
  onDelete,
  onReRunOcr,
}) => {
  const [activeTab, setActiveTab] = useState<"ocr" | "summary" | "entities" | "preview">("ocr");
  const [copied, setCopied] = useState(false);

  if (!document) return null;

  const canDelete = currentUser.role === "admin" || currentUser.role === "manager";

  const handleCopy = () => {
    navigator.clipboard.writeText(document.ocrText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 uppercase dark:bg-blue-900/60 dark:text-blue-300">
                📁 {document.folderName}
              </span>
              <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800 uppercase dark:bg-red-950/60 dark:text-red-300">
                🔒 {document.sensitivity}
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                <Sparkles className="h-3 w-3" /> {document.confidenceScore}% OCR
              </span>
            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {document.title}
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
              <span>Arquivo: {document.originalFileName}</span>
              <span>•</span>
              <span>Tamanho: {formatBytes(document.fileSize)}</span>
              <span>•</span>
              <span>Data Doc: {new Date(document.documentDate).toLocaleDateString("pt-BR")}</span>
            </div>
          </div>

          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-600 font-bold">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Top Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("ocr")}
              className={`rounded-lg px-3 py-1.5 font-bold ${
                activeTab === "ocr"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-200"
              }`}
            >
              Texto OCR Completo
            </button>
            <button
              onClick={() => setActiveTab("summary")}
              className={`rounded-lg px-3 py-1.5 font-bold ${
                activeTab === "summary"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-200"
              }`}
            >
              Resumo IA
            </button>
            <button
              onClick={() => setActiveTab("entities")}
              className={`rounded-lg px-3 py-1.5 font-bold ${
                activeTab === "entities"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-200"
              }`}
            >
              Entidades Extraídas ({document.extractedEntities.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copiado!" : "Copiar Texto"}</span>
            </button>

            <button
              onClick={() => onDownload(document)}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 font-bold text-white shadow-sm hover:bg-emerald-700"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Baixar Arquivo</span>
            </button>

            <button
              onClick={() => onReRunOcr(document)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              title="Re-processar OCR no Gemini"
            >
              <RefreshCw className="h-3.5 w-3.5 text-blue-600" />
              <span>Re-executar OCR</span>
            </button>

            <button
              onClick={() => onDelete(document)}
              disabled={!canDelete}
              className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 font-semibold text-red-700 hover:bg-red-100 disabled:opacity-30 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
              title={canDelete ? "Excluir arquivo" : "Sem permissão para exclusão"}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Excluir</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-4">
          {activeTab === "ocr" && (
            <div className="rounded-xl bg-slate-900 p-4 font-mono text-xs leading-relaxed text-slate-200 border border-slate-800 max-h-[380px] overflow-y-auto whitespace-pre-wrap">
              {document.ocrText}
            </div>
          )}

          {activeTab === "summary" && (
            <div className="rounded-xl bg-blue-50/70 p-5 border border-blue-100 text-xs text-blue-950 dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-200 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <h4 className="font-bold text-sm">Resumo Executivo Gerado pela Inteligência Artificial</h4>
              </div>
              <p className="text-xs leading-relaxed italic">
                "{document.summary}"
              </p>
              <div className="pt-2 border-t border-blue-200/60 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300">
                <strong>Assuntos / Tags Associados:</strong>{" "}
                {document.subjects.join(", ")}
              </div>
            </div>
          )}

          {activeTab === "entities" && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-500 dark:text-slate-400">
                Entidades essenciais e valores identificados pelo OCR Gemini:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {document.extractedEntities.map((entity, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <Tag className="h-4 w-4 text-blue-500 shrink-0" />
                    <span>{entity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Meta */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3 dark:border-slate-800">
          <div>Enviado por: <strong className="text-slate-700 dark:text-slate-300">{document.uploadedBy.name}</strong> em {new Date(document.uploadedAt).toLocaleString("pt-BR")}</div>
          <div className="flex items-center gap-3">
            <span>Consultas: {document.accessCount}</span>
            <span>Downloads: {document.downloadCount}</span>
            <span>Versão: {document.version}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
