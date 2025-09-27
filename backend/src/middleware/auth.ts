import { auth } from 'express-oauth2-jwt-bearer';
import { Request, Response, NextFunction } from 'express';

//const port = process.env.PORT || 8080;

export const jwtCheck = auth({
  audience: ['https://api.recipe-planner.com'],
  issuerBaseURL: 'https://dev-jahsgytfrmdc7we8.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});

export const debugJWT = (req: Request, res: Response, next: NextFunction) => {
  console.log('=== JWT DEBUG ===');
  console.log('Auth object:', (req as any).auth);
  console.log('Headers:', req.headers.authorization);
  console.log('================');
  next();
};

export const jwtErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('=== JWT ERROR ===');
  console.log('Error:', err);
  console.log('Error message:', err.message);
  console.log('Error status:', err.status);
  console.log('================');
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid token', details: err.message });
  }
  next(err);
};