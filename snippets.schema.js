const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    
    title: { type: String, required: true },
    
    code: { type: String, required: true },

    language: { type: String, required: true },

    notes: { type: String, required: false },

    tags: { type: String, required: false },
});

const model = mongoose.model('Snippets', schema);

module.exports = model;