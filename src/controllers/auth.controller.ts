import {Request,Response} from 'express'
import nodemailer from 'nodemailer'
import User,{IUser} from '../models/User';

import jwt from 'jsonwebtoken';

export const signUp = async (req: Request, res: Response) => {
    //Guardar Usuario
    const user:IUser=new User({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password
    });
    user.password = await user.encryptPassword(user.password)
    const savedUser = await user.save();
    //Token
    const token:string = jwt.sign({_id:savedUser._id},
        process.env.TOKEN_SECRET || 'tokentest',
        )
    
    res.header('auth-token',token).json(savedUser);
    
};

export const signIn = async (req: Request, res: Response) => {
    const user = await User.findOne({email:req.body.email});
    console.log(user)
    if(!user) return res.status(400).json("Email is wrong");

    const correctPassword:boolean = await user.validatePassword(req.body.password)
    if(!correctPassword) return res.status(400).json("Password is wrong");

    const token:string = jwt.sign({_id:user._id},process.env.TOKEN_SECRET||'tokentest',{
        expiresIn: 60*15
    })

    res.header('auth-token',token).json(user);
};

export const profile = async (req: Request, res: Response) => {
    const user = await User.findById(req.userId);
    if(!user) return res.status(404).json("User not found!");
    res.json(user);
};

export const resetPassword = async (req: Request, res: Response) => {
    const user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).json("Email is wrong");

    //ENVIAR MAIL
    const token:string = jwt.sign({_id:user._id},process.env.TOKEN_SECRET_RESET||'resettokentest',{
        expiresIn:60*5
    })

     
    const verificationLink=`http//localhost:${process.env.PORT||"3000"}/resetpassword/${token}`
    //data mail y enviarlo
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:`${process.env.EMAIL_ADDRESS}`,
            pass:`${process.env.EMAIL_PASSWORD}`
        }
    });
    const mailOptions = {
        from:'test@gmail.com',
        to:`${user.email}`,
        subject:'Reset Password',
        text:verificationLink
    };

    try {
        transporter.sendMail(mailOptions)
    } catch (error) {
        console.error("Ha ocurrido un error");
    }

    res.status(200).json('Email enviado')
    await user.updateOne({tokenReset:token})
    console.log(user)
}

export const changePassword = async (req: Request, res: Response) => {
    // const user = await User.findByIdAndUpdate(req.userId,{});
    const user = await User.findOne({email:req.body.email});
    console.log(user)

    if(!user)return res.status(404).json("User not found!");
    
    await user.updateOne({
        password:await user.encryptPassword(req.body.newpassword),
        tokenReset:null
    })
    console.log(user)
    await user.save();
    res.status(200).json(user)
    
}
