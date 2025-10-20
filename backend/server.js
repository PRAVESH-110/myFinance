require('dotenv').config();
const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
// const bodyParser=require('body-parser');

const adminRoutes=require('./routes/admin');
const userRoutes=require('./routes/user');
const transactionRoutes=require('./routes/transactions');

const app=express();

const allowedOrigin=[ 'http://localhost:5173',  ];

app.user(cors({
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

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/transaction", transactionRoutes);

async function dbConnect(){
    try{
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected succesfully");

    app.listen(5000,()=>{
    console.log("Server is running on port 5000");
})
    }
    catch(error){
        console.log("Failed to connect to db");
        process.exit(1);
    }

}

app.listen(5000,()=>{
    console.log("Server is running on port 5000");
})