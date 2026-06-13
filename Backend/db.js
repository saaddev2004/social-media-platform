const mongoose = require("mongoose");
const mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL);
const db = mongoose.connection;

db.on('connected', () => {
    console.log("MongoDB Connected: SocialConnect DB");
});

db.on('disconnected', () => {
    console.log("MongoDB Disconnected");
});

db.on('error', (error) => {
    console.log("Error occurred: " + error);
});

module.exports = db;