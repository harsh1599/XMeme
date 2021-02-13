const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const memeSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    url:{
        type: String,
        required: true
    },
    caption:{
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
)
memeSchema.index({name:1,url:1,caption:1},{unique:true});
const Meme = mongoose.model('Meme', memeSchema);

module.exports = Meme;
