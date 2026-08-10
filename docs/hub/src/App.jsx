import React, { useState } from 'react';
import { 
  Database, ShieldCheck, FileText, Code2, Search, 
  Sun, Moon, Printer, Copy, Check, Layers, Cpu, 
  Key, AlertTriangle, ChevronRight, Lock, Clock, Target, Calendar,
  Download, Settings, Eye, Sliders, FileCode, CheckCircle2, HelpCircle
} from 'lucide-react';

const DOCUMENTS_DATA = {
  project_proposal: {
    id: "project_proposal",
    title: "UniCore: Project Proposal",
    subtitle: "Centralized PostgreSQL Operating Platform for 30,000+ Students",
    stage: "Stage 1 Milestone",
    status: "Active Proposal",
    display: true, // Only Project Proposal is displayed; others remain Coming Soon until display=true
    authors: [
      { name: "Ankit Rath", roll: "1024030458", role: "Concurrency Architecture" },
      { name: "Manan Kapoor", roll: "1024030467", role: "BCNF Schema Normalization" },
      { name: "Abhinav Kumar Singh", roll: "1024030440", role: "API Middleware & Audit" }
    ],
    markdownFile: "PROJECT_PROPOSAL.md",
    latexFile: "project_proposal.tex",
    sections: [
      { id: "pitch", title: "1. Elevator Pitch" },
      { id: "intro", title: "2. Introduction & Problem" },
      { id: "objectives", title: "3. SMART Objectives" },
      { id: "methodology", title: "4. Architecture & Safeguards" },
      { id: "timeline", title: "5. Timeline & Milestones" },
      { id: "resources", title: "6. Resources & Budget" },
      { id: "risks", title: "7. Risks & Mitigations" }
    ]
  },
  prototype_proposal: {
    id: "prototype_proposal",
    title: "Prototype Proposal & System Specifications",
    subtitle: "Stage 2 Milestone — Under Active Development",
    stage: "Stage 2",
    status: "Coming Soon",
    display: false,
    authors: [
      { name: "Ankit Rath", roll: "1024030458" },
      { name: "Manan Kapoor", roll: "1024030467" },
      { name: "Abhinav Kumar Singh", roll: "1024030440" }
    ],
    markdownFile: "PROTOTYPE_PROPOSAL.md",
    latexFile: "prototype_proposal.tex",
    sections: []
  },
  final_report: {
    id: "final_report",
    title: "Final Technical Master Report (12-Section Evaluation)",
    subtitle: "Stage 3 Milestone — Scheduled Post-Prototype",
    stage: "Stage 3",
    status: "Coming Soon",
    display: false,
    authors: [
      { name: "Ankit Rath", roll: "1024030458" },
      { name: "Manan Kapoor", roll: "1024030467" },
      { name: "Abhinav Kumar Singh", roll: "1024030440" }
    ],
    markdownFile: "FINAL_REPORT.md",
    latexFile: "final_report.tex",
    sections: []
  }
};

