import dotenv from "dotenv"
import epxress from "express"
import asyncError from "../utils/CustomError/asyncErrorHandler.js"
import postSchema from "../models/post.schema.js";
import passport from "passport";
import CustomError from "../utils/CustomError/CustomError.js";
import { createPost, deltePost, getActive, getPost, getPostByLocation, updatePost } from "../controller/post.controller.js";
dotenv.config()
const postRoutes =epxress.Router();

postRoutes.post("/",passport.authenticate('jwt', { session: false }),createPost)
postRoutes.get("/",passport.authenticate('jwt', { session: false }),getPost);
postRoutes.put("/:id", passport.authenticate('jwt', { session: false }),updatePost);
postRoutes.delete("/:id",passport.authenticate('jwt', { session: false }),deltePost)
postRoutes.get("/dashboard",passport.authenticate('jwt', { session: false }),getActive)
postRoutes.post("/get-post-by-location",passport.authenticate('jwt', { session: false }),getPostByLocation)
export default postRoutes