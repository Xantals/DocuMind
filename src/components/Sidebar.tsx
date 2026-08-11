import React from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Search,
  ScanText,
  ShieldCheck,
  History,
  FileText,
  Folder as FolderIcon,
  HardDrive,
  Database,
  Sparkles,
} from "lucide-react";
import { Folder } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  folders: Folder[];
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  totalStorageMb: number;
  totalDocumentsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  folders,
  selectedFolderId,
  onSelectFolder,
  totalStorageMb,
  totalDocumentsCount,
}) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { id: "documents", label: "Documentos & Pastas", icon: FolderKanban, badge: totalDocumentsCount },
    { id: "search", label: "Busca Avançada", icon: Search, badge: "OCR" },
    { id: "ocr", label: "Centro OCR (IA)", icon: ScanText, badge: "Gemini" },
    { id: "permissions", label: "Permissões de Acesso", icon: ShieldCheck, badge: null },
    { id: "audit", label: "Logs de Auditoria", icon: History, badge: null },
  ];

  // Storage calculation (10 GB cap = 10,240 MB)
  const storageCapacityMb = 10240;
  const storagePercentage = Math.min(100, (totalStorageMb / storageCapacityMb) * 100);

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-slate-900 text-slate-300 dark:border-slate-800">
      {/* Brand Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/20">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 font-bold text-slate-100 text-base leading-tight">
            <span>DocuMind</span>
            <span className="rounded bg-blue-500/20 px-1 py-0.2 text-[9px] font-bold text-blue-400 border border-blue-500/30">
              GED v2.5
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Digitalização & OCR IA</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <div className="mb-2 px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Menu Principal
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id === "documents") {
                      // reset folder filter if needed
                    }
                  }}
                  className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                      : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        isActive
                          ? "bg-blue-700 text-blue-100"
                          : "bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Folders Navigation */}
        <div>
          <div className="mb-2 flex items-center justify-between px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            <span>Pastas & Assuntos</span>
            <button
              onClick={() => {
                setActiveTab("documents");
                onSelectFolder(null);
              }}
              className="text-[10px] text-blue-400 hover:underline"
            >
              Ver Todas
            </button>
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => {
                setActiveTab("documents");
                onSelectFolder(null);
              }}
              className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === "documents" && selectedFolderId === null
                  ? "bg-slate-800 text-blue-400 font-semibold"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <FolderIcon className="h-3.5 w-3.5 text-slate-400" />
              <span className="truncate">Todos os Arquivos</span>
            </button>

            {folders.map((fld) => {
              const isSelected = activeTab === "documents" && selectedFolderId === fld.id;
              return (
                <button
                  key={fld.id}
                  onClick={() => {
                    setActiveTab("documents");
                    onSelectFolder(fld.id);
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs transition-colors ${
                    isSelected
                      ? "bg-slate-800 text-blue-400 font-semibold"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: fld.color || "#3b82f6" }}
                    />
                    <span className="truncate">{fld.name}</span>
                  </div>
                  {fld.documentCount !== undefined && fld.documentCount > 0 && (
                    <span className="text-[10px] text-slate-500 font-mono">{fld.documentCount}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Storage Footer */}
      <div className="border-t border-slate-800 p-4">
        <div className="rounded-xl bg-slate-800/80 p-3 text-xs border border-slate-700/60">
          <div className="mb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-medium text-slate-200">
              <HardDrive className="h-3.5 w-3.5 text-blue-400" />
              <span>Armazenamento</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {totalStorageMb.toFixed(1)} MB / 10 GB
            </span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-500"
              style={{ width: `${Math.max(2, storagePercentage)}%` }}
            />
          </div>

          <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-400">
            <Sparkles className="h-3 w-3 text-amber-400 shrink-0" />
            <span>OCR Gemini indexado em tempo real</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
