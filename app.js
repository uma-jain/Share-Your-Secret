//jshint esver
const express=require("express");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

 
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
 var secret = "Thisisourlittlesecret";
 userschema.plugin(encrypt, { secret: secret,encryptedFields: ['password'] });
//user is table:collections
const User= mongoose.model("User",userschema); // in singular formm collection;


app.post("/register",function(req,res){

   const newuser=new User({
       email:req.body.email,
       password:req.body.password
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

app.post("/login",function(req,res){
    User.findOne({email:req.body.email},function(err,user){
    if(!user){
        console.log("not found");
      
       res.render("register");
    }
    else{
      
           if(user.password === req.body.password){
               console.log("found");
                res.render("secrets");
            }
     
       }
        
    });
 });

app.listen(3000,function(){
console.log("server started at port 3000");
});