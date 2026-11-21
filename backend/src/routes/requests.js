import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireOng } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();

// ================= ADOÇÃO =================
router.post('/adoption', requireAuth, async (req, res) => {
    const { animalId, message } = req.body;
    const r = await prisma.adoptionRequest.create({ data: { animalId, userId: req.user.id, message } });
    res.status(201).json(r);
});

router.get('/adoption/mine', requireAuth, async (req, res) => {
    const r = await prisma.adoptionRequest.findMany({
        where: { userId: req.user.id },
        include: { animal: { include: { images: true, ong: { select: { name: true } } } } },
        orderBy: { createdAt: 'desc' }
    });
    res.json(r);
});

router.get('/adoption/pending', requireAuth, requireOng, async (req, res) => {
    const r = await prisma.adoptionRequest.findMany({
        // REMOVIDO O FILTRO DE STATUS PARA TRAZER O HISTÓRICO
        where: { animal: { ongId: req.user.ongId } },
        include: {
            user: { select: { id: true, name: true, email: true, phone: true, city: true, state: true } },
            animal: { include: { images: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
    res.json(r);
});

router.patch('/adoption/:id/review', requireAuth, requireOng, async (req, res) => {
    const { approve } = req.body;
    const r = await prisma.adoptionRequest.update({
        where: { id: Number(req.params.id) },
        data: { status: approve ? 'APPROVED' : 'REJECTED', reviewedAt: new Date() }
    });
    if (approve) {
        await prisma.animal.update({ where: { id: r.animalId }, data: { status: 'ADOPTED' } });
    }
    res.json(r);
});

router.delete('/adoption/:id', requireAuth, async (req, res) => {
    try {
        const request = await prisma.adoptionRequest.findUnique({ where: { id: Number(req.params.id) } });
        if (!request) return res.status(404).json({ error: 'Não encontrada' });
        if (request.userId !== req.user.id && req.user.role !== 'ONG') return res.status(403).json({ error: 'Sem permissão' });
        await prisma.adoptionRequest.delete({ where: { id: request.id } });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao apagar.' });
    }
});

// ================= LAR TEMPORÁRIO =================
router.post('/temphome', requireAuth, async (req, res) => {
    const { animalId, message } = req.body;
    const r = await prisma.tempHomeRequest.create({ data: { animalId, userId: req.user.id, message } });
    res.status(201).json(r);
});

router.get('/temphome/pending', requireAuth, requireOng, async (req, res) => {
    const r = await prisma.tempHomeRequest.findMany({
        // REMOVIDO O FILTRO DE STATUS PARA TRAZER O HISTÓRICO
        where: { animal: { ongId: req.user.ongId } },
        include: {
            user: { select: { id: true, name: true, email: true, phone: true, city: true, state: true } },
            animal: { include: { images: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
    res.json(r);
});

router.patch('/temphome/:id/review', requireAuth, requireOng, async (req, res) => {
    const r = await prisma.tempHomeRequest.update({
        where: { id: Number(req.params.id) },
        data: { status: 'REVIEWED' }
    });
    res.json(r);
});

router.delete('/temphome/:id', requireAuth, requireOng, async (req, res) => {
    await prisma.tempHomeRequest.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
});

// ================= DOAÇÃO =================
router.post('/donation', requireAuth, async (req, res) => {
    const { animalId, amount, message } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Valor inválido' });

    const r = await prisma.donationPledge.create({
        data: { animalId, userId: req.user.id, type: 'MONEY', message, amount: Number(amount) }
    });
    res.status(201).json(r);
});

router.get('/donation/pending', requireAuth, requireOng, async (req, res) => {
    const r = await prisma.donationPledge.findMany({
        // REMOVIDO O FILTRO DE STATUS PARA TRAZER O HISTÓRICO
        where: { animal: { ongId: req.user.ongId } },
        include: {
            user: { select: { id: true, name: true, email: true, phone: true, city: true, state: true } },
            animal: { include: { images: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
    res.json(r);
});

router.patch('/donation/:id/review', requireAuth, requireOng, async (req, res) => {
    const r = await prisma.donationPledge.update({
        where: { id: Number(req.params.id) },
        data: { status: 'REVIEWED' }
    });
    res.json(r);
});

router.delete('/donation/:id', requireAuth, requireOng, async (req, res) => {
    await prisma.donationPledge.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
});

export default router;