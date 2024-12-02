import { Hono } from "hono";
import ProductController from "./product-controller";
import { auth } from "../../middleware/auth";
export const productRoutes = new Hono();

productRoutes.post('/product',auth,ProductController.createProduct);
productRoutes.get('/product/:category',auth,ProductController.getProductsByCategory);
productRoutes.get('/product/:id',auth,ProductController.getProductsById);
productRoutes.put('/product/:id',auth,ProductController.updateProduct);  
productRoutes.delete('/product/:id',auth,ProductController.deleteProduct);