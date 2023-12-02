require("dotenv").config();
const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  expressSanitizer = require("express-sanitizer"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override");
const PORT = process.env.PORT || 5000;
mongoose.connect('mongodb://localhost/blog');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));
const Blog = require("./model/blog");
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.render("index", { blogs: blogs });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/blogs/new", (req, res) => {
  res.render("new");
});

app.post("/blogs", async (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  try {
    const newBlog = await Blog.create(req.body.blog);
    console.log("Blog created!");
    res.redirect("/blogs");
  } catch (err) {
    console.log(err);
    res.render("new");
  }
});

app.get("/blogs/:id", async (req, res) => {
  try {
    const foundBlog = await Blog.findById(req.params.id);
    res.render("show", { blog: foundBlog });
  } catch (err) {
    console.log(err);
    res.redirect("/blogs");
  }
});

app.get("/blogs/:id/edit", async (req, res) => {
  try {
    const foundBlog = await Blog.findById(req.params.id);
    res.render("edit", { blog: foundBlog });
  } catch (err) {
    console.log(err);
    res.redirect("/blogs");
  }
});

app.put("/blogs/:id", async (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  try {
    await Blog.findByIdAndUpdate(req.params.id, req.body.blog);
    res.redirect("/blogs/" + req.params.id);
  } catch (err) {
    console.log(err);
    res.redirect("/blogs");
  }
});

app.delete("/blogs/:id", async (req, res) => {
    try {
      await Blog.findOneAndDelete({ _id: req.params.id });
      res.redirect("/blogs");
    } catch (err) {
      console.log(err);
      res.redirect("/blogs");
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server for Blog App has started on ${PORT}`);
});
