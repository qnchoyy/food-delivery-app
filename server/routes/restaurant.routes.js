import { Router } from "express";
import {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    approveRestaurant,
} from "../controllers/restaurant.controller.js";
import authorize from "../middleware/auth.middleware.js";

const restaurantRouter = Router();

restaurantRouter.get("/", getAllRestaurants);
restaurantRouter.get("/:id", getRestaurantById);
restaurantRouter.post("/", authorize, createRestaurant);
restaurantRouter.put("/:id", authorize, updateRestaurant);
restaurantRouter.delete("/:id", authorize, deleteRestaurant);
restaurantRouter.put("/:id/approve", authorize, approveRestaurant);

export default restaurantRouter;