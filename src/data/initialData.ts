import { User, Folder, Subject, DocumentItem, AuditLog } from "../types";

export const MOCK_USERS: User[] = [
  {
    id: "usr-admin",
    name: "Ana Paula Souza",
    email: "ana.souza@documind.com.br",
    role: "admin",
    department: "Tecnologia e Governança",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-gestor",
    name: "Carlos Alberto Santos",
    email: "carlos.santos@documind.com.br",
    role: "manager",
    department: "Jurídico & Contratos",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-operador",
    name: "Mariana Lima",
    email: "mariana.lima@documind.com.br",
    role: "operator",
    department: "Centro de Digitalização",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-leitor",
    name: "Roberto Oliveira",
    email: "roberto.oliveira@documind.com.br",
    role: "viewer",
    department: "Auditoria Externa",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
];

export const MOCK_FOLDERS: Folder[] = [
  {
    id: "fld-contratos",
    name: "Contratos e Acordos",
    icon: "FileSignature",
    color: "#3b82f6",
    description: "Contratos de prestação de serviço, NDAs, aditivos e termos de parceria comercial.",
    allowedRoles: ["admin", "manager", "operator", "viewer"],
    createdBy: "Ana Paula Souza",
    createdAt: "2026-01-10T08:30:00Z",
  },
  {
    id: "fld-financeiro",
    name: "Financeiro e Contas",
    icon: "Receipt",
    color: "#10b981",
    description: "Notas fiscais, faturas de fornecedores, comprovantes e faturamento.",
    allowedRoles: ["admin", "manager", "operator"],
    createdBy: "Ana Paula Souza",
    createdAt: "2026-01-11T10:15:00Z",
  },
  {
    id: "fld-rh",
    name: "Recursos Humanos",
    icon: "Users",
    color: "#ec4899",
    description: "Fichas de admissão, holerites, registros de empregados e convenções.",
    allowedRoles: ["admin", "manager"],
    createdBy: "Carlos Alberto Santos",
    createdAt: "2026-01-15T14:20:00Z",
  },
  {
    id: "fld-juridico",
    name: "Jurídico e Processos",
    icon: "Scale",
    color: "#8b5cf6",
    description: "Peças jurídicas, procurações, pareceres e notificações judiciais.",
    allowedRoles: ["admin", "manager", "viewer"],
    createdBy: "Carlos Alberto Santos",
    createdAt: "2026-01-20T09:00:00Z",
  },
  {
    id: "fld-fiscal",
    name: "Fiscal e Impostos",
    icon: "Landmark",
    color: "#f59e0b",
    description: "Guias de recolhimento de impostos (DARF, GPS, FGTS) e certidões negativas.",
    allowedRoles: ["admin", "manager", "operator"],
    createdBy: "Ana Paula Souza",
    createdAt: "2026-02-01T11:45:00Z",
  },
  {
    id: "fld-diretoria",
    name: "Diretoria e Atas",
    icon: "ShieldAlert",
    color: "#ef4444",
    description: "Atas de reunião de diretoria, estatutos sociais e decisões estratégicas sigilosas.",
    allowedRoles: ["admin"],
    createdBy: "Ana Paula Souza",
    createdAt: "2026-02-05T16:00:00Z",
  },
];

export const MOCK_SUBJECTS: Subject[] = [
  { id: "sbj-1", name: "Contrato", color: "#3b82f6", description: "Instrumentos contratuais vinculantes" },
  { id: "sbj-2", name: "Nota Fiscal / NFS-e", color: "#10b981", description: "Documentos fiscais e faturas" },
  { id: "sbj-3", name: "Prestação de Serviços", color: "#06b6d4", description: "Relatórios e escopos de serviço" },
  { id: "sbj-4", name: "Admissão & Pessoal", color: "#ec4899", description: "Documentos de colaboradores" },
  { id: "sbj-5", name: "Processo Judicial", color: "#8b5cf6", description: "Ações e contencioso judicial" },
  { id: "sbj-6", name: "Tributário", color: "#f59e0b", description: "Pagamento de impostos e tributos" },
  { id: "sbj-7", name: "Ata de Reunião", color: "#ef4444", description: "Deliberações corporativas" },
  { id: "sbj-8", name: "Confidencial", color: "#64748b", description: "Informações sigilosas de alto risco" },
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: "doc-001",
    title: "Contrato de Prestação de Serviços - TechCloud Solutions 2026",
    originalFileName: "contrato_techcloud_2026_digitalizado.pdf",
    fileType: "pdf",
    fileSize: 2480000, // 2.48 MB
    folderId: "fld-contratos",
    folderName: "Contratos e Acordos",
    subjects: ["Contrato", "Prestação de Serviços"],
    uploadedBy: {
      id: "usr-gestor",
      name: "Carlos Alberto Santos",
      email: "carlos.santos@documind.com.br",
    },
    uploadedAt: "2026-08-01T10:30:00Z",
    documentDate: "2026-07-28",
    sensitivity: "Interno",
    ocrStatus: "completed",
    ocrText: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE INFRAESTRUTURA EM NUVEM E GESTÃO DIGITAL

CONTRATANTE: DocuMind Tecnologia S.A., pessoa jurídica de direito privado, inscrita no CNPJ/MF sob o nº 44.102.883/0001-20, com sede na Av. Paulista, 1000 - São Paulo/SP.
CONTRATADA: TechCloud Solutions Brasil Ltda., inscrita no CNPJ nº 18.293.001/0001-88.

CLÁUSULA PRIMEIRA - DO OBJETO:
A CONTRATADA compromete-se a fornecer serviços de hospedagem dedicada, alta disponibilidade em Cloud Run e gerenciamento de banco de dados com SLA mínimo de 99,9%.

CLÁUSULA SEGUNDA - DO PREÇO E CONDIÇÕES DE PAGAMENTO:
Pelo fornecimento dos serviços objetos deste contrato, a CONTRATANTE pagará o valor mensal de R$ 18.500,00 (dezoito mil e quinhentos reais), com vencimento no dia 10 de cada mês.

CLÁUSULA TERCEIRA - DA VIGÊNCIA E RESCISÃO:
O presente contrato vigora pelo prazo de 24 (vinte e quatro) meses, iniciando-se em 01/08/2026 e encerrando-se em 01/08/2028.
Multa rescisória de 10% sobre o saldo remanescente em caso de rescisão imotivada.

Foro de São Paulo / SP.
Assinado digitalmente em 28 de julho de 2026.`,
    summary: "Contrato de infraestrutura em nuvem firmado entre DocuMind S.A. e TechCloud Solutions no valor de R$ 18.500,00/mês, com SLA de 99,9% e vigência de 24 meses.",
    confidenceScore: 99.2,
    extractedEntities: [
      "DocuMind Tecnologia S.A.",
      "CNPJ 44.102.883/0001-20",
      "TechCloud Solutions Brasil Ltda.",
      "CNPJ 18.293.001/0001-88",
      "R$ 18.500,00/mês",
      "SLA 99.9%",
      "Vigência: 24 meses",
    ],
    version: "1.0",
    allowedRoles: ["admin", "manager", "operator", "viewer"],
    accessCount: 42,
    downloadCount: 15,
  },
  {
    id: "doc-002",
    title: "Nota Fiscal Eletrônica NFS-e 2026/0891 - InfraTech Digital",
    originalFileName: "nfse_0891_infratech_scanned.png",
    fileType: "png",
    fileSize: 1120000, // 1.12 MB
    folderId: "fld-financeiro",
    folderName: "Financeiro e Contas",
    subjects: ["Nota Fiscal / NFS-e", "Prestação de Serviços"],
    uploadedBy: {
      id: "usr-operador",
      name: "Mariana Lima",
      email: "mariana.lima@documind.com.br",
    },
    uploadedAt: "2026-08-05T14:12:00Z",
    documentDate: "2026-08-04",
    sensitivity: "Restrito",
    ocrStatus: "completed",
    ocrText: `PREFEITURA DO MUNICÍPIO DE SÃO PAULO
SECRETARIA MUNICIPAL DA FAZENDA
NOTA FISCAL ELETRÔNICA DE SERVIÇOS - NFS-e

Número da Nota: 00000891
Data e Hora de Emissão: 04/08/2026 11:20:45
Código de Verificação: 7X89-2041-0012

PRESTADOR DE SERVIÇOS:
InfraTech Consultoria Digital Ltda.
CNPJ: 29.881.044/0001-52 | IE: Isento | IM: 4.882.109-1
Endereço: Alameda Santos, 800 - Conj. 12 - Cerqueira César - São Paulo/SP

TOMADOR DE SERVIÇOS:
DocuMind Tecnologia S.A.
CNPJ: 44.102.883/0001-20

DISCRIMINAÇÃO DOS SERVIÇOS:
Serviços de digitalização de acervo físico documental, higienização de papéis, indexação por OCR de alta definição e upload seguro no repositório digital.
Lote total: 12.500 páginas digitalizadas.

VALOR TOTAL DA NOTA = R$ 12.450,00
Deduções: R$ 0,00 | Base de Cálculo: R$ 12.450,00 | Alíquota ISS: 5,00%
ISS a Reter: R$ 622,50 | Valor Líquido: R$ 11.827,50`,
    summary: "Nota fiscal NFS-e nº 00000891 emitida por InfraTech referente ao serviço de digitalização de 12.500 páginas com indexação OCR. Valor líquido R$ 11.827,50.",
    confidenceScore: 98.6,
    extractedEntities: [
      "NFS-e 00000891",
      "InfraTech Consultoria Digital Ltda.",
      "CNPJ 29.881.044/0001-52",
      "R$ 12.450,00 (Líquido: R$ 11.827,50)",
      "12.500 páginas digitalizadas",
    ],
    version: "1.0",
    allowedRoles: ["admin", "manager", "operator"],
    accessCount: 19,
    downloadCount: 7,
  },
  {
    id: "doc-003",
    title: "Ficha de Admissão e Termo LGPD - Eng. Roberto Fernandes",
    originalFileName: "ficha_admissao_roberto_fernandes.pdf",
    fileType: "pdf",
    fileSize: 3100000,
    folderId: "fld-rh",
    folderName: "Recursos Humanos",
    subjects: ["Admissão & Pessoal", "Confidencial"],
    uploadedBy: {
      id: "usr-admin",
      name: "Ana Paula Souza",
      email: "ana.souza@documind.com.br",
    },
    uploadedAt: "2026-08-08T09:00:00Z",
    documentDate: "2026-08-01",
    sensitivity: "Confidencial",
    ocrStatus: "completed",
    ocrText: `DOCUMIND TECNOLOGIA S.A. - DEPARTAMENTO DE RECURSOS HUMANOS
FICHA DE REGISTRO DE EMPREGADO E TERMO DE CONSENTIMENTO LGPD

DADOS PESSOAIS DO COLABORADOR:
Nome Completo: Roberto Fernandes de Oliveira
CPF: 304.992.188-02 | RG: 42.109.882-X SSP/SP
Data de Nascimento: 14/05/1991 | Estado Civil: Casado
Endereço: Rua dos Pinheiros, 450 - Apt 82 - Pinheiros - SP

DADOS CONTRATUAIS:
Cargo: Arquiteto de Soluções de Software Principal
Departamento: Engenharia e Inteligência Artificial
Data de Admissão: 01/08/2026 | Salário Inicial: R$ 16.200,00
Jornada: 40 horas semanais (Regime CLT Híbrido)

TERMO DE PRIVACIDADE E TRATAMENTO DE DADOS (LGPD):
O colaborador autoriza expressamente o tratamento de seus dados pessoais e biométricos estritamente para fins de gestão do vínculo empregatício, plano de saúde e previdência corporativa.

Assinado por Roberto Fernandes de Oliveira e Gestão de RH em 01/08/2026.`,
    summary: "Ficha de registro de admissão do colaborador Roberto Fernandes no cargo de Arquiteto de Soluções com salário de R$ 16.200,00 e assinatura do termo LGPD.",
    confidenceScore: 99.0,
    extractedEntities: [
      "Roberto Fernandes de Oliveira",
      "CPF 304.992.188-02",
      "Arquiteto de Soluções Principal",
      "Admissão 01/08/2026",
      "Salário R$ 16.200,00",
      "Termo LGPD Aceito",
    ],
    version: "1.0",
    allowedRoles: ["admin", "manager"],
    accessCount: 12,
    downloadCount: 3,
  },
  {
    id: "doc-004",
    title: "Notificação Judicial e Mandado de Citação - Processo 1002931-2026",
    originalFileName: "notificacao_judicial_proc_1002931.pdf",
    fileType: "pdf",
    fileSize: 4200000,
    folderId: "fld-juridico",
    folderName: "Jurídico e Processos",
    subjects: ["Processo Judicial", "Confidencial"],
    uploadedBy: {
      id: "usr-gestor",
      name: "Carlos Alberto Santos",
      email: "carlos.santos@documind.com.br",
    },
    uploadedAt: "2026-08-02T16:45:00Z",
    documentDate: "2026-07-30",
    sensitivity: "Restrito",
    ocrStatus: "completed",
    ocrText: `PODER JUDICIÁRIO DO ESTADO DE SÃO PAULO
COMARCA DE SÃO PAULO - FORO CÍVEL CENTRAL
3ª VARA CÍVEL DA CAPITAL

PROCESSO Nº 1002931-44.2026.8.26.0100
CLASSE: Ação Declaratória de Cumprimento de Cláusula Contratual
REQUERENTE: Distribuidora Nacional de Insumos S.A.
REQUERIDO: DocuMind Tecnologia S.A.

MANDADO DE CITAÇÃO E NOTIFICAÇÃO
CITE-SE o representante legal da ré DocuMind Tecnologia S.A. para, querendo, apresentar contestação no prazo legal de 15 (quinze) dias úteis, sob pena de revelia e presunção de veracidade dos fatos alegados.

Juiz de Direito: Dr. Mário Henrique Alencar.
Emitido em 30 de julho de 2026.`,
    summary: "Notificação judicial do Foro Cível Central de SP (Processo 1002931-44.2026) requerendo contestação em 15 dias úteis referente à ação declaratória de cumprimento contratual.",
    confidenceScore: 97.8,
    extractedEntities: [
      "Processo 1002931-44.2026.8.26.0100",
      "3ª Vara Cível da Capital / SP",
      "Distribuidora Nacional de Insumos S.A.",
      "Prazo Contestação: 15 dias úteis",
    ],
    version: "1.0",
    allowedRoles: ["admin", "manager", "viewer"],
    accessCount: 28,
    downloadCount: 9,
  },
  {
    id: "doc-005",
    title: "Comprovante DARF e Guia de Recolhimento IRPJ/CSLL - Q2/2026",
    originalFileName: "darf_irpj_csll_q2_2026.pdf",
    fileType: "pdf",
    fileSize: 850000,
    folderId: "fld-fiscal",
    folderName: "Fiscal e Impostos",
    subjects: ["Tributário", "Fiscal"],
    uploadedBy: {
      id: "usr-operador",
      name: "Mariana Lima",
      email: "mariana.lima@documind.com.br",
    },
    uploadedAt: "2026-07-20T11:00:00Z",
    documentDate: "2026-07-15",
    sensitivity: "Interno",
    ocrStatus: "completed",
    ocrText: `MINISTÉRIO DA FAZENDA - SECRETARIA DA RECEITA FEDERAL DO BRASIL
DARF - DOCUMENTO DE ARRECADAÇÃO DE RECEITAS FEDERAIS

Nome / Razão Social: DocuMind Tecnologia S.A.
CNPJ: 44.102.883/0001-20
Código da Receita: 2089 (IRPJ - Lucro Presumido)
Período de Apuração: 30/06/2026 (2º Trimestre / 2026)
Data de Vencimento: 31/07/2026

VALOR DO PRINCIPAL: R$ 48.910,20
MULTA: R$ 0,00
JUROS: R$ 0,00
VALOR TOTAL PAGO: R$ 48.910,20

Comprovante de pagamento bancário via Banco do Brasil em 20/07/2026. Autenticação Mecânica: BB.091.204.882.119.`,
    summary: "Guia DARF paga referente ao IRPJ do 2º trimestre de 2026 no valor de R$ 48.910,20 com comprovante de quitação bancária.",
    confidenceScore: 99.4,
    extractedEntities: [
      "DARF Código 2089 (IRPJ)",
      "CNPJ 44.102.883/0001-20",
      "Valor R$ 48.910,20",
      "Autenticação BB.091.204.882.119",
    ],
    version: "1.0",
    allowedRoles: ["admin", "manager", "operator"],
    accessCount: 15,
    downloadCount: 4,
  },
  {
    id: "doc-006",
    title: "Ata da Reunião de Diretoria Executiva nº 42 - Planejamento 2027",
    originalFileName: "ata_diretoria_executiva_42_confidencial.pdf",
    fileType: "pdf",
    fileSize: 1890000,
    folderId: "fld-diretoria",
    folderName: "Diretoria e Atas",
    subjects: ["Ata de Reunião", "Confidencial"],
    uploadedBy: {
      id: "usr-admin",
      name: "Ana Paula Souza",
      email: "ana.souza@documind.com.br",
    },
    uploadedAt: "2026-08-10T17:30:00Z",
    documentDate: "2026-08-10",
    sensitivity: "Confidencial",
    ocrStatus: "completed",
    ocrText: `DOCUMIND TECNOLOGIA S.A. - ATA DA REUNIÃO DA DIRETORIA EXECUTIVA Nº 42
DOCUMENTO ESTRITAMENTE CONFIDENCIAL - ACESSO RESTRITO AOS ADMINISTRADORES

Aos dez dias do mês de agosto de dois mil e vinte e seis, às 15h, na sede social da Companhia.
PRESENTES: Ana Paula Souza (CEO), Carlos Alberto Santos (VP Jurídico), Fernando Castro (CFO).

ORDEM DO DIA:
1. Aprovação do orçamento de investimentos em IA e digitalização para o ano fiscal 2027 (R$ 4.500.000,00).
2. Estratégia de expansão internacional para países da América Latina (Colômbia e Chile).
3. Avaliação de proposta de fusão e aquisição (M&A) com concorrente regional de software de arquivo.

DELIBERAÇÕES:
Por unanimidade, os diretores aprovaram o aporte de R$ 4,5M na divisão de OCR inteligente e autorizaram a assinatura de NDA de M&A.

Nada mais havendo a tratar, lavrou-se a presente ata.`,
    summary: "Ata sigilosa de diretoria deliberando aprovação do investimento de R$ 4,5M em IA/OCR para 2027 e autorização para negociações de M&A e expansão LatAm.",
    confidenceScore: 99.8,
    extractedEntities: [
      "Ata de Diretoria nº 42",
      "Investimento R$ 4.500.000,00 em IA",
      "Aprovação de M&A e Expansão LatAm",
      "Acesso Restrito ao Conselho/Admin",
    ],
    version: "1.0",
    allowedRoles: ["admin"],
    accessCount: 8,
    downloadCount: 2,
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-101",
    timestamp: "2026-08-11T15:45:10Z",
    userId: "usr-admin",
    userName: "Ana Paula Souza",
    userRole: "admin",
    userEmail: "ana.souza@documind.com.br",
    action: "OCR_RUN",
    documentId: "doc-006",
    documentTitle: "Ata da Reunião de Diretoria Executiva nº 42 - Planejamento 2027",
    details: "Re-processamento completo de OCR efetuado com modelo Gemini 3.6 Flash. Precisão: 99.8%.",
    ipAddress: "187.108.22.90",
    device: "Chrome / macOS Monterey",
    severity: "info",
  },
  {
    id: "log-102",
    timestamp: "2026-08-11T14:20:00Z",
    userId: "usr-operador",
    userName: "Mariana Lima",
    userRole: "operator",
    userEmail: "mariana.lima@documind.com.br",
    action: "UPLOAD",
    documentId: "doc-002",
    documentTitle: "Nota Fiscal Eletrônica NFS-e 2026/0891 - InfraTech Digital",
    details: "Upload de arquivo digitalizado em formato PNG (1.12 MB). OCR automático concluído.",
    ipAddress: "201.88.190.12",
    device: "Chrome / Windows 11",
    severity: "success",
  },
  {
    id: "log-103",
    timestamp: "2026-08-11T11:05:44Z",
    userId: "usr-leitor",
    userName: "Roberto Oliveira",
    userRole: "viewer",
    userEmail: "roberto.oliveira@documind.com.br",
    action: "VIEW",
    documentId: "doc-001",
    documentTitle: "Contrato de Prestação de Serviços - TechCloud Solutions 2026",
    details: "Visualização completa e leitura do texto OCR extraído.",
    ipAddress: "177.30.12.80",
    device: "Firefox / Ubuntu Linux",
    severity: "info",
  },
  {
    id: "log-104",
    timestamp: "2026-08-10T18:12:00Z",
    userId: "usr-gestor",
    userName: "Carlos Alberto Santos",
    userRole: "manager",
    userEmail: "carlos.santos@documind.com.br",
    action: "DOWNLOAD",
    documentId: "doc-004",
    documentTitle: "Notificação Judicial e Mandado de Citação - Processo 1002931-2026",
    details: "Download do documento original em PDF realizado com sucesso.",
    ipAddress: "189.120.40.15",
    device: "Safari / macOS Ventura",
    severity: "info",
  },
  {
    id: "log-105",
    timestamp: "2026-08-10T16:00:00Z",
    userId: "usr-admin",
    userName: "Ana Paula Souza",
    userRole: "admin",
    userEmail: "ana.souza@documind.com.br",
    action: "CHANGE_PERMISSION",
    documentId: "doc-006",
    documentTitle: "Ata da Reunião de Diretoria Executiva nº 42",
    details: "Nível de confidencialidade alterado para 'Confidencial'. Acesso restrito apenas para perfil Administrador.",
    ipAddress: "187.108.22.90",
    device: "Chrome / macOS Monterey",
    severity: "warning",
  },
];
