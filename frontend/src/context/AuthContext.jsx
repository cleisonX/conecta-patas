import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const raw = localStorage.getItem('user');
        if (raw) setUser(JSON.parse(raw));
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const updateUser = (newUserData) => {
        const updated = { ...user, ...newUserData };
        localStorage.setItem('user', JSON.stringify(updated));
        setUser(updated);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);