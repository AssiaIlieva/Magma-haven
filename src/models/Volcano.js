const mongoose = require('mongoose');

const volcanoSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 2,
        required: true,
    },
    location: {
        type: String,
        minLength: 3,
        required: true,
    },
    elevation: {
        type: Number,
        min: 0,
        required: true,
    },
    lastEruption: {
        type: Number,
        min: 0,
        max: 2024,
        required: true,
    },
    image: {
        type: String,
        match: /^https?:\/\//,
        required: true,
    },
    typeVolcano: {
        type: String,
        enum: [Supervolcanoes, Submarine, Subglacial, Mud, Stratovolcanoes, Shield],
        required: true,
    }, 
    description: {
        type: String,
        minLength: 10,
        required: true,
    },
    voteList: [{
        type: mongoose.Types.ObjectId,
        default: [],
        ref: 'User'
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
});

const Volcano = mongoose.model('Volcano', volcanoSchema);

module.exports = Volcano;