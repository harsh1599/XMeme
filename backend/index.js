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
const port = process.env.PORT || 5000
app.use(cors());
app.use(express.json());



app.get('/',function(req,res){
    // res.json('Hello');
    Meme
    .find()
    .sort({createdAt:-1})
    .limit(10)
    .then(memes=>res.json(
        memes.map(meme=>(
            {
                id:meme._id,
                name:meme.name,
                url:meme.url,
                caption:meme.caption
            }
        ))
    ))
    .catch(err=>res.json("Error: "+err));
});

app.get('/:id', function(req,res){
    console.log("Look for me! ", req.params.id);
    Meme
    .findById(req.params.id)
    .then(meme=>{
        res.json(
        {
            id: meme._id,
            name: meme.name,
            url: meme.url,
            caption:meme.caption
        }
    )})
    .catch(err=>res.json("Error: "+err));
})
app.post('/memes', function(req,res){
    const { name, url, caption } = req.body;
    console.log("reqbody: ",req.body);
    Meme.create({
        name:name,
        url:url,
        caption:caption
    },function(err,meme){
        if(err)res.json("Error: "+err);
        res.json({id:meme._id});
    })
});

app.patch('/:id', function(req,res){
    Meme
    .findByIdAndUpdate(
        {_id: req.params.id},
        {
            name: req.body.name,
            url: req.body.url,
            caption: req.body.caption
        },
        function(err,result){
            if(err){
                res.json("Error: "+err);
            } else {
                res.json(result);
            }
        }
    )
})
app.get('/:id/comments', function(req,res){
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
app.post('/:id/comments', function(req,res){
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

mongoose.connect("mongodb+srv://cluster0.xno2z.mongodb.net/test?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority",
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useFindAndModify: false, 
        useCreateIndex: true,
        sslKey: credentials,
        sslCert: credentials 
    }
)








app.listen(port, ()=>{
    console.log(`The servers is running on port: ${port}`);
})
