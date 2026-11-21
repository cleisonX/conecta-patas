import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
    const ongs = await prisma.ong.findMany({
        where: { verified: true },
        select: { id: true, name: true, city: true, state: true, description: true }
    });
    res.json(ongs);
});

router.get('/:id', async (req, res) => {
    const ong = await prisma.ong.findUnique({
        where: { id: Number(req.params.id) },
        select: {
            id: true, name: true, city: true, state: true, phone: true, description: true, address: true, avatarUrl: true,
            animals: {
                where: { status: 'AVAILABLE' }, // <-- FILTRO ADICIONADO AQUI
                include: { images: true }
            }
        }
    });
    if (!ong) return res.status(404).json({ error: 'ONG não encontrada' });
    res.json(ong);
});

export default router;