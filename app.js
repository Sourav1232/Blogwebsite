const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _= require("lodash");

const homeStartingContent = "Welcome to your Journal.Write your daily activities,express your views about the world, anything you want to write about.Here you will not be judged by your opinions,views,race or whatever.So write anything to your heart's content.";
const aboutContent = "I am Sourav, an aspiring web developer who is trying to excel in his studies,and keep everyone happy. He resides in Kolkata for his college purposes. He studies in University of Calcutta pursuing Instrumentation Engineering.He is currently in third year.";
const contactContent = "you can contact me every social media handles given below";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true, useUnifiedTopology: true ,family:4})
  .then(() => {
    console.log('Connected to the database');

    const postSchema = {

      title: String,
     
      content: String
     
     };

     const Post = mongoose.model("Post", postSchema);


app.get('/', async (req, res) => {
  try {
    // Find all documents from the model
    const posts = await Post.find();

    // Render the ejs file (e.g., 'documents.ejs') and pass the documents data
    res.render("home", {
 
      startingContent: homeStartingContent,
 
      posts: posts
 
      });
  } catch (err) {
    console.error('Error fetching documents:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/about", function(req, res){
  res.render("about",{aboutstat: aboutContent});
})


app.get("/contact", function(req, res){
  res.render("contact",{contactstat: contactContent});
})


app.get("/compose",function(req, res){
  res.render("compose");
})


app.post("/compose", function(req, res){

  const post = new Post ({

    title: req.body.postTitle,
 
    content: req.body.postBody
 
  });
 

  post.save()
  .then(savedDocument => {
    console.log('Document saved successfully:', savedDocument);
  })
  .catch(err => {
    console.error('Error saving document:', err);
  });
  
  res.redirect("/");
})




app.get('/posts/:postId', async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.postId });

    if (!post) {
      return res.status(404).send('Document not found');
    }

    res.render("post", {

      title: post.title,
 
      content: post.content
 
    });
  } catch (err) {
    console.error('Error finding the Document:', err);
    res.status(500).send('Internal Server Error');
  }
});









app.listen(3000, function() {
  console.log("Server started on port 3000");
});


})
.catch((error) => {
  console.error('Error connecting to the database:', error);
});