const RAW_MARKDOWN_CONTENT = {
  project_proposal: `# PROJECT PROPOSAL: UniCore (Campus Operating Platform)

**Title of Proposal:**  
**UniCore: Centralized Campus Operating Platform & High-Concurrency Transaction Layer**

**Institutional Metadata:**  
**Institution:** Thapar Institute of Engineering & Technology, Patiala  
**Department:** Computer Science & Engineering Department (CSED)  
**Course:** UCS310 – Database Management Systems  
**Target Enrollment Scale:** 30,000+ Active Students  

**Project Team & Roles:**
- **Ankit Rath** (Roll No. 1024030458) — *Systems Architect & Concurrency Specialist*
- **Manan Kapoor** (Roll No. 1024030467) — *Database Schema & BCNF Normalization Specialist*
- **Abhinav Kumar Singh** (Roll No. 1024030440) — *API Middleware & PL/SQL Audit Pipeline Engineer*

---

## 1. Elevator Pitch & Executive Summary

- **The Gap:** Modern educational institutions run student academics, hostel allotment, library circulation, and examination scheduling as disconnected, standalone system silos. This fragmentation creates severe data duplication, drifting records, room double-booking race conditions during peak rushes, and zero forensic auditability.
- **The Solution:** UniCore provides a centralized, database-first operating platform built on PostgreSQL. It consolidates all institutional workflows under 8 domain schemas and 35+ Boyce-Codd Normal Form (BCNF) tables, governed by atomic row-level locks (\`SELECT FOR UPDATE\`), automated PL/SQL triggers, and immutable JSON audit ledgers.
- **The Impact:** UniCore eliminates administrative overhead, guarantees 100% ACID transaction safety during concurrent enrollment rushes, and achieves a target Time-To-Acknowledgement (TTA) of <= 2 hours for operational requests across 30,000+ students.

---

## 2. Introduction & Problem Statement

### Context & Operational Relevance
Modern university administrative workflows suffer from extreme fragmentation. Student profiles, residential hostel bed allocations, library book inventories, and exam marks are entered and managed in separate software tools. As campus enrollment scales past 30,000 students, manual inter-department coordination fails, yielding five recurring failure modes:

\`\`\`
┌──────────────────────────────────────────────────────────┐
│             Disconnected System Silos                    │
└───────────┬──────────────┬──────────────┬────────────────┘
            │              │              │
            ▼              ▼              ▼
┌──────────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
│ Data Duplication ││Inconsistency ││ Resource     ││ Transaction  │
│ (Address/Contact)││(Drifting Rec)││ Tracking Err ││ Hazards/Races│
└──────────────────┘└──────────────┘└──────────────┘└──────────────┘
\`\`\`

1. **Data Duplication:** Redundant identity and address records entered separately across hostel, library, and student registrar databases.
2. **Data Inconsistency:** Mismatched student profiles when details update in one department portal but fail to propagate to others.
3. **Resource Tracking Errors:** Manual, error-prone tracking of bed availability, room statuses, and library book copies.
4. **Transaction Hazards (Race Conditions):** Concurrent HTTP requests during peak room-allotment windows result in double-allocating hostel beds or overbooking exam hall seats.
5. **Security & Audit Gaps:** Unscoped administrative permissions allow unauthorized modifications without traceable actor logs.

---

## 3. SMART Project Objectives

\`\`\`
  Specific ──────► Centralized PostgreSQL platform with 8 domain BCNF schemas
  Measurable ───► Median TTA <= 2 hrs, 0 double-booking errors under load
  Attainable ───► 12-Week milestone plan with modular database-first architecture
  Relevant ─────► Solves campus operational fragmentation at 30k student scale
  Time-Bound ───► Phased deliverables with week-by-week verification benchmarks
\`\`\`

### Primary Objective
To design, implement, and benchmark a unified, BCNF-normalized PostgreSQL database operating platform for 30,000+ active students that eliminates data redundancy, guarantees ACID transaction safety during peak concurrent rushes, and records immutable audit ledgers.

### Specific Sub-Goals
1. **BCNF Schema Normalization:** Decompose 35+ relational tables across 8 domain schemas (\`Auth\`, \`Audit\`, \`Academic\`, \`Hostel\`, \`Library\`, \`Exam\`, \`Admin\`, \`Core\`) strictly into Boyce-Codd Normal Form.
2. **Atomic Concurrency Control:** Enforce row-level locking (\`SELECT FOR UPDATE\`) and PostgreSQL advisory locks within PL/SQL stored procedures (\`hostel_allot()\`) to guarantee zero double-booking under 10,000+ concurrent requests.
3. **Automated Business Rules:** Implement PL/SQL \`BEFORE INSERT\` triggers to block invalid operations (e.g. blocking book issuance if unpaid fines exceed Rs. 500) and \`AFTER\` triggers to emit JSON before/after state diffs to an immutable \`audit_logs\` table.
4. **Empirical Performance Benchmarking:** Evaluate transaction throughput (TPS), latency percentiles (p95/p99), and write amplification under simulated high-concurrency loads using \`pgBench\`.

---

## 4. Engineering Methodology & System Architecture

UniCore follows a 3-tier engineering methodology tailored for robust software systems:

\`\`\`
┌──────────────────────────────────────────────────────────┐
│                 Tier 1: Responsive Web UI                │
│    (Citizen/Student Portal, Staff Workflow, Admin)       │
└────────────────────────────┬─────────────────────────────┘
                             │ REST API (JSON / HTTPS)
                             ▼
┌──────────────────────────────────────────────────────────┐
│                 Tier 2: Backend REST API                 │
│      (Auth Middleware, RBAC Scoping, Business Logic)     │
└────────────────────────────┬─────────────────────────────┘
                             │ Connection Pooling (pg)
                             ▼
┌──────────────────────────────────────────────────────────┐
│            Tier 3: PostgreSQL 16 System of Record        │
│   (8 Schemas, 35+ BCNF Tables, PL/SQL Triggers, Locks)   │
└────────────────────────────┬─────────────────────────────┘
\`\`\`

### 4.1 Module Breakdown & Domain Schematics
- **Auth Schema:** Unified identity, \`users\` super-type entity, password hashing, RBAC junction tables (\`roles\`, \`permissions\`, \`user_roles\`, \`role_permissions\`), session revocation.
- **Audit Schema:** Immutable forensic ledger (\`audit_logs\`), actor identity, UTC timestamps, JSON \`change_details\`, \`login_logs\`.
- **Academic Schema:** Department hierarchy, courses, student profiles, semester enrollments, grades, dynamic SGPA functions.
- **Hostel Schema:** Hostels, room types, bed capacities, allocations, warden assignments, maintenance work orders.
- **Library Schema:** Publishers, categories, book titles, physical copies, member borrowing, automated fine calculation.
- **Exam Schema:** Schedules, hall capacities, invigilator rosters, grading policies.
- **Admin & Core Schemas:** Staff leaves, asset maintenance, geographic hierarchy (\`countries\` -> \`states\` -> \`cities\` -> \`addresses\`), global settings.

### 4.2 Concurrency Safeguards & Isolation Matrix

| Operational Scenario | Isolation Level | Technical Mechanism | Enforced Guarantee |
| :--- | :--- | :--- | :--- |
| **Hostel Bed Allotment** | \`SERIALIZABLE\` | \`SELECT FOR UPDATE\` on room row | Zero double-booking of beds |
| **Exam Seat Registration** | \`READ COMMITTED\` | \`pg_advisory_xact_lock(exam_id)\` | Hall seat capacity never exceeded |
| **Library Book Circulation** | \`READ COMMITTED\` | In-transaction decrement | Copy count never drops below 0 |
| **Grade Record Updates** | \`READ COMMITTED\` | \`UPSERT\` (\`ON CONFLICT DO UPDATE\`) | Updates existing row; zero duplicate rows |

---

## 5. Project Timeline & Phase Deliverables

| Phase / Weeks | Technical Task Focus | Key Milestone & Deliverable |
| :--- | :--- | :--- |
| **Weeks 1–3** | Literature Review, Domain Requirements & ER Modeling | 8-Domain ER Schematic & Proposal Approval |
| **Weeks 4–6** | BCNF Normalization & PostgreSQL DDL Schema Setup | 35+ BCNF Tables Created with Foreign Key Constraints |
| **Weeks 7–8** | PL/SQL Triggers, Stored Procedures & Row Locking | \`hostel_allot()\`, \`fine_block_trigger\`, \`audit_mutation()\` |
| **Weeks 9–10** | REST API Integration & Concurrency Benchmarking | \`pgBench\` Concurrency Suite & TPS Latency Metrics |
| **Weeks 11–12** | End-to-End System Testing & Documentation | Final Evaluation Report & Staging Bundle |

---

## 6. Resources & Budget

- **Human Resources:**
  - *Ankit Rath:* Concurrency control, transaction isolation, and load benchmarking.
  - *Manan Kapoor:* Relational algebra, BCNF decomposition proofs, and schema normalization.
  - *Abhinav Kumar Singh:* REST API middleware, RBAC security scoping, and PL/SQL audit trigger integration.
- **Engine Availability & Infrastructure:** Mature, production-ready components are utilized (PostgreSQL 16 relational database engine, Node.js runtime, Git version control).
- **Budget:** **No external funding required.** All development, testing, and database execution run on existing university laboratory infrastructure and local computing resources.

---

## 7. Risk Assessment & Mitigation Strategies

| Identified Risk | Risk Impact | Proposed Mitigation Strategy |
| :--- | :--- | :--- |
| **High Lock Contention** | High (Transaction Retries) | Implement pessimistic \`SELECT FOR UPDATE\` under \`READ COMMITTED\` with short transaction boundaries. |
| **Data Privacy & Scope** | Medium (Unauthorized Access) | Enforce strict RBAC permission scoping at API middleware layer and soft-delete historical preservation. |
| **Measurement Ambiguity** | Medium (Evaluation Errors) | Instrument automated UTC timestamps in database \`AFTER\` triggers prior to execution. |`,

  prototype_proposal: `# PROTOTYPE PROPOSAL: UniCore Technical Specification (Stage 2)

**Status:** Locked (display: false) — Scheduled for Prototype Release Phase.`,
  final_report: `# FINAL TECHNICAL MASTER REPORT: UniCore Evaluation (Stage 3)

**Status:** Locked (display: false) — Scheduled Post-Evaluation.`
};

