
import React, { useState } from 'react';
import { AIPurifier } from '../../utils/safeCore.ts';

const WoundClinicConsole: React.FC = () => {
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [tissueType, setTissueType] = useState('GRANULATION');

    const runAIDiagnostic = async () => {
        setIsAnalyzing(true);
        // Simulation of Gemini/Med-Gemma multi-modal analysis
        setTimeout(() => {
            setAnalysisResult({
                status: 'ANALYSIS_COMPLETE',
                tissue: tissueType,
                probability: 0.94,
                recommendation: tissueType === 'NECROTIC' ? 'Debridement required' : 'Advanced foam dressing',
                next_step: 'Update treatment plan in Vega'
            });
            setIsAnalyzing(false);
        }, 2000);
    };

    return (
        <div className="p-8 bg-slate-900 min-h-[600px] rounded-3xl border border-blue-500/20 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

            <header className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
                <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="material-symbols-outlined text-blue-400">biotech</span>
                        DANIEL_AI Diagnostic Console
                    </h3>
                    <p className="text-blue-400/60 text-xs font-mono tracking-widest uppercase mt-1">Wound Clinic Program // VEGA SCALE</p>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] font-bold tracking-tighter animate-pulse">
                    REAL-TIME ANALYSIS ACTIVE
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/5">
                        <label className="block text-xs font-bold text-blue-300 uppercase tracking-widest mb-4">Tissue Identification</label>
                        <select
                            value={tissueType}
                            onChange={(e) => setTissueType(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 transition-colors"
                        >
                            <option value="GRANULATION">Granulation Tissue</option>
                            <option value="NECROTIC">Necrotic Escar</option>
                            <option value="SLOUGH">Slough / Fibrinous</option>
                            <option value="EPITHELIAL">Epithelialization</option>
                        </select>
                    </div>

                    <button
                        onClick={runAIDiagnostic}
                        disabled={isAnalyzing}
                        className="w-full h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                    >
                        {isAnalyzing ? (
                            <span className="animate-spin material-symbols-outlined">sync</span>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">psychology</span>
                                Run AI Wound Diagnostic
                            </>
                        )}
                    </button>
                </div>

                <div className="relative">
                    {analysisResult ? (
                        <div className="p-6 rounded-2xl bg-blue-600/10 border border-blue-500/40 animate-in fade-in slide-in-from-right-4 duration-500">
                            <h4 className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-6">Diagnostic Results</h4>

                            <div className="space-y-6">
                                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                    <span className="text-gray-400 text-sm">Target tissue</span>
                                    <span className="text-white font-bold">{analysisResult.tissue}</span>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                    <span className="text-gray-400 text-sm">Confidence</span>
                                    <span className="text-green-400 font-bold">{(analysisResult.probability * 100).toFixed(0)}%</span>
                                </div>

                                <div className="mt-8 p-6 rounded-xl bg-blue-500/20 border border-blue-500/30">
                                    <p className="text-blue-200 text-sm font-medium leading-relaxed italic">
                                        "{analysisResult.recommendation}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 pt-4 text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                                    <span className="material-symbols-outlined text-xs">database</span>
                                    READY TO SYNC TO VEGA SCALE
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl p-10 text-center opacity-30">
                            <span className="material-symbols-outlined text-6xl mb-4">image_search</span>
                            <p className="text-sm">Identify tissue samples to begin clinical analysis</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WoundClinicConsole;
