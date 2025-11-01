// models/LostFound.js
const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Lost', 'Found'],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true
    },
    contact: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String, 
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'lost_found_items'
});

module.exports = mongoose.models.LostFound || mongoose.model('LostFound', lostFoundSchema);
