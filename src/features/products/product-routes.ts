import { Hono } from "hono";
import ProductController from "./product-controller";
export const productRoutes = new Hono();

productRoutes.post('/product',ProductController.createProduct);
productRoutes.get('/product/:category',ProductController.getProductsByCategory);
productRoutes.get('/product/:id',ProductController.getProductsById);
productRoutes.put('/product/:id',ProductController.updateProduct);  
productRoutes.delete('/product/:id',ProductController.deleteProduct);