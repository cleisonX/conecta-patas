import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function UserProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        api.get(`/users/${id}`).then(r => setUser(r.data));
    }, [id]);

    if (!user) return <p className="container" style={{ paddingTop: '3rem' }}>Carregando...</p>;

    const whatsappLink = user.phone ? `https://wa.me/55${user.phone.replace(/\D/g, '')}?text=Olá ${user.name}, falo em nome da ONG sobre a sua solicitação de adoção.` : '#';

    return (
        <section className="container narrow" style={{ paddingTop: '3rem' }}>
            <button onClick={() => navigate(-1)} className="btn-back">← Voltar</button>

            <div className="ong-header-card" style={{ textAlign: 'center' }}>
                {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1rem' }} />
                ) : (
                    <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#eee', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>👤</div>
                )}

                <h1>{user.name}</h1>
                <p className="muted">{user.city} - {user.state}</p>
                {user.address && <p style={{ fontSize: '0.9rem', color: '#666' }}>{user.address}</p>}

                <div style={{ marginTop: '2rem' }}>
                    {user.phone ? (
                        <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn-whatsapp">
                            Chamar no WhatsApp
                        </a>
                    ) : (
                        <p className="alert error">Este usuário não cadastrou um telefone.</p>
                    )}
                </div>
            </div>

            {user.description && (
                <div className="form-card" style={{ marginTop: '2rem' }}>
                    <h3>Sobre o adotante</h3>
                    <p style={{ marginTop: '1rem' }}>{user.description}</p>
                </div>
            )}
        </section>
    );
}