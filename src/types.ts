export type UserRole = "admin" | "manager" | "operator" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar: string;
}

export interface Folder {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  parentId?: string | null;
  allowedRoles: UserRole[];
  createdBy: string;
  createdAt: string;
  documentCount?: number;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  description: string;
}

export type SensitivityLevel = "Público" | "Interno" | "Restrito" | "Confidencial";

export type OcrStatus = "pending" | "processing" | "completed" | "failed";

export interface DocumentItem {
  id: string;
  title: string;
  originalFileName: string;
  fileType: "pdf" | "jpg" | "png" | "docx" | "xlsx";
  fileSize: number; // bytes
  folderId: string;
  folderName: string;
  subjects: string[];
  uploadedBy: {
    id: string;
    name: string;
    email: string;
  };
  uploadedAt: string;
  documentDate: string;
  sensitivity: SensitivityLevel;
  ocrStatus: OcrStatus;
  ocrText: string;
  summary: string;
  confidenceScore: number;
  extractedEntities: string[];
  fileUrl?: string; // base64 or URL
  previewThumbnail?: string;
  version: string;
  allowedRoles: UserRole[];
  accessCount: number;
  downloadCount: number;
}

export type AuditAction =
  | "UPLOAD"
  | "VIEW"
  | "DOWNLOAD"
  | "DELETE"
  | "EDIT_METADATA"
  | "MOVE_FOLDER"
  | "CHANGE_PERMISSION"
  | "OCR_RUN"
  | "CREATE_FOLDER";

export type AuditSeverity = "info" | "success" | "warning" | "danger";

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userEmail: string;
  action: AuditAction;
  documentId?: string;
  documentTitle?: string;
  details: string;
  ipAddress: string;
  device: string;
  severity: AuditSeverity;
}

export interface SearchFilters {
  query: string;
  folderId: string;
  subjects: string[];
  sensitivity: string;
  dateFrom: string;
  dateTo: string;
  fileType: string;
  minConfidence: number;
  ocrOnly: boolean;
}
