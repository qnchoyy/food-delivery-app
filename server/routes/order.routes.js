import { Router } from "express";
import {
    getUserOrders,
    getRestaurantOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    cancelOrder
} from "../controllers/order.controller.js";
import authorize from "../middleware/auth.middleware.js";

const orderRouter = Router();

orderRouter.get("/my-orders", authorize, getUserOrders);
orderRouter.get("/restaurant/:restaurantId", authorize, getRestaurantOrders);
orderRouter.get("/:orderId", authorize, getOrderById);
orderRouter.post("/", authorize, createOrder);
orderRouter.put("/:orderId/status", authorize, updateOrderStatus);
orderRouter.put("/:orderId/cancel", authorize, cancelOrder);

export default orderRouter;