// Requiring the required modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const { attachment } = require('express/lib/response');

// Setting and using some properties
app.set('view-engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// Connecting to mongodb database(wikiDB)
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});
// Creating the Schema
const wikiSchema = new mongoose.Schema({ title: String, content: String });
// Creating the model or collection
const articlesModel = new mongoose.model("articles", wikiSchema);

// //////////////////////////////////////////// REQUEST FOR ALL ARTICLES //////////////////////////////////////////////////////////

app.route("/articles")
// When user tries to GET the articles only
.get((req, res) => {            // Fetching the articles from the API using the get() call
    articlesModel.find((err, articles) => {
        if (!err) 
            res.send(articles); 
        else 
            res.send(err);
    })
})

// When user tries to make the POST request only
.post((req, res) => {

    const newArticle = new articlesModel({ title: req.body.title,  content: req.body.content });
    newArticle.save(err => {
        if (!err) {
            res.send("Successfully saved");
        } else {
            res.send(err);
        }
    })
})

// When user tries to make the DELETE request only
.delete((req, res) => {
    articlesModel.deleteMany((err) => {
        if (!err) res.send("Deletion Successfull"); else console.log(err);
    })
});

// //////////////////////////////////////////// REQUEST FOR SPECIFIC ARTICLES //////////////////////////////////////////////////////////

app.route("/articles/:articleTitle")
// When user tries to make the specific GET request
.get((req, res)=> {
    const param = req.params.articleTitle;
    
    articlesModel.findOne({title: param}, (err, article) => {
        if (!err) {
            res.send(article);
        } else {
            res.send(err);
        }
    });
})

.put((req, res) => {
    articlesModel.replaceOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        (err) => {
            if (!err) {
                res.send("Update successfull");
            } else { 
                res.send(err);
            }
        }
    );
})

.patch((req, res) => {
    articlesModel.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        (err) => {
            if (!err) {
                res.send("Updating the specific field successfull")
            } else {
                res.end(err);
            }
        });
})

.delete((req, res) => {
    const deleteElement = req.body.title;
    articlesModel.deleteOne({title: deleteElement}, (err) => {
        if (!err) res.send("Deletion Successfull"); else console.log(err);
    })
});


// Tuning the server to listen to port number 3000
app.listen("3000", () => {
    console.log("Listening on 3000");
})
