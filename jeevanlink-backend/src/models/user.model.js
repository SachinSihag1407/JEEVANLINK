import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const userSchema = new Schema({
    name: {
        type: String,
        minlength: [3, 'firstName must be 3 Charater']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [3, 'firstName must be 3 Charater']
    },
    password: {
        type: String,
        required: true,
        select: false   // m kuch bhi select ho ho yya data le to ye na aaye sath me
    },
    role: {
        type: String,
        enum: ["PATIENT", "HOSPITAL", "BLOOD_BANK", "AMBULANCE", "ADMIN"],
        default: "PATIENT",
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    location: {
        address: String,
        lat: Number,
        lng: Number,
    }

}, { timestamps: true })

// now iske schema se hn kuch methods ko access krenge 

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "24h" })
    return token;
}

userSchema.methods.comparedPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}


userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10)
}



export const User = mongoose.model("User", userSchema)