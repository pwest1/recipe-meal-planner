import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Import routes
import authRoutes from './routes/auth';
import recipeRoutes from './routes/recipes';
import ingredientRoutes from './routes/ingredients';

dotenv.config();

const app = express();
const { auth } = require('express-oauth2-jwt-bearer');const port = process.env.PORT || 8080

const jwtCheck = auth({
  audience: 'https://api.recipe-planner.com',
  issuerBaseURL: 'https://dev-jahsgytfrmdc7we8.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});
// Initialize Prisma Client
export const prisma = new PrismaClient();

// middleware


app.get('/authorized', function (req, res) {
    res.send('Secured Resource');
});

app.listen(port);

console.log('Running on port ', port);

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(jwtCheck);

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Recipe Planner API is running!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// // API Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/ingredients', ingredientRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

//  error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

//shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default app;