const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const memeSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    text:{
        type: String,
        required: true
    },
    memeId:{
        type: Schema.Types.ObjectId,
        ref:'Meme'
    }
},
    {
        timestamps: true
    }
)

const Comment = mongoose.model('Comment', memeSchema);

module.exports = Comment;
