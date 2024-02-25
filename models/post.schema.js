import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    body: {
        type: String,
        required: [true, "Body is required"],
    },
    createdBy: {
        type: String,
        required: [true, "Created by is required"]
    },
    active: {
        type: Boolean,
        default: true
    },
    userId:{type:String},
    location: {
        type: {
            type: String,
            required: [true, "Location type is required"]
        },
        coordinates: {
            type: [Number], // Array of numbers (float values)
            required: [true, "Coordinates are required"]
        }
    },
});

// Create 2dsphere index for location field
postSchema.index({ location: "2dsphere" });

export default mongoose.model("userPosts", postSchema);
