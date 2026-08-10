import React, { useState } from 'react';
import { 
  Database, ShieldCheck, FileText, Code2, Search, 
  Sun, Moon, Printer, Copy, Check, Layers, Cpu, 
  Key, AlertTriangle, ChevronRight, Lock, Clock, Target, Calendar
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
    display: false, // Hidden until display=true
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
    display: false, // Hidden until display=true
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

**Title of Proposal:** UniCore: Centralized Campus Operating Platform & High-Concurrency Transaction Layer
**Institution:** Thapar Institute of Engineering & Technology, Patiala  
**Course:** UCS310 – Database Management Systems | Target Scale: 30,000+ Students

**Project Team & Roles:**
- Ankit Rath (1024030458) — Systems Architect & Concurrency Specialist
- Manan Kapoor (1024030467) — Database Schema & BCNF Normalization Specialist
- Abhinav Kumar Singh (1024030440) — API Middleware & Audit Pipeline Engineer

## 1. Elevator Pitch & Executive Summary
- The Gap: Disconnected departmental silos cause severe data duplication, room double-booking race conditions during peak rushes, and zero auditability.
- The Solution: Centralized PostgreSQL operating platform (8 BCNF schemas, 35+ tables) governed by SELECT FOR UPDATE row locks, PL/SQL triggers, and immutable JSON audit ledgers.
- The Impact: Eliminates administrative overhead, guarantees 100% ACID safety, and achieves Time-To-Acknowledgement (TTA) <= 2 hours.

## 2. SMART Objectives
- Primary Goal: Centralized BCNF PostgreSQL operating platform for 30,000+ students with 100% ACID transaction safety.
- Sub-Goals: BCNF normalization, SELECT FOR UPDATE row locks, fine threshold triggers, pgBench throughput evaluation.`,

  prototype_proposal: `# PROTOTYPE PROPOSAL (Stage 2 - Coming Soon)`,
  final_report: `# FINAL TECHNICAL MASTER REPORT (Stage 3 - Coming Soon)`
};

const RAW_LATEX_CONTENT = {
  project_proposal: `\\documentclass[11pt,a4paper]{article}
\\usepackage{hyperref}
\\usepackage{booktabs}

\\title{\\textbf{UniCore: Project Proposal}}
\\author{Ankit Rath (1024030458) \\quad Manan Kapoor (1024030467) \\quad Abhinav Kumar Singh (1024030440)}
\\date{\\today}

\\begin{document}
\\maketitle
\\begin{abstract}
UniCore is a centralized, database-driven campus operating platform engineered to unify student academic records, residential hostel allotment, library asset circulation, examination processing, and administrative workflows under a single PostgreSQL system of record.
\\end{abstract}
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

  const currentDoc = DOCUMENTS_DATA[activeDoc];

  const handleCopyCode = (text, formatName) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatName);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

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
                Project Proposal Portal
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

          {/* Format Selector Switcher */}
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

          {/* Section Index (Only rendered when display === true) */}
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
              {/* RAW FORMAT VIEWER */}
              {viewFormat !== 'rendered' ? (
                <div className="space-y-4">
                  <div className="glass-panel p-4 rounded-xl flex items-center justify-between border-blue-500/30 bg-blue-950/20">
                    <div className="flex items-center space-x-3">
                      <Code2 className="w-5 h-5 text-blue-400" />
                      <div>
                        <h4 className="text-sm font-semibold text-slate-100">
                          Source Code: {viewFormat === 'markdown' ? currentDoc.markdownFile : currentDoc.latexFile}
                        </h4>
                        <p className="text-xs text-slate-400">
                          Complete proposal raw content formatted for academic compilation.
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleCopyCode(
                        viewFormat === 'markdown' ? RAW_MARKDOWN_CONTENT[activeDoc] : RAW_LATEX_CONTENT[activeDoc],
                        viewFormat
                      )}
                      className="flex items-center space-x-1.5 px-3 py-1.5 text-xs rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors shadow-md shadow-blue-600/20"
                    >
                      {copiedFormat === viewFormat ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Raw {viewFormat.toUpperCase()}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="glass-panel p-6 rounded-2xl overflow-x-auto font-mono text-xs leading-relaxed text-slate-300 bg-slate-950">
                    <pre className="whitespace-pre-wrap">
                      {viewFormat === 'markdown' ? RAW_MARKDOWN_CONTENT[activeDoc] : RAW_LATEX_CONTENT[activeDoc]}
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
                      <span>1. Elevator Pitch</span>
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
                          A centralized PostgreSQL operating layer (8 BCNF schemas, 35+ tables) governed by <code className="text-blue-300">SELECT FOR UPDATE</code> row locks, PL/SQL triggers, and JSON audit ledgers.
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
                          <strong className="text-emerald-400">Sub-Goal 2: Atomic Row Locks:</strong> Enforce <code className="text-emerald-300">SELECT FOR UPDATE</code> in <code className="text-emerald-300">hostel_allot()</code> procedure.
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                          <strong className="text-cyan-400">Sub-Goal 3: Automated Triggers:</strong> Implement fine check triggers (&gt; Rs. 500 block) and JSON audit triggers.
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                          <strong className="text-amber-400">Sub-Goal 4: Concurrency Metrics:</strong> Measure TPS throughput and p95/p99 latency via <code className="text-amber-300">pgBench</code>.
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
                            <td className="p-3 text-slate-300"><code className="text-indigo-300">hostel_allot()</code>, <code className="text-indigo-300">fine_block_trigger</code></td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-emerald-400">Weeks 9–10</td>
                            <td className="p-3">REST API Integration & Concurrency Benchmarking</td>
                            <td className="p-3 text-slate-300"><code className="text-emerald-300">pgBench</code> Concurrency Metrics</td>
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
