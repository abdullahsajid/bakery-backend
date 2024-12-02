import { Context } from "hono";
import jwt from "jsonwebtoken";
import { setCookie } from "hono/cookie";

namespace CommonUtils{
    export const setUserCookie = async (user : any,cx:Context) => {
        console.log('user',user._id);
        let token = await CommonUtils.generateToken(user)
        setCookie(cx,"bakery-auth",token,{
            secure:true,
            httpOnly:true,
            sameSite:'Strict'
        })
        return token
    }

    export const generateToken = (user:any) => {
        let token = jwt.sign({
            id:user._id
        },process.env.SECRET_KEY as string) 
        return token
    }
}

export default CommonUtils;