import React, { useState } from "react";
import {
  FileText,
  FolderOpen,
  Eye,
  Download,
  Trash2,
  FolderInput,
  Tag,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Grid,
  List,
  Search,
  Plus,
  Sparkles,
  Calendar,
  User,
  Shield,
  FileSpreadsheet,
  Image as ImageIcon,
} from "lucide-react";
import { DocumentItem, Folder, Subject, User as UserType } from "../types";

interface DocumentsViewProps {
  documents: DocumentItem[];
  folders: Folder[];
  subjects: Subject[];
  currentUser: UserType;
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onViewDocument: (doc: DocumentItem) => void;
  onDeleteDocument: (doc: DocumentItem) => void;
  onDownloadDocument: (doc: DocumentItem) => void;
  onMoveDocumentFolder: (docId: string, newFolderId: string) => void;
  onOpenUpload: () => void;
  onOpenFolderModal: () => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  folders,
  subjects,
  currentUser,
  selectedFolderId,
  onSelectFolder,
  onViewDocument,
  onDeleteDocument,
  onDownloadDocument,
  onMoveDocumentFolder,
  onOpenUpload,
  onOpenFolderModal,
}) => {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [movingDocId, setMovingDocId] = useState<string | null>(null);
  const [targetFolderId, setTargetFolderId] = useState<string>("");

  // Filter documents
  const filteredDocs = documents.filter((doc) => {
    if (selectedFolderId && doc.folderId !== selectedFolderId) return false;
    if (selectedSubject && !doc.subjects.includes(selectedSubject)) return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchFile = doc.originalFileName.toLowerCase().includes(q);
      const matchText = doc.ocrText.toLowerCase().includes(q);
      const matchEntities = doc.extractedEntities.some((e) => e.toLowerCase().includes(q));
      if (!matchTitle && !matchFile && !matchText && !matchEntities) return false;
    }
    return true;
  });

  const activeFolder = folders.find((f) => f.id === selectedFolderId);

  const getSensitivityBadge = (level: string) => {
    switch (level) {
      case "Confidencial":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/60 dark:text-red-300";
      case "Restrito":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300";
      case "Interno":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500 shrink-0" />;
      case "png":
      case "jpg":
        return <ImageIcon className="h-5 w-5 text-blue-500 shrink-0" />;
      case "xlsx":
        return <FileSpreadsheet className="h-5 w-5 text-emerald-500 shrink-0" />;
      default:
        return <FileText className="h-5 w-5 text-slate-500 shrink-0" />;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Permission Checks
  const canDelete = currentUser.role === "admin" || currentUser.role === "manager";
  const canUpload = currentUser.role !== "viewer";

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* Top Action Bar & Folder Pills */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {activeFolder ? activeFolder.name : "Todos os Documentos"}
            </h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {filteredDocs.length} {filteredDocs.length === 1 ? "arquivo" : "arquivos"}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {activeFolder ? activeFolder.description : "Repositório completo de arquivos digitalizados com indexação de texto OCR."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Filter */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar nesta pasta..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          {/* View Toggle Buttons */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-800">
            <button
              onClick={() => setViewMode("table")}
              className={`rounded-md p-1.5 text-xs font-medium ${
                viewMode === "table"
                  ? "bg-slate-100 text-blue-600 dark:bg-slate-700 dark:text-blue-400"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
              }`}
              title="Visualização em Lista"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-md p-1.5 text-xs font-medium ${
                viewMode === "grid"
                  ? "bg-slate-100 text-blue-600 dark:bg-slate-700 dark:text-blue-400"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
              }`}
              title="Visualização em Grade"
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={onOpenUpload}
            disabled={!canUpload}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Documento</span>
          </button>
        </div>
      </div>

      {/* Folders Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onSelectFolder(null)}
          className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
            selectedFolderId === null
              ? "bg-blue-600 text-white shadow-2xs"
              : "border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          }`}
        >
          📂 Todas as Pastas ({documents.length})
        </button>

        {folders.map((f) => {
          const count = documents.filter((d) => d.folderId === f.id).length;
          const isSelected = selectedFolderId === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onSelectFolder(f.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: isSelected ? "#ffffff" : f.color || "#3b82f6" }} />
              <span>{f.name}</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${isSelected ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Subject Tags Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">Assunto:</span>
        <button
          onClick={() => setSelectedSubject(null)}
          className={`rounded-lg px-2.5 py-1 font-medium text-[11px] ${
            selectedSubject === null
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 font-bold"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          Todos
        </button>
        {subjects.map((sbj) => (
          <button
            key={sbj.id}
            onClick={() => setSelectedSubject(selectedSubject === sbj.name ? null : sbj.name)}
            className={`rounded-lg px-2.5 py-1 font-medium text-[11px] transition-colors ${
              selectedSubject === sbj.name
                ? "bg-blue-600 text-white font-bold"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {sbj.name}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredDocs.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center dark:border-slate-700 dark:bg-slate-900/50">
          <FolderOpen className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-200">
            Nenhum documento encontrado
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {searchFilter || selectedSubject
              ? "Tente limpar os filtros de busca para visualizar outros arquivos."
              : "Digitalize ou faça o upload de um novo arquivo para começar."}
          </p>
          {canUpload && (
            <button
              onClick={onOpenUpload}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>Upload de Documento</span>
            </button>
          )}
        </div>
      )}

      {/* Documents Table View */}
      {viewMode === "table" && filteredDocs.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
                <tr>
                  <th className="py-3 px-4 font-semibold">Documento / Nome Original</th>
                  <th className="py-3 px-3 font-semibold">Pasta</th>
                  <th className="py-3 px-3 font-semibold">Assuntos / Tags</th>
                  <th className="py-3 px-3 font-semibold">Data Doc.</th>
                  <th className="py-3 px-3 font-semibold">Acurácia OCR</th>
                  <th className="py-3 px-3 font-semibold">Sigilo</th>
                  <th className="py-3 px-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4 max-w-xs">
                      <div className="flex items-start gap-3">
                        {getFileIcon(doc.fileType)}
                        <div className="min-w-0">
                          <button
                            onClick={() => onViewDocument(doc)}
                            className="font-bold text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400 hover:underline text-xs text-left line-clamp-1"
                          >
                            {doc.title}
                          </button>
                          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-400">
                            <span className="truncate">{doc.originalFileName}</span>
                            <span>•</span>
                            <span className="font-mono shrink-0">{formatBytes(doc.fileSize)}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        📁 {doc.folderName}
                      </span>
                    </td>

                    <td className="py-3 px-3 max-w-[180px]">
                      <div className="flex flex-wrap gap-1">
                        {doc.subjects.map((s) => (
                          <span
                            key={s}
                            className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200/60"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        <span>{new Date(doc.documentDate).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                        <Sparkles className="h-3 w-3" />
                        {doc.confidenceScore}% OCR
                      </span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-bold ${getSensitivityBadge(doc.sensitivity)}`}>
                        <Lock className="h-3 w-3" />
                        {doc.sensitivity}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onViewDocument(doc)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                          title="Visualizar e Texto OCR completo"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => onDownloadDocument(doc)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-600 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
                          title="Baixar arquivo ou OCR"
                        >
                          <Download className="h-4 w-4" />
                        </button>

                        {/* Move Folder Quick Trigger */}
                        <button
                          onClick={() => {
                            setMovingDocId(doc.id);
                            setTargetFolderId(doc.folderId);
                          }}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-purple-600 dark:hover:bg-slate-800 dark:hover:text-purple-400"
                          title="Mover de pasta"
                        >
                          <FolderInput className="h-4 w-4" />
                        </button>

                        {/* Delete Button (with permission check) */}
                        <button
                          onClick={() => onDeleteDocument(doc)}
                          disabled={!canDelete}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent dark:hover:bg-red-950/50"
                          title={canDelete ? "Excluir documento" : "Sem permissão de exclusão (Apenas Admin/Gestor)"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Documents Grid View */}
      {viewMode === "grid" && filteredDocs.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-blue-400 hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getFileIcon(doc.fileType)}
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{doc.fileType}</span>
                  </div>
                  <span className={`rounded border px-2 py-0.5 text-[10px] font-bold ${getSensitivityBadge(doc.sensitivity)}`}>
                    {doc.sensitivity}
                  </span>
                </div>

                <h3
                  onClick={() => onViewDocument(doc)}
                  className="mt-3 font-bold text-xs text-slate-900 hover:text-blue-600 dark:text-slate-100 dark:hover:text-blue-400 hover:underline cursor-pointer line-clamp-2"
                >
                  {doc.title}
                </h3>

                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                  "{doc.summary}"
                </p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {doc.subjects.map((s) => (
                    <span
                      key={s}
                      className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-[11px]">{formatBytes(doc.fileSize)}</span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onViewDocument(doc)}
                    className="rounded-lg bg-slate-100 p-1.5 text-slate-700 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:text-slate-300"
                    title="Visualizar e OCR"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDownloadDocument(doc)}
                    className="rounded-lg bg-slate-100 p-1.5 text-slate-700 hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:text-slate-300"
                    title="Download"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteDocument(doc)}
                    disabled={!canDelete}
                    className="rounded-lg bg-slate-100 p-1.5 text-slate-400 hover:bg-red-600 hover:text-white disabled:opacity-30 dark:bg-slate-800"
                    title="Excluir"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Move Document Modal Dialog */}
      {movingDocId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Mover Documento para outra Pasta
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Selecione o diretório de destino. A alteração será registrada no log de auditoria.
            </p>

            <div className="mt-4 space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nova Pasta de Destino:
              </label>
              <select
                value={targetFolderId}
                onChange={(e) => setTargetFolderId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    📁 {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setMovingDocId(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (movingDocId && targetFolderId) {
                    onMoveDocumentFolder(movingDocId, targetFolderId);
                    setMovingDocId(null);
                  }
                }}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Mover Arquivo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
