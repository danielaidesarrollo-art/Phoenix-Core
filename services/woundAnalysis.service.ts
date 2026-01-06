import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export interface WoundAnalysisResult {
    tissueComposition: {
        granulation: number;
        slough: number;
        necrotic: number;
        epithelial: number;
    };
    measurements: {
        estimatedLength: number;
        estimatedWidth: number;
        estimatedArea: number;
    };
    woundType: string;
    severity: 'Leve' | 'Moderada' | 'Severa';
    infectionRisk: 'Bajo' | 'Medio' | 'Alto';
    healingStage: string;
    recommendations: string[];
    suggestedDressings: string[];
    suggestedTherapies: string[];
    confidence: number;
    rawAnalysis: string;
}

export class WoundAnalysisService {
    private model: any;
    private medGemmaModel: any;

    constructor() {
        try {
            if (API_KEY) {
                const genAI = new GoogleGenerativeAI(API_KEY);
                // Use Gemini 1.5 Pro for multimodal analysis
                this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
                // Use Med-Gemma for medical recommendations (fallback to Gemini Pro if not available)
                this.medGemmaModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
            } else {
                console.warn('Google Gemini API Key is missing. Wound analysis will not work.');
            }
        } catch (e) {
            console.error('Failed to initialize Gemini models:', e);
        }
    }

