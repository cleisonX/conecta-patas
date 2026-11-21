import { useState } from 'react';

export default function DonationModal({ isOpen, onClose, animalName, ong, onConfirm }) {
    const [value, setValue] = useState('50');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1 = Escolher valor, 2 = Mostrar PIX

    if (!isOpen) return null;

    const handleDonate = async () => {
        const amount = Number(value);
        if (amount <= 0) {
            alert('Por favor, insira um valor válido.');
            return;
        }
        setLoading(true);
        await onConfirm(amount);
        setLoading(false);
        setStep(2); // Avança para a tela do PIX
    };

    const copyPix = () => {
        navigator.clipboard.writeText(ong.pixKey);
        alert('Chave PIX copiada com sucesso!');
    };

    const whatsappLink = ong.phone ? `https://wa.me/55${ong.phone.replace(/\D/g, '')}?text=Olá! Acabei de fazer uma doação de R$${value} para o animal ${animalName}. Segue o comprovante:` : '#';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-modal-btn" onClick={onClose}>×</button>

                {step === 1 ? (
                    <>
                        <h2>Ajudar {animalName}</h2>
                        <p className="muted" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                            Escolha um valor para doar. Em seguida, mostraremos a chave PIX da ONG.
                        </p>

                        <div className="donation-grid">
                            {[10, 20, 50, 100].map(v => (
                                <button
                                    key={v}
                                    className={`donation-btn ${Number(value) === v ? 'active' : ''}`}
                                    onClick={() => setValue(String(v))}
                                >
                                    R$ {v}
                                </button>
                            ))}
                        </div>

                        <div style={{ marginTop: '1.5rem', width: '100%' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#444' }}>Outro valor (R$)</label>
                            <input
                                type="number"
                                value={value}
                                onChange={e => setValue(e.target.value)}
                                min="1"
                                style={{ marginTop: '0.5rem' }}
                            />
                        </div>

                        <button
                            className="btn-primary"
                            style={{ width: '100%', marginTop: '2rem', padding: '1rem' }}
                            onClick={handleDonate}
                            disabled={loading}
                        >
                            {loading ? 'Registrando...' : `Continuar para Doação`}
                        </button>
                    </>
                ) : (
                    <>
                        <h2 style={{ color: 'var(--green)' }}>Doação Registrada!</h2>
                        <p className="muted" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                            Envie o valor de <strong>R$ {value}</strong> para a chave PIX abaixo da ONG <strong>{ong.name}</strong>.
                        </p>

                        <div className="pix-box">
                            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Chave PIX da ONG:</p>
                            <strong style={{ fontSize: '1.1rem', wordBreak: 'break-all' }}>{ong.pixKey || 'Chave PIX não cadastrada.'}</strong>
                            {ong.pixKey && (
                                <button className="btn-copy" onClick={copyPix}>Copiar Chave</button>
                            )}
                        </div>

                        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1.5rem', textAlign: 'center', lineHeight: 1.4 }}>
                            Após o pagamento, <strong>envie o comprovante</strong> para a ONG pelo WhatsApp.
                        </p>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', width: '100%' }}>
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-whatsapp"
                                style={{ flex: 1, padding: '0.8rem' }}
                            >
                                Enviar Comprovante
                            </a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}