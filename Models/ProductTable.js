const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    usage: { type: String, required: true },
}, { timeseries: true });

const Product = mongoose.model('product', ProductSchema);
module.exports = Product