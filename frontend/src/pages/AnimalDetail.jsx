import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DonationModal from '../components/DonationModal';

export default function AnimalDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [animal, setAnimal] = useState(null);
    const [msg, setMsg] = useState('');
    const [mainIdx, setMainIdx] = useState(0);
    const [zoomImg, setZoomImg] = useState(null);
    const [isDonationOpen, setIsDonationOpen] = useState(false);

    useEffect(() => {
        api.get(`/animals/${id}`).then(r => setAnimal(r.data));
    }, [id]);

    const send = async (endpoint, payload) => {
        if (!user) { setMsg('Faça login para continuar.'); return; }
        try {
            await api.post(`/requests/${endpoint}`, { animalId: animal.id, ...payload });
            setMsg('Solicitação enviada com sucesso!');
        } catch (e) { setMsg(e.response?.data?.error || 'Erro ao enviar.'); }
    };

    const handleDonation = async (amount) => {
        await send('donation', { amount });
    };

    if (!animal) return <p className="container" style={{ paddingTop: '3rem' }}>Carregando…</p>;
    const images = animal.images || [];
    const isOng = user && user.role === 'ONG';

    return (
        <section className="container detail" style={{ paddingTop: '2rem' }}>
            <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 10 }}>
                <button onClick={() => navigate(-1)} className="btn-back">← Voltar</button>
            </div>

            <div className="gallery" style={{ marginTop: '2rem' }}>
                {images[mainIdx] ? (
                    <img className="gallery-main" src={images[mainIdx].url} alt={animal.name} style={{ cursor: 'zoom-in' }} onClick={() => setZoomImg(images[mainIdx].url)} />
                ) : <div className="placeholder large">Sem foto</div>}

                {images.length > 1 && (
                    <div className="thumbs">
                        {images.map((img, i) => (
                            <img key={img.id} src={img.url} alt="" className={i === mainIdx ? 'active' : ''} onClick={() => setMainIdx(i)} />
                        ))}
                    </div>
                )}
            </div>

            {zoomImg && (
                <div className="image-modal" onClick={() => setZoomImg(null)}>
                    <span className="close-modal">×</span>
                    <img src={zoomImg} alt="Zoom" />
                </div>
            )}

            <div className="info">
                <h1>{animal.name}</h1>
                <p className="muted">{animal.species} • {animal.breed || 'SRD'} • {animal.gender === 'M' ? 'Macho' : animal.gender === 'F' ? 'Fêmea' : '—'} {animal.ageMonths && `• ${animal.ageMonths} meses`}</p>
                <p>{animal.description}</p>
                <p><strong>ONG:</strong> {animal.ong?.name} — {animal.ong?.city}/{animal.ong?.state}</p>

                <div className="actions">
                    {isOng ? (
                        <Link to={`/painel/editar/${animal.id}`} className="btn-primary" style={{ textAlign: 'center' }}>Editar Animal</Link>
                    ) : (
                        <>
                            {animal.isForAdoption && (
                                <button className="btn-primary" onClick={() => send('adoption', { message: 'Tenho interesse em adotar' })}>Quero adotar</button>
                            )}
                            {animal.needsTempHome && (
                                <button className="btn-secondary" onClick={() => send('temphome', { message: 'Posso oferecer lar temporário' })}>Lar temporário</button>
                            )}
                            {animal.needsMoney && (
                                <button className="btn-secondary" onClick={() => setIsDonationOpen(true)}>Doar Dinheiro</button>
                            )}
                        </>
                    )}
                </div>
                {msg && <p className="msg">{msg}</p>}
            </div>

            <DonationModal
                isOpen={isDonationOpen}
                onClose={() => setIsDonationOpen(false)}
                animalName={animal.name}
                ong={animal.ong}
                onConfirm={handleDonation}
            />
        </section>
    );
}