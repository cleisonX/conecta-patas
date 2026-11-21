import { useEffect, useState } from 'react';
import { api } from '../services/api';
import AnimalCard from '../components/AnimalCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('Todos');

  useEffect(() => {
    if (user) {
      setLoading(true);
      api.get('/animals')
        .then(r => setAnimals(r.data))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const animaisFiltrados = animals.filter(a => {
    const termo = busca.toLowerCase();
    const matchNome = a.name.toLowerCase().includes(termo);
    const matchOng = a.ong?.name?.toLowerCase().includes(termo) || false;
    const matchCidade = a.ong?.city?.toLowerCase().includes(termo) || false;
    const matchBusca = matchNome || matchOng || matchCidade;

    if (filtro === 'Para Adoção') return matchBusca && a.isForAdoption;
    if (filtro === 'Cachorros') return matchBusca && a.species === 'Cachorro';
    if (filtro === 'Gatos') return matchBusca && a.species === 'Gato';
    if (filtro === 'Lar temporário') return matchBusca && a.needsTempHome;
    if (filtro === 'Ajuda em R$') return matchBusca && a.needsMoney;
    return matchBusca;
  });

  return (
    <div className="home-wrapper">
      <section className="hero container">
        <div className="hero-content">
          <span className="badge">Adoção responsável com ONGs</span>
          <h1>Todo animal merece um <em>lar.</em></h1>
          <p>Conheça os animais das ONGs, ofereça um lar temporário ou ajude com um PIX.</p>

          <div className="hero-buttons">
            {user ? (
              <>
                <a href="#animais" className="btn-primary">Ver animais</a>
                {user.role === 'ONG' ? (
                  <Link to="/painel/novo" className="btn-secondary">Cadastrar Animal</Link>
                ) : (
                  <Link to="/enviar-animal" className="btn-secondary">Doar meu animal</Link>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="btn-primary">Entrar</Link>
                <Link to="/register" className="btn-secondary">Cadastre-se</Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-image">
          {/* AQUI ESTÁ A NOVA IMAGEM */}
          <img src="/hero.jpg" alt="Cachorro e gato deitados no tapete" />
        </div>
      </section>

      {user && (
        <section id="animais" className="container" style={{ marginTop: '4rem' }}>
          <div className="list-header">
            <h2>Esperando por você</h2>
            <div className="search-bar">
              <span>🔍</span>
              <input type="text" placeholder="Buscar nome, ONG ou cidade" value={busca} onChange={e => setBusca(e.target.value)} />
            </div>
          </div>

          <div className="filter-pills">
            {['Todos', 'Para Adoção', 'Cachorros', 'Gatos', 'Lar temporário', 'Ajuda em R$'].map(f => (
              <button key={f} className={filtro === f ? 'active' : ''} onClick={() => setFiltro(f)}>{f}</button>
            ))}
          </div>

          {loading ? <p>Carregando…</p> : animaisFiltrados.length === 0 ? (
            <div className="empty-state">Nenhum animal encontrado.</div>
          ) : (
            <div className="grid">
              {animaisFiltrados.map(a => <AnimalCard key={a.id} animal={a} />)}
            </div>
          )}
        </section>
      )}
    </div>
  );
}