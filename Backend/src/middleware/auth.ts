import {Response, Request, NextFunction} from "express";
import {auth} from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";
import User from "../models/user";

// declaring custom variables for request
declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}

// this will check the authorization header (the bearer token) and is going to check the token that we get and if it belongs to a logged in user
export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {authorization} = req.headers;

  // When request is sent from Auth the header has "Bearer" followed by a string
  if (!authorization || !authorization.startsWith("Bearer")) {
    return res.sendStatus(401);
  }

  // this is the access token a.k.a what comes after "Bearer" on the header
  const token = authorization.split(" ")[1];

  // decoding the token
  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const auth0Id = decoded.sub;

    const user = await User.findOne({auth0Id});

    if (!user) {
      return res.sendStatus(401);
    }

    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
};
