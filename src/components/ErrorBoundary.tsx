import { Component, type ReactNode, type ErrorInfo } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean; error?: Error };

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('ErrorBoundary caught:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">Algo salió mal</h1>
                        <p className="text-slate-600 mb-4">
                            Hubo un error inesperado. Recarga la página para continuar.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Recargar
                        </button>
                        {this.state.error && (
                            <pre className="mt-4 text-xs text-left text-red-600 bg-red-50 p-2 rounded overflow-auto max-h-32">
                                {this.state.error.message}
                            </pre>
                        )}
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}