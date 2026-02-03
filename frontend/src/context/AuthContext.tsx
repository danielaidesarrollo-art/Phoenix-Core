import React, { createContext, useContext, useState, useEffect } from 'react';

// Simulated User Interface matching 'Sirius' audit requirements
export interface User {
    id: string;
    display_name: string; // The field possibly causing the issue
    role: string;
    biometric_token?: string;
}

interface AuthContextType {
    user: User | null;
    login: (name: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // SIMULATION: Check local storage or existing session
        // In a real 'Polaris' integration, this would validate with Supabase
        const storedUser = localStorage.getItem('phoenix_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            // Default "Guest" or "Medico" state found by user. 
            // We fix this by NOT setting a default, forcing a sync.
        }
    }, []);

    const login = (name: string) => {
        // Simulating the fix: ensuring display_name is correctly mapped
        const newUser: User = {
            id: 'usr_' + Math.random().toString(36).substr(2, 9),
            display_name: name, // Explicitly using the input, avoiding "MEDICO" default
            role: 'CLINICAL_SPECIALIST',
            biometric_token: 'bio_verified_ok'
        };
        setUser(newUser);
        localStorage.setItem('phoenix_user', JSON.stringify(newUser));

        // Simulating Sirius Audit Log
        console.log(`[SIRIUS AUDIT] User Authenticated: ${newUser.display_name} (Role: ${newUser.role})`);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('phoenix_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
