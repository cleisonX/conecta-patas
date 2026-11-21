import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
    const { user, loading } = useAuth();

    // Se ainda estiver lendo o localStorage, mostra uma tela de carregamento
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', fontSize: '1.2rem', color: 'var(--text-light)' }}>
                <p>Carregando...</p>
            </div>
        );
    }

    // Se não tem usuário, vai pro login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Se o usuário não tiver o cargo certo (ex: USER tentando acessar /painel)
    if (role && user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
}