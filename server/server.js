import express from 'express'

import { PORT } from './config/env.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middleware/error.middleware.js';

const app = express();

app.use(express.json());

app.use(errorMiddleware)

app.get('/', (req, res) => {
    res.send('Welcome the the Food delivery API!');
});


app.listen(PORT, async () => {
    console.log(`Food Delivery API is running on http://localhost:${PORT}`);

    await connectToDatabase();
});