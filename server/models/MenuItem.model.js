import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: {
        type: String,
        enum: ['pizza', 'burger', 'sushi', 'salad', 'drink', 'dessert'],
        required: true,
    },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;