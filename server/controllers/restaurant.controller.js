import Restaurant from '../models/Restaurant.model.js'

export const createRestaurant = async (req, res, next) => {
    try {
        const { name, description, address, categories } = req.body;

        if (req.user.role !== "restaurant-owner") {
            return res.status(403).json({ messsage: "Access denied. Only restaurant owners can create restaurants." });
        }

        const restaurant = await Restaurant.create({
            name,
            description,
            address,
            categories,
            owner: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Restaurant created successfully",
            data: restaurant,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllRestaurants = async (req, res, next) => {
    try {
        const { category, city, search, sortBy, page = 1, limit = 10 } = req.query;

        const filter = { isApproved: true, active: true };
        if (category) filter.categories = category;
        if (city) filter["address.city"] = city;
        if (search) filter.name = { $regex: search, $options: "i" };

        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * limitNumber;

        const restaurants = await Restaurant.find(filter)
            .populate("owner", "name email")
            .sort(sortBy ? { [sortBy]: 1 } : { createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        res.status(200).json({
            success: true,
            count: restaurants.length,
            data: restaurants,
        });
    } catch (error) {
        next(error);
    }
};

export const getRestaurantById = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id).populate("owner", "name email");

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        res.status(200).json({
            success: true,
            data: restaurant,
        });
    } catch (error) {
        next(error);
    }
};

export const updateRestaurant = async (req, res, next) => {
    try {
        let restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized to update this restaurant" });
        }

        restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.status(200).json({
            success: true,
            message: "Restaurant updated successfully",
            data: restaurant,
        });
    } catch (error) {
        next(error);
    }
}

export const deleteRestaurant = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }


        if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized to delete this restaurant" });
        }

        await restaurant.deleteOne();

        res.status(200).json({
            success: true,
            message: "Restaurant deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const approveRestaurant = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Only admins can approve restaurants"
        });
    }

    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }

        if (restaurant.isApproved) {
            return res.status(400).json({ success: false, message: "Restaurant is already approved" });
        }

        restaurant.isApproved = true;
        await restaurant.save();

        res.status(200).json({ success: true, message: "Restaurant approved successfully", data: restaurant });

    } catch (error) {
        next(error);
    }
};