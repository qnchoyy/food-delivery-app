import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    items: [
        {
            name: { type: String, required: true, trim: true },
            description: { type: String, trim: true },
            price: { type: Number, required: true, min: 0 },
            category: {
                type: String,
                enum: ['pizza', 'burger', 'sushi', 'salad', 'drink', 'dessert'],
                required: true,
            },
            isAvailable: { type: Boolean, default: true },
            discountPrice: { type: Number, min: 0 },
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Menu = mongoose.model('Menu', menuSchema);

export default Menu;