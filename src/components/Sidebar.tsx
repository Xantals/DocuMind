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
  X,
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
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  folders,
  selectedFolderId,
  onSelectFolder,
  totalStorageMb,
  totalDocumentsCount,
  isMobileOpen = false,
  onCloseMobile,
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

  const sidebarContent = (
    <aside className="flex h-full w-full flex-col border-r border-slate-200/80 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
      {/* Brand Logo */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
            <FileText className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100 text-base leading-tight">
              <span>DocuMind</span>
              <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-600 border border-blue-200/60 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800">
                GED v2.5
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Digitalização & OCR IA</span>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 md:hidden dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <div className="mb-2 px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
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
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isActive
                          ? "bg-blue-700 text-blue-100"
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
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
          <div className="mb-2 flex items-center justify-between px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            <span>Pastas & Assuntos</span>
            <button
              onClick={() => {
                setActiveTab("documents");
                onSelectFolder(null);
                if (onCloseMobile) onCloseMobile();
              }}
              className="text-[10px] text-blue-600 font-semibold hover:underline dark:text-blue-400"
            >
              Ver Todas
            </button>
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => {
                setActiveTab("documents");
                onSelectFolder(null);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === "documents" && selectedFolderId === null
                  ? "bg-blue-50 text-blue-700 font-semibold dark:bg-slate-800 dark:text-blue-400"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60"
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
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs transition-colors ${
                    isSelected
                      ? "bg-blue-50 text-blue-700 font-semibold dark:bg-slate-800 dark:text-blue-400"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60"
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
                    <span className="text-[10px] text-slate-400 font-mono">{fld.documentCount}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Storage Footer */}
      <div className="border-t border-slate-100 p-4 dark:border-slate-800">
        <div className="rounded-xl bg-slate-50 p-3 text-xs border border-slate-200/70 dark:bg-slate-800/60 dark:border-slate-700/60">
          <div className="mb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
              <HardDrive className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>Armazenamento</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono dark:text-slate-400">
              {totalStorageMb.toFixed(1)} MB / 10 GB
            </span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${Math.max(2, storagePercentage)}%` }}
            />
          </div>

          <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
            <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
            <span>OCR Gemini indexado em tempo real</span>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <div className="hidden md:flex h-screen w-64 flex-col shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex w-72 max-w-[85vw] flex-1 flex-col z-10 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
