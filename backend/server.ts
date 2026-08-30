import express from 'express';
import cors from 'cors';
import type { Request, Response } from 'express';

const app = express();

app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send({ ok: true, message: 'servidor corriendo '});
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
