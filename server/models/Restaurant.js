const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    image: {
        type: String, // This will store the file path or URL of the uploaded image
        required: true
    },
    food_types: {
        type: [String],
        enum: [
            'pizza', 'ice-cream', 'pastries', 'local-food', 'chinese', 
            'burgers', 'jollof-rice', 'fried-rice', 'pasta'
        ]
    },
    opening_time: {
        type: String,
        required: true
    },
    closing_time: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true

    },
}, { timestamps: true });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
