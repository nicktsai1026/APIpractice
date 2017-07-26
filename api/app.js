const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const hb = require('express-handlebars');
const axios = require('axios');
const pg = require('pg');
const redis = require('redis');
const models = require('./models')
const User = models.user;
const Friend = models.friend;

app.use(bodyParser.urlencoded({extended:false}));
app.engine('handlebars', hb({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//redis connect
var client = redis.createClient({
    host: 'localhost',
    port: 6379
});
client.on('error', function(err){
    console.log(err);
});

app.get('/login', function(req, res) {
    res.render('login');
});

app.post('/home',function(req, res) {
    var input = req.body;
    //console.log(req.body);
    var inputName = input.name;
    User.findOne({where:{userName:inputName}})
        .then((users)=>{
            //console.log(users);
            if(!users) {
                const user = new User();
                User.create({
                    userName:inputName
                })
                .then((users)=>{
                    res.redirect('/users/'+users.dataValues.id);
                })
            }else {
                res.redirect('/users/'+users.dataValues.id);
            }
        })

});

app.post('/addfriend', function(req, res) {
    var input = req.body;
    console.log(req.body);
    var inputName = input.name;
    var inputId = input.userId;
    const friends = new Friend();
    Friend.create({
        friendName:inputName,
        userId:inputId
    })
    .then((friends)=>{
        //console.log("inside addfriend");
        res.redirect('/users/'+inputId);
    })
    .catch((err)=>{
        console.log(err);
    })
});

app.get('/users/:id',function(req, res){
    //console.log(req.params);
    User.findOne({where:{id:req.params.id}})
        .then((users)=>{
            //console.log(users);
            Friend.findAll({where:{userId:req.params.id}})
                .then((friends)=>{
                    //console.log(friends);
                    //console.log(users.dataValues);
                    var obj = users.dataValues;
                    obj.friends = friends;
                    //console.log(obj);
                    res.render('users',obj);
                })
                .catch((err)=>{
                    console.log(err);
                })
        })
});

app.get('/friends/:id',function(req, res) {
    Friend.findOne({where:{id:req.params.id}})
        .then((friends)=>{
            //console.log(friends.dataValues.friendName);
            var checkName = friends.dataValues.friendName;
            axios.get('https://api.github.com/users/'+ checkName +'/events')
                .then(function(response) {
                    var info = response.data;
                    info.post = info;
                    info.friendName = checkName;
                    res.render('friends',info);
                })
        })
        .catch((err)=>{
            console.log(err);
        })
});

// app.get('/friends/:id',function(req, res){
//
// })

app.listen(8080);
