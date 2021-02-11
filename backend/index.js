const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const router = require('express').Router();
const Meme = require('./models/Meme');
const Comment = require('./models/Comment');
const fs = require('fs');
const credentials = fs.readFileSync(__dirname+'/certificates/X509-cert-1619338183590812891.pem');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 8081
app.use(cors());
app.use(express.json());



app.get('/memes',function(req,res){
    Meme
    .find()
    .sort({createdAt:-1})
    .limit(10)
    .then(memes=>res.status('200').json(
        memes.map(meme=>(
            {
                id:meme._id,
                name:meme.name,
                url:meme.url,
                caption:meme.caption
            }
        ))
    ))
});

app.get('/memes/:id', function(req,res){
    console.log("Look for me! ", req.params.id);
    Meme
    .findById(req.params.id)
    .then(meme=>{
        console.log('HI');
        res.status('200').json(
        {
            id: meme._id,
            name: meme.name,
            url: meme.url,
            caption:meme.caption
        }
    )})
    .catch(err=>res.status('404').json("Error: Error"));
})
app.post('/memes', function(req,res){
    if(!(req.body.name && req.body.url && req.body.caption))
        res.status('400').json("Bad Request");
    const { name, url, caption } = req.body;
    console.log("reqbody: ",req.body);
    Meme.create({
        name:name,
        url:url,
        caption:caption
    },function(err,meme){
        if(err){
            console.log("Err: "+err);
            res.status('409').json("Conflict");
        }
        res.status('200').json({id:meme._id});
    });
});

app.patch('/memes/:id', function(req,res){
    const updatedMeme = {};
    if(req.body.url)updatedMeme.url=req.body.url;
    if(req.body.caption)updatedMeme.caption=req.body.caption;
    Meme
    .findByIdAndUpdate(
        {_id: req.params.id},
        {
            ...updatedMeme
        },
        function(err,result){
            if(err){
                if(err.name=="CastError")res.status('404').json('Not Found');
                else if(err.name=="MongoError" && err.code==11000)res.status('409').json('Meme already exists');
            } else {
                res.status('204');
            }
        }
    )
})
app.get('/memes/:id/comments', function(req,res){
    Comment.find()
    .where('memeId')
    .equals(req.params.id)
    .then(memes=>memes.map(meme=>{
        return(
            {
                id: meme._id,
                name: meme.name,
                text: meme.text
            }
        )
    }),err=>console.log("error over here"))
    .then(memes=>res.json(memes));
});
app.post('/memes/:id/comments', function(req,res){
    console.log("posting comment:  ", req.body);
    Meme.findById(req.params.id,function(err,meme){
        if(err){
            res.json("Not found: "+err);
        } else {
            Comment.create({
                memeId: meme._id,
                name: req.body.name,
                text: req.body.text
            }, function(err, comment){
                if(err){
                    res.json("Error: "+err);
                } else {
                    res.json(comment);
                }
            });
        }
    });
});

// mongoose.connect("mongodb+srv://cluster0.xno2z.mongodb.net/test?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority",
//     { 
//         useNewUrlParser: true, 
//         useUnifiedTopology: true, 
//         useFindAndModify: false, 
//         useCreateIndex: true,
//         sslKey: credentials,
//         sslCert: credentials 
//     }
// )

mongoose.connect('mongodb://localhost:27017/xmeme', {useNewUrlParser: true});




app.listen(port, ()=>{
    console.log(`The servers is running on port: ${port}`);
})
