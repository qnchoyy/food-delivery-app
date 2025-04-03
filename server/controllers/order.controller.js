import Order from "../models/Order.model.js";
import Restaurant from "../models/Restaurant.model.js";
import MenuItem from "../models/MenuItem.model.js";

export const getUserOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("restaurant", "name logo")
            .populate("items.menuItem", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        next(error);
    }
};

export const getRestaurantOrders = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.restaurantId);

        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }

        // Ensure the user owns the restaurant or is an admin
        if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "You are not authorized to view orders for this restaurant" });
        }

        const orders = await Order.find({ restaurant: req.params.restaurantId })
            .populate("user", "name lastName email phone")
            .populate("items.menuItem", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        next(error);
    }
};

export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate("user", "name lastName email phone")
            .populate("restaurant", "name logo address")
            .populate("items.menuItem", "name description");

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (
            order.user._id.toString() !== req.user._id.toString() &&
            order.restaurant.owner.toString() !== req.user._id.toString() &&
            req.user.role !== "admin" &&
            req.user.role !== "delivery-person"
        ) {
            return res.status(403).json({ success: false, message: "You are not authorized to view this order" });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
};

export const createOrder = async (req, res, next) => {
    try {
        const {
            restaurantId,
            items,
            deliveryAddress,
            contactPhone,
            paymentMethod,
            note
        } = req.body;

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }

        if (!restaurant.isApproved || !restaurant.active) {
            return res.status(400).json({ success: false, message: "This restaurant is not available for orders" });
        }

        let totalPrice = 0;
        const orderItems = [];

        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItem);

            if (!menuItem) {
                return res.status(404).json({
                    success: false,
                    message: `Menu item ${item.menuItem} not found`
                });
            }

            if (!menuItem.isAvailable) {
                return res.status(400).json({
                    success: false,
                    message: `${menuItem.name} is currently unavailable`
                });
            }

            const itemTotal = menuItem.price * item.quantity;
            totalPrice += itemTotal;

            orderItems.push({
                menuItem: menuItem._id,
                quantity: item.quantity,
                price: menuItem.price
            });
        }

        if (totalPrice < restaurant.minOrderAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum order amount is ${restaurant.minOrderAmount}`
            });
        }

        totalPrice += restaurant.deliveryFee;

        const estimatedDeliveryTime = new Date();
        estimatedDeliveryTime.setMinutes(
            estimatedDeliveryTime.getMinutes() + restaurant.deliveryTime
        );

        const order = await Order.create({
            user: req.user._id,
            restaurant: restaurantId,
            items: orderItems,
            totalPrice,
            status: "pending",
            estimatedDeliveryTime,
            deliveryAddress,
            contactPhone,
            paymentMethod,
            isPaid: paymentMethod !== "cash",
            note
        });

        const populatedOrder = await Order.findById(order._id)
            .populate("restaurant", "name")
            .populate("items.menuItem", "name");

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: populatedOrder
        });
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const validStatuses = ["pending", "preparing", "on the way", "delivered", "canceled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Status must be one of: pending, preparing, on the way, delivered, canceled"
            });
        }

        const order = await Order.findById(req.params.orderId).populate("restaurant");

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (
            order.restaurant.owner.toString() !== req.user._id.toString() &&
            req.user.role !== "admin" &&
            (req.user.role !== "delivery-person" || status !== "delivered")
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this order"
            });
        }

        if (order.status === "delivered" || order.status === "canceled") {
            return res.status(400).json({
                success: false,
                message: `Order is already marked as ${order.status}`
            });
        }

        order.status = status;

        if (status === "delivered" && order.paymentMethod === "cash") {
            order.isPaid = true;
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

export const cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to cancel this order"
            });
        }

        if (order.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel order that is already being prepared or delivered"
            });
        }

        order.status = "canceled";
        await order.save();

        res.status(200).json({
            success: true,
            message: "Order canceled successfully"
        });
    } catch (error) {
        next(error);
    }
};