import React from 'react';
import './ClinicalHUD.css';

interface HUDProps {
    title: string;
    metrics?: { label: string; value: string | number; unit?: string }[];
    status?: 'normal' | 'warning' | 'critical';
    children?: React.ReactNode;
}

export const HUDOverlay: React.FC<HUDProps> = ({ title, metrics, status = 'normal', children }) => {
    return (
        <div className="clinical-hud-container">
            {/* Top Bar - SmartGlass Safe Zone */}
            <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
                <div className="hud-glass-panel p-4 rounded-xl border-l-4 border-l-cyan-400">
                    <h1 className="hud-h1">{title}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <div className={`hud-indicator ${status === 'critical' ? 'bg-red-500 shadow-red-500' : ''}`}></div>
                        <span className="text-[10px] text-white/60 font-mono uppercase tracking-tighter">
                            System: DANIEL_AI // Mode: HUD_ACTIVE
                        </span>
                    </div>
                </div>

                <div className="flex gap-4">
                    {metrics?.map((m, i) => (
                        <div key={i} className="hud-glass-panel p-4 rounded-xl text-right">
                            <p className="text-[10px] text-cyan-400/70 uppercase tracking-widest font-bold">{m.label}</p>
                            <p className="hud-metric">
                                {m.value}<span className="text-xs ml-1 opacity-50">{m.unit}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Side Action HUD - Minimal Footprint */}
            <div className="absolute right-8 bottom-8 flex flex-col gap-4">
                {children}
            </div>

            {/* Bottom HUD: Security & Context */}
            <div className="absolute bottom-8 left-8 hud-glass-panel px-4 py-2 rounded-lg border-b-2 border-b-cyan-400/30">
                <p className="text-[8px] text-white/40 font-mono">ENCRYPTED_HUD_PROTOCOL // AES-256-GCM</p>
            </div>
        </div>
    );
};
