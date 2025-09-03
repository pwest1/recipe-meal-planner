import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { jwtCheck } from './middleware/auth';


// Import routes
import authRoutes from './routes/auth';
import recipeRoutes from './routes/recipes';
import ingredientRoutes from './routes/ingredients';

dotenv.config();

const app = express();

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Basic middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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

// Public API Routes (no auth required)
app.use('/api/auth', authRoutes);

// Protected API Routes (auth required)
app.use('/api/recipes', jwtCheck, recipeRoutes);
app.use('/api/ingredients', jwtCheck, ingredientRoutes);

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