import { AuthProvider } from './features/auth/AuthContext';
import { LoginForm } from './features/auth/LoginForm';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <LoginForm />
      </div>
    </AuthProvider>

  );
}

export default App;