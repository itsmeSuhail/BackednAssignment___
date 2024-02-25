import dotenv from "dotenv"
import postSchema from "../models/post.schema.js";
import CustomError from "../utils/CustomError/CustomError.js";
dotenv.config()
export const createPost=async(req,res,next)=>{
    try {
        const user=req.user;
        const {title,body,active,lat,long}=req.body;
        if(!title||!body||!lat||!long)return next(new CustomError("fields required"),400,{
            ...(!title&&({title:"title is required..."})),
            ...(!body&&({body:"body is required..."})),
            ...(!lat&&({lat:"lat is required..."})),
            ...(!long&&({long:"long is required..."})),
        })
        const data=await postSchema.create({
         title,
         body,
         createdBy:user.name,
         active,
         userId:user._id,
         location:{
            type:"Point",
            coordinates:[
                parseFloat(long),
                parseFloat(lat)
            ]
         }
        });
        res.status(200).json({
            message:"Success",data
        })
    } catch (error) {
        return next(error)
    }
}
export const getPost=async(req,res,next)=>{
    try {
        const data=await postSchema.find();
        res.status(200).json({
            message:"Success",
            data
        })
    } catch (error) {
        return next(error)
    }
}
export const updatePost= async (req, res, next) => {
    try {
        const {id}=req.params;
        console.log(id,"SEE")
        const options = { ...req.body };
        console.log(options)
        const data = await postSchema.findByIdAndUpdate(
           id,{ $set: options }, { new: true });
        res.status(200).json({
            message: "Success",
            data
        });
    } catch (error) {
        return next(error);
    }
}
export const deltePost=async(req,res,next)=>{
    try {
        const {id}=req.params;
     const data=   await postSchema.findByIdAndDelete(id);
     if(!data)return next(new CustomError("post not found",404,{error:"Id is not valid or post not found"}));
        res.status(200).json({
            message:"post deleted successfully..."
        })
    } catch (error) {
        return next(error)
    }
}
export const getActive=async(req,res,next)=>{
    try {
        const filter={};
        const data = await postSchema.aggregate([
            {
                $group: {
                    _id: "$active",
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    counts: {
                        $push: {
                            k: { $cond: { if: { $eq: ["$_id", true] }, then: "active", else: "inactive" } },
                            v: "$count"
                        }
                    }
                }
            },
            {
                $replaceRoot: {
                    newRoot: { $arrayToObject: "$counts" }
                }
            }
        ]);
        res.status(200).json({
            message:"Success",
            data
        })
    } catch (error) {
        return next(error)
    }
}
export const getPostByLocation=async(req,res,next)=>{
    try {
        const {long,lat}=req.body
        if(!lat||!long)return next(new CustomError("fields required"),400,{
            ...(!lat&&({lat:"lat is required..."})),
            ...(!long&&({long:"long is required..."})),
        })
        const data=await postSchema.aggregate([
            {
                $geoNear:{
                    near:{
                        type:"Point",
                        coordinates:[
                            parseFloat(long),
                            parseFloat(lat)
                        ]
                    },
                    key:"location",
                    maxDistance:parseFloat(5000)*1609,
                    distanceField:"dist.calculated",
                    spherical:true
                }
            }
        ]);
        res.status(200).json({
            message:"Success",
            data
        })
    } catch (error) {
        return next(error)
    }
}