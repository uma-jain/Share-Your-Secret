//jshint esver
require('dotenv').config(); 
const express=require("express");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
//const md5=require("md5");
const bcrypt=require("bcrypt");
const saltround=10;

 
const app=express();
app.use(express.static("public"));



app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({
    extended:true
}));   

app.get("/",function(req,res){
res.render("home");

});
app.get("/login",function(req,res){
    res.render("login");
    
});
app.get("/register",function(req,res){
        res.render("register");
        
});


//datebase creation and table creation;
mongoose.connect('mongodb://localhost:27017/userdb', {useNewUrlParser: true, useUnifiedTopology: true});
const userschema= new mongoose.Schema({
   email:String,
   password:String
    
});
 //encryption

//user is table:collections
const User= mongoose.model("User",userschema); // in singular formm collection;


app.post("/register",function(req,res){

    bcrypt.hash(req.body.password ,saltround, function(err, hash) {
        // Store hash in your password DB.
        const newuser=new User({
            email:req.body.email,
            password:hash
        })
        
       newuser.save(function(err){
         if(err)
         {console.log(err);}
         else
         {   console.log("registered");
             res.render("login");
         }
       });
    });
  
   
});

app.post("/login",function(req,res){
    User.findOne({email:req.body.email},function(err,user){
    if(!user){
        console.log("not found");
      
       res.render("register");
    }
    else{    
        bcrypt.compare(req.body.password,user.password, function(err, result) {
            // result == true
            if(result === true){
            console.log("found");
            res.render("secrets");}
            else{
                console.log("incorrect password");
            }
       
        });
    }    
    });
 });

app.listen(3000,function(){
console.log("server started at port 3000");
});
