import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
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
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            price: {
                type: Number,
                required: true,
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'on the way', 'delivered', 'canceled']
    },
    estimatedDeliveryTime: {
        type: Date,
    },
    deliveryAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true, default: 'Bulgaria' },
    },
    contactPhone: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'online'],
        default: 'cash',
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    note: {
        type: String,
        trim: true,
        maxlength: 200,
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;