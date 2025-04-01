import MenuItem from "../models/MenuItem.model.js";
import Menu from "../models/Menu.model.js";
import Restaurant from "../models/Restaurant.model.js";

export const getMenuItems = async (req, res, next) => {
    try {
        const menuItems = await MenuItem.find({ restaurant: req.params.restaurantId });
        res.status(200).json({ success: true, count: menuItems.length, data: menuItems });
    } catch (error) {
        next(error);
    }
};

export const getMenuItemById = async (req, res, next) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ success: false, message: "Menu item not found" });
        }
        res.status(200).json({ success: true, data: menuItem });
    } catch (error) {
        next(error);
    }
};

export const createMenuItem = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.restaurantId);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }

        if (restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to add menu items to this restaurant",
            });
        }

        const menuItem = await MenuItem.create({
            restaurant: req.params.restaurantId,
            ...req.body
        });

        const menu = await Menu.findOne({ restaurant: req.params.restaurantId });
        if (menu) {
            menu.items.push({ menuItem: menuItem._id, price: menuItem.price });
            await menu.save();
        }

        res.status(201).json({ success: true, message: "Menu item added successfully", data: menuItem });
    } catch (error) {
        next(error);
    }
};

export const updateMenuItem = async (req, res, next) => {
    try {
        let menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ success: false, message: "Menu item not found" });
        }

        const restaurant = await Restaurant.findById(menuItem.restaurant);
        if (restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this menu item",
            });
        }

        menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        const menu = await Menu.findOne({ restaurant: menuItem.restaurant });
        if (menu) {
            const menuItemIndex = menu.items.findIndex(item => item.menuItem.toString() === menuItem._id.toString());
            if (menuItemIndex !== -1) {
                menu.items[menuItemIndex].price = menuItem.price;
                await menu.save();
            }
        }

        res.status(200).json({ success: true, message: "Menu item updated successfully", data: menuItem });
    } catch (error) {
        next(error);
    }
};

export const deleteMenuItem = async (req, res, next) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ success: false, message: "Menu item not found" });
        }

        const restaurant = await Restaurant.findById(menuItem.restaurant);
        if (restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this menu item",
            });
        }

        const menu = await Menu.findOne({ restaurant: menuItem.restaurant });
        if (menu) {
            menu.items = menu.items.filter(item => item.menuItem.toString() !== menuItem._id.toString());
            await menu.save();
        }

        await menuItem.deleteOne();

        res.status(200).json({ success: true, message: "Menu item deleted successfully" });
    } catch (error) {
        next(error);
    }
};