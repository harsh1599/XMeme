const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const router = require('express').Router();
const Meme = require('./models/Meme');
const Comment = require('./models/Comment');
const fs = require('fs');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 8081
app.use(cors());
app.use(express.json());


const swaggerUi = require('swagger-ui-express');
swaggerDocument = require('../swagger.json');

app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(8080,()=>{
    console.log("Server listening on 8080");
})



app.get('/memes',function(req,res){
    Meme
    .find()
    .sort({createdAt:-1})
    .limit(100)
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
    Meme
    .findById(req.params.id)
    .then(meme=>{
        res.status('200').json(
        {
            id: meme._id,
            name: meme.name,
            url: meme.url,
            caption:meme.caption
        }
    )})
    .catch(err=>res.status('404').json("Error: Meme Not Found"));
})
app.post('/memes', function(req,res){    
    const { name, url, caption } = req.body;
    Meme.create({
        name:name,
        url:url,
        caption:caption
    },function(err,meme){
        if(err){
            if(err.name=='ValidationError')res.status('400').json("Bad Request");
            else res.status('409').json("Conflict!");
        } else res.status('200').json({id:meme._id});
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
    .then(memes=>res.status('200').json(memes));
});
app.post('/memes/:id/comments', function(req,res){
    Meme.findById(req.params.id,function(err,meme){
        if(err){
            res.status('404').json("Not found: "+err);
        } else {
            Comment.create({
                memeId: meme._id,
                name: req.body.name,
                text: req.body.text
            }, function(err, comment){
                if(err){
                    if(err.name=="ValidationError")res.status('400').json("Bad Request");
                    else res.json("Error: "+err);
                } else {
                    res.status(200).json({id:comment._id});
                }
            });
        }
    });
});

mongoose.connect('mongodb://localhost:27017/xmeme', {useNewUrlParser: true});




app.listen(port, ()=>{
    console.log(`The servers is running on port: ${port}`);
})
