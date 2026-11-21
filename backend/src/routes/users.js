import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.get('/:id', async (req, res) => {
    try {
        const userId = Number(req.params.id);
        if (isNaN(userId)) return res.status(400).json({ error: 'ID inválido' });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, phone: true, city: true, state: true, address: true, avatarUrl: true, description: true }
        });

        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

export default router;