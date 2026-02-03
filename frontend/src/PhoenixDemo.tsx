import React, { useState } from 'react';
import '../../../shared/ui-components/Button';
import '../../../shared/ui-components/ProfileCard';
import '../../../shared/ui-components/AppointmentForm';

// Note: In production, these would be properly imported as React components
// For now, we'll create inline versions using the same styling

const PhoenixDemo: React.FC = () => {
    const [showAppointment, setShowAppointment] = useState(false);

    const handleAppointmentSubmit = (data: any) => {
        console.log('Appointment scheduled:', data);
        alert(`Cita confirmada para ${data.date} a las ${data.time}`);
        setShowAppointment(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#F5F5F5',
            fontFamily: "'Inter', system-ui, sans-serif",
            padding: '2rem'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <header style={{ marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: '#1A237E',
                        marginBottom: '0.5rem'
                    }}>
                        🔥 Phoenix Core
                    </h1>
                    <p style={{ color: '#757575', fontSize: '1.125rem' }}>
                        Wound Clinic Program - Stitch Design Integration
                    </p>
                </header>

                {/* Main Content Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    {/* Profile Card */}
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E0E0E0',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1A237E' }}>
                                Mi Perfil
                            </h2>
                            <button style={{
                                color: '#FF6B35',
                                fontSize: '0.875rem',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}>
                                Editar
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '96px',
                                height: '96px',
                                borderRadius: '50%',
                                backgroundColor: '#FF6B35',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                marginBottom: '1rem',
                                border: '4px solid #E0E0E0'
                            }}>
                                J
                            </div>

                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1A237E', marginBottom: '0.5rem' }}>
                                Juan Pérez
                            </h3>

                            <span style={{
                                backgroundColor: '#F5F5F5',
                                color: '#757575',
                                padding: '0.25rem 1rem',
                                borderRadius: '9999px',
                                fontSize: '0.875rem',
                                fontFamily: 'monospace'
                            }}>
                                PHO-1234
                            </span>
                        </div>

                        <div style={{ borderTop: '1px solid #E0E0E0', paddingTop: '1rem' }}>
                            {[
                                { label: 'Fecha de Nacimiento', value: '15/03/1985' },
                                { label: 'Género', value: 'Masculino' },
                                { label: 'Tipo de Sangre', value: 'O+' }
                            ].map((item, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 0',
                                    borderBottom: idx < 2 ? '1px solid #E0E0E0' : 'none'
                                }}>
                                    <span style={{ color: '#757575', fontSize: '0.875rem' }}>{item.label}</span>
                                    <span style={{ color: '#1A237E', fontWeight: '500' }}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions Card */}
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E0E0E0',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1A237E', marginBottom: '1.5rem' }}>
                            Acciones Rápidas
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button
                                onClick={() => setShowAppointment(!showAppointment)}
                                style={{
                                    width: '100%',
                                    padding: '1rem 2rem',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    borderRadius: '0.75rem',
                                    backgroundColor: '#FF6B35',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E55A2B'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF6B35'}
                            >
                                📅 Agendar Cita
                            </button>

                            <button style={{
                                width: '100%',
                                padding: '1rem 2rem',
                                fontSize: '1rem',
                                fontWeight: '600',
                                borderRadius: '0.75rem',
                                backgroundColor: 'white',
                                color: '#1A237E',
                                border: '2px solid #FF6B35',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}>
                                📋 Ver Historial
                            </button>

                            <button style={{
                                width: '100%',
                                padding: '1rem 2rem',
                                fontSize: '1rem',
                                fontWeight: '600',
                                borderRadius: '0.75rem',
                                backgroundColor: 'white',
                                color: '#1A237E',
                                border: '2px solid #E0E0E0',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}>
                                💊 Recetas
                            </button>
                        </div>
                    </div>
                </div>

                {/* Appointment Form Modal */}
                {showAppointment && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '1rem'
                    }}>
                        <div style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '1rem',
                            padding: '2rem',
                            maxWidth: '500px',
                            width: '100%',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                            position: 'relative'
                        }}>
                            <button
                                onClick={() => setShowAppointment(false)}
                                style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    color: '#757575'
                                }}
                            >
                                ×
                            </button>

                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1A237E', marginBottom: '1.5rem' }}>
                                Agendar Cita
                            </h2>

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                handleAppointmentSubmit({
                                    date: formData.get('date'),
                                    time: formData.get('time'),
                                    type: formData.get('type'),
                                    notes: formData.get('notes')
                                });
                            }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', color: '#757575', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '500' }}>
                                        Fecha
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '0.75rem',
                                            border: '1px solid #E0E0E0',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', color: '#757575', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '500' }}>
                                        Hora
                                    </label>
                                    <input
                                        type="time"
                                        name="time"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '0.75rem',
                                            border: '1px solid #E0E0E0',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', color: '#757575', fontSize: '0.875rem', marginBottom: '0.75rem', fontWeight: '500' }}>
                                        Tipo de Cita
                                    </label>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                            <input type="radio" name="type" value="presencial" defaultChecked style={{ marginRight: '0.5rem' }} />
                                            <span style={{ color: '#1A237E' }}>Presencial</span>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                            <input type="radio" name="type" value="virtual" style={{ marginRight: '0.5rem' }} />
                                            <span style={{ color: '#1A237E' }}>Virtual</span>
                                        </label>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', color: '#757575', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '500' }}>
                                        Notas (Opcional)
                                    </label>
                                    <textarea
                                        name="notes"
                                        rows={3}
                                        placeholder="Motivo de la consulta..."
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '0.75rem',
                                            border: '1px solid #E0E0E0',
                                            fontSize: '1rem',
                                            resize: 'none'
                                        }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    style={{
                                        width: '100%',
                                        padding: '1rem 2rem',
                                        fontSize: '1.125rem',
                                        fontWeight: '600',
                                        borderRadius: '0.75rem',
                                        backgroundColor: '#FF6B35',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    Confirmar Cita
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <footer style={{
                    textAlign: 'center',
                    marginTop: '3rem',
                    padding: '2rem',
                    borderTop: '1px solid #E0E0E0'
                }}>
                    <p style={{ color: '#757575', fontSize: '0.875rem' }}>
                        Phoenix Core - Powered by DANIEL AI Ecosystem
                    </p>
                    <p style={{ color: '#FF6B35', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                        Design System by Stitch
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default PhoenixDemo;
