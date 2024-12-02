import { Context } from "hono";
import ProductModel from "./product-schema";

namespace ProductController{
    export const createProduct = async (ctx : Context) => {
        try{
            const payload = await ctx.req.json();
            const product = await ProductModel.create(payload);
            return ctx.json({message: 'Product created', product},201);
        }catch(err){
            console.log(err);
            return ctx.json({message: 'Internal server error'},500);   
        }
    }

    export const getProductsByCategory = async (ctx:Context) => {
        try{
            const category = await ctx.req.param('category');
            const products = await ProductModel.find({
                category: category
            });
            return ctx.json({message: 'Products found', products},200);
        }catch(err){
            console.log(err);
            return ctx.json({message: 'Internal server error'},500);
        }
    }

    export const getProductsById = async (ctx:Context) => {
        try{
            const categoryId = ctx.req.param('id');
            const product = await ProductModel.findOne({
                _id: categoryId
            })
            return ctx.json({message: 'Product found', product},200);
        }catch(err){
            console.log(err);
            return ctx.json({message: 'Internal server error'},500);
        }
    }

    export const updateProduct = async (ctx:Context) => {
        try{
            const categoryId = ctx.req.param('id');
            const product = await ProductModel.findByIdAndUpdate({
                _id: categoryId
            },{
                $set: ctx.req.json()
            },{
                new: true
            })
            return ctx.json({message: 'Product updated', product},200);
        }catch (err){
            console.log(err);
            return ctx.json({message: 'Internal server error'},500);
        }
    }
    
    export const deleteProduct = async (ctx:Context) => {
        try{
            const categoryId = ctx.req.param('id');
            const product = await ProductModel.findOneAndDelete({
                _id: categoryId})
            return ctx.json({message: 'Product deleted', product},200);
        }catch(err){
            console.log(err);
            return ctx.json({message: 'Internal server error'},500);
        }
    }
}

export default ProductController;