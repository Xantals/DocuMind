import React, { useState } from "react";
import {
  Search,
  Filter,
  FileText,
  Calendar,
  Sparkles,
  Lock,
  Download,
  Eye,
  X,
  FileCheck2,
  SlidersHorizontal,
  DownloadCloud,
} from "lucide-react";
import { DocumentItem, Folder, Subject, SearchFilters } from "../types";

interface AdvancedSearchViewProps {
  documents: DocumentItem[];
  folders: Folder[];
  subjects: Subject[];
  onViewDocument: (doc: DocumentItem) => void;
  onDownloadDocument: (doc: DocumentItem) => void;
  onLogAction: (action: string, details: string, docId?: string, docTitle?: string) => void;
}

export const AdvancedSearchView: React.FC<AdvancedSearchViewProps> = ({
  documents,
  folders,
  subjects,
  onViewDocument,
  onDownloadDocument,
  onLogAction,
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    folderId: "",
    subjects: [],
    sensitivity: "",
    dateFrom: "",
    dateTo: "",
    fileType: "",
    minConfidence: 0,
    ocrOnly: false,
  });

  const [activeTab, setActiveTab] = useState<"all" | "ocr-text">("all");

  const toggleSubjectFilter = (sbjName: string) => {
    setFilters((prev) => {
      const exists = prev.subjects.includes(sbjName);
      if (exists) {
        return { ...prev, subjects: prev.subjects.filter((s) => s !== sbjName) };
      } else {
        return { ...prev, subjects: [...prev.subjects, sbjName] };
      }
    });
  };

  const resetFilters = () => {
    setFilters({
      query: "",
      folderId: "",
      subjects: [],
      sensitivity: "",
      dateFrom: "",
      dateTo: "",
      fileType: "",
      minConfidence: 0,
      ocrOnly: false,
    });
  };

  // Filter logic
  const searchResults = documents.filter((doc) => {
    if (filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchFileName = doc.originalFileName.toLowerCase().includes(q);
      const matchOcr = doc.ocrText.toLowerCase().includes(q);
      const matchSummary = doc.summary.toLowerCase().includes(q);
      const matchEntities = doc.extractedEntities.some((e) => e.toLowerCase().includes(q));

      if (filters.ocrOnly && !matchOcr) return false;
      if (!matchTitle && !matchFileName && !matchOcr && !matchSummary && !matchEntities) {
        return false;
      }
    }

    if (filters.folderId && doc.folderId !== filters.folderId) return false;

    if (filters.subjects.length > 0) {
      const hasSubject = filters.subjects.some((s) => doc.subjects.includes(s));
      if (!hasSubject) return false;
    }

    if (filters.sensitivity && doc.sensitivity !== filters.sensitivity) return false;

    if (filters.fileType && doc.fileType !== filters.fileType) return false;

    if (filters.minConfidence > 0 && doc.confidenceScore < filters.minConfidence) return false;

    if (filters.dateFrom) {
      if (new Date(doc.documentDate) < new Date(filters.dateFrom)) return false;
    }

    if (filters.dateTo) {
      if (new Date(doc.documentDate) > new Date(filters.dateTo)) return false;
    }

    return true;
  });

  // Helper function to highlight query in OCR text snippet
  const renderOcrSnippet = (text: string, query: string) => {
    if (!query.trim()) {
      return text.slice(0, 220) + "...";
    }

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase().trim();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) {
      return text.slice(0, 220) + "...";
    }

    const start = Math.max(0, index - 60);
    const end = Math.min(text.length, index + lowerQuery.length + 120);
    const snippet = text.slice(start, end);

    return (
      <span>
        {start > 0 ? "..." : ""}
        {snippet.split(new RegExp(`(${query})`, "gi")).map((part, i) =>
          part.toLowerCase() === lowerQuery ? (
            <mark key={i} className="bg-amber-200 text-amber-900 rounded font-bold px-1 dark:bg-amber-500/40 dark:text-amber-200">
              {part}
            </mark>
          ) : (
            part
          )
        )}
        {end < text.length ? "..." : ""}
      </span>
    );
  };

  const handleExportSearchResults = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Título,NomeArquivo,Pasta,DataDocumento,Sensibilidade,AcuraciaOCR,Resumo"]
        .concat(
          searchResults.map(
            (d) =>
              `"${d.id}","${d.title.replace(/"/g, '""')}","${d.originalFileName}","${d.folderName}","${d.documentDate}","${d.sensitivity}","${d.confidenceScore}%","${d.summary.replace(/"/g, '""')}"`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_busca_ocr_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onLogAction(
      "DOWNLOAD",
      `Exportou relatório em CSV com ${searchResults.length} resultados de busca avançada`
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Search Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 mb-2">
          <SlidersHorizontal className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Módulo de Busca Avançada & Indexador OCR
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Realize buscas por termos exatos no conteúdo OCR extraído pela IA, metadados, entidades financeiras, jurisprudências e datas.
        </p>

        {/* Main Query Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Digite palavras-chave, nomes de empresa, CNPJ, valores ou cláusulas do documento..."
            value={filters.query}
            onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-12 pr-10 text-sm text-slate-900 shadow-inner focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-400"
          />
          {filters.query && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, query: "" }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Grid */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {/* Folder Select */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Pasta / Diretório:</label>
            <select
              value={filters.folderId}
              onChange={(e) => setFilters((prev) => ({ ...prev, folderId: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="">Todas as Pastas</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  📁 {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sensitivity Select */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Nível de Sigilo:</label>
            <select
              value={filters.sensitivity}
              onChange={(e) => setFilters((prev) => ({ ...prev, sensitivity: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="">Todos os Níveis</option>
              <option value="Público">Público</option>
              <option value="Interno">Interno</option>
              <option value="Restrito">Restrito</option>
              <option value="Confidencial">Confidencial</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Data Inicial do Doc:</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Data Final do Doc:</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Subjects Multi Checkbox */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            Filtrar por Assunto / Categoria:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {subjects.map((sbj) => {
              const isChecked = filters.subjects.includes(sbj.name);
              return (
                <button
                  key={sbj.id}
                  onClick={() => toggleSubjectFilter(sbj.name)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                    isChecked
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {isChecked ? "✓ " : ""}{sbj.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* OCR Only & Reset bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={filters.ocrOnly}
              onChange={(e) => setFilters((prev) => ({ ...prev, ocrOnly: e.target.checked }))}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Buscar estritamente dentro do corpo do texto OCR</span>
          </label>

          <button
            onClick={resetFilters}
            className="text-slate-500 hover:text-slate-800 underline dark:hover:text-slate-200 text-xs"
          >
            Limpar Todos os Filtros
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Resultados da Pesquisa ({searchResults.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {filters.query
              ? `Termo pesquisado: "${filters.query}"`
              : "Exibindo todos os documentos filtrados"}
          </p>
        </div>

        {searchResults.length > 0 && (
          <button
            onClick={handleExportSearchResults}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <DownloadCloud className="h-4 w-4 text-emerald-600" />
            <span>Exportar CSV</span>
          </button>
        )}
      </div>

      {/* Search Results List */}
      {searchResults.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <Search className="mx-auto h-10 w-10 text-slate-400" />
          <h4 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-200">
            Nenhum documento encontrado para estes critérios
          </h4>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Tente buscar por sinônimos ou reduzir a quantidade de filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {searchResults.map((doc) => (
            <div
              key={doc.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-400 transition-all dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      📁 {doc.folderName}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                      <Sparkles className="h-3 w-3" /> OCR {doc.confidenceScore}%
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      Sigilo: {doc.sensitivity}
                    </span>
                  </div>

                  <h4
                    onClick={() => onViewDocument(doc)}
                    className="text-sm font-bold text-slate-900 hover:text-blue-600 dark:text-slate-100 dark:hover:text-blue-400 hover:underline cursor-pointer"
                  >
                    {doc.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100 dark:bg-slate-800/60 dark:border-slate-800">
                    <strong className="text-blue-600 dark:text-blue-400 text-[11px] block mb-0.5">
                      Trecho OCR Encontrado:
                    </strong>
                    {renderOcrSnippet(doc.ocrText, filters.query)}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                    <span>Arquivo: <strong className="text-slate-600 dark:text-slate-300">{doc.originalFileName}</strong></span>
                    <span>•</span>
                    <span>Data: {new Date(doc.documentDate).toLocaleDateString("pt-BR")}</span>
                    <span>•</span>
                    <span>Enviado por: {doc.uploadedBy.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 md:self-center">
                  <button
                    onClick={() => onViewDocument(doc)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Visualizar</span>
                  </button>
                  <button
                    onClick={() => onDownloadDocument(doc)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <Download className="h-4 w-4" />
                    <span>Baixar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
