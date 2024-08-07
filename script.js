const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");
const articleSchema = mongoose.Schema({
  title: String,
  content: String,
});
const Article = mongoose.model("articles", articleSchema);
// const article = new Article({
//   title: "REST",
//   content: "REST stands for Representational State Transfer",
// });
// article.save();

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

///////////////// REQUESTS TARGETTING ALL ARTICLES /////////////////////////////

app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    article.save(function (err) {
      if (err) res.send(err);
      else res.send("successfully added a new article");
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err, foundArticles) {
      if (err) res.send(err);
      else res.send("successfully deleted all the articles");
    });
  });

///////////////// REQUESTS TARGETTING A SPECIFIC ARTICLE /////////////////////////////

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No matching articles was found");
      }
    });
  })

  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      {
        title: req.body.title,
        content: req.body.content,
      },
      function (err) {
        if (!err) res.send("successfully updated the article.");
      }
    );
  })

  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("successfully updated the selected article.");
        }
      }
    );
  })

  // DIFFERENCE BETWEEN PUT AND PATCH:
  // PUT --> update the entire document.
  // PATCH --> update a specific field in the document.

  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) res.send("successfully deleted the article");
    });
  });

app.listen(3000, function () {
  console.log("server is up and runing.");
});
