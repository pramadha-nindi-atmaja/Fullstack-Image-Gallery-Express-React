import { Router } from "express";
import {
  deleteProduct,
  getProductById,
  getProducts,
  insertProduct,
  updateProduct,
} from "../controllers/product.controller.js";
const productRouter = Router();

productRouter.get("/products", getProducts);
productRouter.get("/products/:id", getProductById);
productRouter.post("/products", insertProduct);
productRouter.put("/products/:id", updateProduct);
productRouter.delete("/products/:id", deleteProduct);
export default productRouter;
