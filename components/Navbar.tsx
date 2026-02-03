
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Icons } from '../constants';

interface NavbarProps {
    onNavigate: (view: string) => void;
    activeView: string;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
            }`}
    >
        {icon}
        <span className="hidden lg:inline">{label}</span>
    </button>
);

const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeView }) => {
    const { user, logout } = useAppContext();

    const safeRender = (value: any) => {
        return (typeof value === 'string' || typeof value === 'number') ? value : '';
    };

    const isChiefOrCoord = user?.cargo === 'JEFE MEDICO' || user?.cargo === 'COORDINADOR';

    return (
        <nav className="bg-brand-blue shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        {/* Daniel AI Ecosystem Branding Line */}
                        <div className="hidden lg:flex items-center gap-2 mr-4 pr-4 border-r border-white/10 h-8">
                            <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center border border-white/10">
                                <span className="text-white font-black text-[6px]">D_AI</span>
                            </div>
                            <span className="text-white text-[8px] uppercase font-bold tracking-[0.2em] opacity-60">Daniel AI <span className="text-blue-400">Ecosystem</span></span>
                        </div>

                        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center border border-white/20 overflow-hidden">
                            <img
                                src="/assets/phoenix_logo_official.jpg"
                                alt="Phoenix Logo"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    mixBlendMode: 'screen',
                                    filter: 'contrast(1.5) brightness(1.1)'
                                }}
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-white text-lg leading-none tracking-tight">Phoenix <span className="text-blue-400">Core</span></span>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[8px] text-blue-300/50 uppercase tracking-[0.2em] font-mono leading-none">Advanced Clinical Node</span>
                                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                                <span className="text-[7px] text-white/30 uppercase tracking-widest font-mono">Partner: [INST_LOGO]</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4 overflow-x-auto">
                        <NavItem icon={Icons.Home} label="Pacientes" isActive={activeView === 'dashboard'} onClick={() => onNavigate('dashboard')} />
                        <NavItem icon={<span className="material-symbols-outlined text-sm">healing</span>} label="Clínica Heridas" isActive={activeView === 'woundclinic'} onClick={() => onNavigate('woundclinic')} />
                        <NavItem icon={Icons.Clipboard} label="Registro Heridas" isActive={activeView === 'wounds'} onClick={() => onNavigate('wounds')} />
                        <NavItem icon={Icons.Handover} label="Entrega Turno" isActive={activeView === 'handover'} onClick={() => onNavigate('handover')} />
                        <NavItem icon={Icons.Schedule} label="Agenda" isActive={activeView === 'schedule'} onClick={() => onNavigate('schedule')} />
                        <NavItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>} label="DANIEL AI" isActive={activeView === 'daniel'} onClick={() => onNavigate('daniel')} />
                        {isChiefOrCoord && (
                            <NavItem icon={Icons.ClipboardCheck} label="Orden Prod." isActive={activeView === 'production'} onClick={() => onNavigate('production')} />
                        )}
                        <NavItem icon={Icons.Profile} label="Mi Perfil" isActive={activeView === 'profile'} onClick={() => onNavigate('profile')} />
                        {user?.cargo === 'JEFE MEDICO' && (
                            <NavItem icon={Icons.Users} label="Personal" isActive={activeView === 'staff'} onClick={() => onNavigate('staff')} />
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-white">{safeRender(user?.nombre)}</p>
                            <p className="text-xs text-gray-300">{safeRender(user?.cargo)}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all border border-white/10"
                            title="Cerrar Sesión"
                        >
                            {Icons.Logout}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
