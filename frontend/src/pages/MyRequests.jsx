import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function MyRequests() {
    const [reqs, setReqs] = useState([]);

    const load = () => api.get('/requests/adoption/mine').then(r => setReqs(r.data));
    useEffect(() => { load(); }, []);

    const remove = async (id) => {
        if (confirm('Deseja apagar esta solicitação?')) {
            await api.delete(`/requests/adoption/${id}`);
            load();
        }
    };

    const getStatusText = (status, ongName) => {
        if (status === 'PENDING') return 'Pendente';
        if (status === 'APPROVED') return `Aprovado por ${ongName}`;
        if (status === 'REJECTED') return 'Recusado';
        return status;
    };

    return (
        <section className="container" style={{ paddingTop: '3rem' }}>
            <h1 style={{ textAlign: 'center' }}>Minhas Solicitações</h1>

            <div className="list-container">
                {reqs.length === 0 && <p className="empty-state">Nenhuma solicitação encontrada.</p>}
                {reqs.map(r => (
                    <div key={r.id} className="request-card" style={{ alignItems: 'center', flexDirection: 'row', flexWrap: 'nowrap' }}>
                        {r.animal.images?.[0] && <img src={r.animal.images[0].url} alt="" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 style={{ fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.animal.name}</h3>
                            <p className="muted" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>ONG: {r.animal.ong?.name}</p>
                            <p className={`status ${r.status.toLowerCase()}`} style={{ fontSize: '0.75rem', padding: '2px 8px', display: 'inline-block', marginTop: '4px' }}>{getStatusText(r.status, r.animal.ong?.name)}</p>
                        </div>
                        <button className="btn-delete-text" onClick={() => remove(r.id)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Apagar</button>
                    </div>
                ))}
            </div>
        </section>
    );
}