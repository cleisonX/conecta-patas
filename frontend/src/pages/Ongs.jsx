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
                    {/* Emoji da lupa removido */}
                    <input placeholder="Buscar por nome ou cidade" value={busca} onChange={e => setBusca(e.target.value)} />
                </div>
            </div>

            <div className="ong-grid">
                {ongsFiltradas.map(ong => (
                    <Link to={`/ong/${ong.id}`} key={ong.id} className="ong-card">
                        <h3>{ong.name}</h3>

                        {/* Emoji do pino removido */}
                        <p className="muted">{ong.city} - {ong.state}</p>

                        <p className="ong-desc-preview">
                            {ong.description || 'Esta ONG ainda não adicionou uma descrição.'}
                        </p>

                        <span className="ong-link">Ver perfil completo →</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}