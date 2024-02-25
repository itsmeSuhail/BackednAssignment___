import dotenv from "dotenv"
import userSchema from "../models/user.schama.js";
import jwt from "jsonwebtoken"
import passport from "passport";
import bcrypt from "bcrypt"
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
dotenv.config()
export const passportMiddleWare=()=>{
    passport.use(new LocalStrategy({
        usernameField: 'email', 
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const user = await userSchema.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Incorrect email' });
            }
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return done(null, false, { message: 'Incorrect password' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
}
export const passportVarifier=()=>{
    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JwtSecret
    }, async (jwtPayload, done) => {
        try {
            const user = await userSchema.findById(jwtPayload.user._id);
            console.log(user)
    
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
}
export const userRegister=async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        // Hash the password securely
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create user in the database
        await userSchema.create({
            name,
            email,
            password: hashedPassword // Store the hashed password
        });
        res.status(200).json({
            message: "User account created successfully"
        });
    } catch (error) {
        return next(error);
    }
}
export const userLogin=(req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        console.log(user)
        const token = jwt.sign({ user }, process.env.JwtSecret);
        return  res.cookie('jwt', token, { httpOnly: true, secure: true }).json({ token });
    })(req, res, next);
}