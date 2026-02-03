import React, { useState, useRef, useEffect } from 'react';
import { PhoenixAPI } from '../../utils/api_client.ts';
import { CameraAdapter } from '../../utils/cameraAdapter.ts';

const WoundClinicConsole: React.FC = () => {
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [tissueType, setTissueType] = useState('GRANULATION');
    const [woundLocation, setWoundLocation] = useState('Primary');
    const [resvechParams, setResvechParams] = useState({
        dim: 0, depth: 0, edges: 0, bed: 0, exudate: 0, inf: 0
    });
    const [error, setError] = useState<string | null>(null);
    const [isMultimodalAnalyzing, setIsMultimodalAnalyzing] = useState(false);
    const [multimodalResult, setMultimodalResult] = useState<any>(null);
    const [isArchiving, setIsArchiving] = useState(false);
    const [comparisonResult, setComparisonResult] = useState<any>(null);
    const [isTraining, setIsTraining] = useState(false);
    const [trainingCase, setTrainingCase] = useState<any>(null);

    // Camera Integration
    const [isCameraActive, setIsCameraActive] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const cameraAdapter = useRef(new CameraAdapter());

    const [professionalObservation, setProfessionalObservation] = useState('');

    const runAIDiagnostic = async () => {
        setIsAnalyzing(true);
        setError(null);
        try {
            const data = await PhoenixAPI.diagnoseTissue(tissueType, {
                resvech_params: resvechParams,
                woundLocation: woundLocation,
                professional_observation: professionalObservation // Pass observations to diagnostic
            });
            setAnalysisResult(data.diagnostic);
        } catch (err) {
            console.error(err);
            setError('Connection failed. Is the Phoenix Core backend running?');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const syncToVega = async () => {
        if (!analysisResult) return;
        setIsSyncing(true);
        setError(null);
        try {
            await PhoenixAPI.saveRecord('P-DEMO', analysisResult.diagnostics);
            alert('Record synced to Vega successfully!');
        } catch (err) {
            console.error(err);
            setError('Failed to sync record to Vega.');
        } finally {
            setIsSyncing(false);
        }
    };

    const toggleCamera = async () => {
        if (isCameraActive) {
            cameraAdapter.current.stopCamera();
            setIsCameraActive(false);
        } else {
            if (videoRef.current) {
                try {
                    await cameraAdapter.current.startCamera(videoRef.current);
                    setIsCameraActive(true);
                } catch (err: any) {
                    setError(err.message);
                }
            }
        }
    };

    const captureAndAnalyze = async () => {
        setIsMultimodalAnalyzing(true);
        setError(null);
        try {
            const b64Image = cameraAdapter.current.captureFrame();
            const astraPrompt = `
                Perform a high-fidelity clinical analysis of this wound image.
                1. LIGHT & DEPTH: Analyze light reflection patterns and shadows to estimate wound depth and contour integrity.
                2. TISSUE QUALITY: Evaluate tissue viability based on color saturation and texture.
                3. CONTEXT: Integrate professional observation: "${professionalObservation || 'No additional verbal data provided.'}"
                4. DIAGNOSTIC: Determine TIMERS phase and clinical implications.
            `;
            const result = await PhoenixAPI.analyzeMultimodal(b64Image, astraPrompt);
            setMultimodalResult(result);
        } catch (err: any) {
            console.error(err);
            setError('Multimodal capture failed: ' + err.message);
        } finally {
            setIsMultimodalAnalyzing(false);
        }
    };

    const startAristotelesTraining = async () => {
        if (!analysisResult) return;
        setIsTraining(true);
        setError(null);
        try {
            // Phoenix interconnects with Aristoteles Core for clinician learning
            const response = await fetch('http://localhost:4011/simulate-case', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: 'CLINICIAN-001',
                    condition: analysisResult.diagnostics,
                    level: 'RESIDENCY_V2',
                    focus_area: 'Advanced Biofilm Management'
                })
            });
            const data = await response.json();
            setTrainingCase(data);
        } catch (err) {
            console.error(err);
            setError('Aristoteles Core is offline. Interconnection failed.');
        } finally {
            setIsTraining(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsMultimodalAnalyzing(true);
        setError(null);

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = (reader.result as string).split(',')[1];
            try {
                const astraPrompt = `
                    Perform a high-fidelity clinical analysis of this wound image.
                    1. LIGHT & DEPTH: Analyze light reflection patterns and shadows to estimate wound depth and contour integrity.
                    2. TISSUE QUALITY: Evaluate tissue viability based on color saturation and texture.
                    3. CONTEXT: Integrate professional observation: "${professionalObservation || 'No additional verbal data provided.'}"
                    4. DIAGNOSTIC: Determine TIMERS phase and clinical implications.
                `;
                const result = await PhoenixAPI.analyzeMultimodal(base64String, astraPrompt);
                setMultimodalResult(result);
            } catch (err) {
                console.error(err);
                setError('Multimodal analysis failed. Ensure Gateway and Astra Core are online.');
            } finally {
                setIsMultimodalAnalyzing(false);
            }
        };
        reader.readAsDataURL(file);
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
                    <p className="text-blue-400/60 text-xs font-mono tracking-widest uppercase mt-1">Ecosystem: Vega // Auditor: Sirius // Multi-Wound Tech</p>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] font-bold tracking-tighter animate-pulse">
                    REAL-TIME ANALYSIS ACTIVE
                </div>
            </header>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/5">
                        <label className="block text-xs font-bold text-blue-300 uppercase tracking-widest mb-4">Observaciones del Profesional (Datos Verbales)</label>
                        <textarea
                            value={professionalObservation}
                            onChange={(e) => setProfessionalObservation(e.target.value)}
                            placeholder="Ingrese hallazgos clínicos, comentarios del paciente o datos verbales relevantes..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-blue-500 transition-colors h-24 resize-none"
                        />
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/5">
                        <label className="block text-xs font-bold text-blue-300 uppercase tracking-widest mb-4">Tissue Identification</label>
                        <select
                            value={tissueType}
                            onChange={(e) => setTissueType(e.target.value)}
                            title="Seleccione el tipo de tejido observado"
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 transition-colors"
                        >
                            <option value="GRANULATION">Granulation Tissue</option>
                            <option value="NECROTIC">Necrotic Escar</option>
                            <option value="SLOUGH">Slough / Fibrinous</option>
                            <option value="EPITHELIAL">Epithelialization</option>
                            <option value="INFECTED">Infection / Inflammation (TIMERS-I)</option>
                        </select>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/5">
                        <label className="block text-xs font-bold text-blue-300 uppercase tracking-widest mb-4">Wound Identifier (Location)</label>
                        <input
                            type="text"
                            value={woundLocation}
                            onChange={(e) => setWoundLocation(e.target.value)}
                            placeholder="e.g. Left Ankle, Dorsum of Right Foot"
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 transition-colors"
                            title="Location of the wound for tracking"
                        />
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/5 space-y-4">
                        <label className="block text-xs font-bold text-purple-300 uppercase tracking-widest">RESVECH 2.0 parameters</label>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(resvechParams).map(([key, val]) => (
                                <div key={key}>
                                    <label htmlFor={`resvech-${key}`} className="block text-[8px] text-white/40 uppercase mb-1">{key}</label>
                                    <input
                                        type="number"
                                        id={`resvech-${key}`}
                                        min="0"
                                        max={key === 'inf' ? 15 : 6}
                                        value={val}
                                        title={`Value for RESVECH parameter: ${key}`}
                                        onChange={(e) => setResvechParams({ ...resvechParams, [key]: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-white text-xs"
                                    />
                                </div>
                            ))}
                        </div>
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

                    <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/10 mt-6 group/upload relative overflow-hidden">
                        <label className="block text-xs font-bold text-purple-300 uppercase tracking-widest mb-4 flex justify-between items-center">
                            <span className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">auto_videocam</span>
                                Astra Capture Suite
                            </span>
                            {isCameraActive && (
                                <span className="flex items-center gap-1 text-[8px] text-red-500 animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                    LIVE FEED
                                </span>
                            )}
                            {analysisResult?.sirius_compliance && (
                                <span className={`flex items-center gap-1 text-[8px] ${analysisResult.sirius_compliance.status === 'COMPLIANT' ? 'text-green-500' : 'text-blue-500'} font-bold`}>
                                    <span className="material-symbols-outlined text-[10px]">verified_user</span>
                                    SIRIUS: {analysisResult.sirius_compliance.status}
                                </span>
                            )}
                        </label>

                        <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40 border border-purple-500/20 mb-4">
                            {!isCameraActive && !multimodalResult && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-purple-400/30">
                                    <span className="material-symbols-outlined text-4xl mb-2">videocam_off</span>
                                    <p className="text-[10px] font-mono tracking-tighter">CAMERA INACTIVE</p>
                                </div>
                            )}
                            <video
                                ref={videoRef}
                                className={`w-full h-full object-cover ${isCameraActive ? 'opacity-100' : 'opacity-0'} transition-opacity`}
                                playsInline
                                muted
                                title="Clinician Live Feed"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={toggleCamera}
                                className={`h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isCameraActive
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-sm">
                                    {isCameraActive ? 'videocam_off' : 'videocam'}
                                </span>
                                {isCameraActive ? 'Stop Stream' : 'Initialise Device'}
                            </button>

                            <button
                                onClick={captureAndAnalyze}
                                disabled={!isCameraActive || isMultimodalAnalyzing}
                                className="h-12 bg-purple-600 rounded-xl text-white text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 hover:bg-purple-500 disabled:opacity-30"
                            >
                                <span className="material-symbols-outlined text-sm">
                                    {isMultimodalAnalyzing ? 'sync' : 'auto_fix_high'}
                                </span>
                                {isMultimodalAnalyzing ? 'Analysing...' : 'Capture & Astra'}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <button
                                onClick={async () => {
                                    setIsArchiving(true);
                                    try {
                                        const frame = cameraAdapter.current.captureFrame();
                                        await PhoenixAPI.archiveImage('P-DEMO', woundLocation, frame);
                                        alert('Image Archived Safely (HIPAA Encrypted)');
                                    } catch (err) {
                                        setError('Archiving failed');
                                    } finally {
                                        setIsArchiving(false);
                                    }
                                }}
                                disabled={!isCameraActive || isArchiving}
                                className="h-10 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-300 text-[8px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-30"
                            >
                                <span className="material-symbols-outlined text-sm">inventory_2</span>
                                {isArchiving ? 'Archiving...' : 'HIPAA Archive'}
                            </button>

                            <button
                                onClick={async () => {
                                    setComparisonResult(null);
                                    setIsMultimodalAnalyzing(true);
                                    try {
                                        const frame = cameraAdapter.current.captureFrame();
                                        const res = await PhoenixAPI.compareHealing('P-DEMO', woundLocation, frame);
                                        setComparisonResult(res);
                                    } catch (err) {
                                        setError('Comparison failed');
                                    } finally {
                                        setIsMultimodalAnalyzing(false);
                                    }
                                }}
                                disabled={!isCameraActive || isMultimodalAnalyzing}
                                className="h-10 bg-green-600/20 border border-green-500/30 rounded-xl text-green-300 text-[8px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-30"
                            >
                                <span className="material-symbols-outlined text-sm">compare_arrows</span>
                                COMPARE PROGRESS
                            </button>
                        </div>

                        <div className="mt-4 border-t border-white/5 pt-4">
                            <label className="relative cursor-pointer flex items-center justify-center gap-2 text-[8px] text-purple-300/60 uppercase tracking-widest hover:text-purple-300 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    disabled={isMultimodalAnalyzing}
                                    title="Upload legacy media"
                                />
                                <span className="material-symbols-outlined text-xs">attach_file</span>
                                or upload legacy media
                            </label>
                        </div>
                    </div>
                </div>

                <div className="relative space-y-6">
                    {comparisonResult && (
                        <div className="p-6 rounded-2xl bg-green-600/10 border border-green-500/40 animate-in slide-in-from-top-4 duration-500">
                            <h4 className="text-green-400 font-bold uppercase tracking-widest text-[10px] mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                Astra Healing Progress Analysis
                            </h4>
                            <p className="text-green-200 text-xs leading-relaxed italic border-l-2 border-green-500/50 pl-4 py-1">
                                {comparisonResult.analysis || comparisonResult.error || 'Comparison logic active.'}
                            </p>
                        </div>
                    )}

                    {multimodalResult && (
                        <div className="p-6 rounded-2xl bg-purple-600/10 border border-purple-500/40 animate-in slide-in-from-top-4 duration-500">
                            <h4 className="text-purple-400 font-bold uppercase tracking-widest text-[10px] mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">visibility</span>
                                Astra Multimodal Analysis
                            </h4>
                            <p className="text-purple-200 text-xs leading-relaxed italic border-l-2 border-purple-500/50 pl-4 py-1">
                                {multimodalResult.analysis}
                            </p>
                        </div>
                    )}

                    {analysisResult ? (
                        <div className="p-6 rounded-2xl bg-blue-600/10 border border-blue-500/40 animate-in fade-in slide-in-from-right-4 duration-500">
                            <h4 className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-6">Diagnostic Results</h4>

                            <div className="space-y-6">
                                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                    <span className="text-gray-400 text-sm">Target tissue</span>
                                    <span className="text-white font-bold">{tissueType}</span>
                                </div>
                                {analysisResult.timers_phase && (
                                    <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                        <span className="text-gray-400 text-sm">TIMERS Phase</span>
                                        <span className="text-purple-400 font-bold">{analysisResult.timers_phase}</span>
                                    </div>
                                )}
                                {analysisResult.resvech_assessment && (
                                    <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                        <span className="text-gray-400 text-sm">RESVECH Score</span>
                                        <div className="text-right">
                                            <div className="text-white font-bold">{analysisResult.resvech_assessment.total_score} pts</div>
                                            <div className="text-[10px] text-blue-400 font-bold uppercase">{analysisResult.resvech_assessment.prognosis}</div>
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                    <span className="text-gray-400 text-sm">Urgency</span>
                                    <span className={`${analysisResult.urgency_level === 'HIGH' ? 'text-red-400' : 'text-green-400'} font-bold`}>
                                        {analysisResult.urgency_level}
                                    </span>
                                </div>

                                <div className="mt-8 p-6 rounded-xl bg-blue-500/20 border border-blue-500/30">
                                    <p className="text-blue-200 text-sm font-medium leading-relaxed italic mb-4">
                                        "{analysisResult.recommendation}"
                                    </p>

                                    {/* Specialized Dressing Recommendations */}
                                    {analysisResult.specialized_dressing && (
                                        <div className="mt-4 pt-4 border-t border-blue-500/20">
                                            <h5 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-xs">healing</span>
                                                Recommended Laboratory Product
                                            </h5>
                                            <div className="flex flex-wrap gap-2">
                                                {analysisResult.specialized_dressing.brand === 'Smith & Nephew' && (
                                                    <span className="px-3 py-1 rounded bg-blue-600/30 border border-blue-500/50 text-blue-200 text-xs font-bold">
                                                        Smith & Nephew: {analysisResult.specialized_dressing.product}
                                                    </span>
                                                )}
                                                {analysisResult.specialized_dressing.brand === 'Mölnlycke' && (
                                                    <span className="px-3 py-1 rounded bg-teal-600/30 border border-teal-500/50 text-teal-200 text-xs font-bold">
                                                        Mölnlycke: {analysisResult.specialized_dressing.product}
                                                    </span>
                                                )}
                                                {analysisResult.specialized_dressing.product.includes('Versajet') && (
                                                    <span className="px-3 py-1 rounded bg-red-600/30 border border-red-500/50 text-red-200 text-xs font-bold animate-pulse">
                                                        HYDROSURGERY INDICATED (Versajet)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {analysisResult.med_gemma_intelligence && (
                                    <div className="mt-4 p-5 rounded-xl bg-red-500/10 border border-red-500/30">
                                        <h5 className="text-red-400 text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-xs">clinical_notes</span>
                                            Med-Gemma Safety Insights
                                        </h5>
                                        <p className="text-red-200 text-xs leading-relaxed">
                                            {analysisResult.med_gemma_intelligence.recommendations}
                                        </p>
                                        <div className="mt-3 flex gap-2">
                                            <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[8px] font-bold">
                                                RISK: {analysisResult.med_gemma_intelligence.overall_risk}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {analysisResult.biofilm_assessment && (
                                    <div className="mt-4 p-5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                                        <h5 className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-xs">biotech</span>
                                            Biofilm Step-down Protocol
                                        </h5>
                                        <div className="space-y-3">
                                            {analysisResult.biofilm_assessment.steps.map((step: any, idx: number) => (
                                                <div key={idx} className="flex gap-3">
                                                    <span className="text-amber-500 font-bold text-[10px]">{step.action}:</span>
                                                    <span className="text-amber-200 text-[10px] leading-tight">{step.detail}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 flex flex-col gap-3">
                                    <button
                                        onClick={syncToVega}
                                        disabled={isSyncing}
                                        className="flex items-center gap-3 text-[10px] text-blue-400 hover:text-blue-300 font-mono uppercase tracking-widest transition-colors disabled:opacity-50"
                                    >
                                        <span className={`material-symbols-outlined text-xs ${isSyncing ? 'animate-spin' : ''}`}>
                                            {isSyncing ? 'sync' : 'database'}
                                        </span>
                                        {isSyncing ? 'SYNCING...' : 'SYNC TO VEGA SCALE'}
                                    </button>

                                    <button
                                        onClick={startAristotelesTraining}
                                        disabled={isTraining}
                                        className="flex items-center gap-3 text-[10px] text-purple-400 hover:text-purple-300 font-mono uppercase tracking-widest transition-colors disabled:opacity-50"
                                    >
                                        <span className={`material-symbols-outlined text-xs ${isTraining ? 'animate-spin' : ''}`}>
                                            {isTraining ? 'school' : 'psychology_alt'}
                                        </span>
                                        {isTraining ? 'Generating Simulation...' : 'Practice Case with Aristoteles'}
                                    </button>
                                </div>

                                {trainingCase && (
                                    <div className="mt-6 p-6 rounded-2xl bg-purple-900/40 border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)] animate-in zoom-in-95 duration-300">
                                        <header className="flex justify-between items-center mb-4">
                                            <h5 className="text-purple-300 text-xs font-bold uppercase">Medical Simulation ACTIVE</h5>
                                            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[8px] border border-purple-500/30">MIR/USMLE LEVEL</span>
                                        </header>
                                        <p className="text-white text-xs leading-relaxed mb-4 italic">
                                            "{trainingCase.clinical_case}"
                                        </p>
                                        <div className="space-y-2">
                                            {trainingCase.clinical_pearls?.map((pearl: string, i: number) => (
                                                <div key={i} className="text-[10px] text-purple-200 flex gap-2">
                                                    <span className="text-purple-500">•</span> {pearl}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl p-10 text-center opacity-30 min-h-[300px]">
                            <span className="material-symbols-outlined text-6xl mb-4">image_search</span>
                            <p className="text-sm">Identify tissue samples or use Astra to begin clinical analysis</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WoundClinicConsole;
