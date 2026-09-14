import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'UniCore Node API' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
