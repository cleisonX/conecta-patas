import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditAnimal() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({});
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/animals/${id}`).then(r => {
            const a = r.data;
            setForm({
                name: a.name, species: a.species, breed: a.breed || '', ageMonths: a.ageMonths || '',
                gender: a.gender || '', size: a.size || '', description: a.description || '',
                isForAdoption: a.isForAdoption, needsTempHome: a.needsTempHome, needsMoney: a.needsMoney
            });
            setLoading(false);
        });
    }, [id]);

    const submit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (files.length > 0) files.forEach(f => fd.append('images', f));

        try {
            await api.put(`/animals/${id}`, fd);
            alert('Animal atualizado com sucesso!');
            navigate('/painel/animais');
        } catch (err) {
            alert('Erro ao editar animal. Tente novamente.');
        }
    };

    if (loading) return <p className="container" style={{ paddingTop: '3rem' }}>Carregando...</p>;

    return (
        <section className="container narrow" style={{ paddingTop: '2rem' }}>
            <button onClick={() => navigate(-1)} className="btn-back">← Voltar</button>
            <h1>Editar Animal</h1>

            <form className="form-card" onSubmit={submit} style={{ marginTop: '1.5rem' }}>
                <label>Nome do Animal</label>
                <input value={form.name} required onChange={e => setForm({ ...form, name: e.target.value })} />

                <label>Espécie</label>
                <select value={form.species} required onChange={e => setForm({ ...form, species: e.target.value })}>
                    <option value="Cachorro">Cachorro</option>
                    <option value="Gato">Gato</option>
                </select>

                <label>Raça</label>
                <input value={form.breed} onChange={e => setForm({ ...form, breed: e.target.value })} />

                <label>Idade (em meses)</label>
                <input type="number" value={form.ageMonths} onChange={e => setForm({ ...form, ageMonths: e.target.value })} />

                <div className="row-2">
                    <div>
                        <label>Sexo</label>
                        <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                            <option value="">—</option><option value="M">Macho</option><option value="F">Fêmea</option>
                        </select>
                    </div>
                    <div>
                        <label>Porte</label>
                        <select value={form.size} onChange={e => setForm({ ...form, size: e.target.value })}>
                            <option value="">—</option><option value="P">Pequeno</option><option value="M">Médio</option><option value="G">Grande</option>
                        </select>
                    </div>
                </div>

                <label>Descrição</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

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

                <label>Alterar Fotos (Deixe em branco para manter as atuais)</label>
                <input type="file" multiple accept="image/*" onChange={e => setFiles([...e.target.files])} />

                <button className="btn-primary" style={{ marginTop: '1rem' }}>Salvar Alterações</button>
            </form>
        </section>
    );
}