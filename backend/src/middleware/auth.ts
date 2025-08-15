import { auth } from 'express-oauth2-jwt-bearer';

//const port = process.env.PORT || 8080;

export const jwtCheck = auth({
  audience: 'https://api.recipe-planner.com',
  issuerBaseURL: 'https://dev-jahsgytfrmdc7we8.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});

