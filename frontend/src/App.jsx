import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-red-50 text-slate-900 flex flex-col items-center justify-center p-4">
      <div className="glass-panel max-w-2xl w-full p-12 rounded-3xl text-center space-y-8 relative overflow-hidden">
        {/* Abstract decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-red-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-slate-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-red-100 text-red-600 font-semibold text-sm border border-red-200 shadow-sm mb-6 uppercase tracking-wider">
            Stage 3 Objective
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
            UniCore <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Frontend</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto font-medium">
            The high-performance interactive campus portal is currently under active development. The underlying architecture and transaction engines are documented in our interactive proposal.
          </p>
        </div>

        <div className="relative z-10 pt-8 border-t border-slate-200/60">
          <p className="text-sm text-slate-500 mb-6 uppercase tracking-wider font-bold">Read the Architecture Proposal</p>
          <a 
            href="/unicore/docs/"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-lg transition-all shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transform hover:-translate-y-0.5"
          >
            <span>Go to Documentation</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
