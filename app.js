//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose=require("mongoose");


const uri = "mongodb+srv://admin-ankit:admin-ankit@cluster0.s10zm.mongodb.net/blogDB";
mongoose.connect(uri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

const postSchema={
  title:String,
  content:String
};

const Post=mongoose.model("Post",postSchema);

const homeStartingContent = "Whether you’re looking for a tool to record your daily emotions and activities in a reflective journal, keep track of milestones in a food diary or any other journal, or even record your dreams in a dream journal, we have you covered We give you all the tools you need to focus on the ideas you want to preserve, rather than the process of writing itself.";


const aboutContent = "Hey everyone! I'm Ankit Shaw, the creator of this website. This webiste was developed to give you all the tools you need to focus on the ideas you want to preserve, rather than the process of writing itself. Whether you’re looking for a tool to record your daily emotions and activities in a reflective journal, keep track of milestones in a food diary, or even record your dreams in a dream journal, we have you covered.";


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/", function(req, res){

  Post.find({},function(err, postsFound){

    res.render("home", {
      startingContent: homeStartingContent,
      posts: postsFound
  })
 
    });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact");
});

app.get("/compose", function(req, res){
  res.render("compose",{
    title:"",
    content:""
  });
});

app.post("/compose", function(req, res){
  const post =new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function (err) {

    if (!err) {

      res.redirect("/");

    }

  });

});



app.get("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;
  console.log(requestedPostId);
  Post.findOne({ _id: requestedPostId }, function (err, postsFound) {

    console.log(postsFound._id);
    res.render("post", {

      title: postsFound.title,

      content: postsFound.content,

      id:postsFound._id

    });

  });

});

app.post("/deletePost",function(req,res){

  const foundId = req.body.deleteId;
  Post.findOneAndDelete({_id:foundId},function(err)
  {
    if(err)
    console.log(err);
  });

  res.redirect("/");

})



app.post("/editPost", function(req,res) {

  const foundId=req.body.postId;

  Post.findOne({_id:foundId},function(err,postFound){
    
    if (err)
    console.log(err);


    else {
      const titleFixed = postFound.title;
      const contentFixed = postFound.content;

      Post.deleteOne({_id:foundId},function(err){
        if(err)
        console.log(err);
      })

      res.render("compose",{
        title: titleFixed,
        content: contentFixed
      });

    }

  });
  console.log("hey2");
});


app.listen(process.env.PORT||3000, function() {
  console.log("Server started on port 3000");
});
