import React, { useState } from "react";
import {
  ScanText,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  FileText,
  Upload,
  Brain,
  Code,
  Tag,
  Shield,
  Clock,
  Layers,
} from "lucide-react";
import { DocumentItem } from "../types";

interface OcrCenterViewProps {
  documents: DocumentItem[];
  onUpdateDocumentOcr: (docId: string, newOcrData: Partial<DocumentItem>) => void;
  onLogAction: (action: string, details: string, docId?: string, docTitle?: string) => void;
}

export const OcrCenterView: React.FC<OcrCenterViewProps> = ({
  documents,
  onUpdateDocumentOcr,
  onLogAction,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || "");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "json" | "entities">("text");

  const currentDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const handleRunOcr = async () => {
    if (!currentDoc) return;
    setIsProcessing(true);

    try {
      const response = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: currentDoc.originalFileName,
          fileData: currentDoc.fileUrl || currentDoc.ocrText,
          mimeType: currentDoc.fileType === "pdf" ? "application/pdf" : "image/png",
          customPrompt: customPrompt || "Extraia todo o texto com máxima precisão e identifique dados chave.",
        }),
      });

      const data = await response.json();

      if (data && data.extractedText) {
        onUpdateDocumentOcr(currentDoc.id, {
          ocrText: data.extractedText,
          summary: data.summary || currentDoc.summary,
          confidenceScore: data.confidenceScore || 98.5,
          extractedEntities: data.extractedEntities || currentDoc.extractedEntities,
        });

        onLogAction(
          "OCR_RUN",
          `Re-processou OCR do arquivo com modelo Gemini 3.6 Flash. Confiança: ${data.confidenceScore}%`,
          currentDoc.id,
          currentDoc.title
        );
      }
    } catch (err) {
      console.error("Erro ao rodar OCR no Gemini:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = () => {
    if (!currentDoc) return;
    navigator.clipboard.writeText(currentDoc.ocrText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300">
                <Brain className="h-3.5 w-3.5" /> Motor Gemini 3.6 Flash
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Reconhecimento Óptico de Caracteres Avançado</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Centro de Processamento & Análise de OCR
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Selecione qualquer documento digitalizado para inspecionar a extração de texto em tempo real, testar prompts customizados e extrair entidades estruturadas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs font-bold text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  📄 {d.title.slice(0, 45)}...
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {currentDoc && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column - Document Info & Prompt Customizer */}
          <div className="space-y-6 lg:col-span-5">
            {/* Card Document Info */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Documento Selecionado
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <Sparkles className="h-3 w-3" /> {currentDoc.confidenceScore}% Acurácia
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {currentDoc.title}
                </h3>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 block font-semibold">Pasta:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">📁 {currentDoc.folderName}</span>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 block font-semibold">Sigilo:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">🔒 {currentDoc.sensitivity}</span>
                  </div>
                </div>

                <div className="rounded-xl bg-blue-50/60 p-3 text-xs text-blue-900 dark:bg-blue-950/40 dark:text-blue-200 border border-blue-100 dark:border-blue-900/50">
                  <strong className="block text-[11px] font-bold text-blue-700 dark:text-blue-300 mb-1">
                    Resumo Automático Gerado pela IA:
                  </strong>
                  <p className="text-xs leading-relaxed italic">
                    "{currentDoc.summary}"
                  </p>
                </div>
              </div>
            </div>

            {/* Prompt Customizer */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                <Brain className="h-4 w-4 text-purple-600" />
                Instrução de Análise Customizada (Prompt)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                Forneça diretrizes específicas para o motor Gemini extrair dados adicionais deste documento digitalizado.
              </p>

              <textarea
                rows={3}
                placeholder="Ex: Extraia o valor das parcelas, CNPJ do tomador e prazo de vigência contratual..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />

              <button
                onClick={handleRunOcr}
                disabled={isProcessing}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Processando no Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Re-Executar OCR com IA</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column - OCR Extracted Output Inspector */}
          <div className="space-y-4 lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              {/* Header Tabs */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("text")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                      activeTab === "text"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    Texto Completo (OCR)
                  </button>

                  <button
                    onClick={() => setActiveTab("entities")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                      activeTab === "entities"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    Entidades Extraídas ({currentDoc.extractedEntities.length})
                  </button>

                  <button
                    onClick={() => setActiveTab("json")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                      activeTab === "json"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    Esquema JSON
                  </button>
                </div>

                <button
                  onClick={handleCopyText}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-500" />
                      <span>Copiar Texto</span>
                    </>
                  )}
                </button>
              </div>

              {/* Tab Content */}
              <div className="mt-4">
                {activeTab === "text" && (
                  <div className="max-h-[420px] overflow-y-auto rounded-xl bg-slate-900 p-4 font-mono text-xs leading-relaxed text-slate-200 border border-slate-800 whitespace-pre-wrap">
                    {currentDoc.ocrText}
                  </div>
                )}

                {activeTab === "entities" && (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Chaves numéricas, entidades corporativas, CNPJs e datas identificadas automaticamente:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                      {currentDoc.extractedEntities.map((ent, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          <Tag className="h-4 w-4 text-blue-500 shrink-0" />
                          <span>{ent}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "json" && (
                  <pre className="max-h-[420px] overflow-y-auto rounded-xl bg-slate-950 p-4 font-mono text-[11px] text-emerald-400 border border-slate-800">
                    {JSON.stringify(
                      {
                        documentId: currentDoc.id,
                        title: currentDoc.title,
                        folder: currentDoc.folderName,
                        confidenceScore: currentDoc.confidenceScore,
                        documentDate: currentDoc.documentDate,
                        sensitivity: currentDoc.sensitivity,
                        summary: currentDoc.summary,
                        extractedEntities: currentDoc.extractedEntities,
                        rawOcrLength: currentDoc.ocrText.length,
                      },
                      null,
                      2
                    )}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
