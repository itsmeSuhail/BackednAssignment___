import expres from "express";
import cors from "cors"
import dotenv from "dotenv";
import { connectDb } from "./utils/ConnectDb.js"
import cookieParser from "cookie-parser";
import globalErrorHandler  from "./controller/error.controller.js"
dotenv.config();
import path from"path"
import { URL } from 'url';
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";


const port = process.env.PORT || 3001;
const mongoURL = process.env.mongoURL;
const app = expres();

  app.use(expres.static('dist'));
  app.use(cookieParser());
app.use(cors({
  origin:"*",credentials:true
}));
app.use(expres.json())
const __dirname = new URL('.', import.meta.url).pathname;
//Connect dataBase
connectDb(mongoURL);
//routes
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/userPost",postRoutes)

app.use(globalErrorHandler)

app.listen(port, () => { console.log(`server is started at http://localhost:${port}`) })