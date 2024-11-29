import { Context } from "hono"
import categoryModel from "./category-schema";
namespace categoryController{
    export const createCategory = async (ctx:Context) => {
        try{
            let payload = await ctx.req.json();
            const newCategory = await categoryModel.create({
                userId: payload._id,
                categoryName: payload.category
            });

            return ctx.json({message: 'Category created', category: newCategory},201);

        }catch(err){
            console.log(err);
            return ctx.json({message: 'Internal server error'},500);
        }
    }

    export const getCategories = async (ctx:Context) => {
        try{
            let payload = await ctx.req.json();
            const categories = await categoryModel.find({
                userId: payload._id
            });

            return ctx.json({message: 'Categories found', categories},200);

        }catch(err){
            console.log(err);
            return ctx.json({message: 'Internal server error'},500);
        }
    }

    export const updateCategory = async (ctx:Context) => {
        try{
            let id = await ctx.req.param('id');
            let categoryName = ctx.req.param('category');
            const updatedCategory = await categoryModel.findOneAndUpdate({
                _id: id
            },{
                categoryName: categoryName
            },{
                new: true
            });

            return ctx.json({message: 'Category updated', category: updatedCategory},200);

        }catch(err){
            console.log(err);
            return ctx.json({message: 'Internal server error'},500);
        }
    }

    export const deleteCategory = async (ctx:Context) => {
        try{
            let id = await ctx.req.param('id');
            const deleteCategory = await categoryModel.findOneAndDelete({_id:id});

            return ctx.json({message:'Category deleted',deleteCategory},200)
        }catch(err){
            console.log(err);
            return ctx.json({message: 'Internal server error'},500);
        }
    }
}

export default categoryController;