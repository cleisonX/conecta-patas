import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AnimalCard({ animal }) {
    const [currentImg, setCurrentImg] = useState(0);
    const images = animal.images || [];

    const nextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImg((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <Link to={`/animal/${animal.id}`} className="card">
            <div className="card-img">
                {images.length > 0 ? (
                    <>
                        {/* O Cloudinary já envia a URL completa em images[currentImg].url */}
                        <img src={images[currentImg].url} alt={animal.name} loading="lazy" />

                        {images.length > 1 && (
                            <>
                                <button className="carousel-btn prev" onClick={prevImage}>‹</button>
                                <button className="carousel-btn next" onClick={nextImage}>›</button>
                                <div className="carousel-dots">
                                    {images.map((_, idx) => (
                                        <span key={idx} className={idx === currentImg ? 'active' : ''} />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="placeholder">Sem foto</div>
                )}
            </div>

            <div className="card-body">
                <h3>{animal.name}</h3>
                <p className="muted">{animal.species} • {animal.breed || 'SRD'} • {animal.gender === 'M' ? 'Macho' : animal.gender === 'F' ? 'Fêmea' : '—'}</p>
                <p className="ong">{animal.ong?.name} — {animal.ong?.city}</p>
                <div className="tags">
                    {animal.isForAdoption && <span className="tag">Adoção</span>}
                    {animal.needsTempHome && <span className="tag">Lar temporário</span>}
                    {animal.needsMoney && <span className="tag">Ajuda em R$</span>}
                </div>
            </div>
        </Link>
    );
}