import React, { useState } from 'react';

const WoundAssessment = () => {
    const [parameters, setParameters] = useState({
        size: 0,
        depth: 0,
        edges: 0,
        tissue_type: 0,
        exudate: 0,
        infection_inflammation: 0,
        tissue_type_desc: 'Grating',
        exudate_desc: 'None',
        edges_desc: 'Regular'
    });

    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleRunAnalysis = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/analyze_wound', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ parameters })
            });
            const data = await response.json();
            setAnalysis(data);
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 fade-in">
            <div className="glass-panel p-8 rounded-3xl">
                <h2 className="text-3xl font-bold mb-6 glow-text-cyan flex items-center gap-3">
                    <span className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">🩺</span>
                    Clinical Assessment Parameters
                </h2>

                <div className="resvech-grid">
                    <ParameterInput
                        label="Wound Size"
                        value={parameters.size}
                        max={5}
                        onChange={(v) => setParameters({ ...parameters, size: v })}
                    />
                    <ParameterInput
                        label="Depth"
                        value={parameters.depth}
                        max={3}
                        onChange={(v) => setParameters({ ...parameters, depth: v })}
                    />
                    <ParameterInput
                        label="Edges"
                        value={parameters.edges}
                        max={3}
                        onChange={(v) => setParameters({ ...parameters, edges: v })}
                    />
                    <ParameterInput
                        label="Tissue Type"
                        value={parameters.tissue_type}
                        max={6}
                        onChange={(v) => setParameters({ ...parameters, tissue_type: v })}
                    />
                    <ParameterInput
                        label="Exudate"
                        value={parameters.exudate}
                        max={5}
                        onChange={(v) => setParameters({ ...parameters, exudate: v })}
                    />
                    <ParameterInput
                        label="Infection/Inf"
                        value={parameters.infection_inflammation}
                        max={10}
                        onChange={(v) => setParameters({ ...parameters, infection_inflammation: v })}
                    />
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleRunAnalysis}
                        disabled={loading}
                        className="btn-primary flex items-center gap-2 text-lg px-8 py-3"
                    >
                        {loading ? 'Processing...' : 'Generate AI Diagnosis'}
                        {!loading && <span className="text-xl">✨</span>}
                    </button>
                </div>
            </div>

            {analysis && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 fade-in">
                    {/* RESVECH Result */}
                    <div className="glass-panel p-8 rounded-3xl border-l-4 border-cyan-500">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">RESVECH 2.0 Score</h3>
                            <span className="text-4xl font-mono font-bold text-cyan-400">{analysis.resvech_score}/35</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-cyan-500 h-full transition-all duration-1000"
                                style={{ width: `${(analysis.resvech_score / 35) * 100}%` }}
                            ></div>
                        </div>
                        <p className="mt-4 text-gray-400 text-sm italic">
                            *A lower score indicates better healing progress.
                        </p>
                    </div>

                    {/* TIMERS Dashboard */}
                    <div className="glass-panel p-8 rounded-3xl border-l-4 border-purple-500">
                        <h3 className="text-xl font-bold mb-4">TIMERS Assessment</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(analysis.timers).map(([key, value]: [string, any]) => (
                                <div key={key} className="bg-white/5 p-4 rounded-xl">
                                    <div className="font-bold text-purple-400 text-lg mb-1">{key}</div>
                                    <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">{value.status}</div>
                                    <div className="text-sm text-gray-300">{value.action}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Biofilm Protocol */}
                    <div className="glass-panel p-8 rounded-3xl col-span-1 lg:col-span-2 border-l-4 border-red-500">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-400">
                            🛡️ Biofilm Management Protocol
                        </h3>
                        <ul className="space-y-3">
                            {analysis.biofilm_protocol.map((step: string, i: number) => (
                                <li key={i} className="flex gap-4 items-start">
                                    <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs font-bold mt-1">
                                        STEP {i + 1}
                                    </span>
                                    <span className="text-gray-300">{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Sponsored Clinical Catalog */}
                    {analysis.sponsored_products && analysis.sponsored_products.length > 0 && (
                        <div className="glass-panel p-8 rounded-3xl col-span-1 lg:col-span-2 border-t-4 border-cyan-500/50">
                            <h3 className="text-xl font-bold mb-4 flex justify-between items-center">
                                <span className="flex items-center gap-2">
                                    📦 Clinically Aligned Products
                                </span>
                                <span className="text-[10px] bg-white/10 px-2 py-1 rounded tracking-widest uppercase">Sponsored</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {analysis.sponsored_products.map((product: any) => (
                                    <div key={product.id} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all group">
                                        <div className="text-[10px] text-cyan-400 font-bold mb-1 uppercase tracking-tighter">{product.manufacturer}</div>
                                        <h4 className="text-lg font-bold mb-2 group-hover:text-cyan-300 transition-colors">{product.name}</h4>
                                        <p className="text-sm text-gray-400 mb-4">{product.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] bg-cyan-900/30 text-cyan-300 px-2 py-1 rounded">
                                                Aligned with: {product.alignment}
                                            </span>
                                            <a
                                                href={product.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs font-bold text-white hover:underline flex items-center gap-1"
                                            >
                                                Learn More ↗
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Simulation: Misaligned/Rejected Products */}
                    {analysis.misaligned_products && analysis.misaligned_products.length > 0 && (
                        <div className="glass-panel p-8 rounded-3xl col-span-1 lg:col-span-2 border-t-4 border-red-500/50 bg-red-500/5">
                            <h3 className="text-xl font-bold mb-4 flex justify-between items-center text-red-400">
                                <span className="flex items-center gap-2">
                                    🚫 Clinical Misalignment Detected
                                </span>
                                <span className="text-[10px] bg-red-500/20 px-2 py-1 rounded tracking-widest uppercase text-red-300">Filtered</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {analysis.misaligned_products.map((product: any) => (
                                    <div key={product.id} className="bg-black/20 p-6 rounded-2xl border border-red-500/10 opacity-60">
                                        <div className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-tighter">{product.manufacturer}</div>
                                        <h4 className="text-lg font-bold mb-2 text-gray-400">{product.name}</h4>
                                        <p className="text-xs text-gray-500 mb-4 italic">"{product.description}"</p>

                                        <div className="space-y-2">
                                            {product.rejection_reasons.map((reason: string, idx: number) => (
                                                <div key={idx} className="text-xs font-bold text-red-400 flex items-center gap-2">
                                                    <span>⚠️</span> {reason}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-gray-600 uppercase">
                                            Rejection based on International EWMA/WUWHS Guidelines
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const ParameterInput = ({ label, value, max, onChange }: any) => (
    <div className="flex flex-col gap-2 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
        <div className="flex justify-between items-center">
            <label htmlFor={`param-${label.replace(/\s+/g, '-').toLowerCase()}`} className="text-sm font-medium text-gray-300">{label}</label>
            <span className="font-mono text-cyan-400">{value}</span>
        </div>
        <input
            id={`param-${label.replace(/\s+/g, '-').toLowerCase()}`}
            type="range"
            min="0"
            max={max}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full"
            title={label}
        />
        <div className="flex justify-between text-[10px] text-gray-500 uppercase">
            <span>Mild</span>
            <span>Severe</span>
        </div>
    </div>
);

export default WoundAssessment;
