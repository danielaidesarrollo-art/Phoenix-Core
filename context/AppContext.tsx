import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Patient, HandoverNote, User } from '../types';
import { initialCollaborators } from '../data/collaborators';

interface AppState {
  user: User | null;
  loading: boolean;
  theme: 'light' | 'dark';
  patients: Patient[];
  handoverNotes: HandoverNote[];
  users: User[];
}

interface AppContextType {
  state: AppState;
  user: User | null;
  patients: Patient[];
  handoverNotes: HandoverNote[];
  users: User[];
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  addHandoverNote: (note: HandoverNote) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: '1',
    nombre: 'Admin Daniel',
    correo: 'admin@phoenix.com',
    cargo: 'JEFE MEDICO',
    rol: 'ADMIN'
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [handoverNotes, setHandoverNotes] = useState<HandoverNote[]>([]);
  const [users, setUsers] = useState<User[]>(initialCollaborators);

  // Local storage and API persistence
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/patients');
        if (response.ok) {
          const data = await response.json();
          setPatients(data);
          return;
        }
      } catch (error) {
        console.log("Backend not reached, using local storage");
      }

      const savedPatients = localStorage.getItem('phoenix_patients');
      if (savedPatients) {
        setPatients(JSON.parse(savedPatients));
      }
    };
    fetchPatients();

    const savedNotes = localStorage.getItem('phoenix_notes');
    if (savedNotes) {
      setHandoverNotes(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('phoenix_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('phoenix_notes', JSON.stringify(handoverNotes));
  }, [handoverNotes]);

  const addPatient = (patient: Patient) => {
    setPatients(prev => [...prev, patient]);
  };

  const updatePatient = (updatedPatient: Patient) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  };

  const addHandoverNote = (note: HandoverNote) => {
    setHandoverNotes(prev => [note, ...prev]);
  };

  const logout = () => {
    setUser(null);
    console.log("Logging out...");
  };

  const state: AppState = {
    user,
    loading,
    theme,
    patients,
    handoverNotes,
    users
  };

  return (
    <AppContext.Provider value={{ state, user, patients, handoverNotes, users, setUser, setTheme, addPatient, updatePatient, addHandoverNote, logout }}>
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
