import { Context, Hono, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import jwt, { JwtPayload } from "jsonwebtoken";

export const auth = async (ctx:Context,next:Next) => {
    const authHeader = ctx.req.header("Authorization");
    
    if(!authHeader?.startsWith("Bearer ")) {
        throw new HTTPException(401, {message:"Unauthorized"});
    }

    const token = authHeader.split(" ")[1];

    if(!token){
        throw new HTTPException(401, {message:"Unauthorized"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        if(typeof decoded === 'object' && decoded != null){
            ctx.set("user", decoded);
            await next();
        }else{
            throw new HTTPException(401, {message:"Unauthorized"});
        }
    }catch(err){
        throw new HTTPException(401, {message:"Unauthorized"});
    }

}