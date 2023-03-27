/*
Author: Cao Ngoc Linh
Script for server
*/

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// connect to mongodb
mongoose.set('strictQuery', false);
const mongoDB = "mongodb://127.0.0.1/";

// Wait for database to connect, logging an error if there is a problem 
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(mongoDB);
}

// create schema
const Schema = mongoose.Schema;
const itemSchema = new Schema({
    title: String,
    description: String,
    image: String,
    price: Number,
    stat: String
});
const userSchema = new Schema({
    username: String,
    password: String,
    listings: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
    purchases: [{ type: Schema.Types.ObjectId, ref: 'Item' }]
});

// create model
const Item = mongoose.model('Item', itemSchema);
const User = mongoose.model('User', userSchema);

// middleware to parse JSON in request body
app.use(bodyParser.json());

app.use(express.static('public_html'));

// handle GET requests to /get/users
app.get('/get/users', async (req, res) => {
    // find all users in mongodb and return as JSON
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

// handle GET requests to /get/items
app.get('/get/items', async (req, res) => {
    // find all items in mongodb and return as JSON
    try {
        const items = await Item.find({});
        res.json(items);
    } catch (err) {
        res.status(500).send(err);
    }
});

// handle GET requests to /get/listings/USERNAME
app.get('/get/listings/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const user = await User.findOne({ username }).populate('listings');
        res.json(user.listings);
    } catch (err) {
        res.status(500).send(err);
    }
});

// handle GET requests to /get/purchases/USERNAME
app.get('/get/purchases/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const user = await User.findOne({ username }).populate('purchases');
        res.json(user.purchases);
    } catch (err) {
        res.status(500).send(err);
    }
});

// handle GET requests to /search/users/KEYWORD
app.get('/search/users/:keyword', async (req, res) => {
    const keyword = req.params.keyword;
    try {
        const users = await User.find({ username: { $regex: keyword, $options: 'i' } });
        res.json(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

// handle GET requests to /search/items/KEYWORD
app.get('/search/items/:keyword', async (req, res) => {
    const keyword = req.params.keyword;
    try {
        const items = await Item.find({ description: { $regex: keyword, $options: 'i' } });
        res.json(items);
    } catch (err) {
        res.status(500).send(err);
    }
});

// handle POST requests to /add/user
app.post('/add/user', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    try {
        await user.save({});
        res.send('User added successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});

// handle POST requests to /add/item/USERNAME
app.post('/add/item/:username', async (req, res) => {
    const { title, description, image, price, stat } = req.body;
    const username = req.params.username;
    const item = new Item({ title, description, image, price, stat });
    try {
        const savedItem = await item.save({});
        await User.findOneAndUpdate(
            { username },
            { $push: { listings: savedItem._id } },
        );
        res.send('Item added successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});

// start server
app.listen(port, () => console.log(`Server listening on port ${port}`));
