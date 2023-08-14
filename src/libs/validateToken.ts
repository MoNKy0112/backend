import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

interface IPayload{
    _id:string;
    iat:number;
    exp:number;

}

export const tokenValidation = (req:Request, res:Response, next:NextFunction) =>{
    const token = req.header('auth-token');

    if(!token) return res.status(401).json("Acceso denegado");

    const payload = jwt.verify(token, process.env.TOKEN_SECRET || 'tokentest') as IPayload;

    req.userId = payload._id;
    
    next();
}

export const tokenResetValidation = (req:Request, res:Response, next:NextFunction) =>{
    const token = req.header('reset-token');

    if(!token) return res.status(401).json("Acceso denegado");

    const payload = jwt.verify(token, process.env.TOKEN_SECRET_RESET || 'resettokentest') as IPayload;

    req.userId = payload._id;
    
    next();
}