const RAW_LATEX_CONTENT = {
  project_proposal: `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=1in]{geometry}
\\usepackage{hyperref}
\\usepackage{booktabs}
\\usepackage{enumitem}
\\usepackage{amsmath,amssymb}
\\usepackage{listings}
\\usepackage{xcolor}

\\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    urlcolor=cyan,
    pdftitle={UniCore - Project Proposal},
}

\\title{\\textbf{UniCore: Centralized Campus Operating Platform \\& High-Concurrency Transaction Layer}\\\\ \\Large Project Proposal}
\\author{\\textbf{Ankit Rath} (1024030458) \\quad \\textbf{Manan Kapoor} (1024030467) \\quad \\textbf{Abhinav Kumar Singh} (1024030440)\\\\
\\small Department of Computer Science \\& Engineering\\\\
\\small Thapar Institute of Engineering \\& Technology, Patiala\\\\
\\small Course: UCS310 -- Database Management Systems}
\\date{\\today}

\\begin{document}

\\maketitle

\\begin{abstract}
UniCore is a centralized, database-driven campus operating platform engineered to unify student academic records, residential hostel allotment, library asset circulation, examination processing, and administrative workflows under a single PostgreSQL system of record. Decomposed into Boyce-Codd Normal Form (BCNF) across 8 domain schemas and 35+ tables, UniCore guarantees 100\\% ACID transaction safety during peak concurrent rushes via explicit row-level locking (\\texttt{SELECT FOR UPDATE}), automated PL/SQL triggers, and immutable JSON audit ledgers, targeting a Time-To-Acknowledgement (TTA) of $\\le 2$ hours across 30,000+ active students.
\\end{abstract}

\\section{Elevator Pitch}
\\begin{itemize}[leftmargin=*]
    \\item \\textbf{The Gap:} Modern universities run academics, hostels, library, and exams as disconnected system silos, causing severe data duplication, drifting records, room double-booking race conditions during peak rushes, and zero forensic auditability.
    \\item \\textbf{The Solution:} UniCore provides a centralized PostgreSQL operating platform (8 BCNF schemas, 35+ tables) governed by atomic row locks (\\texttt{SELECT FOR UPDATE}), automated PL/SQL triggers, and immutable JSON audit ledgers.
    \\item \\textbf{The Impact:} Eliminates administrative overhead, guarantees 100\\% ACID transaction safety during enrollment rushes, and achieves a target Time-To-Acknowledgement (TTA) $\\le 2$ hours across 30,000+ students.
\\end{itemize}

\\section{SMART Project Objectives}
\\begin{enumerate}[leftmargin=*]
    \\item \\textbf{Primary Objective:} Design, implement, and benchmark a unified BCNF PostgreSQL operating platform for 30,000+ students that eliminates data redundancy and guarantees ACID transaction safety during peak concurrent rushes.
    \\item \\textbf{Sub-Goal 1 (BCNF Normalization):} Decompose 35+ relational tables across 8 domain schemas strictly into Boyce-Codd Normal Form.
    \\item \\textbf{Sub-Goal 2 (Atomic Concurrency Control):} Enforce row-level locking (\\texttt{SELECT FOR UPDATE}) within stored procedures (\\texttt{hostel\\_allot()}) to guarantee zero double-booking under 10,000+ concurrent requests.
    \\item \\textbf{Sub-Goal 3 (Automated Triggers):} Implement PL/SQL \\texttt{BEFORE INSERT} triggers blocking invalid operations (unpaid fines $>$ Rs. 500) and \\texttt{AFTER} triggers emitting JSON state diffs to an immutable \\texttt{audit\\_logs} table.
    \\item \\textbf{Sub-Goal 4 (Concurrency Benchmarking):} Evaluate transaction throughput (TPS) and latency percentiles (p95/p99) under high-concurrency loads using \\texttt{pgBench}.
\\end{enumerate}

\\section{System Architecture \\& Concurrency Controls}
\\begin{table}[h!]
\\centering
\\begin{tabular}{llll}
\\toprule
\\textbf{Scenario} & \\textbf{Isolation Level} & \\textbf{Mechanism} & \\textbf{Enforced Guarantee} \\\\
\\midrule
Hostel Bed Allotment & \\texttt{SERIALIZABLE} & \\texttt{SELECT FOR UPDATE} & Zero double-booking \\\\
Exam Seat Registration & \\texttt{READ COMMITTED} & \\texttt{pg\\_advisory\\_xact\\_lock()} & Seat count $\\le$ Capacity \\\\
Library Book Issue & \\texttt{READ COMMITTED} & Decrement \\texttt{total\\_copies} & Available count $\\ge 0$ \\\\
Grade Record Updates & \\texttt{READ COMMITTED} & \\texttt{UPSERT} & Updates row without duplication \\\\
\\bottomrule
\\end{tabular}
\\caption{UniCore Transaction Concurrency Matrix}
\\end{table}

\\section{Timeline \\& Milestones}
\\begin{table}[h!]
\\centering
\\begin{tabular}{lll}
\\toprule
\\textbf{Weeks} & \\textbf{Technical Task Focus} & \\textbf{Key Deliverable} \\\\
\\midrule
Weeks 1--3 & Domain Requirements \\& ER Modeling & 8-Domain ER Schematic \\& Proposal Approval \\\\
Weeks 4--6 & BCNF Normalization \\& PostgreSQL DDL & 35+ BCNF Tables Created \\\\
Weeks 7--8 & PL/SQL Triggers \\& Row Locks & \\texttt{hostel\\_allot()}, \\texttt{fine\\_block\\_trigger} \\\\
Weeks 9--10 & REST API Integration \\& Benchmarking & \\texttt{pgBench} Concurrency Metrics \\\\
Weeks 11--12 & End-to-End Evaluation \\& Testing & Final Master Report \\& Staging Build \\\\
\\bottomrule
\\end{tabular}
\\caption{Week-by-Week Development Schedule}
\\end{table}

\\section{Resources \\& Budget}
\\begin{itemize}[leftmargin=*]
    \\item \\textbf{Team Roles:} Ankit Rath (Concurrency Isolation), Manan Kapoor (BCNF Normalization), Abhinav Kumar Singh (REST API \\& PL/SQL Audit).
    \\item \\textbf{Budget:} \\textbf{No external funding required.} All development executes on existing university laboratory infrastructure.
\\end{itemize}

\\end{document}`,

  prototype_proposal: `% Stage 2 Prototype Proposal (Coming Soon)`,
  final_report: `% Stage 3 Final Master Report (Coming Soon)`
};

