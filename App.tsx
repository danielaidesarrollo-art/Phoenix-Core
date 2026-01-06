// 1. Importa el proveedor que acabas de crear
import { AppProvider } from './context/AppContext.tsx';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorFallback from './components/ErrorFallback';

function App() {
    return (
        // 2. Envuelve todo el contenido con el AppProvider
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <AppProvider>
                <div className="App">
                    {/* Aquí va tu Dashboard y el resto de componentes */}
                    <Dashboard />
                </div>
            </AppProvider>
        </ErrorBoundary>
    );
}

export default App;
