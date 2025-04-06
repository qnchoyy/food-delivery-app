import Menu from "../models/Menu.model.js";
import MenuItem from "../models/MenuItem.model.js";
import Restaurant from "../models/Restaurant.model.js";

export const getMenuByRestaurant = async (req, res, next) => {
    try {
        const menu = await Menu.findOne({
            restaurant: req.params.restaurantId,
            isActive: true,
            isApproved: true,
        }).populate("items.menuItem", "name description price category isAvailable");

        if (!menu) {
            return res.status(404).json({ success: false, message: "Menu not found" });
        }

        res.status(200).json({ success: true, data: menu });
    } catch (error) {
        next(error);
    }
};

export const createMenu = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.restaurantId);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }

        if (restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized to create a menu for this restaurant" });
        }

        const existingMenu = await Menu.findOne({ restaurant: req.params.restaurantId });
        if (existingMenu) {
            return res.status(400).json({ success: false, message: "Menu already exists for this restaurant" });
        }

        const menu = await Menu.create({
            restaurant: req.params.restaurantId,
            items: req.body.items || [],
            isApproved: false,
            isActive: true,
        });

        res.status(201).json({ success: true, message: "Menu created successfully. Waiting for approval.", data: menu });
    } catch (error) {
        next(error);
    }
};

export const addItemToMenu = async (req, res, next) => {
    try {
        const menu = await Menu.findOne({ restaurant: req.params.restaurantId }).populate("restaurant");
        if (!menu) {
            return res.status(404).json({ success: false, message: "Menu not found" });
        }

        if (menu.restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized to update this menu" });
        }

        const menuItem = await MenuItem.create({
            restaurant: req.params.restaurantId,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            isAvailable: req.body.isAvailable,
        });

        menu.items.push({ menuItem: menuItem._id, price: req.body.price });
        await menu.save();

        res.status(200).json({ success: true, message: "Item added to menu", data: menu });
    } catch (error) {
        next(error);
    }
};


export const approveMenu = async (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Only admins can approve menus" });
    }

    try {
        const menu = await Menu.findOne({ restaurant: req.params.restaurantId });
        if (!menu) {
            return res.status(404).json({ success: false, message: "Menu not found" });
        }

        if (menu.isApproved) {
            return res.status(400).json({ success: false, message: "Menu is already approved" });
        }

        menu.isApproved = true;
        await menu.save();

        res.status(200).json({ success: true, message: "Menu approved successfully", data: menu });
    } catch (error) {
        next(error);
    }
};