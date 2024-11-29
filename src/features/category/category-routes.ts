import { Hono } from "hono";
import categoryController from "./category-controller";

export const categoryRoutes = new Hono();

categoryRoutes.get('/get-category',categoryController.getCategories);
categoryRoutes.post('/create-category',categoryController.createCategory);
categoryRoutes.put('/update-category/:category/:id',categoryController.updateCategory);
categoryRoutes.delete('/delete-category/:id',categoryController.deleteCategory);