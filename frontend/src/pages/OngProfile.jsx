import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import AnimalCard from '../components/AnimalCard';

export default function OngProfile() {
    const { id } = useParams();
    const [ong, setOng] = useState(null);

    useEffect(() => {
        api.get(`/ongs/${id}`).then(r => setOng(r.data));
    }, [id]);

    if (!ong) return <p className="container" style={{ paddingTop: '3rem' }}>Carregando...</p>;

    return (
        <section className="container" style={{ paddingTop: '3rem' }}>
            <Link to="/ongs" className="btn-back">← Voltar para ONGs</Link>

            <div className="ong-header-card">
                <h1>{ong.name}</h1>
                <p className="muted">📍 {ong.city} - {ong.state}</p>
                {ong.phone && <p>📞 Contato: {ong.phone}</p>}
                <p className="ong-desc">{ong.description || 'Esta ONG ainda não adicionou uma descrição.'}</p>
            </div>

            <h2 style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>Animais desta ONG</h2>
            {ong.animals && ong.animals.length > 0 ? (
                <div className="grid">
                    {ong.animals.map(a => <AnimalCard key={a.id} animal={{ ...a, ong }} />)}
                </div>
            ) : (
                <p className="muted">Nenhum animal cadastrado no momento.</p>
            )}
        </section>
    );
}