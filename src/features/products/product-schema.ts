import { Schema,model } from "mongoose";

let ProductSchema = new Schema(
    {
        name: {
            type: String
        },
        description:{
            type: String
        },
        price:{
            type: Number
        },
        category:{
            type: Schema.Types.ObjectId,
            ref: 'bakery-Category',
        },
        image:{
            type: String
        },
        countInStock:{
            type: Number
        },
        rating:{
            type: Number
        },
        numReviews:{
            type: Number
        }
    },
    {
        timestamps: true
    }
);

const ProductModel = model(`bakery-Product`, ProductSchema);

export default ProductModel;