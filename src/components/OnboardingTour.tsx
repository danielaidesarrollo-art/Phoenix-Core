
import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';

const OnboardingTour: React.FC = () => {
    const [step, setStep] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('phoenix_tour_seen');
        if (!hasSeenTour) {
            setIsOpen(true);
        }
    }, []);

    const steps = [
        {
            title: "¡Bienvenido a Phoenix Core 3ra Gen!",
            content: "Explora la nueva plataforma de gestión clínica multimodal. Ahora con integración de IA Med-Gemma y visualización 3D Astra.",
            icon: "🚀"
        },
        {
            title: "Gestión de Pacientes",
            content: "En el listado principal puedes ingresar nuevos pacientes, verificar su cobertura geográfica y gestionar sus planes de tratamiento.",
            icon: "👥"
        },
        {
            title: "Clínica de Heridas IA",
            content: "Utiliza nuestra herramienta de análisis de heridas para obtener diagnósticos automatizados y propuestas tecnológicas basadas en evidencia.",
            icon: "🏥"
        },
        {
            title: "Reportes Operacionales",
            content: "Si tienes permisos de Administrador, puedes descargar informes CSV detallados y monitorear la actividad del sistema en tiempo real.",
            icon: "📊"
        },
        {
            title: "Listo para Operar",
            content: "Tu sesión está protegida por SafeCore. Si el sistema detecta inactividad, se cerrará automáticamente por seguridad.",
            icon: "✅"
        }
    ];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            handleClose();
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('phoenix_tour_seen', 'true');
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Recorrido de Inicio">
            <div className="text-center space-y-4 py-4">
                <div className="text-6xl mb-4">{steps[step].icon}</div>
                <h4 className="text-xl font-bold text-slate-800">{steps[step].title}</h4>
                <p className="text-slate-600 leading-relaxed">
                    {steps[step].content}
                </p>
                <div className="flex justify-between items-center pt-6">
                    <div className="flex gap-1">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-blue-600 w-4' : 'bg-slate-200'}`}
                            />
                        ))}
                    </div>
                    <Button onClick={handleNext}>
                        {step === steps.length - 1 ? "Comenzar" : "Siguiente"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default OnboardingTour;
