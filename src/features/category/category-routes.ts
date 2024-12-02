import { Hono } from "hono";
import categoryController from "./category-controller";
import { auth } from "../../middleware/auth";
export const categoryRoutes = new Hono();

categoryRoutes.get('/get-category',auth,categoryController.getCategories);
categoryRoutes.post('/create-category',auth,categoryController.createCategory);
categoryRoutes.put('/update-category/:category/:id',auth,categoryController.updateCategory);
categoryRoutes.delete('/delete-category/:id',auth,categoryController.deleteCategory);