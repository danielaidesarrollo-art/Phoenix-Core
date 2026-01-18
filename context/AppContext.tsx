
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Patient, HandoverNote } from '../types.ts';
import { initialCollaborators } from '../data/collaborators.ts';
import { getInitialPatients } from '../data/patients.ts';

interface AppContextType {
    user: User | null;
    users: User[];
    patients: Patient[];
    handoverNotes: HandoverNote[];
    login: (user: User) => void;
    logout: () => void;
    addPatient: (patient: Patient) => void;
    updatePatient: (patient: Patient) => void;
    addHandoverNote: (note: HandoverNote) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [handoverNotes, setHandoverNotes] = useState<HandoverNote[]>([]);
    const [users] = useState<User[]>(initialCollaborators);

    useEffect(() => {
        setPatients(getInitialPatients());

        // Polaris Session Detection Simulation
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token') || localStorage.getItem('polaris_token');

        if (token && !user) {
            // In reality, we'd verify this token with SafeCore or Polaris
            console.log("Polaris Session Detected. Granting access to Phoenix Core.");
            const johanUser = users.find(u => u.documento === '79965441') || users[0];
            setUser(johanUser);
            localStorage.setItem('polaris_token', token);
        }
    }, [users, user]);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    const addPatient = (newPatient: Patient) => {
        setPatients(prev => [...prev, newPatient]);
    };

    const updatePatient = (updatedPatient: Patient) => {
        setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    };

    const addHandoverNote = (note: HandoverNote) => {
        setHandoverNotes(prev => [...prev, note]);
    };

    return (
        <AppContext.Provider value={{
            user,
            users,
            patients,
            handoverNotes,
            login,
            logout,
            addPatient,
            updatePatient,
            addHandoverNote
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
