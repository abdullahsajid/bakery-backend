import { Schema,model } from "mongoose";

let userSchema = new Schema<IUser>(
    {
        username: {
            type: String
        },
        email:{
            type: String,
            unique: true,
            required: true,
            lowercase: true
        },
        password:{
            type: String,
        },
        googleId:{
            type: String
        },
        isAdmin:{
            type: Boolean,
            enum: [true, false] as const,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const userModel = model(`bakery-User`, userSchema);

export default userModel;
