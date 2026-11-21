import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // NOVO ESTADO
    const { login } = useAuth();
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await api.post('/auth/login', form);
            login(data.user, data.token);
            navigate(data.user.role === 'ONG' ? '/painel' : '/');
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao entrar');
        }
    };

    return (
        <div className="auth-wrap">
            <form className="form-card" onSubmit={submit}>
                <h1>Entrar</h1>
                <input placeholder="E-mail" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />

                <div className="password-wrapper">
                    <input
                        placeholder="Senha"
                        type={showPassword ? "text" : "password"}
                        required
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                    />
                    <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? '🙈' : '👁️'}
                    </button>
                </div>

                {error && <p className="error">{error}</p>}
                <button type="submit" className="btn-primary">Entrar</button>
                <p className="muted center">Não tem conta? <Link to="/register">Cadastre-se</Link></p>
            </form>
        </div>
    );
}