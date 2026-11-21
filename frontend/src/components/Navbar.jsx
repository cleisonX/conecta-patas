import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const close = () => setOpen(false);

    const handleLogout = () => {
        logout();
        close();
        setProfileOpen(false);
        window.location.href = '/';
    };

    const handleAnimalClick = () => {
        close();
        if (location.pathname === '/') {
            document.getElementById('animais')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/#animais');
        }
    };

    return (
        <header className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="brand" onClick={close}>
                    <span className="logo-icon">🐾</span> Conecta Patas
                </Link>

                <button className="menu-btn" onClick={() => setOpen(o => !o)}>☰</button>

                <nav className={`nav-links ${open ? 'open' : ''}`}>
                    {user && (
                        <>
                            <button onClick={handleAnimalClick} className="nav-link-btn">Animais</button>

                            {user.role === 'USER' && (
                                <>
                                    <NavLink to="/ongs" onClick={close}>ONGs</NavLink>
                                    <NavLink to="/minhas-solicitacoes" onClick={close}>Minhas Solicitações</NavLink>
                                    <NavLink to="/enviar-animal" onClick={close}>Doar meu animal</NavLink>
                                </>
                            )}
                            {user.role === 'ONG' && <NavLink to="/painel" onClick={close}>Meu Painel</NavLink>}
                        </>
                    )}

                    {!user && (
                        <>
                            <NavLink to="/login" onClick={close}>Entrar</NavLink>
                            <NavLink to="/register" onClick={close}>Cadastre-se</NavLink>
                        </>
                    )}

                    {user && (
                        <div className="profile-container">
                            <button className="btn-profile" onClick={() => setProfileOpen(!profileOpen)}>
                                {user.avatarUrl && <img src={user.avatarUrl} alt="" className="avatar-nav" />}
                                <span className="profile-name">{user.name.split(' ')[0]}</span> <span className="arrow">▾</span>
                            </button>

                            {profileOpen && (
                                <div className="profile-dropdown">
                                    <Link to="/perfil" onClick={() => { setProfileOpen(false); close(); }}>Editar Perfil</Link>
                                    <button onClick={handleLogout} className="dropdown-logout">Sair</button>
                                </div>
                            )}
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}