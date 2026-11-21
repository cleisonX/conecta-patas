import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import ongRoutes from './routes/ongs.js';
import animalRoutes from './routes/animals.js';
import requestRoutes from './routes/requests.js';
import userRoutes from './routes/users.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/ongs', ongRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API em http://localhost:${PORT}`));