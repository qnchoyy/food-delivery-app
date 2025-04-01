import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    items: [
        {
            menuItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'MenuItem',
                required: true
            },
            price: {
                type: Number,
                required: true,
                min: 0,
            },
            isAvailable: {
                type: Boolean,
                default: true,
            }
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    },
    isApproved: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Menu = mongoose.model('Menu', menuSchema);

export default Menu;