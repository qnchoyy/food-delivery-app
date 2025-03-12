import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Restaurant name is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
    },
    logo: {
        type: String,
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true, default: 'Bulgaria' },
    },
    categories: {
        type: [String],
        enum: ["pizza", "burger", "sushi", "salad", "drink", "dessert"],
        default: []
    },
    workingHours: {
        monday: { open: { type: Number, default: 900 }, close: { type: Number, default: 2100 } },
        tuesday: { open: { type: Number, default: 900 }, close: { type: Number, default: 2100 } },
        wednesday: { open: { type: Number, default: 900 }, close: { type: Number, default: 2100 } },
        thursday: { open: { type: Number, default: 900 }, close: { type: Number, default: 2100 } },
        friday: { open: { type: Number, default: 900 }, close: { type: Number, default: 2100 } },
        saturday: { open: { type: Number, default: 900 }, close: { type: Number, default: 2100 } },
        sunday: { open: { type: Number, default: 900 }, close: { type: Number, default: 2100 } },
    },
    deliveryTime: {
        type: Number,
        default: 45
    },
    minOrderAmount: {
        type: Number,
        default: 0
    },
    deliveryFee: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 1,
        min: [1, 'Rating cannot be less than 1'],
        max: [5, 'Rating cannot be more than 5']
    },
    active: {
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isApproved: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;