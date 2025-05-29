// src\models\userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date, // FIXED: Consistent naming
    verifyToken: String,
    verifyTokenExpiry: Date,    // FIXED: Consistent naming
});

const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;