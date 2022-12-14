const mongoose = require("mongoose");
const ejs = require("ejs");
const express = require("express");
const bodyParser = require("body-parser");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");


const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);




app.route("/articles")

.get(function(req, res){
  Article.find({}, function(err, foundArticle){
    if(!err){
      res.send(foundArticle);
    }
    else{
      res.send(err);
    }
  });
})

.post(function(req, res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("You have successfully added a new article.");
    }else{
      re.send(err);
    }
  });
})

.delete(function(req, res){
  Article.deleteMany({}, function(err){
    if (!err) {
      res.send("succesfully deleted all the articles.");
    }
    else{
      res.send(err);
    }
  })
});



///////////////////////////////////////Requests trageting a specific article//////////////////////


app.route("/articles/:id")

.get(function(req, res){


  Article.findOne({ title: req.params.id }, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }
    else{
      res.send("No articles matching the title was found.");
    }
  });
})

.put(function(req, res){
  Article.update(
    {title: req.params.id},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the content of article.")
      }
    }
  )
})

.patch(function(req, res){

  Article.update(
    {title: req.params.id},
    {$set: req.body },
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the article.");
      }
    }
  )

})

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.id},
    function(err){
      if(!err){
        res.send("Successfully deleted the article.")
      }
      else{
        res.send(err);
      }
    }
  )
});




app.listen(3000, function(){
  console.log("Server started succesfully on port 3000");
})
