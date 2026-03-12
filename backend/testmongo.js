require('dotenv').config();
const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

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
