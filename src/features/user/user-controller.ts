import { Context } from "hono";
import userModel from "./user-schema";
import bcrypt from 'bcrypt';
import CommonUtils from "../../utils/common-utils";

namespace UserController{
    export const signUp = async (ctx : Context) => {
        try{
            let payload = await ctx.req.json();
            const user = await userModel.find({
                email: payload.email.toLowerCase()
            });

            if(user.length > 0){
                return ctx.json({message: 'User already exists',status:400},200);
            }
            const saltRounds = 10;
            const hashPassword = await bcrypt.hash(payload.password,saltRounds);
            
            const newUser = await userModel.create({
                username:payload.name,
                email:payload.email,
                password:hashPassword
            });
            
            if(newUser){
                const token = await CommonUtils.setUserCookie(newUser,ctx);
                return ctx.json({
                    status:200,
                    user: {username:newUser.username,email:newUser.email},
                    token: token
                })
            }

            return ctx.json({status:201, user: newUser},201);

        }catch(err){
            console.log(err);
            return ctx.json({message: 'Internal server error',status:500},500);
        }
    }

    export const signIn = async (ctx:Context) => {
        try{
            let payload = await ctx.req.json();

            if(payload.googleId){
                const existUser = await userModel.findOne({
                    googleId: payload.googleId
                });

                if(existUser){
                    const token = await CommonUtils.setUserCookie(existUser,ctx);
                    return ctx.json({
                        status:200,
                        user: {username:existUser.username,email:existUser.email},
                        token: token
                    })
                }

                const newUser = await userModel.create({
                    username:payload.name,
                    email:payload.email,
                    googleId:payload.googleId
                });
                const token = await CommonUtils.setUserCookie(newUser,ctx);
                return ctx.json({
                    status:200,
                    user: {username:newUser.username,email:newUser.email},
                    token: token
                })
            }

            const user = await userModel.findOne({
                email: payload.email.toLowerCase()               
            });

            if(!user){
                return ctx.json({message: 'User not found',status:400},404);
            }

            

            const isPasswordValid = await bcrypt.compare(
                payload.password,
                user.password
            );

            if(!isPasswordValid){
                return ctx.json({message: 'Invalid password',status:400},400);
            }

            if(isPasswordValid){
                const token = await CommonUtils.setUserCookie(user,ctx);
                return ctx.json({
                    status:201,
                    user:{username:user.username,email:user.email},
                    token
                },200);
            }

        }catch(err){
            console.log(err);
            return ctx.json({message: 'Internal server error',status:500},500);
        }
    }
}

export default UserController;