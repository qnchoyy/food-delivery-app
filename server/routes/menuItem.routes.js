import { Router } from "express";
import {
    getMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem
} from "../controllers/menuItem.controller.js";
import authorize from "../middleware/auth.middleware.js";

const menuItemRouter = Router();

menuItemRouter.get("/:restaurantId/items", getMenuItems);
menuItemRouter.get("/item/:id", getMenuItemById);
menuItemRouter.post("/:restaurantId/item", authorize, createMenuItem);
menuItemRouter.put("/item/:id", authorize, updateMenuItem);
menuItemRouter.delete("/item/:id", authorize, deleteMenuItem);

export default menuItemRouter;