
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

    return (
        <nav className="sticky top-0 z-50 px-4 py-3 bg-white border-b border-slate-200 shadow-sm backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-blue-600 rounded-lg text-white font-bold text-xl">
                        P
                    </div>
                    <span className="font-bold text-slate-800 text-xl tracking-tight hidden md:block">Phoenix Core</span>
                </div>

                <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl">
                    <NavItem icon={Icons.Home} label="Pacientes" isActive={activeView === 'dashboard'} onClick={() => onNavigate('dashboard')} />
                    <NavItem icon={Icons.Clipboard} label="Heridas" isActive={activeView === 'wounds'} onClick={() => onNavigate('wounds')} />
                    <NavItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>} label="DANIEL AI" isActive={activeView === 'daniel'} onClick={() => onNavigate('daniel')} />
                    <NavItem icon={Icons.Profile} label="Perfil" isActive={activeView === 'profile'} onClick={() => onNavigate('profile')} />
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800">{safeRender(user?.nombre)}</p>
                        <p className="text-xs text-slate-500 font-medium">{safeRender(user?.cargo)}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                        title="Cerrar Sesión"
                    >
                        {Icons.Logout}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
