import express from 'express'

import { PORT } from './config/env.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome the the Food delivery API!');
});


app.listen(PORT, () => {
    console.log(`Food Delivery API is running on http://localhost:${PORT}`);
});