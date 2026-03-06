const mongoose = require('mongoose');
const uri = "mongodb+srv://syedfaiz052004_db_user:hGLkU4ClktChwxug@cluster0.amwst5g.mongodb.net/";

async function run() {
    try {
        console.log("Connecting...");
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log("Connected successfully to MongoDB Atlas!");
        process.exit(0);
    } catch (err) {
        console.error("Connection failed:", err.message);
        process.exit(1);
    }
}
run();
