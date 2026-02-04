import React, { useState, useEffect } from 'react';

interface SiriusAuditBannerProps {
    position?: 'top' | 'bottom';
}

const SiriusAuditBanner: React.FC<SiriusAuditBannerProps> = ({ position = 'bottom' }) => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Show banner after 2 seconds of login
        const timer = setTimeout(() => setIsVisible(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    const positionClasses = position === 'top'
        ? 'top-0'
        : 'bottom-0';

    return (
        <div
            className={`fixed ${positionClasses} left-0 right-0 z-50 transition-all duration-300 ${isMinimized ? 'translate-y-0' : ''
                }`}
        >
            <div className="mx-auto max-w-7xl px-4 py-2">
                <div className="glass-panel rounded-lg border border-yellow-500/30 bg-gradient-to-r from-yellow-900/20 via-orange-900/20 to-yellow-900/20 backdrop-blur-md shadow-lg shadow-yellow-500/10">
                    {!isMinimized ? (
                        <div className="flex items-center justify-between gap-4 px-4 py-3">
                            <div className="flex items-center gap-3">
                                {/* SIRIUS Star Icon */}
                                <div className="flex-shrink-0">
                                    <div className="relative">
                                        <svg
                                            className="w-8 h-8 text-yellow-400 animate-pulse"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                                        </svg>
                                        <div className="absolute inset-0 blur-md bg-yellow-400/50"></div>
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">
                                            🛡️ SIRIUS Audit Active
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-semibold">
                                            MONITORING
                                        </span>
                                    </div>
                                    <p className="text-yellow-100/80 text-xs leading-relaxed">
                                        Todas las acciones están siendo monitoreadas y auditadas para garantizar el cumplimiento de{' '}
                                        <span className="font-semibold text-yellow-200">HIPAA</span>,{' '}
                                        <span className="font-semibold text-yellow-200">Ley 1581</span> y protocolos de seguridad.
                                    </p>
                                </div>
                            </div>

                            {/* Minimize Button */}
                            <button
                                onClick={() => setIsMinimized(true)}
                                className="flex-shrink-0 p-2 rounded-lg hover:bg-yellow-500/10 transition-colors"
                                aria-label="Minimizar banner"
                            >
                                <svg
                                    className="w-5 h-5 text-yellow-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsMinimized(false)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 hover:bg-yellow-500/10 transition-colors"
                        >
                            <svg
                                className="w-4 h-4 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                            </svg>
                            <span className="text-yellow-400 text-xs font-bold uppercase">SIRIUS Audit</span>
                            <svg
                                className="w-4 h-4 text-yellow-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SiriusAuditBanner;
