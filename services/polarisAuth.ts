// POLARIS Authentication Service
const POLARIS_MEDICAL_URL = import.meta.env.VITE_POLARIS_MEDICAL_URL || 'https://polaris-medical-986491035018.us-central1.run.app';
const POLARIS_FINANCIAL_URL = import.meta.env.VITE_POLARIS_FINANCIAL_URL || 'https://polaris-financial-986491035018.us-central1.run.app';

export interface AuthCredentials {
    documento: string;
    password: string;
}

export interface BiometricData {
    type: 'facial' | 'fingerprint';
    data: string; // Base64 encoded or descriptor
}

export interface RegisterData extends AuthCredentials {
    nombre: string;
    correo: string;
    institucion: string;
    cargo: string;
    biometric?: BiometricData;
}

export interface AuthResponse {
    success: boolean;
    token?: string;
    user?: {
        documento: string;
        nombre: string;
        correo: string;
        cargo: string;
    };
    error?: string;
}

class PolarisAuthService {
    private baseUrl: string;

    constructor(type: 'medical' | 'financial' = 'medical') {
        this.baseUrl = type === 'medical' ? POLARIS_MEDICAL_URL : POLARIS_FINANCIAL_URL;
    }

    async login(credentials: AuthCredentials): Promise<AuthResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: 'Error al conectar con POLARIS. Verifique su conexión.',
            };
        }
    }

    async register(data: RegisterData): Promise<AuthResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: 'Error al registrar usuario. Intente nuevamente.',
            };
        }
    }

    async verifyBiometric(documento: string, biometric: BiometricData): Promise<AuthResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/auth/verify-biometric`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ documento, biometric }),
            });

            if (!response.ok) {
                throw new Error('Biometric verification failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Biometric verification error:', error);
            return {
                success: false,
                error: 'Error al verificar biometría.',
            };
        }
    }

    async recoverPassword(documento: string): Promise<{ success: boolean; message?: string; error?: string }> {
        try {
            const response = await fetch(`${this.baseUrl}/auth/recover-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ documento }),
            });

            if (!response.ok) {
                throw new Error('Password recovery failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Password recovery error:', error);
            return {
                success: false,
                error: 'Error al iniciar recuperación de contraseña.',
            };
        }
    }

    async resetPassword(documento: string, code: string, newPassword: string): Promise<AuthResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ documento, code, newPassword }),
            });

            if (!response.ok) {
                throw new Error('Password reset failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Password reset error:', error);
            return {
                success: false,
                error: 'Error al restablecer contraseña.',
            };
        }
    }

    async verifyToken(token: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/auth/verify-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            return response.ok;
        } catch (error) {
            console.error('Token verification error:', error);
            return false;
        }
    }
}

export const polarisAuthMedical = new PolarisAuthService('medical');
export const polarisAuthFinancial = new PolarisAuthService('financial');
export default polarisAuthMedical;
