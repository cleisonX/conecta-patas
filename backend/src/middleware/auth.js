import jwt from 'jsonwebtoken';
export const SECRET = process.env.JWT_SECRET || 'dev-secret';

export function requireAuth(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Token ausente' });
    try { req.user = jwt.verify(token, SECRET); next(); }
    catch { res.status(401).json({ error: 'Token inválido' }); }
}

export function requireOng(req, res, next) {
    if (req.user.role !== 'ONG') return res.status(403).json({ error: 'Somente ONGs' });
    next();
}