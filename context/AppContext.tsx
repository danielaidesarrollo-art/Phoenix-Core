import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Patient, User, ClinicalNote, WoundRecord } from '../types';

interface AppState {
  user: User | null;
  loading: boolean;
  theme: 'light' | 'dark';
  patients: Patient[];
  wounds: WoundRecord[];
  clinicalNotes: ClinicalNote[];
  users: User[];
  isBioCoreAuthenticated: boolean;
}

interface AppContextType {
  state: AppState;
  user: User | null;
  patients: Patient[];
  wounds: WoundRecord[];
  clinicalNotes: ClinicalNote[];
  users: User[];
  isBioCoreAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  addWound: (wound: WoundRecord) => void;
  updateWound: (wound: WoundRecord) => void;
  addClinicalNote: (note: ClinicalNote) => void;
  addUser: (user: User) => void;
  validateBioCoreAuth: (biometricData: string) => Promise<boolean>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [wounds, setWounds] = useState<WoundRecord[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>([]);
  const [isBioCoreAuthenticated, setIsBioCoreAuthenticated] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      nombre: 'Admin Daniel',
      correo: 'admin@phoenix.com',
      cargo: 'MÉDICO ESPECIALISTA EN HERIDAS',
      rol: 'ADMIN',
      password: 'admin'
    }
  ]);

  // Check for active session in localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('phoenix_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('phoenix_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('phoenix_user');
    }
  }, [user]);

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
  }, []);

  useEffect(() => {
    localStorage.setItem('phoenix_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    const savedWounds = localStorage.getItem('phoenix_wounds');
    if (savedWounds) {
      setWounds(JSON.parse(savedWounds));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('phoenix_wounds', JSON.stringify(wounds));
  }, [wounds]);

  useEffect(() => {
    const savedNotes = localStorage.getItem('phoenix_clinical_notes');
    if (savedNotes) {
      setClinicalNotes(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('phoenix_clinical_notes', JSON.stringify(clinicalNotes));
  }, [clinicalNotes]);

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

  const addUser = (newUser: User) => {
    setUsers(prev => [...prev, { ...newUser, id: Date.now().toString() }]);
  };

  const validateBioCoreAuth = async (biometricData: string) => {
    console.log("[BioCore] Validating biometric signature:", biometricData.substring(0, 10) + "...");
    // Mocking BioCore API call
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo: if data is NOT "error", we authenticate
    const isValid = biometricData !== 'error';
    setIsBioCoreAuthenticated(isValid);
    setLoading(false);
    return isValid;
  };

  const logout = () => {
    setUser(null);
    setIsBioCoreAuthenticated(false);
    console.log("Logging out...");
  };

  const state: AppState = {
    user,
    loading,
    theme,
    patients,
    wounds,
    clinicalNotes,
    users,
    isBioCoreAuthenticated
  };

  return (
    <AppContext.Provider value={{
      state,
      user,
      patients,
      wounds,
      clinicalNotes,
      setUser,
      setTheme,
      addPatient,
      updatePatient,
      addWound,
      updateWound,
      addClinicalNote,
      addUser,
      validateBioCoreAuth,
      isBioCoreAuthenticated,
      users,
      logout
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
