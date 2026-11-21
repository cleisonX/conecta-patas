import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { SECRET, requireAuth } from '../middleware/auth.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const prisma = new PrismaClient();
const router = Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: { folder: 'conecta-patas-perfis', allowed_formats: ['jpg', 'png', 'jpeg', 'webp'] },
});
const upload = multer({ storage: storage });

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, phone, city, state, address, description, ong } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name, email, passwordHash, phone, city, state, address, description,
                role: role === 'ONG' ? 'ONG' : 'USER',
                ...(role === 'ONG' && ong && {
                    ong: {
                        create: {
                            name: ong.name, city: ong.city, state: ong.state,
                            cnpj: ong.cnpj || null, phone: ong.phone || null,
                            description: ong.description || null, address: ong.address || null,
                            pixKey: ong.pixKey || null,
                        }
                    }
                })
            },
            include: { ong: true }
        });
        res.status(201).json({ id: user.id, role: user.role, ongId: user.ong?.id });
    } catch (e) { res.status(400).json({ error: e.message }); }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email }, include: { ong: true } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash)))
        return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign(
        { id: user.id, role: user.role, ongId: user.ong?.id ?? null },
        SECRET, { expiresIn: '7d' }
    );
    res.json({
        token, user: {
            id: user.id, name: user.name, role: user.role, ongId: user.ong?.id ?? null,
            phone: user.phone, city: user.city, state: user.state,
            address: user.address, avatarUrl: user.avatarUrl, description: user.description
        }
    });
});

router.put('/profile', requireAuth, upload.single('avatar'), async (req, res) => {
    const { name, phone, city, state, address, description, pixKey } = req.body;
    try {
        let avatarUrl = req.body.avatarUrl;

        // Se enviou uma nova foto, o Cloudinary retorna a URL completa em req.file.path
        if (req.file) {
            avatarUrl = req.file.path;
        }

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: { name, phone, city, state, address, description, avatarUrl }
        });

        if (user.role === 'ONG') {
            await prisma.ong.update({
                where: { userId: user.id },
                data: { phone, city, state, address, description, avatarUrl, pixKey }
            });
        }

        res.json({ id: user.id, name: user.name, role: user.role, phone: user.phone, city: user.city, state: user.state, address: user.address, avatarUrl: user.avatarUrl, description: user.description });
    } catch (e) { res.status(400).json({ error: 'Erro ao atualizar perfil' }); }
});

router.put('/password', requireAuth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
            return res.status(401).json({ error: 'Senha atual incorreta' });
        }
        const passwordHash = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({ where: { id: req.user.id }, data: { passwordHash } });
        res.json({ message: 'Senha atualizada com sucesso' });
    } catch (e) { res.status(400).json({ error: 'Erro ao atualizar senha' }); }
});

export default router;