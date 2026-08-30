import React, { useState, useEffect } from 'react';
import { 
  Database, ShieldCheck, FileText, Code2, Search, 
  Sun, Moon, Printer, Copy, Check, Layers, Cpu, 
  Key, AlertTriangle, ChevronRight, Lock, Clock, Target, Calendar,
  Download, Settings, Sliders, GitBranch, Workflow, Network, Box, Activity, ArrowRight,
  Eye, FileCode, ExternalLink, RefreshCw
} from 'lucide-react';

const DOCUMENTS_DATA = {
  project_proposal: {
    id: "project_proposal",
    title: "UniCore: Project Proposal",
    subtitle: "High-Concurrency Transaction Layer",
    stage: "Stage 1 Milestone",
    status: "Active Proposal",
    display: true,
    authors: [
      { name: "Ankit Rath", roll: "1024030458" },
      { name: "Manan Kapoor", roll: "1024030467" },
      { name: "Abhinav Kumar Singh", roll: "1024030440" }
    ],
    markdownFile: "PROJECT_PROPOSAL.md",
    latexFile: "project_proposal.tex",
    pdfFile: "/unicore/pdfs/project_proposal.pdf",
    pdfFileName: "project_proposal.pdf",
    sections: [
      { id: "pitch", title: "1. Elevator Pitch" },
      { id: "intro", title: "2. Introduction & Problem" },
      { id: "objectives", title: "3. SMART Objectives" },
      { id: "methodology", title: "4. System Architecture" },
      { id: "uml", title: "4.3 UML Diagrams" },
      { id: "dfd", title: "4.4 Data Flow Diagrams" },
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
    pdfFile: "/unicore/pdfs/prototype_proposal.pdf",
    pdfFileName: "prototype_proposal.pdf",
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
    pdfFile: "/unicore/pdfs/final_report.pdf",
    pdfFileName: "final_report.pdf",
    sections: []
  }
};

const RAW_MARKDOWN_CONTENT = {
  project_proposal: `# PROJECT PROPOSAL: UniCore

**Title of Proposal:**  
**UniCore: High-Concurrency Transaction Layer**

**Institutional Metadata:**  
**Institution:** Thapar Institute of Engineering & Technology, Patiala  
**Department:** Computer Science & Engineering Department (CSED)  
**Target Enrollment Scale:** 30,000+ Active Students  

**Project Team:**
- **Ankit Rath** (Roll No. 1024030458)
- **Manan Kapoor** (Roll No. 1024030467)
- **Abhinav Kumar Singh** (Roll No. 1024030440)

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

---

## 4. Engineering Methodology & System Architecture

UniCore follows a 3-tier engineering methodology tailored for robust software systems.

### 4.3 Unified Modeling Language (UML) Diagrams
Models include Use Case Diagram, Class Diagram, Sequence Diagram, Component & Deployment Diagram, and State Machine Diagram.

### 4.4 Data Flow Diagrams (DFDs)
Includes DFD Level 0 Context Diagram, DFD Level 1 System Flow, and DFD Level 2 Detailed Process Flow.

---

## 5. Project Timeline & Phase Deliverables

| Phase / Weeks | Technical Task Focus | Key Milestone & Deliverable |
| :--- | :--- | :--- |
| **Weeks 1–3** | Literature Review, Domain Requirements & ER Modeling | 8-Domain ER Schematic & Proposal Approval |
| **Weeks 4–6** | BCNF Normalization & PostgreSQL DDL Schema Setup | 35+ BCNF Tables Created |
| **Weeks 7–8** | PL/SQL Triggers, Stored Procedures & Row Locking | \`hostel_allot()\`, \`fine_block_trigger\` |
| **Weeks 9–10** | REST API Integration & Concurrency Benchmarking | \`pgBench\` Concurrency Suite Metrics |
| **Weeks 11–12** | End-to-End System Testing & Documentation | Final Evaluation Report & Staging Bundle |

---

## 6. Resources & Budget

- **Project Engineering Team:** Ankit Rath, Manan Kapoor, Abhinav Kumar Singh
- **Budget:** No external funding required. All development runs on university laboratory infrastructure.`,

  prototype_proposal: `# PROTOTYPE PROPOSAL: UniCore System Architecture & Specs

*(Stage 2 Proposal — Development in Progress)*

**Institutional Metadata:**  
**Institution:** Thapar Institute of Engineering & Technology, Patiala  
**Department:** Computer Science & Engineering Department (CSED)  
**Target Scale:** 30,000+ Active Students  

**Project Team:**
- **Ankit Rath** (Roll No. 1024030458)
- **Manan Kapoor** (Roll No. 1024030467)
- **Abhinav Kumar Singh** (Roll No. 1024030440)`,

  final_report: `# Technical Master Report: UniCore

*(Stage 3 Technical Report)*

**Institutional Metadata:**  
**Institution:** Thapar Institute of Engineering & Technology, Patiala  
**Department:** Department of Computer Science & Engineering (CSED)  
**Target Scale:** 30,000+ Active Students  

**Project Team:**
- **Ankit Rath** (Roll No. 1024030458)
- **Manan Kapoor** (Roll No. 1024030467)
- **Abhinav Kumar Singh** (Roll No. 1024030440)`
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

\\title{\\textbf{UniCore: Centralized System \\& High-Concurrency Transaction Layer}\\\\ \\Large Project Proposal}
\\author{\\textbf{Ankit Rath} (1024030458) \\quad \\textbf{Manan Kapoor} (1024030467) \\quad \\textbf{Abhinav Kumar Singh} (1024030440)\\\\
\\small Department of Computer Science \\& Engineering\\\\
\\small Thapar Institute of Engineering \\& Technology, Patiala}
\\date{\\today}

\\begin{document}

\\maketitle

\\begin{abstract}
UniCore is a centralized campus operating platform engineered to unify student academic records, residential hostel allotment, library asset circulation, examination processing, and administrative workflows under a single system of record. Decomposed into Boyce-Codd Normal Form (BCNF) across 8 domain schemas and 35+ tables, UniCore guarantees 100\\% ACID transaction safety during peak concurrent rushes via explicit row-level locking (\\texttt{SELECT FOR UPDATE}), automated PL/SQL triggers, and immutable JSON audit ledgers, targeting a Time-To-Acknowledgement (TTA) of $\\le 2$ hours across 30,000+ active students.
\\end{abstract}

\\section{Elevator Pitch}
\\begin{itemize}[leftmargin=*]
    \\item \\textbf{The Gap:} Modern universities run academics, hostels, library, and exams as disconnected system silos, causing severe data duplication, drifting records, room double-booking race conditions during peak rushes, and zero forensic auditability.
    \\item \\textbf{The Solution:} UniCore provides a centralized operating platform (8 BCNF schemas, 35+ tables) governed by atomic row locks (\\texttt{SELECT FOR UPDATE}), automated PL/SQL triggers, and immutable JSON audit ledgers.
    \\item \\textbf{The Impact:} Eliminates administrative overhead, guarantees 100\\% ACID transaction safety during enrollment rushes, and achieves a target Time-To-Acknowledgement (TTA) $\\le 2$ hours across 30,000+ students.
\\end{itemize}

\\section{UML and Data Flow Modeling}
The architecture integrates UML Use Case, Class, Sequence, Component, and State Machine diagrams along with 3 levels of Data Flow Diagrams (DFD Level 0 Context, DFD Level 1 System Flow, DFD Level 2 Detailed Process Flow) to model end-to-end operational execution and forensic audit ledgers.

\\section{Resources \\& Budget}
\\begin{itemize}[leftmargin=*]
    \\item \\textbf{Engineering Team:} Ankit Rath, Manan Kapoor, Abhinav Kumar Singh.
    \\item \\textbf{Budget:} \\textbf{No external funding required.} All development executes on existing university laboratory infrastructure.
\\end{itemize}

\\end{document}`,
  prototype_proposal: `% Stage 2 Prototype Proposal`,
  final_report: `% Stage 3 Final Master Report`
};

// Formatted Markdown View Component
function FormattedMarkdownView({ docId }) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl glass-panel flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
          <span className="font-bold text-[var(--text-main)] text-sm font-mono">PROJECT_PROPOSAL.md</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-mono border border-red-200 dark:border-red-500/20">MARKDOWN PREVIEW</span>
        </div>
        <span className="text-xs text-[var(--text-muted)] font-mono">GitHub Markdown Standard</span>
      </div>

      <div className="glass-panel p-8 rounded-3xl space-y-6 text-[var(--text-main)] leading-relaxed text-sm">
        <div className="border-b border-[var(--border-color)] pb-6 space-y-2">
          <span className="text-xs font-mono text-red-600 dark:text-red-400 uppercase tracking-widest">Document Title</span>
          <h1 className="text-2xl font-extrabold font-heading">
            UniCore: High-Concurrency Transaction Layer
          </h1>
          <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)] pt-2 font-mono">
            <div><strong>Institution:</strong> Thapar Institute of Engineering & Technology, Patiala</div>
            <div><strong>Department:</strong> Computer Science & Engineering Department (CSED)</div>
            <div><strong>Target Scale:</strong> 30,000+ Active Students</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold flex items-center space-x-2 border-b border-[var(--border-color)] pb-2">
            <Target className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span>1. Elevator Pitch & Executive Summary</span>
          </h2>
          <div className="space-y-2 text-xs text-[var(--text-muted)]">
            <p><strong className="text-[var(--text-main)]">The Gap:</strong> Standalone system silos cause severe data duplication, drifting records, double-booking race conditions during peak rushes, and zero forensic auditability.</p>
            <p><strong className="text-[var(--text-main)]">The Solution:</strong> Centralized operating platform built on PostgreSQL (8 BCNF domain schemas, 35+ tables) governed by <code className="text-red-600 dark:text-red-400 font-mono bg-slate-200 dark:bg-slate-800/40 px-1 py-0.5 rounded">SELECT FOR UPDATE</code> row locks and PL/SQL triggers.</p>
            <p><strong className="text-[var(--text-main)]">The Impact:</strong> Guarantees 100% ACID transaction safety during concurrent rushes with target TTA $\le 2$ hours.</p>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold flex items-center space-x-2 border-b border-[var(--border-color)] pb-2">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span>2. Introduction & Problem Statement</span>
          </h2>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-[var(--text-muted)]">
            <li><strong className="text-[var(--text-main)]">Data Duplication:</strong> Identity and address data duplicated across hostel, library, and academic databases.</li>
            <li><strong className="text-[var(--text-main)]">Data Inconsistency:</strong> Student details updated in one portal fail to propagate to other administrative modules.</li>
            <li><strong className="text-[var(--text-main)]">Transaction Hazards:</strong> Race conditions double-allocate hostel beds or overbook exam hall seats during peak registration.</li>
          </ul>
        </div>

        {/* Timeline Table */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold flex items-center space-x-2 border-b border-[var(--border-color)] pb-2">
            <Calendar className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span>5. Timeline & Phase Deliverables</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-900/50 text-[var(--text-main)] font-mono border-b border-[var(--border-color)]">
                <tr>
                  <th className="p-2.5">Phase</th>
                  <th className="p-2.5">Focus</th>
                  <th className="p-2.5">Key Deliverable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-muted)]">
                <tr>
                  <td className="p-2.5 font-bold text-red-600 dark:text-red-400">Weeks 1–3</td>
                  <td className="p-2.5">Literature Review & ER Modeling</td>
                  <td className="p-2.5">8-Domain ER Schematic</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-red-600 dark:text-red-400">Weeks 4–6</td>
                  <td className="p-2.5">BCNF Normalization & DDL Setup</td>
                  <td className="p-2.5">35+ BCNF Tables Created</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-red-600 dark:text-red-400">Weeks 7–8</td>
                  <td className="p-2.5">PL/SQL Triggers & Locks</td>
                  <td className="p-2.5"><code className="text-red-600 dark:text-red-400 font-mono">hostel_allot()</code> & Trigger Ledger</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

// Formatted LaTeX Academic View Component
function FormattedLaTeXView({ docId }) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl glass-panel flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code2 className="w-5 h-5 text-red-600 dark:text-red-400" />
          <span className="font-bold text-[var(--text-main)] text-sm font-mono">project_proposal.tex</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-mono border border-red-200 dark:border-red-500/20">ACADEMIC LATEX PAPER VIEW</span>
        </div>
        <span className="text-xs text-[var(--text-muted)] font-mono">TeX Article Template</span>
      </div>

      {/* Academic Paper Sheet */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl space-y-8 shadow-2xl text-[var(--text-main)]">
        
        {/* TeX Preamble Badge */}
        <div className="bg-slate-100 dark:bg-slate-900/60 border border-[var(--border-color)] p-3 rounded-xl font-mono text-[11px] text-[var(--text-muted)] flex items-center justify-between">
          <span>{"\\documentclass[11pt,a4paper]{article}"}</span>
          <span>Packages: geometry, hyperref, booktabs, amsmath, listings</span>
        </div>

        {/* Paper Title & Authors Block */}
        <div className="text-center space-y-3 border-b border-[var(--border-color)] pb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight leading-snug">
            UniCore: High-Concurrency Transaction Layer
          </h1>
          <div className="text-sm font-medium text-red-600 dark:text-red-400 font-mono">
            Ankit Rath (1024030458) &nbsp;•&nbsp; Manan Kapoor (1024030467) &nbsp;•&nbsp; Abhinav Kumar Singh (1024030440)
          </div>
          <div className="text-xs text-[var(--text-muted)] font-serif italic">
            Department of Computer Science & Engineering<br />
            Thapar Institute of Engineering & Technology, Patiala
          </div>
        </div>

        {/* TeX Abstract */}
        <div className="bg-red-50 dark:bg-red-500/5 border-l-4 border-red-500 p-5 rounded-r-xl space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 font-mono">{"\\begin{abstract}"}</h3>
          <p className="text-xs text-[var(--text-muted)] italic leading-relaxed">
            UniCore is a centralized campus operating platform engineered to unify student academic records, residential hostel allotment, library asset circulation, examination processing, and administrative workflows under a single system of record. Decomposed into Boyce-Codd Normal Form (BCNF) across 8 domain schemas and 35+ tables, UniCore guarantees 100% ACID transaction safety during peak concurrent rushes via explicit row-level locking (<code className="font-mono text-red-600 dark:text-red-400">SELECT FOR UPDATE</code>), automated PL/SQL triggers, and immutable JSON audit ledgers, targeting a Time-To-Acknowledgement (TTA) of $\le 2$ hours across 30,000+ active students.
          </p>
        </div>

        {/* TeX Section 1 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold font-serif border-b border-[var(--border-color)] pb-1">
            1. Elevator Pitch ({"\\section{Elevator Pitch}"})
          </h2>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-[var(--text-muted)]">
            <li><strong className="text-[var(--text-main)]">The Gap:</strong> Disconnected system silos cause data duplication, drifting records, double-booking race conditions during peak rushes, and zero forensic auditability.</li>
            <li><strong className="text-[var(--text-main)]">The Solution:</strong> Centralized operating platform (8 BCNF schemas, 35+ tables) governed by atomic row locks (<code className="font-mono text-red-600 dark:text-red-400">SELECT FOR UPDATE</code>) and PL/SQL triggers.</li>
            <li><strong className="text-[var(--text-main)]">The Impact:</strong> Guarantees 100% ACID transaction safety with target TTA $\le 2$ hours across 30,000+ active students.</li>
          </ul>
        </div>

        {/* TeX Section 2 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold font-serif border-b border-[var(--border-color)] pb-1">
            2. System Architecture & Concurrency Matrix ({"\\section{System Architecture}"})
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left font-serif">
              <thead className="border-t-2 border-b-2 border-[var(--border-color)] text-red-600 dark:text-red-400 uppercase font-mono text-[11px]">
                <tr>
                  <th className="p-2">Scenario</th>
                  <th className="p-2">Isolation Level</th>
                  <th className="p-2">Mechanism ({"\\texttt{booktabs}"})</th>
                  <th className="p-2">Enforced Guarantee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-muted)]">
                <tr>
                  <td className="p-2 text-[var(--text-main)]">Hostel Bed Allotment</td>
                  <td className="p-2 font-mono text-red-600 dark:text-red-400">SERIALIZABLE</td>
                  <td className="p-2 font-mono">SELECT FOR UPDATE</td>
                  <td className="p-2 text-red-600 dark:text-red-400">Zero double-booking</td>
                </tr>
                <tr>
                  <td className="p-2 text-[var(--text-main)]">Exam Seat Registration</td>
                  <td className="p-2 font-mono text-red-600 dark:text-red-400">READ COMMITTED</td>
                  <td className="p-2 font-mono">pg_advisory_xact_lock()</td>
                  <td className="p-2 text-red-600 dark:text-red-400">Seat count $\le$ Capacity</td>
                </tr>
                <tr>
                  <td className="p-2 text-[var(--text-main)]">Library Book Issue</td>
                  <td className="p-2 font-mono text-red-600 dark:text-red-400">READ COMMITTED</td>
                  <td className="p-2 font-mono">In-transaction decrement</td>
                  <td className="p-2 text-red-600 dark:text-red-400">Available count $\ge 0$</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TeX Code Listing Block */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">{"\\begin{lstlisting}[language=SQL]"}</h3>
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-[var(--border-color)] font-mono text-xs text-red-700 dark:text-red-300 leading-relaxed overflow-x-auto">
{`CREATE OR REPLACE PROCEDURE hostel.hostel_allot(
    p_student_id UUID,
    p_room_id UUID,
    p_academic_year TEXT
) AS $$
BEGIN
    SELECT bed_count FROM hostel.hostel_rooms WHERE id = p_room_id FOR UPDATE;
    INSERT INTO hostel.allocations (student_id, room_id, academic_year, status)
    VALUES (p_student_id, p_room_id, p_academic_year, 'active');
END;
$$ LANGUAGE plpgsql;`}
          </div>
        </div>

      </div>
    </div>
  );
}

// Embedded Real PDF Viewer Component
function PDFViewer({ pdfUrl, filename }) {
  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="p-4 rounded-xl glass-panel flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[var(--text-main)] text-sm font-mono">{filename}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-mono border border-red-200 dark:border-red-500/20">
                COMPILED PDF FILE
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">Compiled via pdflatex (TeX Live 2023)</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <a 
            href={pdfUrl} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium transition-colors border border-slate-300 dark:border-slate-700"
          >
            <ExternalLink className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <span>Open Fullscreen PDF</span>
          </a>

          <a 
            href={pdfUrl} 
            download={filename}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors shadow-md shadow-red-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </a>
        </div>
      </div>

      {/* Embedded PDF Container */}
      <div className="glass-panel p-2 rounded-2xl overflow-hidden h-[750px] shadow-2xl relative">
        <object
          data={pdfUrl}
          type="application/pdf"
          className="w-full h-full rounded-xl"
        >
          <div className="p-8 text-center space-y-4 text-xs text-[var(--text-muted)]">
            <p>Your browser does not support embedded PDF view.</p>
            <a 
              href={pdfUrl} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold"
            >
              <span>Download & Open PDF</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </object>
      </div>
    </div>
  );
}

export default function App() {
  const [activeDoc, setActiveDoc] = useState('project_proposal');
  const [viewFormat, setViewFormat] = useState('rendered'); // 'rendered' | 'markdown' | 'latex'
  const [subViewMode, setSubViewMode] = useState('pdf'); // 'pdf' | 'formatted' | 'raw'
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedFormat, setCopiedFormat] = useState(null);
  const [fontSize, setFontSize] = useState('text-xs');
  const [wordWrap, setWordWrap] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  
  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkTheme]);

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
    <div className={`min-h-screen ${''} transition-colors duration-300`}>
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 glass-nav no-print px-4 lg:px-8 py-3 flex items-center justify-between flex-wrap gap-4">
        
        {/* Brand Header */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-red-600 to-red-500 flex items-center justify-center shadow-lg shadow-red-500/20">
            <Database className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-2xl tracking-tight font-heading bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-red-400 to-red-600">
                UniCore
              </span>
              
            </div>
            
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          
          {/* Format Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl border border-[var(--border-color)]">
            <button 
              onClick={() => setViewFormat('rendered')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                viewFormat === 'rendered' ? 'bg-red-600 text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Interactive Proposal
            </button>
            <button 
              onClick={() => { setViewFormat('markdown'); setSubViewMode('formatted'); }}
              className={`px-3 py-1 text-xs rounded-lg font-medium flex items-center space-x-1 transition-all ${
                viewFormat === 'markdown' ? 'bg-red-600 text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>.MD</span>
            </button>
            <button 
              onClick={() => { setViewFormat('latex'); setSubViewMode('pdf'); }}
              className={`px-3 py-1 text-xs rounded-lg font-medium flex items-center space-x-1 transition-all ${
                viewFormat === 'latex' ? 'bg-red-600 text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Code2 className="w-3 h-3" />
              <span>LaTeX PDF</span>
            </button>
          </div>

          {/* Theme Switcher */}
          <button 
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            className="p-2 rounded-xl glass-panel hover:bg-slate-200 dark:bg-slate-800/50 text-[var(--text-main)] transition-colors"
            title="Toggle Theme (Dark / Light)"
          >
            {isDarkTheme ? <Sun className="w-4 h-4 text-red-600 dark:text-red-400" /> : <Moon className="w-4 h-4 text-red-600" />}
          </button>

          {/* Export PDF Button */}
          <a 
            href={currentDoc.pdfFile}
            download={currentDoc.pdfFileName}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold shadow-md shadow-red-600/20 transition-all"
            title="Download PDF Document"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download PDF</span>
          </a>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar */}
        <aside className="lg:col-span-3 no-print space-y-6">
          {/* Metadata Card */}
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                {currentDoc.stage}
              </span>
              <span className="text-xs text-[var(--text-muted)] font-mono">
                {currentDoc.status}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-[var(--text-main)] font-heading text-base leading-snug">
                {currentDoc.title}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                {currentDoc.subtitle}
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--border-color)] space-y-2">
              <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Project Engineering Team</span>
              <div className="space-y-1.5">
                {currentDoc.authors.map((author, i) => (
                  <div key={i} className="text-xs text-[var(--text-main)] flex items-center justify-between">
                    <span className="font-medium">{author.name}</span>
                    <span className="font-mono text-[var(--text-muted)] text-[11px]">{author.roll}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section Index */}
          {currentDoc.display && currentDoc.sections.length > 0 && (
            <div className="glass-panel p-5 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center justify-between">
                <span>Proposal Index</span>
                <Layers className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              </h4>
              <nav className="space-y-1">
                {currentDoc.sections.map((sec, idx) => (
                  <a 
                    key={idx}
                    href={`#${sec.id}`}
                    className="flex items-center space-x-2 text-xs py-1.5 px-2.5 rounded-lg text-[var(--text-muted)] hover:text-red-600 dark:text-red-400 hover:bg-red-100 dark:bg-red-500/10 transition-all group"
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
          
          {!currentDoc.display ? (
            <div className="glass-panel p-12 rounded-3xl text-center space-y-6 border-red-200 dark:border-red-500/20 bg-gradient-to-b from-slate-100 dark:from-slate-900 via-slate-100 dark:via-slate-900 to-red-100 dark:to-red-950/10">
              <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto shadow-lg shadow-red-500/10">
                <Lock className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-500/30 uppercase tracking-wide">
                  Upcoming Stage Milestone
                </span>
                <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-900 dark:text-slate-100">
                  {currentDoc.title}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-600 dark:text-slate-400 leading-relaxed">
                  This document content is locked and set to <code className="text-red-700 dark:text-red-300 font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">display: false</code>. It will be automatically unlocked during upcoming milestone phases.
                </p>
              </div>

              <button 
                onClick={() => setActiveDoc('project_proposal')}
                className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors shadow-lg shadow-red-600/20"
              >
                <span>View Active Project Proposal</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* MARKDOWN OR LATEX VIEW MODES */}
              {viewFormat !== 'rendered' ? (
                <div className="space-y-6">
                  {/* Mode Bar */}
                  <div className="glass-panel p-4 rounded-xl flex items-center justify-between border-red-300 dark:border-red-500/30 bg-slate-100 dark:bg-slate-900/60 flex-wrap gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400">
                        {viewFormat === 'markdown' ? <FileText className="w-5 h-5" /> : <Code2 className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-[var(--text-main)] font-mono">
                            {activeFileName}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 font-mono">
                            {viewFormat === 'markdown' ? 'MARKDOWN FILE' : 'LATEX FILE'}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">
                          {subViewMode === 'pdf' 
                            ? 'Real compiled PDF view'
                            : subViewMode === 'formatted' 
                            ? 'Formatted view' 
                            : 'Raw source code'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Sub-View Switcher Bar */}
                      <div className="flex items-center bg-slate-200 dark:bg-slate-950 p-1 rounded-lg border border-[var(--border-color)]">
                        {viewFormat === 'latex' && (
                          <button 
                            onClick={() => setSubViewMode('pdf')}
                            className={`px-3 py-1 text-xs rounded-md font-semibold transition-all flex items-center space-x-1.5 ${
                              subViewMode === 'pdf' ? 'bg-red-600 text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>PDF Viewer</span>
                          </button>
                        )}
                        <button 
                          onClick={() => setSubViewMode('formatted')}
                          className={`px-3 py-1 text-xs rounded-md font-semibold transition-all flex items-center space-x-1.5 ${
                            subViewMode === 'formatted' ? 'bg-red-600 text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Formatted View</span>
                        </button>
                        <button 
                          onClick={() => setSubViewMode('raw')}
                          className={`px-3 py-1 text-xs rounded-md font-semibold transition-all flex items-center space-x-1.5 ${
                            subViewMode === 'raw' ? 'bg-red-600 text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                          }`}
                        >
                          <FileCode className="w-3.5 h-3.5" />
                          <span>Raw Source</span>
                        </button>
                      </div>

                      <button 
                        onClick={() => handleDownloadFile(activeContentText, activeFileName)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium transition-colors border border-slate-300 dark:border-slate-700"
                        title="Download raw file"
                      >
                        <Download className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                        <span className="hidden sm:inline">Download</span>
                      </button>

                      <button 
                        onClick={() => handleCopyCode(activeContentText, viewFormat)}
                        className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors shadow-md shadow-red-600/20"
                      >
                        {copiedFormat === viewFormat ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-red-700 dark:text-red-300" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Body Content depending on subViewMode */}
                  {subViewMode === 'pdf' && viewFormat === 'latex' ? (
                    <PDFViewer pdfUrl={currentDoc.pdfFile} filename={currentDoc.pdfFileName} />
                  ) : subViewMode === 'formatted' ? (
                    viewFormat === 'markdown' ? (
                      <FormattedMarkdownView docId={activeDoc} />
                    ) : (
                      <FormattedLaTeXView docId={activeDoc} />
                    )
                  ) : (
                    <div className="glass-panel p-6 rounded-2xl overflow-x-auto bg-slate-200 dark:bg-slate-950 border-slate-800">
                      <pre className={`font-mono ${fontSize} leading-relaxed text-slate-800 dark:text-slate-200 ${wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre'}`}>
                        {activeContentText}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                /* RENDERED INTERACTIVE DASHBOARD VIEW */
                <div className="space-y-8">
                  
                  {/* Hero Header */}
                  <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border-red-200 dark:border-red-500/20">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-xs font-semibold text-red-600 dark:text-red-400 tracking-wide uppercase">
                        <ShieldCheck className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span>Thapar Institute of Engineering & Technology | CSED</span>
                      </div>
                      <h1 className="text-3xl lg:text-4xl font-extrabold text-[var(--text-main)] font-heading tracking-tight leading-tight">
                        UniCore: High-Concurrency Transaction Layer
                      </h1>
                      <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-3xl">
                        A centralized campus operating platform that unifies student academic records, residential hostel allotment, library circulation, and examination processing under one system of record — built for strict transactional integrity, BCNF normalization, and scale to 30,000+ students.
                      </p>
                    </div>
                  </div>

                  {/* 1. Elevator Pitch */}
                  <section id="pitch" className="glass-panel p-6 lg:p-8 rounded-2xl space-y-4">
                    <h2 className="text-xl font-bold font-heading text-[var(--text-main)] flex items-center space-x-2">
                      <Target className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span>1. Elevator Pitch & Executive Summary</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-[var(--border-color)] space-y-2">
                        <div className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">The Operational Gap</div>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                          Disconnected departmental silos cause severe data duplication, room double-booking race conditions during peak rushes, and zero forensic auditability.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-[var(--border-color)] space-y-2">
                        <div className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">The Software Solution</div>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                          A centralized operating platform (8 BCNF schemas, 35+ tables) governed by <code className="text-red-600 dark:text-red-400 font-mono">SELECT FOR UPDATE</code> row locks, PL/SQL triggers, and JSON audit ledgers.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-[var(--border-color)] space-y-2">
                        <div className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">The Measurable Impact</div>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                          Eliminates administrative overhead, guarantees 100% ACID transaction safety during rushes, and achieves a target Time-To-Acknowledgement (TTA) $\le 2$ hours across 30,000+ students.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* 2. Introduction & Problem Statement */}
                  <section id="intro" className="glass-panel p-6 lg:p-8 rounded-2xl space-y-6">
                    <div>
                      <h2 className="text-xl font-bold font-heading text-[var(--text-main)] flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <span>2. Introduction & Problem Statement</span>
                      </h2>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        Five recurring operational failure modes in multi-tier administrative software:
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-[var(--border-color)] space-y-1">
                        <div className="text-xs font-bold text-red-600 dark:text-red-400">1. Data Duplication</div>
                        <p className="text-xs text-[var(--text-muted)]">Redundant address & contact records stored across hostel, library, and academic databases.</p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-[var(--border-color)] space-y-1">
                        <div className="text-xs font-bold text-red-600 dark:text-red-400">2. Data Inconsistency</div>
                        <p className="text-xs text-[var(--text-muted)]">Mismatched student profiles when details update in one portal but fail to propagate to others.</p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-[var(--border-color)] space-y-1">
                        <div className="text-xs font-bold text-red-600 dark:text-red-400">3. Resource Tracking Errors</div>
                        <p className="text-xs text-[var(--text-muted)]">Manual, error-prone tracking of bed availability, room statuses, and library book copies.</p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-[var(--border-color)] space-y-1">
                        <div className="text-xs font-bold text-red-600 dark:text-red-400">4. Transaction Hazards</div>
                        <p className="text-xs text-[var(--text-muted)]">Concurrent HTTP requests during room allotment rushes result in double-booking beds.</p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-[var(--border-color)] space-y-1">
                        <div className="text-xs font-bold text-red-600 dark:text-red-400">5. Security & Audit Gaps</div>
                        <p className="text-xs text-[var(--text-muted)]">Unscoped administrative permissions allow modifications without traceable actor logs.</p>
                      </div>
                    </div>
                  </section>

                  {/* 3. SMART Objectives */}
                  <section id="objectives" className="glass-panel p-6 lg:p-8 rounded-2xl space-y-4">
                    <h2 className="text-xl font-bold font-heading text-[var(--text-main)] flex items-center space-x-2">
                      <Cpu className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span>3. SMART Project Objectives</span>
                    </h2>

                    <div className="space-y-3 pt-2">
                      <div className="p-4 rounded-xl bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                        <div className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">Primary Overarching Objective</div>
                        <p className="text-xs text-[var(--text-main)] mt-1">
                          To design, implement, and benchmark a unified BCNF PostgreSQL operating platform for 30,000+ active students that eliminates data redundancy, guarantees ACID transaction safety during peak concurrent rushes, and records immutable audit ledgers.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-[var(--border-color)] text-xs text-[var(--text-muted)]">
                          <strong className="text-red-600 dark:text-red-400">Sub-Goal 1: BCNF Normalization:</strong> Decompose 35+ tables across 8 domain schemas strictly into Boyce-Codd Normal Form.
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-[var(--border-color)] text-xs text-[var(--text-muted)]">
                          <strong className="text-red-600 dark:text-red-400">Sub-Goal 2: Atomic Row Locks:</strong> Enforce <code className="text-red-600 dark:text-red-400 font-mono">SELECT FOR UPDATE</code> in <code className="text-red-600 dark:text-red-400 font-mono">hostel_allot()</code> procedure.
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-[var(--border-color)] text-xs text-[var(--text-muted)]">
                          <strong className="text-red-600 dark:text-red-400">Sub-Goal 3: Automated Triggers:</strong> Implement fine check triggers (&gt; Rs. 500 block) and JSON audit triggers.
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-[var(--border-color)] text-xs text-[var(--text-muted)]">
                          <strong className="text-red-600 dark:text-red-400">Sub-Goal 4: Concurrency Metrics:</strong> Measure TPS throughput and p95/p99 latency via <code className="text-red-600 dark:text-red-400 font-mono">pgBench</code>.
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* 4. Methodology & Architecture */}
                  <section id="methodology" className="glass-panel p-6 lg:p-8 rounded-2xl space-y-4">
                    <h2 className="text-xl font-bold font-heading text-[var(--text-main)] flex items-center space-x-2">
                      <Key className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span>4. System Architecture & Concurrency Matrix</span>
                    </h2>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100 dark:bg-slate-900/60 text-[var(--text-main)] uppercase tracking-wider font-semibold border-b border-[var(--border-color)]">
                          <tr>
                            <th className="p-3">Scenario</th>
                            <th className="p-3">Isolation Level</th>
                            <th className="p-3">Safeguard Mechanism</th>
                            <th className="p-3">Enforced Guarantee</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-muted)]">
                          <tr className="hover:bg-slate-100 dark:hover:bg-slate-900/20">
                            <td className="p-3 font-semibold text-red-600 dark:text-red-400">Hostel Bed Allotment</td>
                            <td className="p-3 font-mono text-red-600 dark:text-red-400">SERIALIZABLE</td>
                            <td className="p-3 font-mono text-[var(--text-muted)]">SELECT FOR UPDATE on room row</td>
                            <td className="p-3 text-red-600 dark:text-red-400">Zero double-booking of beds</td>
                          </tr>
                          <tr className="hover:bg-slate-100 dark:hover:bg-slate-900/20">
                            <td className="p-3 font-semibold text-red-600 dark:text-red-400">Exam Seat Registration</td>
                            <td className="p-3 font-mono text-red-600 dark:text-red-400">READ COMMITTED</td>
                            <td className="p-3 font-mono text-[var(--text-muted)]">pg_advisory_xact_lock(exam_id)</td>
                            <td className="p-3 text-red-600 dark:text-red-400">Seat count never exceeds capacity</td>
                          </tr>
                          <tr className="hover:bg-slate-100 dark:hover:bg-slate-900/20">
                            <td className="p-3 font-semibold text-red-600 dark:text-red-400">Library Book Issue</td>
                            <td className="p-3 font-mono text-red-600 dark:text-red-400">READ COMMITTED</td>
                            <td className="p-3 font-mono text-[var(--text-muted)]">In-transaction decrement</td>
                            <td className="p-3 text-red-600 dark:text-red-400">Copy count never drops below 0</td>
                          </tr>
                          <tr className="hover:bg-slate-100 dark:hover:bg-slate-900/20">
                            <td className="p-3 font-semibold text-red-600 dark:text-red-400">Grade Record Updates</td>
                            <td className="p-3 font-mono text-red-600 dark:text-red-400">READ COMMITTED</td>
                            <td className="p-3 font-mono text-[var(--text-muted)]">UPSERT (ON CONFLICT DO UPDATE)</td>
                            <td className="p-3 text-red-600 dark:text-red-400">Updates existing; zero duplicate rows</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>

                  {/* 4.3 Unified Modeling Language (UML) Diagrams */}
                  <section id="uml" className="glass-panel p-6 lg:p-8 rounded-2xl space-y-6">
                    <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                      <div>
                        <h2 className="text-xl font-bold font-heading text-[var(--text-main)] flex items-center space-x-2">
                          <GitBranch className="w-5 h-5 text-red-600 dark:text-red-400" />
                          <span>4.3 Unified Modeling Language (UML) Diagrams</span>
                        </h2>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          Comprehensive object-oriented and structural models of the UniCore platform.
                        </p>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 font-mono">
                        UML 2.5 Standard
                      </span>
                    </div>

                    <div className="space-y-6">
                      {/* Use Case */}
                      <div className="p-5 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-[var(--border-color)] space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center space-x-2">
                            <Box className="w-4 h-4" />
                            <span>4.3.1 UML Use Case Diagram</span>
                          </h3>
                          <span className="text-[10px] text-[var(--text-muted)] font-mono">System Actor Boundaries</span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">
                          Models interactions between primary external actors (Student, Academic Staff, Warden, Library Officer, Admin) and operational use cases.
                        </p>
                        <div className="p-4 rounded-xl bg-slate-200 dark:bg-slate-950 border border-slate-800 overflow-x-auto">
                          <pre className="font-mono text-[11px] text-red-700 dark:text-red-300 leading-relaxed whitespace-pre">
{`┌─────────────────────────────────────────────────────────────────────────────┐
│                        UniCore System Boundary                              │
│                                                                             │
│   ┌───────────────────────┐             ┌───────────────────────┐           │
│   │ Enroll in Courses     │             │ Allot Hostel Bed      │           │
│   │  (Academic Schema)    │             │    (Hostel Schema)    │           │
│   └───────────────────────┘             └───────────────────────┘           │
│               ▲                                     ▲                       │
│               │ <<include>>                         │ <<include>>           │
│   ┌───────────┴───────────┐             ┌───────────┴───────────┐           │
│   │ Verify Prerequisites  │             │ Lock Bed Capacity     │           │
│   └───────────────────────┘             └───────────────────────┘           │
│                                                                             │
│   ┌───────────────────────┐             ┌───────────────────────┐           │
│   │ Post Semester Grades  │             │ Issue & Borrow Books  │           │
│   │  (Academic Schema)    │             │   (Library Schema)    │           │
│   └───────────────────────┘             └───────────────────────┘           │
│               │                                     │                       │
│               │ <<include>>                         │ <<include>>           │
│               ▼                                     ▼                       │
│   ┌────────────────────────────────────────────────────────┐                │
│   │ Emit JSON Mutation Event to Audit Logs Ledger          │                │
│   │                   (Audit Schema)                       │                │
│   └────────────────────────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────────────────────────┘`}
                          </pre>
                        </div>
                      </div>

                      {/* Class Diagram */}
                      <div className="p-5 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-[var(--border-color)] space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center space-x-2">
                            <Layers className="w-4 h-4" />
                            <span>4.3.2 UML Class & Data Architecture Diagram</span>
                          </h3>
                          <span className="text-[10px] text-[var(--text-muted)] font-mono">Domain Entities & Relations</span>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-200 dark:bg-slate-950 border border-slate-800 overflow-x-auto">
                          <div className="w-full flex justify-center py-2">
                            <img src="/unicore/images/class_diagram_light.png" alt="Class Diagram" className="dark:hidden max-w-full h-auto rounded-lg" />
                            <img src="/unicore/images/class_diagram_dark.png" alt="Class Diagram" className="hidden dark:block max-w-full h-auto rounded-lg" />
                          </div>
                        </div>
                      </div>

                      {/* Sequence & Component Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="p-5 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-[var(--border-color)] space-y-3">
                          <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center space-x-2">
                            <Activity className="w-4 h-4" />
                            <span>4.3.3 UML Sequence Diagram</span>
                          </h3>
                          <p className="text-xs text-[var(--text-muted)]">Pessimistic lock acquisition and trigger execution flow.</p>
                          <div className="p-4 rounded-xl bg-slate-200 dark:bg-slate-950 border border-slate-800 overflow-x-auto">
                            <div className="w-full flex justify-center py-2">
                              <img src="/unicore/images/seq_light.png" alt="Sequence Diagram" className="dark:hidden max-w-full h-auto rounded-lg" />
                              <img src="/unicore/images/seq_dark.png" alt="Sequence Diagram" className="hidden dark:block max-w-full h-auto rounded-lg" />
                            </div>
                          </div>
                        </div>

                        <div className="p-5 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-[var(--border-color)] space-y-3">
                          <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center space-x-2">
                            <Network className="w-4 h-4" />
                            <span>4.3.4 UML Component Diagram</span>
                          </h3>
                          <p className="text-xs text-[var(--text-muted)]">3-Tier deployment architecture across nodes.</p>
                          <div className="p-4 rounded-xl bg-slate-200 dark:bg-slate-950 border border-slate-800 overflow-x-auto">
                            <div className="w-full flex justify-center py-2">
                              <img src="/unicore/images/comp_light.png" alt="Component Diagram" className="dark:hidden max-w-full h-auto rounded-lg" />
                              <img src="/unicore/images/comp_dark.png" alt="Component Diagram" className="hidden dark:block max-w-full h-auto rounded-lg" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* 4.4 Data Flow Diagrams (DFDs) */}
                  <section id="dfd" className="glass-panel p-6 lg:p-8 rounded-2xl space-y-6">
                    <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                      <div>
                        <h2 className="text-xl font-bold font-heading text-[var(--text-main)] flex items-center space-x-2">
                          <Workflow className="w-5 h-5 text-red-600 dark:text-red-400" />
                          <span>4.4 Data Flow Diagrams (DFDs)</span>
                        </h2>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          Functional decomposition of data inputs, processes, data stores, and outputs.
                        </p>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 font-mono">
                        DFD Level 0, 1 & 2
                      </span>
                    </div>

                    <div className="space-y-6">
                      {/* DFD Level 0 Context */}
                      <div className="p-5 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-[var(--border-color)] space-y-3">
                        <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center space-x-2">
                          <ArrowRight className="w-4 h-4" />
                          <span>4.4.1 DFD Level 0 (Context Diagram)</span>
                        </h3>
                        <p className="text-xs text-[var(--text-muted)]">
                          Establishes external entities (Students, Faculty, Wardens, Library Staff, Admins) and boundary data flows.
                        </p>
                        <div className="p-4 rounded-xl bg-slate-200 dark:bg-slate-950 border border-slate-800 overflow-x-auto">
                          <div className="w-full flex justify-center py-2">
                            <img src="/unicore/images/dfd0_light.png" alt="DFD Level 0" className="dark:hidden max-w-full h-auto rounded-lg" />
                            <img src="/unicore/images/dfd0_dark.png" alt="DFD Level 0" className="hidden dark:block max-w-full h-auto rounded-lg" />
                          </div>
                        </div>
                      </div>

                      {/* DFD Level 1 & 2 Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="p-5 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-[var(--border-color)] space-y-3">
                          <h3 className="text-sm font-bold text-red-600 dark:text-red-400">4.4.2 DFD Level 1 (System Flow)</h3>
                          <p className="text-xs text-[var(--text-muted)]">Main process pipelines and data stores.</p>
                          <div className="p-4 rounded-xl bg-slate-200 dark:bg-slate-950 border border-slate-800 overflow-x-auto">
                            <div className="w-full flex justify-center py-2">
                              <img src="/unicore/images/dfd1_light.png" alt="DFD Level 1" className="dark:hidden max-w-full h-auto rounded-lg" />
                              <img src="/unicore/images/dfd1_dark.png" alt="DFD Level 1" className="hidden dark:block max-w-full h-auto rounded-lg" />
                            </div>
                          </div>
                        </div>

                        <div className="p-5 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-[var(--border-color)] space-y-3">
                          <h3 className="text-sm font-bold text-red-600 dark:text-red-400">4.4.3 DFD Level 2 (Allotment & Audit)</h3>
                          <p className="text-xs text-[var(--text-muted)]">Procedural sub-steps for bed allocation and audit log generation.</p>
                          <div className="p-3.5 rounded-xl bg-slate-200 dark:bg-slate-950 border border-slate-800 text-[11px] font-mono text-red-700 dark:text-red-300 space-y-1">
                            <div>3.1 Parse Request & Check Member Fines</div>
                            <div>3.2 Execute SELECT FOR UPDATE on room</div>
                            <div>3.3 Check Capacity (Current &lt; Bed Count)</div>
                            <div>3.4 Insert allocation record (Active)</div>
                            <div>5.1 Trigger generates JSON before/after state diff</div>
                            <div>5.2 Append immutable record to D5: Audit Store</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* 5. Timeline & Schedule */}
                  <section id="timeline" className="glass-panel p-6 lg:p-8 rounded-2xl space-y-4">
                    <h2 className="text-xl font-bold font-heading text-[var(--text-main)] flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span>5. Timeline & Milestone Breakdown</span>
                    </h2>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100 dark:bg-slate-900/60 text-[var(--text-main)] uppercase tracking-wider font-semibold border-b border-[var(--border-color)]">
                          <tr>
                            <th className="p-3">Phase / Weeks</th>
                            <th className="p-3">Technical Task Focus</th>
                            <th className="p-3">Key Deliverable</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-muted)]">
                          <tr>
                            <td className="p-3 font-bold text-red-600 dark:text-red-400">Weeks 1–3</td>
                            <td className="p-3">Literature Review, Domain Requirements & ER Modeling</td>
                            <td className="p-3 text-[var(--text-main)]">8-Domain ER Schematic & Proposal Approval</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-red-600 dark:text-red-400">Weeks 4–6</td>
                            <td className="p-3">BCNF Normalization & PostgreSQL DDL Schema Setup</td>
                            <td className="p-3 text-[var(--text-main)]">35+ BCNF Tables Created</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-red-600 dark:text-red-400">Weeks 7–8</td>
                            <td className="p-3">PL/SQL Triggers, Stored Procedures & Row Locking</td>
                            <td className="p-3 text-[var(--text-main)]"><code className="text-red-600 dark:text-red-400 font-mono">hostel_allot()</code>, <code className="text-red-600 dark:text-red-400 font-mono">fine_block_trigger</code></td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-red-600 dark:text-red-400">Weeks 9–10</td>
                            <td className="p-3">REST API Integration & Concurrency Benchmarking</td>
                            <td className="p-3 text-[var(--text-main)]"><code className="text-red-600 dark:text-red-400 font-mono">pgBench</code> Concurrency Metrics</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-red-600 dark:text-red-400">Weeks 11–12</td>
                            <td className="p-3">End-to-End System Testing & Documentation</td>
                            <td className="p-3 text-[var(--text-main)]">Final Master Report & Staging Build</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>

                  {/* 6. Resources & Budget */}
                  <section id="resources" className="glass-panel p-6 lg:p-8 rounded-2xl space-y-4">
                    <h2 className="text-xl font-bold font-heading text-[var(--text-main)] flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span>6. Resources & Budget</span>
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[var(--text-muted)]">
                      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-[var(--border-color)] space-y-2">
                        <strong className="text-[var(--text-main)] font-semibold">Project Engineering Team:</strong>
                        <ul className="list-disc list-inside space-y-1 text-[var(--text-muted)]">
                          <li>Ankit Rath</li>
                          <li>Manan Kapoor</li>
                          <li>Abhinav Kumar Singh</li>
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-[var(--border-color)] space-y-2">
                        <strong className="text-[var(--text-main)] font-semibold">Infrastructure & Budget:</strong>
                        <p className="text-[var(--text-muted)] leading-relaxed">
                          <strong>No external funding required.</strong> All development, testing, and database execution run on existing university laboratory infrastructure and local computing resources.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* 7. Risks & Mitigations */}
                  <section id="risks" className="glass-panel p-6 lg:p-8 rounded-2xl space-y-4">
                    <h2 className="text-xl font-bold font-heading text-[var(--text-main)] flex items-center space-x-2">
                      <ShieldCheck className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span>7. Risk Assessment & Mitigation Strategies</span>
                    </h2>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100 dark:bg-slate-900/60 text-[var(--text-main)] uppercase tracking-wider font-semibold border-b border-[var(--border-color)]">
                          <tr>
                            <th className="p-3">Identified Risk</th>
                            <th className="p-3">Risk Impact</th>
                            <th className="p-3">Proposed Mitigation Strategy</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-muted)]">
                          <tr>
                            <td className="p-3 font-semibold text-red-600 dark:text-red-400">High Lock Contention</td>
                            <td className="p-3 text-red-600 dark:text-red-400">High (Transaction Retries)</td>
                            <td className="p-3 text-[var(--text-muted)]">Implement pessimistic SELECT FOR UPDATE under READ COMMITTED with short transaction boundaries.</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold text-red-600 dark:text-red-400">Data Privacy & Scope</td>
                            <td className="p-3 text-red-600 dark:text-red-400">Medium (Unauthorized Access)</td>
                            <td className="p-3 text-[var(--text-muted)]">Enforce strict RBAC permission scoping at API middleware layer and soft-delete historical preservation.</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold text-red-600 dark:text-red-400">Measurement Ambiguity</td>
                            <td className="p-3 text-red-600 dark:text-red-400">Medium (Evaluation Errors)</td>
                            <td className="p-3 text-[var(--text-muted)]">Instrument automated UTC timestamps in database AFTER triggers prior to execution.</td>
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
      <footer className="no-print border-t border-[var(--border-color)] mt-16 py-8 text-center text-xs text-[var(--text-muted)] space-y-2">
        <p>UniCore — Thapar Institute of Engineering & Technology, Patiala</p>
        <p className="font-mono text-[11px] text-[var(--text-muted)] opacity-70">Built with React, Vite, Tailwind CSS, & GitHub Pages</p>
      </footer>
    </div>
  );
}
