import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem',
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Menu = mongoose.model('Menu', menuSchema);

export default Menu;