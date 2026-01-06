
import React from 'react';

interface ErrorFallbackProps {
    error?: Error | null;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Algo salió mal</h2>
                <p className="text-gray-600 text-center mb-6">
                    La aplicación ha encontrado un error inesperado. Por favor, intenta recargar la página.
                </p>

                {error && (
                    <div className="bg-gray-100 p-3 rounded-md overflow-auto max-h-48 text-xs font-mono text-red-800 mb-4 border border-gray-200">
                        <p className="font-bold mb-1">Detalles del error:</p>
                        {error.toString()}
                    </div>
                )}

                <button
                    onClick={() => window.location.reload()}
                    className="w-full w-full bg-brand-blue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    Recargar Aplicación
                </button>
            </div>
        </div>
    );
};

export default ErrorFallback;
