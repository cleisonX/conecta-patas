import { Router } from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireOng } from '../middleware/auth.js';
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
    params: { folder: 'conecta-patas-animais', allowed_formats: ['jpg', 'png', 'jpeg', 'webp'] },
});
const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    const { species, ongId, needsTempHome, needsMoney, isForAdoption } = req.query;
    const where = {
        status: 'AVAILABLE',
        ...(species && { species }),
        ...(ongId && { ongId: Number(ongId) }),
        ...(needsTempHome === 'true' && { needsTempHome: true }),
        ...(needsMoney === 'true' && { needsMoney: true }),
        ...(isForAdoption === 'true' && { isForAdoption: true }),
    };
    const animals = await prisma.animal.findMany({
        where,
        include: { images: true, ong: { select: { name: true, city: true, state: true } } },
        orderBy: { createdAt: 'desc' }
    });
    res.json(animals);
});

router.get('/pending', requireAuth, requireOng, async (req, res) => {
    const animals = await prisma.animal.findMany({
        where: { status: 'PENDING', ongId: req.user.ongId },
        // ADICIONADO O PHONE AQUI
        include: { images: true, submittedByUser: { select: { name: true, email: true, phone: true } } }
    });
    res.json(animals);
});

router.get('/:id', async (req, res) => {
    const animal = await prisma.animal.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            images: true,
            ong: { select: { id: true, name: true, phone: true, city: true, state: true, pixKey: true } }
        }
    });
    if (!animal) return res.status(404).json({ error: 'Não encontrado' });
    res.json(animal);
});

router.post('/', requireAuth, requireOng, upload.array('images', 6), async (req, res) => {
    const { name, species, breed, ageMonths, gender, size, description, isForAdoption, needsTempHome, needsMoney } = req.body;
    const files = req.files || [];
    const animal = await prisma.animal.create({
        data: {
            name, species, breed, description, gender, size,
            ageMonths: ageMonths ? Number(ageMonths) : null,
            status: 'AVAILABLE',
            ongId: req.user.ongId,
            isForAdoption: isForAdoption === 'true',
            needsTempHome: needsTempHome === 'true',
            needsMoney: needsMoney === 'true',
            images: { create: files.map((f, i) => ({ url: f.path, isMain: i === 0 })) }
        },
        include: { images: true }
    });
    res.status(201).json(animal);
});

router.post('/submit', requireAuth, upload.array('images', 6), async (req, res) => {
    const { name, species, breed, ageMonths, gender, size, description, submissionReason, ongId } = req.body;
    if (!ongId) return res.status(400).json({ error: 'Informe a ONG' });
    const files = req.files || [];
    const animal = await prisma.animal.create({
        data: {
            name, species, breed, description, submissionReason, gender, size,
            ageMonths: ageMonths ? Number(ageMonths) : null,
            status: 'PENDING',
            ongId: Number(ongId),
            submittedByUserId: req.user.id,
            images: { create: files.map((f, i) => ({ url: f.path, isMain: i === 0 })) }
        }
    });
    res.status(201).json(animal);
});

router.put('/:id', requireAuth, requireOng, upload.array('images', 6), async (req, res) => {
    const animalId = Number(req.params.id);
    const { name, species, breed, ageMonths, gender, size, description, isForAdoption, needsTempHome, needsMoney } = req.body;
    const files = req.files || [];

    try {
        const animal = await prisma.animal.findUnique({ where: { id: animalId } });
        if (!animal || animal.ongId !== req.user.ongId) return res.status(403).json({ error: 'Sem permissão' });

        const data = {
            name, species, breed, description, gender, size,
            ageMonths: ageMonths ? Number(ageMonths) : null,
            isForAdoption: isForAdoption === 'true',
            needsTempHome: needsTempHome === 'true',
            needsMoney: needsMoney === 'true',
        };

        if (files.length > 0) {
            await prisma.animalImage.deleteMany({ where: { animalId } });
            data.images = { create: files.map((f, i) => ({ url: f.path, isMain: i === 0 })) };
        }

        const updated = await prisma.animal.update({ where: { id: animalId }, data, include: { images: true } });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao editar animal' });
    }
});

router.patch('/:id/review', requireAuth, requireOng, async (req, res) => {
    const { approve, rejectionReason } = req.body;
    const animal = await prisma.animal.update({
        where: { id: Number(req.params.id) },
        data: {
            status: approve ? 'AVAILABLE' : 'REJECTED',
            rejectionReason: approve ? null : rejectionReason
        }
    });
    res.json(animal);
});

router.delete('/:id', requireAuth, requireOng, async (req, res) => {
    try {
        const animal = await prisma.animal.findUnique({ where: { id: Number(req.params.id) } });
        if (!animal) return res.status(404).json({ error: 'Animal não encontrado' });
        if (animal.ongId !== req.user.ongId) return res.status(403).json({ error: 'Sem permissão' });

        await prisma.animal.delete({ where: { id: animal.id } });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir.' });
    }
});

export default router;