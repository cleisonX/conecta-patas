import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Register() {
    const [isOng, setIsOng] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [ong, setOng] = useState({ name: '', city: '', state: '', phone: '', cnpj: '', description: '', pixKey: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // NOVO ESTADO
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/register', { ...form, role: isOng ? 'ONG' : 'USER', ...(isOng && { ong }) });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao cadastrar');
        }
    };

    return (
        <div className="auth-wrap">
            <form className="form-card" onSubmit={submit}>
                <h1>Criar conta</h1>
                <div className="toggle-row">
                    <button type="button" className={!isOng ? 'active' : ''} onClick={() => setIsOng(false)}>Sou Pessoa</button>
                    <button type="button" className={isOng ? 'active' : ''} onClick={() => setIsOng(true)}>Sou ONG</button>
                </div>
                <input placeholder="Seu nome" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
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

                {isOng && (
                    <>
                        <input placeholder="Nome da ONG" required value={ong.name} onChange={e => setOng({ ...ong, name: e.target.value })} />
                        <div className="row-2">
                            <input placeholder="Cidade" required value={ong.city} onChange={e => setOng({ ...ong, city: e.target.value })} />
                            <input placeholder="UF" maxLength={2} required value={ong.state} onChange={e => setOng({ ...ong, state: e.target.value.toUpperCase() })} />
                        </div>
                        <input placeholder="Telefone (WhatsApp)" value={ong.phone} onChange={e => setOng({ ...ong, phone: e.target.value })} />
                        <input placeholder="Chave PIX (para doações)" value={ong.pixKey} onChange={e => setOng({ ...ong, pixKey: e.target.value })} />
                        <textarea placeholder="Descrição da ONG" value={ong.description} onChange={e => setOng({ ...ong, description: e.target.value })} />
                    </>
                )}
                {error && <p className="error">{error}</p>}
                <button className="btn-primary">Cadastrar</button>
                <p className="muted center">Já tem conta? <Link to="/login">Entrar</Link></p>
            </form>
        </div>
    );
}