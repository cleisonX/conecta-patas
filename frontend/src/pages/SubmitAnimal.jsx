import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function SubmitAnimal() {
    const [ongs, setOngs] = useState([]);
    const [form, setForm] = useState({});
    const [files, setFiles] = useState([]);
    const [ok, setOk] = useState(false);

    useEffect(() => { api.get('/ongs').then(r => setOngs(r.data)); }, []);

    const submit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        files.forEach(f => fd.append('images', f));
        await api.post('/animals/submit', fd);
        setOk(true);
    };

    if (ok) return <section className="container narrow"><div className="success-card"><h2>✅ Enviado!</h2><p>A ONG vai avaliar.</p></div></section>;

    return (
        <section className="container narrow">
            <h1>Enviar meu animal</h1>
            <form className="form-card" onSubmit={submit}>
                <select required onChange={e => setForm({ ...form, ongId: e.target.value })}>
                    <option value="">Escolha a ONG</option>
                    {ongs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
                <input required placeholder="Nome do animal" onChange={e => setForm({ ...form, name: e.target.value })} />
                <select required onChange={e => setForm({ ...form, species: e.target.value })}>
                    <option value="">Espécie</option><option value="Cachorro">Cachorro</option><option value="Gato">Gato</option>
                </select>
                <input placeholder="Raça" onChange={e => setForm({ ...form, breed: e.target.value })} />
                <textarea required placeholder="Por que está doando?" onChange={e => setForm({ ...form, submissionReason: e.target.value })} />
                <input type="file" multiple accept="image/*" onChange={e => setFiles([...e.target.files])} />
                <button className="btn-primary">Enviar</button>
            </form>
        </section>
    );
}