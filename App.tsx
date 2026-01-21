
import React, { useState } from 'react';
import Layout from './components/Layout';
import MetaMockup from './components/MetaMockup';
import StrategyPanel from './components/StrategyPanel';
import { GeminiService } from './services/geminiService';
import { Campaign, AppView, AdObjective, AdCopy, SegmentationStrategy } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('dashboard');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);

  // Form State
  const [url, setUrl] = useState('');
  const [clientName, setClientName] = useState('');
  const [objective, setObjective] = useState<AdObjective>(AdObjective.LEADS);
  const [format, setFormat] = useState<'image' | 'video'>('image');

  // Intelligence State
  const [analysis, setAnalysis] = useState<{
    copy: AdCopy;
    strategy: SegmentationStrategy;
    visualPrompt: string;
    sources: { title: string; uri: string }[];
  } | null>(null);
  const [creativeUrl, setCreativeUrl] = useState<string | null>(null);

  const startResearch = async () => {
    if (!url || !clientName) return alert('URL and Client Name are required.');
    setIsProcessing(true);
    setAnalysis(null);
    setCreativeUrl(null);
    setStep(1);

    try {
      const result = await GeminiService.analyzeUrlAndMarket(url, objective);
      setAnalysis(result);
      setStep(2);
    } catch (e) {
      alert('Error analyzing site. Verify API Key.');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateCreative = async () => {
    if (!analysis) return;
    setIsProcessing(true);
    try {
      let media = '';
      if (format === 'image') {
        media = await GeminiService.generateBanner(analysis.visualPrompt);
      } else {
        // @ts-ignore
        if (typeof window.aistudio !== 'undefined' && !(await window.aistudio.hasSelectedApiKey())) {
          // @ts-ignore
          await window.aistudio.openSelectKey();
        }
        media = await GeminiService.generateVideo(analysis.visualPrompt);
      }
      setCreativeUrl(media);
      setStep(3);
    } catch (e) {
      alert('Generation error. Try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const saveCampaign = () => {
    if (!analysis || !creativeUrl) return;
    const newCamp: Campaign = {
      id: Date.now().toString(),
      clientName,
      url,
      objective,
      creativeType: format,
      creativeUrl,
      copy: analysis.copy,
      strategy: analysis.strategy,
      sources: analysis.sources,
      status: 'ready'
    };
    setCampaigns([newCamp, ...campaigns]);
    setView('dashboard');
    // Reset
    setAnalysis(null);
    setCreativeUrl(null);
    setStep(1);
    setUrl('');
    setClientName('');
  };

  return (
    <Layout activeView={view} onViewChange={setView}>
      {view === 'dashboard' && (
        <div className="space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Campaign Overview</h1>
              <p className="text-slate-500">Managing {campaigns.length} client portfolios</p>
            </div>
            <button onClick={() => setView('strategy-lab')} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-lg shadow-indigo-200">
              + New Multi-Campaign
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             {[
               { label: 'Total Clients', val: campaigns.length, icon: 'fa-briefcase', color: 'bg-blue-50 text-blue-600' },
               { label: 'Ads Generated', val: campaigns.length * 3, icon: 'fa-ad', color: 'bg-indigo-50 text-indigo-600' },
               { label: 'Market Research', val: 'Active', icon: 'fa-search', color: 'bg-amber-50 text-amber-600' },
               { label: 'API Health', val: '99.9%', icon: 'fa-heartbeat', color: 'bg-emerald-50 text-emerald-600' }
             ].map((stat, i) => (
               <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <i className={`fas ${stat.icon} text-lg`}></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{stat.label}</p>
                    <p className="text-xl font-bold text-slate-800">{stat.val}</p>
                  </div>
               </div>
             ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b">
                <tr>
                  <th className="px-8 py-4">Business / URL</th>
                  <th className="px-8 py-4">Segmentation Status</th>
                  <th className="px-8 py-4">Format</th>
                  <th className="px-8 py-4">Launch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.length === 0 ? (
                  <tr><td colSpan={4} className="px-8 py-12 text-center text-slate-300 italic">No campaigns found. Start in the Strategy Lab.</td></tr>
                ) : (
                  campaigns.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                      <td className="px-8 py-4">
                        <p className="font-bold text-slate-800">{c.clientName}</p>
                        <p className="text-xs text-slate-400 truncate max-w-xs">{c.url}</p>
                      </td>
                      <td className="px-8 py-4">
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Strategy Mapped</span>
                      </td>
                      <td className="px-8 py-4">
                        <i className={`fas ${c.creativeType === 'image' ? 'fa-image text-blue-400' : 'fa-video text-pink-400'}`}></i>
                      </td>
                      <td className="px-8 py-4">
                        <button className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-slate-900 text-white text-xs rounded transition-all">Export Meta</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(view === 'strategy-lab' || view === 'new-campaign') && (
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map(num => (
              <div key={num} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= num ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                  {num}
                </div>
                <span className={`text-xs font-bold uppercase tracking-tighter ${step >= num ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {num === 1 ? 'Market Intelligence' : num === 2 ? 'Strategic Review' : 'Ad Creative'}
                </span>
                {num < 3 && <div className="w-12 h-px bg-slate-200"></div>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Control Panel */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 space-y-5">
                <h3 className="font-bold text-slate-800">Intelligence Parameters</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Target URL (Deep Scan)</label>
                    <div className="relative">
                      <input 
                        type="url" value={url} onChange={e => setUrl(e.target.value)}
                        placeholder="Paste coches.net, amazon, or client web..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 ring-indigo-500 outline-none transition-all"
                      />
                      <i className="fas fa-link absolute left-3 top-3 text-slate-300"></i>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Client Business Name</label>
                    <input 
                      type="text" value={clientName} onChange={e => setClientName(e.target.value)}
                      placeholder="e.g. MotorEvo Alicante"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Goal</label>
                      <select value={objective} onChange={e => setObjective(e.target.value as any)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm appearance-none">
                        <option value={AdObjective.LEADS}>Leads</option>
                        <option value={AdObjective.CLICKS}>Clicks</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Creative</label>
                      <select value={format} onChange={e => setFormat(e.target.value as any)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm appearance-none">
                        <option value="image">Banner</option>
                        <option value="video">Video (Veo)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={startResearch} disabled={isProcessing}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-100"
                >
                  {isProcessing && step === 1 ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-search"></i>}
                  {isProcessing && step === 1 ? 'Extracting Stock Data...' : 'Start Deep Scan'}
                </button>
              </div>

              {analysis && (
                <div className="bg-indigo-900 text-white p-6 rounded-2xl space-y-4">
                  <h4 className="font-bold text-indigo-200 flex items-center gap-2">
                    <i className="fas fa-check-circle"></i> Scan Completed
                  </h4>
                  <p className="text-xs text-indigo-100">AI has mapped the stock and defined the segmentation strategy. Ready to build creative assets?</p>
                  <button 
                    onClick={generateCreative} disabled={isProcessing}
                    className="w-full py-3 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-magic"></i>}
                    Build Creative Assets
                  </button>
                </div>
              )}
            </div>

            {/* Content Display */}
            <div className="lg:col-span-2 space-y-6">
              {!analysis && !isProcessing && (
                <div className="h-full bg-white border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-12 text-center space-y-4">
                   <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                     <i className="fas fa-robot text-3xl text-slate-200"></i>
                   </div>
                   <div className="max-w-xs">
                     <h3 className="font-bold text-slate-800">Ready for Stock Analysis</h3>
                     <p className="text-sm text-slate-500 mt-2">Paste a URL to identify products, audiences, and create multi-campaign strategies automatically.</p>
                   </div>
                </div>
              )}

              {analysis && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in fade-in duration-500">
                   <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <i className="fas fa-ad"></i> Creative Preview
                      </h4>
                      <MetaMockup campaign={{ clientName, url, creativeType: format }} copy={analysis.copy} creativeUrl={creativeUrl || undefined} />
                      
                      {analysis.sources.length > 0 && (
                        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                          <h5 className="text-[10px] font-bold text-slate-400 uppercase">Analysis Sources (Grounding)</h5>
                          <div className="flex flex-wrap gap-2">
                            {analysis.sources.map((s, i) => (
                              <a key={i} href={s.uri} target="_blank" className="text-[10px] text-indigo-600 hover:underline flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded">
                                <i className="fas fa-external-link-alt"></i> {s.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <i className="fas fa-bullseye"></i> Targeting & Stock Strategy
                      </h4>
                      <StrategyPanel strategy={analysis.strategy} />
                      
                      {creativeUrl && (
                        <button onClick={saveCampaign} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-100 flex items-center justify-center gap-3">
                           <i className="fas fa-save"></i> Save & Deploy Campaign
                        </button>
                      )}
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
