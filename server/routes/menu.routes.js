import express from "express";
import {
    getMenuByRestaurant,
    createMenu,
    addItemToMenu,
    approveMenu
} from "../controllers/menu.controller.js";
import authorize from '../middleware/auth.middleware.js'

const menuRouter = express.Router();

router.get("/:restaurantId", getMenuByRestaurant);
router.post("/:restaurantId", authorize, createMenu);
router.post("/:restaurantId/items", authorize, addItemToMenu);
router.put("/:restaurantId/approve", authorize, approveMenu);

export default menuRouter;