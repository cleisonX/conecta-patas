import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function OngRequests() {
    const [tab, setTab] = useState('adoption');
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const load = () => api.get(`/requests/${tab}/pending`).then(r => setData(r.data));
    useEffect(() => { load(); }, [tab]);

    const reviewAdoption = async (id, approve) => {
        await api.patch(`/requests/adoption/${id}/review`, { approve });
        load();
    };

    const markRead = async (id) => {
        const endpoint = tab === 'donation' ? 'donation' : 'temphome';
        await api.patch(`/requests/${endpoint}/${id}/review`);
        load();
    };

    const deleteRequest = async (id) => {
        if (confirm('Tem certeza que deseja apagar esta solicitação do histórico?')) {
            const endpoint = tab === 'donation' ? 'donation' : tab === 'adoption' ? 'adoption' : 'temphome';
            await api.delete(`/requests/${endpoint}/${id}`);
            load();
        }
    };

    // Função para traduzir e colorir o status
    const renderStatus = (status) => {
        if (status === 'PENDING') return null; // Se for pendente, os botões de ação vão aparecer
        if (status === 'REVIEWED') return <span className="status-badge reviewed">Lida</span>;
        if (status === 'APPROVED') return <span className="status-badge approved">Aprovada</span>;
        if (status === 'REJECTED') return <span className="status-badge rejected">Recusada</span>;
        return null;
    };

    return (
        <section className="container" style={{ paddingTop: '3rem' }}>
            <button onClick={() => navigate('/painel')} className="btn-back">← Voltar ao Painel</button>
            <h1>Solicitações</h1>

            <div className="toggle-row" style={{ marginTop: '1rem', maxWidth: '500px' }}>
                <button className={tab === 'adoption' ? 'active' : ''} onClick={() => setTab('adoption')}>Adoção</button>
                <button className={tab === 'temphome' ? 'active' : ''} onClick={() => setTab('temphome')}>Lar Temporário</button>
                <button className={tab === 'donation' ? 'active' : ''} onClick={() => setTab('donation')}>Doações</button>
            </div>

            <div className="list" style={{ marginTop: '2rem' }}>
                {data.length === 0 && <p className="empty-state">Nenhuma solicitação registrada.</p>}
                {data.map(r => (
                    <div key={r.id} className={`request-card ${r.status !== 'PENDING' ? 'card-read' : ''}`}>
                        <div className="request-animal">
                            {r.animal?.images?.[0] ? (
                                <img src={r.animal.images[0].url} alt={r.animal.name} />
                            ) : (
                                <div className="placeholder" style={{ width: 70, height: 70, borderRadius: 12 }}>Sem foto</div>
                            )}
                            <div className="animal-info-fixed">
                                <h3>{r.animal?.name}</h3>
                                <p className="muted">{r.animal?.species} • {r.animal?.breed}</p>
                            </div>
                        </div>

                        <div className="request-user">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h4>Dados do Solicitante</h4>
                                {renderStatus(r.status)}
                            </div>

                            <p><strong>Nome:</strong> {r.user?.name}</p>
                            {r.user?.city && <p><strong>Local:</strong> {r.user.city} - {r.user.state}</p>}
                            {r.message && <p className="msg-user">"{r.message}"</p>}
                            {r.type && <p><strong>Doação:</strong> R$ {r.amount}</p>}

                            <div className="actions-inline">
                                <Link to={`/usuario/${r.user.id}`} className="btn-primary btn-fixed" style={{ textDecoration: 'none' }}>Ver Perfil</Link>

                                {/* SE ESTIVER PENDENTE, MOSTRA OS BOTÕES DE AÇÃO */}
                                {r.status === 'PENDING' && (
                                    <>
                                        {tab === 'adoption' && (
                                            <>
                                                <button className="btn-primary btn-fixed" style={{ background: 'var(--green)' }} onClick={() => reviewAdoption(r.id, true)}>Aprovar</button>
                                                <button className="btn-delete-text btn-fixed" onClick={() => reviewAdoption(r.id, false)}>Recusar</button>
                                            </>
                                        )}

                                        {(tab === 'temphome' || tab === 'donation') && (
                                            <button className="btn-primary btn-fixed" onClick={() => markRead(r.id)}>Marcar como Lida</button>
                                        )}
                                    </>
                                )}

                                {/* O BOTÃO EXCLUIR FICA DISPONÍVEL SEMPRE PARA LIMPAR O HISTÓRICO */}
                                <button className="btn-delete-text" onClick={() => deleteRequest(r.id)}>
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