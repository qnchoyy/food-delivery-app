import express from "express";
import {
    getMenuByRestaurant,
    createMenu,
    addItemToMenu,
    approveMenu
} from "../controllers/menu.controller.js";
import authorize from '../middleware/auth.middleware.js'

const menuRouter = express.Router();

menuRouter.get("/:restaurantId", getMenuByRestaurant);
menuRouter.post("/:restaurantId", authorize, createMenu);
menuRouter.post("/:restaurantId/items", authorize, addItemToMenu);
menuRouter.put("/:restaurantId/approve", authorize, approveMenu);

export default menuRouter;