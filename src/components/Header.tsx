import React from "react";
import {
  Search,
  Upload,
  UserCheck,
  Shield,
  Bell,
  FileText,
  FolderPlus,
  Sparkles,
  Lock,
  LogIn,
  LogOut,
  Menu,
} from "lucide-react";
import { User, UserRole } from "../types";
import { loginWithGoogle, logoutUser } from "../lib/firebase";

interface HeaderProps {
  currentUser: User;
  allUsers: User[];
  onSelectUser: (user: User) => void;
  onOpenUpload: () => void;
  onOpenFolderModal: () => void;
  onQuickSearch: (query: string) => void;
  activeTab: string;
  firebaseUser?: any;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  onOpenUpload,
  onOpenFolderModal,
  onQuickSearch,
  activeTab,
  firebaseUser,
  onToggleMobileMenu,
}) => {
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return { label: "Administrador", bg: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200" };
      case "manager":
        return { label: "Gestor", bg: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200" };
      case "operator":
        return { label: "Operador", bg: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200" };
      case "viewer":
        return { label: "Leitor / Auditor", bg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200" };
    }
  };

  const badge = getRoleBadge(currentUser.role);

  const getTabTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Visão Geral & Métricas";
      case "documents":
        return "Gestão de Documentos";
      case "search":
        return "Busca Avançada & Filtros OCR";
      case "ocr":
        return "Centro OCR (IA)";
      case "permissions":
        return "Controle de Permissões";
      case "audit":
        return "Trilha de Auditoria";
      default:
        return "DocuMind";
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-3 sm:px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 gap-2">
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Mobile Menu Button */}
        <button
          onClick={onToggleMobileMenu}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden dark:text-slate-300 dark:hover:bg-slate-800 shrink-0"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100 truncate">
            {getTabTitle()}
          </h1>
          <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 truncate">
            Sistema de Controle Eletrônico de Documentos Digitalizados
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Quick Search - hidden on mobile, available via search tab or modal */}
        <div className="relative hidden lg:block w-60 xl:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar nos arquivos..."
            onChange={(e) => onQuickSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-blue-400"
          />
        </div>

        {/* Action Buttons */}
        <button
          onClick={onOpenFolderModal}
          disabled={currentUser.role === "viewer"}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          title={currentUser.role === "viewer" ? "Perfil 'Leitor' não tem permissão para criar pasta" : "Criar nova pasta"}
        >
          <FolderPlus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="hidden md:inline">Nova Pasta</span>
        </button>

        <button
          onClick={onOpenUpload}
          disabled={currentUser.role === "viewer"}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 sm:px-3.5 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-blue-500"
          title={currentUser.role === "viewer" ? "Perfil 'Leitor' não tem permissão para upload" : "Digitalizar e enviar arquivo"}
        >
          <Upload className="h-4 w-4" />
          <span className="hidden xs:inline sm:inline">Upload</span>
        </button>

        <div className="hidden sm:block h-5 w-px bg-slate-200 dark:bg-slate-800" />

        {/* User Role Switcher */}
        <div className="relative flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="h-6 w-6 sm:h-7 sm:w-7 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-600 shrink-0"
          />

          <select
            value={currentUser.id}
            onChange={(e) => {
              const selected = allUsers.find((u) => u.id === e.target.value);
              if (selected) onSelectUser(selected);
            }}
            className="rounded-md border border-slate-300 bg-white py-0.5 sm:py-1 px-1.5 text-[11px] sm:text-xs font-medium text-slate-700 shadow-2xs hover:border-slate-400 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 max-w-[110px] sm:max-w-[160px] truncate"
            title="Simular login de outro usuário para testar permissões"
          >
            {allUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role.substring(0, 3).toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {firebaseUser ? (
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
            title="Sair do Google Firebase"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Sair</span>
          </button>
        ) : (
          <button
            onClick={handleGoogleLogin}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            title="Entrar com conta Google via Firebase Auth"
          >
            <LogIn className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden xl:inline">Google</span>
          </button>
        )}
      </div>
    </header>
  );
};
