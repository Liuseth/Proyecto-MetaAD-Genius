
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onViewChange: (view: any) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="bg-indigo-600 p-1.5 rounded-lg">M</span>
            MetaAdGen
          </h1>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Intelligence Unit</p>
        </div>

        <nav className="flex-1 mt-4">
          <button onClick={() => onViewChange('dashboard')} className={`w-full flex items-center gap-3 px-6 py-3 transition-all ${activeView === 'dashboard' ? 'bg-indigo-600/20 text-indigo-400 border-r-4 border-indigo-600' : 'text-slate-400 hover:bg-slate-800'}`}>
            <i className="fas fa-th-large w-5"></i> Dashboard
          </button>
          <button onClick={() => onViewChange('strategy-lab')} className={`w-full flex items-center gap-3 px-6 py-3 transition-all ${activeView === 'strategy-lab' ? 'bg-indigo-600/20 text-indigo-400 border-r-4 border-indigo-600' : 'text-slate-400 hover:bg-slate-800'}`}>
            <i className="fas fa-microscope w-5"></i> Strategy Lab
          </button>
          <button onClick={() => onViewChange('new-campaign')} className={`w-full flex items-center gap-3 px-6 py-3 transition-all ${activeView === 'new-campaign' ? 'bg-indigo-600/20 text-indigo-400 border-r-4 border-indigo-600' : 'text-slate-400 hover:bg-slate-800'}`}>
            <i className="fas fa-paper-plane w-5"></i> Ad Factory
          </button>
        </nav>

        <div className="p-4 bg-slate-950/50">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">JD</div>
             <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold truncate">Senior Media Buyer</p>
                <p className="text-[10px] text-slate-500 truncate">Account Manager</p>
             </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="font-bold text-slate-800 text-lg capitalize">{activeView.replace('-', ' ')}</h2>
          <div className="flex items-center gap-4 text-xs font-semibold">
             <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">Google Search: Connected</span>
             <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Veo 3.1: Active</span>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;
