import mongoose from "mongoose";
mongoose.set("strictQuery", true);
export const connectDb = async (key) => {
    try { 
        await mongoose.connect(key);
        console.log("Db has been connected....");
    } catch (error) {
        console.log("You Got Error at Db File---> ", error.message);
    }
}