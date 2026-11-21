import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

export default function Ongs() {
    const [ongs, setOngs] = useState([]);
    const [busca, setBusca] = useState('');

    useEffect(() => {
        api.get('/ongs').then(r => setOngs(r.data));
    }, []);

    const ongsFiltradas = ongs.filter(o =>
        o.name.toLowerCase().includes(busca.toLowerCase()) ||
        o.city.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <section className="container" style={{ paddingTop: '3rem' }}>
            <div className="page-head">
                <h1>ONGs Parceiras</h1>
                <div className="search-bar">
                    <span>🔍</span>
                    <input placeholder="Buscar por nome ou cidade" value={busca} onChange={e => setBusca(e.target.value)} />
                </div>
            </div>

            <div className="grid">
                {ongsFiltradas.map(ong => (
                    <Link to={`/ong/${ong.id}`} key={ong.id} className="card" style={{ padding: '1.5rem', display: 'block' }}>
                        <h3>{ong.name}</h3>
                        <p className="muted">📍 {ong.city} - {ong.state}</p>
                        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text)' }}>{ong.description || 'Sem descrição.'}</p>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold', display: 'block', marginTop: '1rem' }}>Ver perfil completo →</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}