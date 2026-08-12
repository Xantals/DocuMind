import React, { useState } from "react";
import { FolderPlus, X, Shield } from "lucide-react";
import { Folder, UserRole } from "../../types";

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (folder: Folder) => void;
  createdBy: string;
}

export const FolderModal: React.FC<FolderModalProps> = ({
  isOpen,
  onClose,
  onCreateFolder,
  createdBy,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [allowedRoles, setAllowedRoles] = useState<UserRole[]>(["admin", "manager", "operator", "viewer"]);

  if (!isOpen) return null;

  const handleToggleRole = (role: UserRole) => {
    if (allowedRoles.includes(role)) {
      if (allowedRoles.length > 1) {
        setAllowedRoles(allowedRoles.filter((r) => r !== role));
      }
    } else {
      setAllowedRoles([...allowedRoles, role]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newFolder: Folder = {
      id: `fld-${Date.now()}`,
      name: name.trim(),
      icon: "Folder",
      color,
      description: description || "Diretório de documentos digitalizados",
      allowedRoles,
      createdBy,
      createdAt: new Date().toISOString(),
      documentCount: 0,
    };

    onCreateFolder(newFolder);
    setName("");
    setDescription("");
    onClose();
  };

  const colorOptions = [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#ec4899", // Pink
    "#8b5cf6", // Purple
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#06b6d4", // Cyan
    "#64748b", // Slate
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-4 sm:p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 font-bold">
              <FolderPlus className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Criar Nova Pasta / Diretório
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Nome da Pasta:
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Recursos Humanos / Fichas Admissionais"
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Descrição:
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a finalidade desta pasta..."
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Cor do Ícone:
            </label>
            <div className="flex items-center gap-2">
              {colorOptions.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-6 w-6 rounded-full transition-transform ${
                    color === c ? "ring-2 ring-blue-500 ring-offset-2 scale-110" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Perfis de Usuário com Permissão de Acesso:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["admin", "manager", "operator", "viewer"] as UserRole[]).map((r) => {
                const isChecked = allowedRoles.includes(r);
                return (
                  <button
                    type="button"
                    key={r}
                    onClick={() => handleToggleRole(r)}
                    className={`flex items-center justify-between rounded-lg p-2 border text-[11px] font-bold uppercase transition-all ${
                      isChecked
                        ? "bg-blue-50 border-blue-300 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                        : "bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700"
                    }`}
                  >
                    <span>{r}</span>
                    <span>{isChecked ? "✓" : "+"}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white shadow-md hover:bg-blue-700"
            >
              Criar Pasta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
