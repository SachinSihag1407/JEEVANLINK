import mongoose from "mongoose"

const DB_Name = "SachuDon"

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
        console.log("Database is  Connnected successfully...")
        return connectionInstance;
    } catch (error) {
        console.log("Database connection is failed...", error)
    }
}

export default connectDB;