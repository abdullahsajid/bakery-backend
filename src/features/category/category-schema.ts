import { Schema,model } from "mongoose";

let categorySchema = new Schema(
    {
        userId:{
            type: Schema.Types.ObjectId,
            ref: 'bakery-User',
            required: true
        },
        categoryName: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const categoryModel = model(`bakery-Category`, categorySchema);

export default categoryModel;