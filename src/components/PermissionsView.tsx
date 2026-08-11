import React from "react";
import {
  ShieldCheck,
  UserCheck,
  Lock,
  FolderLock,
  Check,
  X,
  ShieldAlert,
  Info,
  Users,
} from "lucide-react";
import { User, UserRole, Folder } from "../types";

interface PermissionsViewProps {
  currentUser: User;
  allUsers: User[];
  folders: Folder[];
  onSelectUser: (user: User) => void;
  onUpdateFolderRoles: (folderId: string, allowedRoles: UserRole[]) => void;
  onLogAction: (action: string, details: string) => void;
}

export const PermissionsView: React.FC<PermissionsViewProps> = ({
  currentUser,
  allUsers,
  folders,
  onSelectUser,
  onUpdateFolderRoles,
  onLogAction,
}) => {
  const roleMatrix = [
    {
      action: "Visualização de Documentos",
      desc: "Ler documentos públicos e internos das pastas permitidas",
      admin: true,
      manager: true,
      operator: true,
      viewer: true,
    },
    {
      action: "Upload & Digitalização",
      desc: "Enviar novos arquivos digitalizados para o repositório",
      admin: true,
      manager: true,
      operator: true,
      viewer: false,
    },
    {
      action: "Download de Arquivos",
      desc: "Baixar cópias dos arquivos originais e do texto OCR",
      admin: true,
      manager: true,
      operator: true,
      viewer: true,
    },
    {
      action: "Exclusão de Documentos",
      desc: "Remover permanentemente arquivos com registro em auditoria",
      admin: true,
      manager: true,
      operator: false,
      viewer: false,
    },
    {
      action: "Criar & Editar Pastas",
      desc: "Adicionar e reconfigurar estrutura de diretórios do sistema",
      admin: true,
      manager: true,
      operator: false,
      viewer: false,
    },
    {
      action: "Executar OCR Inteligente",
      desc: "Processar novos prompts de extração no modelo Gemini IA",
      admin: true,
      manager: true,
      operator: true,
      viewer: false,
    },
    {
      action: "Acesso a Documentos Sigilosos",
      desc: "Visualizar arquivos com nível de confidencialidade 'Confidencial'",
      admin: true,
      manager: false,
      operator: false,
      viewer: false,
    },
    {
      action: "Acesso a Logs de Auditoria",
      desc: "Consultar a trilha de auditoria e relatórios de segurança",
      admin: true,
      manager: true,
      operator: false,
      viewer: true,
    },
  ];

  const handleToggleFolderRole = (folder: Folder, role: UserRole) => {
    if (currentUser.role !== "admin") {
      alert("Apenas perfil Administrador pode modificar permissões de pastas.");
      return;
    }

    const currentRoles = folder.allowedRoles || [];
    let updatedRoles: UserRole[];

    if (currentRoles.includes(role)) {
      if (currentRoles.length === 1) {
        alert("Pelo menos um perfil deve manter acesso à pasta.");
        return;
      }
      updatedRoles = currentRoles.filter((r) => r !== role);
    } else {
      updatedRoles = [...currentRoles, role];
    }

    onUpdateFolderRoles(folder.id, updatedRoles);
    onLogAction(
      "CHANGE_PERMISSION",
      `Alteou permissões de acesso da pasta '${folder.name}'. Funções autorizadas: ${updatedRoles.join(", ").toUpperCase()}`
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-800 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300">
                <ShieldCheck className="h-3.5 w-3.5" /> Controle de Acesso Baseado em Papéis (RBAC)
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Permissões de Usuário e Segurança
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
              Gerencie a matriz de privilégios de acesso do sistema por papel (Administrador, Gestor, Operador e Leitor) e configure permissões por pasta.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 text-xs border border-slate-200 dark:bg-slate-800 dark:border-slate-700 shrink-0">
            <span className="text-slate-400 font-semibold block text-[10px]">SIMULADOR DE USUÁRIO ATIVO:</span>
            <div className="flex items-center gap-2 mt-1">
              <img src={currentUser.avatar} alt={currentUser.name} className="h-6 w-6 rounded-full" />
              <strong className="text-slate-900 dark:text-white">{currentUser.name}</strong>
              <span className="rounded bg-purple-600 px-1.5 py-0.2 text-[10px] font-bold text-white uppercase">
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Matrix Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Matriz Geral de Privilégios por Função
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
              <tr>
                <th className="py-3 px-4 font-bold">Ação / Operação</th>
                <th className="py-3 px-4 font-bold">Descrição do Privilégio</th>
                <th className="py-3 px-3 font-bold text-center">Admin</th>
                <th className="py-3 px-3 font-bold text-center">Gestor</th>
                <th className="py-3 px-3 font-bold text-center">Operador</th>
                <th className="py-3 px-3 font-bold text-center">Leitor / Auditor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {roleMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {item.action}
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                    {item.desc}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {item.admin ? (
                      <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {item.manager ? (
                      <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {item.operator ? (
                      <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {item.viewer ? (
                      <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Folder Access Rights Grid */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Permissões de Acesso por Pasta
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Clique nas caixas de seleção para conceder ou revogar o acesso de cada papel aos diretórios específicos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {folders.map((folder) => {
            const allowed = folder.allowedRoles || ["admin", "manager", "operator", "viewer"];
            return (
              <div
                key={folder.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: folder.color }} />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {folder.name}
                  </h4>
                </div>

                <div className="space-y-1.5 mt-3 text-xs">
                  {(["admin", "manager", "operator", "viewer"] as UserRole[]).map((r) => {
                    const isChecked = allowed.includes(r);
                    return (
                      <label
                        key={r}
                        className="flex items-center justify-between rounded-lg bg-white p-2 border border-slate-200/80 cursor-pointer hover:bg-blue-50/40 dark:bg-slate-900 dark:border-slate-700/80"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase text-[10px]">
                          {r}
                        </span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleFolderRole(folder, r)}
                          disabled={currentUser.role !== "admin"}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
