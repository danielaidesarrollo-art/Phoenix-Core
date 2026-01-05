// 1. Importa el proveedor que acabas de crear
import { AppProvider } from './context/AppContext';
import Dashboard from './components/Dashboard';

function App() {
    return (
        // 2. Envuelve todo el contenido con el AppProvider
        <AppProvider>
            <div className="App">
                {/* Aquí va tu Dashboard y el resto de componentes */}
                <Dashboard />
            </div>
        </AppProvider>
    );
}

export default App;
