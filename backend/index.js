const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const router = require('express').Router();
const Meme = require('./models/Meme');
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
    .limit(2)
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
    console.log("here");
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


mongoose.connect(process.env.ATLAS_URI, 
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
