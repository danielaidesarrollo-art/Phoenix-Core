import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Patient, User, ClinicalNote, WoundRecord, HandoverNote } from '../types';
import { initialCollaborators } from '../data/collaborators.ts';
import { getInitialPatients } from '../data/patients.ts';

interface AppState {
  user: User | null;
  loading: boolean;
  theme: 'light' | 'dark';
  patients: Patient[];
  wounds: WoundRecord[];
  clinicalNotes: ClinicalNote[];
  handoverNotes: HandoverNote[];
  users: User[];
  isBioCoreAuthenticated: boolean;
}

interface AppContextType {
  state: AppState;
  user: User | null;
  users: User[];
  patients: Patient[];
  wounds: WoundRecord[];
  clinicalNotes: ClinicalNote[];
  handoverNotes: HandoverNote[];
  isBioCoreAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  addWound: (wound: WoundRecord) => void;
  updateWound: (wound: WoundRecord) => void;
  addClinicalNote: (note: ClinicalNote) => void;
  addHandoverNote: (note: HandoverNote) => void;
  addUser: (user: User) => void;
  updateUserInList: (user: User) => void;
  removeUser: (documento: string) => void;
  validateBioCoreAuth: (biometricData: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [wounds, setWounds] = useState<WoundRecord[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>([]);
  const [handoverNotes, setHandoverNotes] = useState<HandoverNote[]>([]);
  const [isBioCoreAuthenticated, setIsBioCoreAuthenticated] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>(initialCollaborators);

  // Initialize patients
  useEffect(() => {
    const initialPatients = getInitialPatients();
    setPatients(initialPatients);
  }, []);

  // Check for active session in localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('phoenix_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Polaris Session Detection Simulation
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || localStorage.getItem('polaris_token');

    if (token && !user) {
      console.log("Polaris Session Detected. Granting access to Phoenix Core.");
      const johanUser = users.find(u => u.documento === '79965441') || users[0];
      setUser(johanUser);
      localStorage.setItem('polaris_token', token);
    }
  }, [users, user]);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('phoenix_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('phoenix_user');
    }
  }, [user]);

  // Local storage and API persistence for patients
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
        console.log("Backend not reached, using local storage/initial data");
      }

      const savedPatients = localStorage.getItem('phoenix_patients');
      if (savedPatients) {
        setPatients(JSON.parse(savedPatients));
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    if (patients.length > 0) {
      localStorage.setItem('phoenix_patients', JSON.stringify(patients));
    }
  }, [patients]);

  const addPatient = (patient: Patient) => {
    setPatients(prev => [...prev, patient]);
  };

  const updatePatient = (updatedPatient: Patient) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  };

  const addWound = (wound: WoundRecord) => {
    setWounds(prev => [...prev, wound]);
  };

  const updateWound = (updatedWound: WoundRecord) => {
    setWounds(prev => prev.map(w => w.id === updatedWound.id ? updatedWound : w));
  };

  const addClinicalNote = (note: ClinicalNote) => {
    setClinicalNotes(prev => [...prev, note]);
  };

  const addHandoverNote = (note: HandoverNote) => {
    setHandoverNotes(prev => [...prev, note]);
  };

  const addUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const updateUserInList = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.documento === updatedUser.documento ? updatedUser : u));
  };

  const removeUser = (documento: string) => {
    setUsers(prev => prev.filter(u => u.documento !== documento));
  };

  const validateBioCoreAuth = async (biometricData: string) => {
    console.log("[BioCore] Validating biometric signature:", biometricData.substring(0, 10) + "...");
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const isValid = biometricData !== 'error';
    setIsBioCoreAuthenticated(isValid);
    setLoading(false);
    return isValid;
  };

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setIsBioCoreAuthenticated(false);
    localStorage.removeItem('polaris_token');
    console.log("Logging out...");
  };

  const setThemeValue = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };

  const state: AppState = {
    user,
    loading,
    theme,
    patients,
    wounds,
    clinicalNotes,
    handoverNotes,
    users,
    isBioCoreAuthenticated
  };

  return (
    <AppContext.Provider value={{
      state,
      user,
      users,
      patients,
      wounds,
      clinicalNotes,
      handoverNotes,
      isBioCoreAuthenticated,
      setUser,
      login,
      logout,
      setTheme: setThemeValue,
      addPatient,
      updatePatient,
      addWound,
      updateWound,
      addClinicalNote,
      addHandoverNote,
      addUser,
      updateUserInList,
      removeUser,
      validateBioCoreAuth
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
