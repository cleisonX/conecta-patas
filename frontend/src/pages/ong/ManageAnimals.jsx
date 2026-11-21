import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ManageAnimals() {
    const { user } = useAuth();
    const [animals, setAnimals] = useState([]);

    const load = () => api.get('/animals', { params: { ongId: user.ongId } }).then(r => setAnimals(r.data));
    useEffect(() => { load(); }, []);

    const remove = async (id) => {
        if (confirm('Tem certeza que deseja excluir este animal?')) {
            try {
                await api.delete(`/animals/${id}`);
                load();
            } catch (e) {
                alert('Erro ao excluir: ' + (e.response?.data?.error || 'Tente novamente.'));
            }
        }
    };

    return (
        <section className="container" style={{ paddingTop: '3rem' }}>
            <button onClick={() => window.history.back()} className="btn-back">← Voltar</button>
            <h1>Meus Animais</h1>

            <div className="grid" style={{ marginTop: '2rem' }}>
                {animals.map(a => (
                    <div key={a.id} className="card">
                        <div className="card-img">
                            {a.images?.[0] ? (
                                <img src={a.images[0].url} alt={a.name} />
                            ) : (
                                <div className="placeholder">Sem foto</div>
                            )}
                        </div>
                        <div className="card-body">
                            <h3>{a.name}</h3>
                            <p className="muted" style={{ marginBottom: '1rem' }}>{a.species}</p>

                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                <Link to={`/painel/editar/${a.id}`} className="btn-primary" style={{ flex: 1, padding: '0.4rem 1rem', fontSize: '0.85rem', textAlign: 'center', textDecoration: 'none' }}>
                                    Editar
                                </Link>
                                <button className="btn-delete-text" onClick={() => remove(a.id)} style={{ flex: 1, padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}