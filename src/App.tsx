import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { DashboardView } from "./components/DashboardView";
import { DocumentsView } from "./components/DocumentsView";
import { AdvancedSearchView } from "./components/AdvancedSearchView";
import { OcrCenterView } from "./components/OcrCenterView";
import { PermissionsView } from "./components/PermissionsView";
import { AuditLogsView } from "./components/AuditLogsView";
import { UploadModal } from "./components/modals/UploadModal";
import { FolderModal } from "./components/modals/FolderModal";
import { DocumentViewerModal } from "./components/modals/DocumentViewerModal";

import {
  MOCK_USERS,
  MOCK_FOLDERS,
  MOCK_SUBJECTS,
  INITIAL_DOCUMENTS,
  INITIAL_AUDIT_LOGS,
} from "./data/initialData";
import {
  User,
  Folder,
  Subject,
  DocumentItem,
  AuditLog,
  UserRole,
  AuditAction,
  AuditSeverity,
} from "./types";
import {
  auth,
  saveInitialDataIfEmpty,
  subscribeToDocuments,
  subscribeToFolders,
  subscribeToAuditLogs,
  saveDocumentToFirestore,
  updateDocumentInFirestore,
  deleteDocumentFromFirestore,
  saveFolderToFirestore,
  addAuditLogToFirestore,
  testFirestoreConnection,
} from "./lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem("documind_user");
    return saved ? JSON.parse(saved) : MOCK_USERS[0];
  });

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [folders, setFolders] = useState<Folder[]>(MOCK_FOLDERS);
  const [subjects] = useState<Subject[]>(MOCK_SUBJECTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [viewerDoc, setViewerDoc] = useState<DocumentItem | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: "info" | "success" | "warning" } | null>(null);

  // Initialize Firestore and Listeners
  useEffect(() => {
    testFirestoreConnection();
    saveInitialDataIfEmpty(INITIAL_DOCUMENTS, MOCK_FOLDERS, INITIAL_AUDIT_LOGS);

    const unsubDocs = subscribeToDocuments((data) => {
      if (data && data.length > 0) setDocuments(data);
    });

    const unsubFolders = subscribeToFolders((data) => {
      if (data && data.length > 0) setFolders(data);
    });

    const unsubLogs = subscribeToAuditLogs((data) => {
      if (data && data.length > 0) setAuditLogs(data);
    });

    const unsubAuth = onAuthStateChanged(auth, (fUser) => {
      setFirebaseUser(fUser);
      if (fUser) {
        // Map firebase user to current user profile
        const gUser: User = {
          id: fUser.uid,
          name: fUser.displayName || fUser.email?.split('@')[0] || "Usuário Google",
          email: fUser.email || "usuario@google.com",
          role: "admin", // Authenticated Google Admin
          department: "Diretoria Executiva",
          avatar: fUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        };
        setCurrentUser(gUser);
        showToast(`Conectado como ${gUser.name} via Firebase Google Auth!`, "success");
      }
    });

    return () => {
      unsubDocs();
      unsubFolders();
      unsubLogs();
      unsubAuth();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("documind_user", JSON.stringify(currentUser));
  }, [currentUser]);

  const showToast = (message: string, type: "info" | "success" | "warning" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Log Audit Action Helper
  const logAuditEvent = (
    action: AuditAction,
    details: string,
    docId?: string,
    docTitle?: string,
    severity: AuditSeverity = "info"
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      userEmail: currentUser.email,
      action,
      documentId: docId,
      documentTitle: docTitle,
      details,
      ipAddress: "187.108.22.90",
      device: "Chrome / macOS Monterey",
      severity,
    };

    setAuditLogs((prev) => [newLog, ...prev]);
    addAuditLogToFirestore(newLog);
  };

  // User Switch Handler
  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    showToast(`Simulando perfil: ${user.name} (${user.role.toUpperCase()})`, "info");
    logAuditEvent(
      "VIEW",
      `Alterou a sessão simulada de usuário para '${user.name}' (${user.role.toUpperCase()})`
    );
  };

  // Add Document
  const handleUploadSuccess = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
    saveDocumentToFirestore(newDoc);

    showToast(`Documento '${newDoc.title}' digitalizado e indexado no Firestore!`, "success");

    logAuditEvent(
      "UPLOAD",
      `Fez upload e digitalização do arquivo '${newDoc.originalFileName}' na pasta '${newDoc.folderName}'. OCR executado com ${newDoc.confidenceScore}% de acurácia.`,
      newDoc.id,
      newDoc.title,
      "success"
    );
  };

  // Create Folder
  const handleCreateFolder = (newFolder: Folder) => {
    setFolders((prev) => [...prev, newFolder]);
    saveFolderToFirestore(newFolder);

    showToast(`Pasta '${newFolder.name}' salva no Firestore!`, "success");

    logAuditEvent(
      "CREATE_FOLDER",
      `Criou nova pasta '${newFolder.name}'. Permissões: ${newFolder.allowedRoles.join(", ").toUpperCase()}`,
      undefined,
      undefined,
      "success"
    );
  };

  // Update Folder Roles
  const handleUpdateFolderRoles = (folderId: string, allowedRoles: UserRole[]) => {
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id === folderId) {
          const updated = { ...f, allowedRoles };
          saveFolderToFirestore(updated);
          return updated;
        }
        return f;
      })
    );
  };

  // View Document Handler
  const handleViewDocument = (doc: DocumentItem) => {
    setViewerDoc(doc);
    const newCount = doc.accessCount + 1;
    setDocuments((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, accessCount: newCount } : d))
    );
    updateDocumentInFirestore(doc.id, { accessCount: newCount });

    logAuditEvent(
      "VIEW",
      `Visualizou o documento e texto OCR na pasta '${doc.folderName}'.`,
      doc.id,
      doc.title,
      "info"
    );
  };

  // Download Document Handler
  const handleDownloadDocument = (doc: DocumentItem) => {
    // Generate text file download
    const element = document.createElement("a");
    const fileContent = `================================================
DOCUMIND GED - CONTROLE DE DOCUMENTOS DIGITALIZADOS
================================================
TÍTULO: ${doc.title}
ARQUIVO ORIGINAL: ${doc.originalFileName}
PASTA: ${doc.folderName}
DATA DO DOCUMENTO: ${doc.documentDate}
SIGILO: ${doc.sensitivity}
ACURÁCIA OCR: ${doc.confidenceScore}%
SISTEMA DE EXTRAÇÃO: Gemini 3.6 Flash IA
================================================
RESUMO EXECUTIVO:
${doc.summary}

================================================
ENTIDADES EXTRAÍDAS:
${doc.extractedEntities.map((e) => `- ${e}`).join("\n")}

================================================
TEXTO COMPLETO EXTRAÍDO (OCR):
${doc.ocrText}
`;

    const file = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `${doc.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_ocr.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    const newCount = doc.downloadCount + 1;
    setDocuments((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, downloadCount: newCount } : d))
    );
    updateDocumentInFirestore(doc.id, { downloadCount: newCount });

    showToast(`Download de '${doc.title}' concluído!`, "success");

    logAuditEvent(
      "DOWNLOAD",
      `Efetuou download do arquivo e texto OCR na pasta '${doc.folderName}'.`,
      doc.id,
      doc.title,
      "info"
    );
  };

  // Delete Document Handler
  const handleDeleteDocument = (doc: DocumentItem) => {
    if (currentUser.role !== "admin" && currentUser.role !== "manager") {
      showToast("Apenas perfis Administrador e Gestor possuem permissão para exclusão.", "warning");
      return;
    }

    if (confirm(`Tem certeza que deseja excluir permanentemente o documento "${doc.title}" do Firestore? Esta ação será gravada no log de auditoria.`)) {
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
      if (viewerDoc?.id === doc.id) setViewerDoc(null);

      deleteDocumentFromFirestore(doc.id);

      showToast(`Documento '${doc.title}' excluído.`, "warning");

      logAuditEvent(
        "DELETE",
        `Excluiu o documento digitalizado '${doc.originalFileName}' da pasta '${doc.folderName}'.`,
        doc.id,
        doc.title,
        "danger"
      );
    }
  };

  // Move Document Folder
  const handleMoveDocumentFolder = (docId: string, newFolderId: string) => {
    const targetFolder = folders.find((f) => f.id === newFolderId);
    if (!targetFolder) return;

    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, folderId: targetFolder.id, folderName: targetFolder.name }
          : d
      )
    );
    updateDocumentInFirestore(docId, { folderId: targetFolder.id, folderName: targetFolder.name });

    const doc = documents.find((d) => d.id === docId);
    showToast(`Documento movido para a pasta '${targetFolder.name}'`, "info");

    logAuditEvent(
      "MOVE_FOLDER",
      `Moveu o documento para a pasta '${targetFolder.name}'.`,
      docId,
      doc?.title || "Documento",
      "info"
    );
  };

  // Update OCR Data Handler
  const handleUpdateDocumentOcr = (docId: string, newOcrData: Partial<DocumentItem>) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, ...newOcrData } : d))
    );
    updateDocumentInFirestore(docId, newOcrData);
    showToast("Re-processamento OCR com Gemini salvo no Firestore!", "success");
  };

  // Quick Search Jump
  const handleQuickSearch = (query: string) => {
    if (query.trim()) {
      setActiveTab("search");
    }
  };

  // Total Storage MB
  const totalStorageMb = documents.reduce((acc, d) => acc + d.fileSize, 0) / (1024 * 1024);

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        folders={folders}
        selectedFolderId={selectedFolderId}
        onSelectFolder={(fId) => setSelectedFolderId(fId)}
        totalStorageMb={totalStorageMb}
        totalDocumentsCount={documents.length}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Workspace */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header
          currentUser={currentUser}
          allUsers={MOCK_USERS}
          onSelectUser={handleSelectUser}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenFolderModal={() => setIsFolderModalOpen(true)}
          onQuickSearch={handleQuickSearch}
          activeTab={activeTab}
          firebaseUser={firebaseUser}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        {/* Toast Notification Alert */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl border border-slate-700 animate-bounce">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            <span>{toast.message}</span>
          </div>
        )}

        {/* Dynamic Tab Views */}
        <main className="flex-1 overflow-y-auto bg-slate-50/60 dark:bg-slate-950/60">
          {activeTab === "dashboard" && (
            <DashboardView
              documents={documents}
              folders={folders}
              subjects={subjects}
              auditLogs={auditLogs}
              currentUser={currentUser}
              onOpenUpload={() => setIsUploadOpen(true)}
              onOpenFolderModal={() => setIsFolderModalOpen(true)}
              onNavigateToTab={(tab, fId) => {
                setActiveTab(tab);
                if (fId !== undefined) setSelectedFolderId(fId);
              }}
            />
          )}

          {activeTab === "documents" && (
            <DocumentsView
              documents={documents}
              folders={folders}
              subjects={subjects}
              currentUser={currentUser}
              selectedFolderId={selectedFolderId}
              onSelectFolder={setSelectedFolderId}
              onViewDocument={handleViewDocument}
              onDeleteDocument={handleDeleteDocument}
              onDownloadDocument={handleDownloadDocument}
              onMoveDocumentFolder={handleMoveDocumentFolder}
              onOpenUpload={() => setIsUploadOpen(true)}
              onOpenFolderModal={() => setIsFolderModalOpen(true)}
            />
          )}

          {activeTab === "search" && (
            <AdvancedSearchView
              documents={documents}
              folders={folders}
              subjects={subjects}
              onViewDocument={handleViewDocument}
              onDownloadDocument={handleDownloadDocument}
              onLogAction={(act, det, dId, dTitle) =>
                logAuditEvent(act as AuditAction, det, dId, dTitle)
              }
            />
          )}

          {activeTab === "ocr" && (
            <OcrCenterView
              documents={documents}
              onUpdateDocumentOcr={handleUpdateDocumentOcr}
              onLogAction={(act, det, dId, dTitle) =>
                logAuditEvent(act as AuditAction, det, dId, dTitle)
              }
            />
          )}

          {activeTab === "permissions" && (
            <PermissionsView
              currentUser={currentUser}
              allUsers={MOCK_USERS}
              folders={folders}
              onSelectUser={handleSelectUser}
              onUpdateFolderRoles={handleUpdateFolderRoles}
              onLogAction={(act, det) => logAuditEvent(act as AuditAction, det)}
            />
          )}

          {activeTab === "audit" && (
            <AuditLogsView
              auditLogs={auditLogs}
              onLogAction={(act, det) => logAuditEvent(act as AuditAction, det)}
            />
          )}
        </main>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        folders={folders}
        subjects={subjects}
        currentUser={currentUser}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Folder Modal */}
      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onCreateFolder={handleCreateFolder}
        createdBy={currentUser.name}
      />

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        document={viewerDoc}
        currentUser={currentUser}
        onClose={() => setViewerDoc(null)}
        onDownload={handleDownloadDocument}
        onDelete={handleDeleteDocument}
        onReRunOcr={(doc) => {
          setViewerDoc(null);
          setActiveTab("ocr");
        }}
      />
    </div>
  );
}
