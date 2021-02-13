const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Meme = require('./models/Meme');
const Comment = require('./models/Comment');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 8081
app.use(cors());
app.use(express.json());

//Contains details for swagger-ui
swaggerDocument = require('./swagger.json');

app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//swagger-ui served on port 8080
app.listen(8080,()=>{
    console.log("Server listening on 8080");
})


//get all memes
app.get('/memes',function(req,res){

    //retrieve all the memes,
    //sort them in descending order wrt. "createdAt",
    //get the top 100 memes
    //map the entries into required json response with 200 status
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


//get meme with _id equal to {id}
app.get('/memes/:id', function(req,res){

    //Retrieve the meme with the id from request parameters,
    //if found structure it in required json format with status code 200,
    //else return error 404(Not found) with an error message
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

//post a meme
app.post('/memes', function(req,res){    
    const { name, url, caption } = req.body;

    //create a meme
    //If successful, return 200 with the id of the meme
    //else if a ValidationError occured, that means a required field is missing,
    //then send a "Bad Request" message with status 400
    //else return 409 with "conflict" message as the entry is already present in the db
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

//partially update the meme
//update either or both from {url,caption} and not the name.
app.patch('/memes/:id', function(req,res){


    //Find the meme by id,
    //update by passing deep copy of the updatedMeme.
    //CastError indicates that the meme with the given id is not found,
    //Hence return 404 status code.
    //MongoError indicates that an entry with same 3 fields is already present 
    //Hence return conflict along with 409.
    //Else if successful return 204(No Content)
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

//get all comments associated with a meme.
app.get('/memes/:id/comments', function(req,res){

    //Find all the entries in which memeId equals given id.
    //returns an array of comments
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

//post a comment on a meme
app.post('/memes/:id/comments', function(req,res){

    //find meme, if not found return 404
    //else try to create a comment,
    //Send 400 if ValidationError occurs(Entry field missing)
    //Send 200 along with id of the comment in the body if successful
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


//connecting to local mongo db running on 27017
//dbname: xmeme
mongoose.connect('mongodb://localhost:27017/xmeme', {useNewUrlParser: true});




app.listen(port, ()=>{
    console.log(`The servers is running on port: ${port}`);
})
