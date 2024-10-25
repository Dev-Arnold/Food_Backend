const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const menuSchema = new Schema({
    restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant' }, // reference to the Restaurant
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    food_description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Menu = mongoose.model("Menu",menuSchema);
module.exports = Menu;