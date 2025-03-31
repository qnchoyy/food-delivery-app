import { Router } from "express";
import {
    getMenuByRestaurant,
    createMenu,
    updateMenu,
    addItemToMenu,
    removeItemFromMenu
} from "../controllers/menu.controller.js";
import authorize from "../middleware/auth.middleware.js";

const menuRouter = Router();

menuRouter.get("/:restaurantId", getMenuByRestaurant);
menuRouter.post("/:restaurantId", authorize, createMenu);
menuRouter.put("/:restaurantId", authorize, updateMenu);
menuRouter.post("/:restaurantId/items", authorize, addItemToMenu);
menuRouter.delete("/:restaurantId/items/:itemId", authorize, removeItemFromMenu);

export default menuRouter;