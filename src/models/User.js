const {Schema, model, MongooseError, default: mongoose} = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    createdVolcanoes: [{
        type: mongoose.Types.ObjectId,
        default: [],
        ref: 'Volcano',
    }],
    votedVolcanoes: [{
        type: mongoose.Types.ObjectId,
        default: [],
        ref: 'Volcano'
    }]

});

userSchema.pre('save', async function(){
    this.password = await bcrypt.hash(this.password, 12);
});

const User = model('User', userSchema);

module.exports = User;