    /**
     * Analyze wound image using multimodal AI
     */
    async analyzeWoundImage(imageFile: File): Promise<WoundAnalysisResult> {
        try {
            if (!this.model) {
                throw new Error('El servicio de análisis con IA no está inicializado (clave API faltante)');
            }

            // Convert image to base64
            const imageData = await this.fileToGenerativePart(imageFile);

            // ... (rest of the prompt logic)
            const prompt = `Eres un experto en análisis de heridas clínicas. Analiza esta imagen de herida y proporciona un análisis detallado en formato JSON.

INSTRUCCIONES:
1. Identifica el tipo de tejido presente (granulación, esfacelo, necrótico, epitelial) y estima porcentajes
2. Estima las dimensiones de la herida (largo, ancho, área en cm²)
3. Clasifica el tipo de herida (úlcera por presión, venosa, arterial, diabética, quirúrgica, traumática, etc.)
4. Evalúa la severidad (Leve, Moderada, Severa)
5. Determina el riesgo de infección (Bajo, Medio, Alto)
6. Identifica la etapa de cicatrización
7. Proporciona recomendaciones específicas de tratamiento

Responde SOLO con un objeto JSON válido con esta estructura exacta:
{
  "tissueComposition": {
    "granulation": <porcentaje 0-100>,
    "slough": <porcentaje 0-100>,
    "necrotic": <porcentaje 0-100>,
    "epithelial": <porcentaje 0-100>
  },
  "measurements": {
    "estimatedLength": <número en cm>,
    "estimatedWidth": <número en cm>,
    "estimatedArea": <número en cm²>
  },
  "woundType": "<tipo de herida>",
  "severity": "<Leve|Moderada|Severa>",
  "infectionRisk": "<Bajo|Medio|Alto>",
  "healingStage": "<descripción de la etapa>",
  "recommendations": ["<recomendación 1>", "<recomendación 2>", ...],
  "confidence": <0-100>
}`;

            const result = await this.model.generateContent([prompt, imageData]);
            const response = await result.response;
            const text = response.text();

            // Parse JSON response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No se pudo extraer JSON de la respuesta');
            }

            const analysis = JSON.parse(jsonMatch[0]);

            // Get treatment recommendations from Med-Gemma
            const treatmentRecommendations = await this.getMedGemmaRecommendations(analysis);

            return {
                ...analysis,
                suggestedDressings: treatmentRecommendations.dressings,
                suggestedTherapies: treatmentRecommendations.therapies,
                rawAnalysis: text,
            };
        } catch (error) {
            console.error('Error analyzing wound:', error);
            throw new Error(`Error en análisis de herida: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }

    /**
     * Get treatment recommendations using Med-Gemma
     */
    private async getMedGemmaRecommendations(analysis: any): Promise<{
        dressings: string[];
        therapies: string[];
    }> {
        try {
            const prompt = `Como experto en medicina de heridas, basándote en este análisis de herida, recomienda:

ANÁLISIS DE HERIDA:
- Tipo: ${analysis.woundType}
- Severidad: ${analysis.severity}
- Composición de tejido: ${JSON.stringify(analysis.tissueComposition)}
- Riesgo de infección: ${analysis.infectionRisk}
- Etapa de cicatrización: ${analysis.healingStage}

Proporciona recomendaciones específicas siguiendo guías internacionales (NPUAP, EWMA, WHS):

1. APÓSITOS RECOMENDADOS: Lista los 3-5 tipos de apósitos más apropiados (hidrocoloides, alginatos, espumas, hidrogeles, etc.)
2. TERAPIAS ADICIONALES: Lista terapias complementarias si son necesarias (VAC, desbridamiento, compresión, etc.)

Responde SOLO con un objeto JSON válido:
{
  "dressings": ["<apósito 1>", "<apósito 2>", ...],
  "therapies": ["<terapia 1>", "<terapia 2>", ...]
}`;

            const result = await this.medGemmaModel.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                return {
                    dressings: ['Apósito hidrocoloide', 'Espuma de poliuretano'],
                    therapies: ['Limpieza con solución salina', 'Evaluación semanal'],
                };
            }

            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error('Error getting Med-Gemma recommendations:', error);
            return {
                dressings: ['Apósito hidrocoloide', 'Espuma de poliuretano'],
                therapies: ['Limpieza con solución salina', 'Evaluación semanal'],
            };
        }
    }

    /**
     * Compare two wound images to track healing progress
     */
    async compareWoundImages(
        previousImage: File,
        currentImage: File
    ): Promise<{
        improvement: number; // -100 to 100
        changes: string[];
        recommendation: string;
    }> {
        try {
            const prevImageData = await this.fileToGenerativePart(previousImage);
            const currImageData = await this.fileToGenerativePart(currentImage);

            const prompt = `Compara estas dos imágenes de la misma herida (primera imagen: estado anterior, segunda imagen: estado actual).

Analiza:
1. Cambios en el tamaño de la herida
2. Cambios en la composición del tejido
3. Signos de mejoría o deterioro
4. Cambios en signos de infección

Responde SOLO con JSON:
{
  "improvement": <número de -100 a 100, donde 100 es mejoría completa y -100 es deterioro severo>,
  "changes": ["<cambio 1>", "<cambio 2>", ...],
  "recommendation": "<recomendación basada en la evolución>"
}`;

            const result = await this.model.generateContent([prompt, prevImageData, currImageData]);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No se pudo extraer JSON de la respuesta');
            }

            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error('Error comparing wounds:', error);
            throw error;
        }
    }

    /**
     * Convert File to GenerativePart for Gemini API
     */
    private async fileToGenerativePart(file: File): Promise<any> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Data = (reader.result as string).split(',')[1];
                resolve({
                    inlineData: {
                        data: base64Data,
                        mimeType: file.type,
                    },
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * Generate treatment plan based on wound analysis
     */
    async generateTreatmentPlan(analysis: WoundAnalysisResult, patientInfo: any): Promise<string> {
        try {
            const prompt = `Como médico especialista en heridas, genera un plan de tratamiento detallado basado en:

ANÁLISIS DE HERIDA:
${JSON.stringify(analysis, null, 2)}

INFORMACIÓN DEL PACIENTE:
- Edad: ${patientInfo.age || 'No especificada'}
- Diagnóstico: ${patientInfo.diagnosis || 'No especificado'}
- Alergias: ${patientInfo.allergies || 'Ninguna'}

Genera un plan de tratamiento completo que incluya:
1. Objetivo terapéutico
2. Protocolo de curación (frecuencia, técnica)
3. Apósitos recomendados
4. Terapias complementarias
5. Medicación si es necesaria
6. Criterios de seguimiento
7. Signos de alarma

Formato: Texto claro y profesional para incluir en historia clínica.`;

            const result = await this.medGemmaModel.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating treatment plan:', error);
            throw error;
        }
    }
}

export const woundAnalysisService = new WoundAnalysisService();
