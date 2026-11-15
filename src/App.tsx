import { AuthProvider } from './features/auth/AuthContext';
import { LoginForm } from './features/auth/LoginForm';
import { AppRouter } from './routes/AppRouter';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>

  );
}

export default App;