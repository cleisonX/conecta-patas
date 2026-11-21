import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Profile() {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({
        name: user.name,
        phone: user.phone || '',
        city: user.city || '',
        state: user.state || '',
        address: user.address || '',
        avatarUrl: user.avatarUrl || '',
        description: user.description || '',
        pixKey: user.pixKey || '' // <-- CAMPO PIX
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
    const [msg, setMsg] = useState({ type: '', text: '' });

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => fd.append(k, v));
            if (avatarFile) fd.append('avatar', avatarFile);

            const { data } = await api.put('/auth/profile', fd);
            updateUser(data);
            setMsg({ type: 'success', text: 'Dados atualizados com sucesso!' });
        } catch (err) {
            setMsg({ type: 'error', text: 'Erro ao atualizar dados.' });
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        try {
            await api.put('/auth/password', passwords);
            setMsg({ type: 'success', text: 'Senha atualizada com sucesso!' });
            setPasswords({ currentPassword: '', newPassword: '' });
        } catch (err) {
            setMsg({ type: 'error', text: err.response?.data?.error || 'Erro ao atualizar senha.' });
        }
    };

    const isOng = user.role === 'ONG';

    return (
        <section className="container narrow" style={{ paddingTop: '3rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Meu Perfil</h1>
            {msg.text && <div className={`alert ${msg.type}`}>{msg.text}</div>}

            <div className="form-card" style={{ marginBottom: '2rem' }}>
                <h2>Dados {isOng ? 'da ONG' : 'Pessoais'}</h2>
                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', width: '100%' }}>

                    {form.avatarUrl && <img src={form.avatarUrl} alt="Avatar" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />}

                    <label>Foto de Perfil (Opcional)</label>
                    <input type="file" accept="image/*" onChange={e => setAvatarFile(e.target.files[0])} />

                    <label>Nome {isOng ? 'da ONG' : 'Completo'}</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />

                    <label>Telefone (WhatsApp)</label>
                    <input placeholder="(00) 00000-0000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />

                    {/* CAMPO PIX EXCLUSIVO PARA ONG */}
                    {isOng && (
                        <>
                            <label>Chave PIX (para receber doações)</label>
                            <input placeholder="CPF, CNPJ, E-mail, Celular ou Chave Aleatória" value={form.pixKey} onChange={e => setForm({ ...form, pixKey: e.target.value })} />
                        </>
                    )}

                    <label>Endereço Completo</label>
                    <input placeholder="Rua, Número, Bairro" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />

                    <div className="row-2">
                        <div>
                            <label>Cidade</label>
                            <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                        </div>
                        <div>
                            <label>UF</label>
                            <input maxLength={2} value={form.state} onChange={e => setForm({ ...form, state: e.target.value.toUpperCase() })} />
                        </div>
                    </div>

                    <label>Sobre (Descrição)</label>
                    <textarea placeholder="Fale um pouco sobre a ONG..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

                    <button type="submit" className="btn-primary" style={{ width: 'fit-content', marginTop: '0.5rem' }}>Salvar Dados</button>
                </form>
            </div>

            <div className="form-card">
                <h2>Alterar Senha</h2>
                <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', width: '100%' }}>
                    <label>Senha Atual</label>
                    <input type="password" required value={passwords.currentPassword} onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })} />
                    <label>Nova Senha</label>
                    <input type="password" required value={passwords.newPassword} onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} />
                    <button type="submit" className="btn-primary" style={{ width: 'fit-content', marginTop: '0.5rem' }}>Alterar Senha</button>
                </form>
            </div>
        </section>
    );
}