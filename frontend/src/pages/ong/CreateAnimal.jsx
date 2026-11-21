import { useState } from 'react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function CreateAnimal() {
    const [form, setForm] = useState({ isForAdoption: true }); // Já vem marcado por padrão
    const [files, setFiles] = useState([]);
    const [ok, setOk] = useState(false);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        files.forEach(f => fd.append('images', f));
        await api.post('/animals', fd);
        setOk(true);
    };

    if (ok) return (
        <section className="container narrow" style={{ paddingTop: '3rem' }}>
            <div className="success-card">
                <h2>✅ Animal cadastrado!</h2>
                <button onClick={() => navigate('/painel')} className="btn-primary" style={{ marginTop: '1rem' }}>Voltar ao Painel</button>
            </div>
        </section>
    );

    return (
        <section className="container narrow" style={{ paddingTop: '2rem' }}>
            <button onClick={() => navigate(-1)} className="btn-back">← Voltar</button>
            <h1>Cadastrar Novo Animal</h1>

            <form className="form-card" onSubmit={submit} style={{ marginTop: '1.5rem' }}>
                <label>Nome do Animal</label>
                <input required onChange={e => setForm({ ...form, name: e.target.value })} />

                <label>Espécie</label>
                <select required onChange={e => setForm({ ...form, species: e.target.value })}>
                    <option value="">Selecione...</option>
                    <option value="Cachorro">Cachorro</option>
                    <option value="Gato">Gato</option>
                </select>

                <label>Raça</label>
                <input placeholder="Ex: SRD, Poodle, Persa..." onChange={e => setForm({ ...form, breed: e.target.value })} />

                <label>Idade (em meses)</label>
                <input type="number" onChange={e => setForm({ ...form, ageMonths: e.target.value })} />

                <div className="row-2">
                    <div>
                        <label>Sexo</label>
                        <select onChange={e => setForm({ ...form, gender: e.target.value })}>
                            <option value="">—</option>
                            <option value="M">Macho</option>
                            <option value="F">Fêmea</option>
                        </select>
                    </div>
                    <div>
                        <label>Porte</label>
                        <select onChange={e => setForm({ ...form, size: e.target.value })}>
                            <option value="">—</option>
                            <option value="P">Pequeno</option>
                            <option value="M">Médio</option>
                            <option value="G">Grande</option>
                        </select>
                    </div>
                </div>

                <label>Descrição / História do animal</label>
                <textarea onChange={e => setForm({ ...form, description: e.target.value })} />

                <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '12px', width: '100%' }}>
                    <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Disponibilidade do Animal:</p>

                    <label className="check">
                        <input type="checkbox" checked={form.isForAdoption} onChange={e => setForm({ ...form, isForAdoption: e.target.checked })} />
                        Para adoção
                    </label>
                    <label className="check">
                        <input type="checkbox" checked={form.needsTempHome} onChange={e => setForm({ ...form, needsTempHome: e.target.checked })} />
                        Precisa de lar temporário
                    </label>
                    <label className="check">
                        <input type="checkbox" checked={form.needsMoney} onChange={e => setForm({ ...form, needsMoney: e.target.checked })} />
                        Aceita ajuda em dinheiro (PIX)
                    </label>
                </div>

                <label>Fotos do Animal (Selecione até 6 fotos)</label>
                <input type="file" multiple accept="image/*" onChange={e => setFiles([...e.target.files])} />

                <button className="btn-primary" style={{ marginTop: '1rem' }}>Salvar e Publicar</button>
            </form>
        </section>
    );
}