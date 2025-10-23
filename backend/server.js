require('dotenv').config();
const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
// const bodyParser=require('body-parser');

const { adminRouter } = require('./routes/admin');
const { userRouter } = require('./routes/user');
const transactionRouter = require('./routes/transactions').transactionRouter;

const app=express();

const allowedOrigin=[ 'http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
    origin:(origin, callback)=>{
        if (!origin || allowedOrigin.includes(origin)){
            callback(null, true);
        }
        else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials:true
}))

app.use(express.json());

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/transaction", transactionRouter);

async function dbConnect(){
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected successfully");
        
        // Start the server after successful DB connection
        app.listen(5000, () => {
            console.log("Server is running on port 5000");
        });
    } catch(error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1);
    }
}

// Start the application
dbConnect();