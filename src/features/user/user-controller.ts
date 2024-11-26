import { Context } from "hono";
import userModel from "./user-schema";
import bcrypt from 'bcrypt';

namespace UserController{
    export const signUp = async (ctx : Context) => {
        try{
            let payload = await ctx.req.json();
            const user = await userModel.find({
                email: payload.email.toLowerCase()
            });

            if(user.length > 0){
                return ctx.json({message: 'User already exists'},400);
            }
            const saltRounds = 10;
            const hashPassword = await bcrypt.hash(payload.password,saltRounds);
            
            const newUser = await userModel.create({
                username:payload.name,
                email:payload.email,
                password:hashPassword
            });

            return ctx.json({message: 'User created', user: newUser},201);

        }catch(err){
            console.log(err);
            return ctx.json({message: 'Internal server error'},500);
        }
    }

    export const signIn = async (ctx:Context) => {
        try{
            let payload = await ctx.req.json();
            const user = await userModel.findOne({
                email: payload.email.toLowerCase()               
            });
            if(!user){
                return ctx.json({message: 'User not found'},404);
            }

            const isPasswordValid = await bcrypt.compare(
                payload.password,
                user.password
            );

            if(!isPasswordValid){
                return ctx.json({message: 'Invalid password'},400);
            }

            if(isPasswordValid){
                return ctx.json({message: 'User logged in',user},200);
            }

        }catch(err){
            console.log(err);
            return ctx.json({message: 'Internal server error'},500);
        }
    }
}

export default UserController;