import express from 'express'

import { PORT } from './config/env.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middleware/error.middleware.js';
import authRouter from './routes/auth.routes.js';
import restaurantRouter from './routes/restaurant.routes.js';
import menuRouter from './routes/menu.routes.js';
import menuItemRouter from './routes/menuItem.routes.js';

const app = express();

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/restaurants', restaurantRouter);
app.use("/api/menu", menuRouter);
app.use("/api/menu-items", menuItemRouter);

app.use(errorMiddleware);

app.listen(PORT, async () => {
    console.log(`Food Delivery API is running on http://localhost:${PORT}`);

    await connectToDatabase();
});