export default function App() {
  const [activeDoc, setActiveDoc] = useState('project_proposal');
  const [viewFormat, setViewFormat] = useState('rendered'); // 'rendered' | 'markdown' | 'latex'
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedFormat, setCopiedFormat] = useState(null);
  const [fontSize, setFontSize] = useState('text-xs'); // 'text-xs' | 'text-sm' | 'text-base'
  const [wordWrap, setWordWrap] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const currentDoc = DOCUMENTS_DATA[activeDoc];

  const handleCopyCode = (text, formatName) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatName);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleDownloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const activeContentText = viewFormat === 'markdown' 
    ? RAW_MARKDOWN_CONTENT[activeDoc] 
    : RAW_LATEX_CONTENT[activeDoc];

  const activeFileName = viewFormat === 'markdown' 
    ? currentDoc.markdownFile 
    : currentDoc.latexFile;

  return (
    <div className={`min-h-screen ${isDarkTheme ? '' : 'light-theme'} transition-colors duration-300`}>
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 glass-nav no-print px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight font-heading bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
                UniCore
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Documentation Hub
              </span>
            </div>
            <p className="text-xs text-slate-400">TIET Campus Operating Platform</p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center space-x-3">
          {/* Search Box */}
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search proposal topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs rounded-lg glass-panel bg-slate-900/50 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-48 lg:w-64"
            />
          </div>

          {/* 3-Format Switcher */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-lg border border-slate-800">
            <button 
              onClick={() => setViewFormat('rendered')}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
                viewFormat === 'rendered' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Interactive Proposal
            </button>
            <button 
              onClick={() => setViewFormat('markdown')}
              className={`px-3 py-1 text-xs rounded-md font-medium flex items-center space-x-1 transition-all ${
                viewFormat === 'markdown' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>.MD</span>
            </button>
            <button 
              onClick={() => setViewFormat('latex')}
              className={`px-3 py-1 text-xs rounded-md font-medium flex items-center space-x-1 transition-all ${
                viewFormat === 'latex' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3 h-3" />
              <span>LaTeX (.tex)</span>
            </button>
          </div>

          {/* Settings Modal Button */}
          <button 
            onClick={() => setShowSettingsModal(!showSettingsModal)}
            className="p-2 rounded-lg glass-panel hover:bg-slate-800/50 text-slate-300 transition-colors"
            title="Viewer Settings"
          >
            <Settings className="w-4 h-4 text-slate-300" />
          </button>

          {/* Theme & PDF Export */}
          <button 
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            className="p-2 rounded-lg glass-panel hover:bg-slate-800/50 text-slate-300 transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {isDarkTheme ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          <button 
            onClick={handlePrint}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-600/20 transition-all"
            title="Export Proposal as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </header>

      {/* Settings Modal Bar */}
      {showSettingsModal && (
        <div className="no-print bg-slate-900 border-b border-slate-800 px-4 lg:px-8 py-3 text-xs text-slate-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-blue-400 flex items-center space-x-1">
                <Sliders className="w-3.5 h-3.5" />
                <span>Viewer Settings:</span>
              </span>

              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Code Font Size:</span>
                <button 
                  onClick={() => setFontSize('text-xs')}
                  className={`px-2 py-0.5 rounded ${fontSize === 'text-xs' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  Small
                </button>
                <button 
                  onClick={() => setFontSize('text-sm')}
                  className={`px-2 py-0.5 rounded ${fontSize === 'text-sm' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  Medium
                </button>
                <button 
                  onClick={() => setFontSize('text-base')}
                  className={`px-2 py-0.5 rounded ${fontSize === 'text-base' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  Large
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Word Wrap:</span>
                <button 
                  onClick={() => setWordWrap(!wordWrap)}
                  className={`px-2.5 py-0.5 rounded font-medium ${wordWrap ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  {wordWrap ? 'Enabled (Wrap)' : 'Disabled (Scroll)'}
                </button>
              </div>
            </div>

            <button 
              onClick={() => setShowSettingsModal(false)}
              className="text-slate-400 hover:text-slate-200 text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Stage Progression Banner */}
      <div className="no-print bg-slate-900/60 border-b border-slate-800/60 px-4 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs overflow-x-auto gap-4 scrollbar-none">
          <span className="text-slate-400 font-medium whitespace-nowrap">DOCUMENT STAGES:</span>
          
          <div className="flex items-center space-x-2 lg:space-x-4">
            <button 
              onClick={() => setActiveDoc('project_proposal')}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full border transition-all whitespace-nowrap ${
                activeDoc === 'project_proposal' 
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 font-semibold shadow-sm shadow-blue-500/10' 
                  : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span>1. Project Proposal</span>
              <span className="text-[10px] bg-blue-500/30 px-1.5 rounded text-blue-300">ACTIVE</span>
            </button>

            <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />

            <button 
              onClick={() => setActiveDoc('prototype_proposal')}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full border transition-all whitespace-nowrap ${
                activeDoc === 'prototype_proposal' 
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 font-semibold' 
                  : 'border-slate-800 text-slate-500 hover:text-slate-400'
              }`}
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>2. Prototype Proposal</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 rounded">COMING SOON</span>
            </button>

            <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />

            <button 
              onClick={() => setActiveDoc('final_report')}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full border transition-all whitespace-nowrap ${
                activeDoc === 'final_report' 
                  ? 'bg-slate-800 border-slate-700 text-slate-300 font-semibold' 
                  : 'border-slate-800 text-slate-500 hover:text-slate-400'
              }`}
            >
              <Lock className="w-3 h-3 text-slate-500" />
              <span>3. Final Master Report</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 rounded">COMING SOON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar */}
        <aside className="lg:col-span-3 no-print space-y-6">
          {/* Metadata Card */}
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {currentDoc.stage}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentDoc.status}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-slate-100 font-heading text-base leading-snug">
                {currentDoc.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {currentDoc.subtitle}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Project Team</span>
              <div className="space-y-1.5">
                {currentDoc.authors.map((author, i) => (
                  <div key={i} className="text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{author.name}</span>
                      <span className="font-mono text-slate-500 text-[11px]">{author.roll}</span>
                    </div>
                    {author.role && (
                      <div className="text-[10px] text-blue-400/80">{author.role}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section Index */}
          {currentDoc.display && currentDoc.sections.length > 0 && (
            <div className="glass-panel p-5 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Proposal Index</span>
                <Layers className="w-3.5 h-3.5 text-slate-500" />
              </h4>
              <nav className="space-y-1">
                {currentDoc.sections.map((sec, idx) => (
                  <a 
                    key={idx}
                    href={`#${sec.id}`}
                    className="flex items-center space-x-2 text-xs py-1.5 px-2.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all group"
                  >
                    <span>{sec.title}</span>
                  </a>
                ))}
              </nav>
            </div>
          )}
        </aside>

        {/* Right Main Content */}
        <main className="lg:col-span-9 space-y-8">
          
          {/* STRICT CHECK FOR display === true */}
          {!currentDoc.display ? (
            /* COMING SOON LOCK SCREEN WHEN display !== true */
            <div className="glass-panel p-12 rounded-3xl text-center space-y-6 border-amber-500/20 bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/10">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
                <Lock className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-wide">
                  Upcoming Stage Milestone
                </span>
                <h2 className="text-2xl font-bold font-heading text-slate-100">
                  {currentDoc.title}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  This document content is locked and set to <code className="text-amber-300 font-mono bg-slate-800 px-1 py-0.5 rounded">display: false</code>. It will be automatically unlocked during upcoming milestone phases.
                </p>
              </div>

              <button 
                onClick={() => setActiveDoc('project_proposal')}
                className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors shadow-lg shadow-blue-600/20"
              >
                <span>View Active Project Proposal</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* RAW FORMAT CODE VIEWER (.MD & LaTeX) */}
              {viewFormat !== 'rendered' ? (
                <div className="space-y-4">
                  {/* Code Header Bar */}
                  <div className="glass-panel p-4 rounded-xl flex items-center justify-between border-blue-500/30 bg-slate-900">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        {viewFormat === 'markdown' ? <FileText className="w-5 h-5" /> : <Code2 className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-slate-100 font-mono">
                            {activeFileName}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
                            {viewFormat === 'markdown' ? 'MARKDOWN SOURCE' : 'LATEX SOURCE'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Complete 100% academic source code for publication and compilation.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleDownloadFile(activeContentText, activeFileName)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors border border-slate-700"
                        title="Download raw file"
                      >
                        <Download className="w-3.5 h-3.5 text-blue-400" />
                        <span>Download</span>
                      </button>

                      <button 
                        onClick={() => handleCopyCode(activeContentText, viewFormat)}
                        className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors shadow-md shadow-blue-600/20"
                      >
                        {copiedFormat === viewFormat ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Copied Code!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy {viewFormat.toUpperCase()}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Code Body Container */}
                  <div className="glass-panel p-6 rounded-2xl overflow-x-auto bg-slate-950 border-slate-800">
                    <pre className={`font-mono ${fontSize} leading-relaxed text-slate-200 ${wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre'}`}>
                      {activeContentText}
                    </pre>
                  </div>
                </div>
              ) : (
                /* RENDERED PROJECT PROPOSAL VIEW */
                <div className="space-y-8">
                  
                  {/* Hero Header */}
                  <div className="glass-panel p-8 rounded-3xl relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 border-blue-500/20">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 tracking-wide uppercase">
                        <ShieldCheck className="w-4 h-4 text-blue-400" />
                        <span>Thapar Institute of Engineering & Technology | UCS310 DBMS</span>
                      </div>
                      <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-100 font-heading tracking-tight leading-tight">
                        UniCore: Centralized Campus Operating Platform & High-Concurrency Transaction Layer
                      </h1>
                      <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
                        A centralized, database-driven operating layer that unifies student academic records, residential hostel allotment, library circulation, and examination processing under one PostgreSQL system of record — built for strict transactional integrity, BCNF normalization, and scale to 30,000+ students.
                      </p>
                    </div>
                  </div>

                  {/* 1. Elevator Pitch */}
                  <section id="pitch" className="glass-panel p-6 lg:p-8 rounded-2xl space-y-4">
                    <h2 className="text-xl font-bold font-heading text-slate-100 flex items-center space-x-2">
                      <Target className="w-5 h-5 text-blue-400" />
                      <span>1. Elevator Pitch & Executive Summary</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                        <div className="text-xs font-bold text-red-400 uppercase tracking-wide">The Operational Gap</div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Disconnected departmental silos cause severe data duplication, room double-booking race conditions during peak rushes, and zero forensic auditability.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                        <div className="text-xs font-bold text-blue-400 uppercase tracking-wide">The Software Solution</div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          A centralized PostgreSQL operating layer (8 BCNF schemas, 35+ tables) governed by <code className="text-blue-300 font-mono">SELECT FOR UPDATE</code> row locks, PL/SQL triggers, and JSON audit ledgers.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                        <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide">The Measurable Impact</div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Eliminates administrative overhead, guarantees 100% ACID transaction safety during rushes, and achieves a target Time-To-Acknowledgement (TTA) $\le 2$ hours across 30,000+ students.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* 2. Introduction & Problem Statement */}
                  <section id="intro" className="glass-panel p-6 lg:p-8 rounded-2xl space-y-6">
                    <div>
                      <h2 className="text-xl font-bold font-heading text-slate-100 flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        <span>2. Introduction & Problem Statement</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Five recurring operational failure modes in multi-tier administrative software:
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                        <div className="text-xs font-bold text-red-400">1. Data Duplication</div>
                        <p className="text-xs text-slate-400">Redundant address & contact records stored across hostel, library, and academic databases.</p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                        <div className="text-xs font-bold text-amber-400">2. Data Inconsistency</div>
                        <p className="text-xs text-slate-400">Mismatched student profiles when details update in one portal but fail to propagate to others.</p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                        <div className="text-xs font-bold text-yellow-400">3. Resource Tracking Errors</div>
                        <p className="text-xs text-slate-400">Manual, error-prone tracking of bed availability, room statuses, and library book copies.</p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                        <div className="text-xs font-bold text-indigo-400">4. Transaction Hazards</div>
                        <p className="text-xs text-slate-400">Concurrent HTTP requests during room allotment rushes result in double-booking beds.</p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                        <div className="text-xs font-bold text-cyan-400">5. Security & Audit Gaps</div>
                        <p className="text-xs text-slate-400">Unscoped administrative permissions allow modifications without traceable actor logs.</p>
                      </div>
                    </div>
                  </section>

                  {/* 3. SMART Objectives */}
                  <section id="objectives" className="glass-panel p-6 lg:p-8 rounded-2xl space-y-4">
                    <h2 className="text-xl font-bold font-heading text-slate-100 flex items-center space-x-2">
                      <Cpu className="w-5 h-5 text-indigo-400" />
                      <span>3. SMART Project Objectives</span>
                    </h2>

                    <div className="space-y-3 pt-2">
                      <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30">
                        <div className="text-xs font-bold text-blue-400 uppercase tracking-wide">Primary Overarching Objective</div>
                        <p className="text-xs text-slate-200 mt-1">
                          To design, implement, and benchmark a unified BCNF PostgreSQL operating platform for 30,000+ active students that eliminates data redundancy, guarantees ACID transaction safety during peak concurrent rushes, and records immutable audit ledgers.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                          <strong className="text-indigo-400">Sub-Goal 1: BCNF Normalization:</strong> Decompose 35+ tables across 8 domain schemas strictly into Boyce-Codd Normal Form.
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                          <strong className="text-emerald-400">Sub-Goal 2: Atomic Row Locks:</strong> Enforce <code className="text-emerald-300 font-mono">SELECT FOR UPDATE</code> in <code className="text-emerald-300 font-mono">hostel_allot()</code> procedure.
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                          <strong className="text-cyan-400">Sub-Goal 3: Automated Triggers:</strong> Implement fine check triggers (&gt; Rs. 500 block) and JSON audit triggers.
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                          <strong className="text-amber-400">Sub-Goal 4: Concurrency Metrics:</strong> Measure TPS throughput and p95/p99 latency via <code className="text-amber-300 font-mono">pgBench</code>.
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* 4. Methodology & Architecture */}
                  <section id="methodology" className="glass-panel p-6 lg:p-8 rounded-2xl space-y-4">
                    <h2 className="text-xl font-bold font-heading text-slate-100 flex items-center space-x-2">
                      <Key className="w-5 h-5 text-emerald-400" />
                      <span>4. System Architecture & Concurrency Matrix</span>
                    </h2>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-900 text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-800">
                          <tr>
                            <th className="p-3">Scenario</th>
                            <th className="p-3">Isolation Level</th>
                            <th className="p-3">Safeguard Mechanism</th>
                            <th className="p-3">Enforced Guarantee</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80 text-slate-300">
                          <tr className="hover:bg-slate-900/40">
                            <td className="p-3 font-semibold text-blue-400">Hostel Bed Allotment</td>
                            <td className="p-3 font-mono text-indigo-400">SERIALIZABLE</td>
                            <td className="p-3 font-mono text-slate-400">SELECT FOR UPDATE on room row</td>
                            <td className="p-3 text-emerald-400">Zero double-booking of beds</td>
                          </tr>
                          <tr className="hover:bg-slate-900/40">
                            <td className="p-3 font-semibold text-blue-400">Exam Seat Registration</td>
                            <td className="p-3 font-mono text-indigo-400">READ COMMITTED</td>
                            <td className="p-3 font-mono text-slate-400">pg_advisory_xact_lock(exam_id)</td>
                            <td className="p-3 text-emerald-400">Seat count never exceeds capacity</td>
                          </tr>
                          <tr className="hover:bg-slate-900/40">
                            <td className="p-3 font-semibold text-blue-400">Library Book Issue</td>
                            <td className="p-3 font-mono text-indigo-400">READ COMMITTED</td>
                            <td className="p-3 font-mono text-slate-400">In-transaction decrement</td>
                            <td className="p-3 text-emerald-400">Copy count never drops below 0</td>
                          </tr>
                          <tr className="hover:bg-slate-900/40">
                            <td className="p-3 font-semibold text-blue-400">Grade Record Updates</td>
                            <td className="p-3 font-mono text-indigo-400">READ COMMITTED</td>
                            <td className="p-3 font-mono text-slate-400">UPSERT (ON CONFLICT DO UPDATE)</td>
                            <td className="p-3 text-emerald-400">Updates existing; zero duplicate rows</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>

                  {/* 5. Timeline & Schedule */}
                  <section id="timeline" className="glass-panel p-6 lg:p-8 rounded-2xl space-y-4">
                    <h2 className="text-xl font-bold font-heading text-slate-100 flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-amber-400" />
                      <span>5. Timeline & Milestone Breakdown</span>
                    </h2>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-900 text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-800">
                          <tr>
                            <th className="p-3">Phase / Weeks</th>
                            <th className="p-3">Technical Task Focus</th>
                            <th className="p-3">Key Deliverable</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80 text-slate-300">
                          <tr>
                            <td className="p-3 font-bold text-amber-400">Weeks 1–3</td>
                            <td className="p-3">Literature Review, Domain Requirements & ER Modeling</td>
                            <td className="p-3 text-slate-300">8-Domain ER Schematic & Proposal Approval</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-blue-400">Weeks 4–6</td>
                            <td className="p-3">BCNF Normalization & PostgreSQL DDL Schema Setup</td>
                            <td className="p-3 text-slate-300">35+ BCNF Tables Created</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-indigo-400">Weeks 7–8</td>
                            <td className="p-3">PL/SQL Triggers, Stored Procedures & Row Locking</td>
                            <td className="p-3 text-slate-300"><code className="text-indigo-300 font-mono">hostel_allot()</code>, <code className="text-indigo-300 font-mono">fine_block_trigger</code></td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-emerald-400">Weeks 9–10</td>
                            <td className="p-3">REST API Integration & Concurrency Benchmarking</td>
                            <td className="p-3 text-slate-300"><code className="text-emerald-300 font-mono">pgBench</code> Concurrency Metrics</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-cyan-400">Weeks 11–12</td>
                            <td className="p-3">End-to-End System Testing & Documentation</td>
                            <td className="p-3 text-slate-300">Final Master Report & Staging Build</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>

                  {/* 6. Resources & Budget */}
                  <section id="resources" className="glass-panel p-6 lg:p-8 rounded-2xl space-y-4">
                    <h2 className="text-xl font-bold font-heading text-slate-100 flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-cyan-400" />
                      <span>6. Resources & Budget</span>
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                        <strong className="text-slate-100 font-semibold">Human Resources & Team Roles:</strong>
                        <ul className="list-disc list-inside space-y-1 text-slate-400">
                          <li>Ankit Rath: Concurrency isolation & load benchmarking</li>
                          <li>Manan Kapoor: BCNF schema normalization proofs</li>
                          <li>Abhinav Kumar Singh: API middleware & PL/SQL audit pipeline</li>
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                        <strong className="text-slate-100 font-semibold">Infrastructure & Budget:</strong>
                        <p className="text-slate-400 leading-relaxed">
                          <strong>No external funding required.</strong> All development, testing, and database execution run on existing university laboratory infrastructure and local computing resources.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* 7. Risks & Mitigations */}
                  <section id="risks" className="glass-panel p-6 lg:p-8 rounded-2xl space-y-4">
                    <h2 className="text-xl font-bold font-heading text-slate-100 flex items-center space-x-2">
                      <ShieldCheck className="w-5 h-5 text-indigo-400" />
                      <span>7. Risk Assessment & Mitigation Strategies</span>
                    </h2>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-900 text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-800">
                          <tr>
                            <th className="p-3">Identified Risk</th>
                            <th className="p-3">Risk Impact</th>
                            <th className="p-3">Proposed Mitigation Strategy</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80 text-slate-300">
                          <tr>
                            <td className="p-3 font-semibold text-red-400">High Lock Contention</td>
                            <td className="p-3 text-amber-400">High (Transaction Retries)</td>
                            <td className="p-3 text-slate-300">Implement pessimistic SELECT FOR UPDATE under READ COMMITTED with short transaction boundaries.</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold text-amber-400">Data Privacy & Scope</td>
                            <td className="p-3 text-indigo-400">Medium (Unauthorized Access)</td>
                            <td className="p-3 text-slate-300">Enforce strict RBAC permission scoping at API middleware layer and soft-delete historical preservation.</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold text-yellow-400">Measurement Ambiguity</td>
                            <td className="p-3 text-cyan-400">Medium (Evaluation Errors)</td>
                            <td className="p-3 text-slate-300">Instrument automated UTC timestamps in database AFTER triggers prior to execution.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>

                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="no-print border-t border-slate-800/80 mt-16 py-8 text-center text-xs text-slate-500 space-y-2">
        <p>UniCore — Thapar Institute of Engineering & Technology, Patiala</p>
        <p className="font-mono text-[11px] text-slate-600">Built with React, Vite, Tailwind CSS, & GitHub Pages</p>
      </footer>
    </div>
  );
}
