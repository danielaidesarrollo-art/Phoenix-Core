
import { AIPurifier } from './safeCore.ts';

const API_BASE_URL = 'http://localhost:8000/api';

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
    }
};
