import dotenv from "dotenv"
import express from "express"
import { passportMiddleWare, passportVarifier, userLogin, userRegister } from "../controller/user.controller.js";
dotenv.config()
const userRoutes =express.Router();
passportMiddleWare()
passportVarifier()
userRoutes.post("/register",userRegister );
userRoutes.post('/login',userLogin );


export default userRoutes;