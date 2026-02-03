
import { AIPurifier } from './safeCore.ts';

const API_BASE_URL = 'http://localhost:8080/api';

export const PhoenixAPI = {
    saveRecord: async (patientId: string, woundStatus: string) => {
        const purifiedId = AIPurifier.purify(patientId);
        const purifiedStatus = AIPurifier.purify(woundStatus);

        const response = await fetch(`${API_BASE_URL}/records`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                patient_id: purifiedId,
                wound_status: purifiedStatus
            }),
        });

        if (!response.ok) {
            throw new Error('Error saving clinical record');
        }

        return response.json();
    },

    getRecord: async (patientId: string) => {
        const response = await fetch(`${API_BASE_URL}/records/${patientId}`);
        if (!response.ok) {
            throw new Error('Record not found');
        }
        return response.json();
    },

    diagnoseTissue: async (tissueType: string, options: { patientId?: string, woundLocation?: string, resvech_params?: any, professional_observation?: string } = {}) => {
        const { patientId = 'P-DEMO', woundLocation = 'Primary', resvech_params, professional_observation } = options;
        const response = await fetch(`${API_BASE_URL}/diagnose`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tissue_type: tissueType,
                patient_id: patientId,
                wound_location: woundLocation,
                resvech_params: resvech_params,
                professional_observation: professional_observation
            }),
        });

        if (!response.ok) {
            throw new Error('Error running AI diagnostic');
        }

        return response.json();
    },

    archiveImage: async (patientId: string, woundLocation: string, imageB64: string, professional_observation?: string) => {
        const response = await fetch(`${API_BASE_URL}/archive-image`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                patient_id: patientId,
                wound_location: woundLocation,
                image_b64: imageB64,
                professional_observation: professional_observation
            }),
        });

        if (!response.ok) {
            throw new Error('Archiving failed');
        }

        return response.json();
    },

    compareHealing: async (patientId: string, woundLocation: string, currentImageB64: string) => {
        const response = await fetch(`${API_BASE_URL}/compare-healing`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                patient_id: patientId,
                wound_location: woundLocation,
                image_b64: currentImageB64
            }),
        });

        if (!response.ok) {
            throw new Error('Comparison failed');
        }

        return response.json();
    },

    analyzeMultimodal: async (mediaB64: string, prompt: string = 'Analyze this wound image.') => {
        const response = await fetch(`${API_BASE_URL}/multimodal-analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                media_b64: mediaB64,
                prompt: prompt
            }),
        });

        if (!response.ok) {
            throw new Error('Multimodal analysis failed');
        }

        return response.json();
    }
};
