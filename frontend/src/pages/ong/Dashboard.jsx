import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

export default function Dashboard() {
    const [counts, setCounts] = useState({ adoptions: 0, temp: 0, animals: 0 });

    useEffect(() => {
        Promise.all([
            api.get('/requests/adoption/pending'),
            api.get('/requests/temphome/pending'),
            api.get('/animals/pending')
        ]).then(([adoptions, temp, animals]) => {
            setCounts({
                adoptions: adoptions.data.length,
                temp: temp.data.length,
                animals: animals.data.length
            });
        });
    }, []);

    return (
        <section className="container" style={{ paddingTop: '2rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Painel de Controle</h1>
            <div className="dash-grid">
                <Link to="/painel/animais" className="dash-card">
                    <div className="dash-icon">🐾</div>
                    <div className="dash-title">Meus Animais</div>
                </Link>
                <Link to="/painel/novo" className="dash-card">
                    <div className="dash-icon">➕</div>
                    <div className="dash-title">Cadastrar Animal</div>
                </Link>
                <Link to="/painel/avaliacoes" className="dash-card">
                    {counts.animals > 0 && <span className="badge-alert">{counts.animals}</span>}
                    <div className="dash-icon">📝</div>
                    <div className="dash-title">Avaliar Envios</div>
                </Link>
                <Link to="/painel/solicitacoes" className="dash-card">
                    {(counts.adoptions > 0 || counts.temp > 0) && <span className="badge-alert">{counts.adoptions + counts.temp}</span>}
                    <div className="dash-icon">📬</div>
                    <div className="dash-title">Solicitações</div>
                </Link>
            </div>
        </section>
    );
}