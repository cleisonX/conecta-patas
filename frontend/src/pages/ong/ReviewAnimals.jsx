import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function ReviewAnimals() {
    const [pending, setPending] = useState([]);
    const navigate = useNavigate();

    const load = () => api.get('/animals/pending').then(r => setPending(r.data));
    useEffect(() => { load(); }, []);

    const review = async (id, approve) => {
        const reason = approve ? null : prompt('Motivo da recusa:');
        await api.patch(`/animals/${id}/review`, { approve, rejectionReason: reason });
        load();
    };

    return (
        <section className="container" style={{ paddingTop: '3rem' }}>
            <button onClick={() => navigate('/painel')} className="btn-back">← Voltar ao Painel</button>
            <h1>Avaliar Envios</h1>

            {pending.length === 0 ? <p className="empty-state">Nenhum envio pendente.</p> : (
                <div className="list" style={{ marginTop: '2rem' }}>
                    {pending.map(a => (
                        <div key={a.id} className="request-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: '100%' }}>
                                {a.images?.[0] && <img src={a.images[0].url} alt="" style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />}
                                <div>
                                    <h3>{a.name}</h3>
                                    <p className="muted">{a.species}</p>
                                </div>
                            </div>
                            <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}><strong>Motivo:</strong> {a.submissionReason}</p>
                            <div className="actions-inline" style={{ marginTop: '1rem', width: '100%' }}>
                                <button className="btn-primary" onClick={() => review(a.id, true)} style={{ flex: 1 }}>Aprovar</button>
                                <button className="btn-delete-text" onClick={() => review(a.id, false)} style={{ flex: 1 }}>Recusar</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}