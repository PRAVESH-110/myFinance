const Router=require("express");
const {userModel, userTransactionModel}= require("../db");
const jwt = require("jsonwebtoken");
const {z}= require("zod");
const bcrypt=require("bcrypt");
const { usermiddleware } = require("../middleware/usermiddleware")

const {JWT_USER_PASSWORD}= require("../config")
const userRouter=Router();

// Zod validation schema for user signup 
const signupSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username too long"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    firstName: z.string().min(1, "First name is required").max(50, "First name too long"),
    lastName: z.string().min(1, "Last name is required").max(50, "Last name too long")
});
    
    userRouter.post('/signup',async function(req,res){
        const {email, username, password, firstName, lastName } = req.body; 
        
        // Zod validation
        try {
            const validatedData = signupSchema.parse({
                email,
                username,
                password,
                firstName,
                lastName
            });
            
            // Hash the password using bcrypt
            const hashedPassword = await bcrypt.hash(validatedData.password, 5);
            
            // If validation passes, create user
            await userModel.create({
                email: validatedData.email,
                username: validatedData.username,
                password: hashedPassword,
                firstName: validatedData.firstName,
                lastName: validatedData.lastName
            });
            
            res.status(201).json({
                message: "User created successfully"
            });
            
        } catch(error) {
            if (error instanceof z.ZodError) {
                // Zod validation failed
                return res.status(400).json({
                    message: "Validation failed",
                    errors: error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                });
            }
            
            // Check for duplicate email error
            if (error.code === 11000) {
                return res.status(409).json({
                    message: "User with this email already exists"
                });
            }
            
            // Database or other error
            console.error("User creation failed:", error);
            res.status(500).json({
                message: "Internal server error",
                error: error.message
            });
        }
    }) 
    
    userRouter.post('/signin',async function(req,res){
        const {email,password}=req.body;

        try {
            const user = await userModel.findOne({
                email: email
            });

            if(!user){
                return res.status(403).json({
                    message: "Incorrect credentials"
                });
            }

            // Compare password with hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if(!isPasswordValid){
                return res.status(403).json({
                    message: "Incorrect credentials"
                });
            }

            const token=jwt.sign({
                id: user._id
            }, JWT_USER_PASSWORD);

            res.json({
                token:token,
                message:"signin successful"
            });
        } catch(error) {
            console.error("User signin failed:", error);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    })

    userRouter.post('/createtransaction',usermiddleware, async function(req,res){
    
            const userId=req.userId;
    
            const {imageURL, title, description, price}=req.body;
    
            const transaction=await userTransactionModel.create({
                imageURL: imageURL,
                title: title,
                description: description,
                price:price,
                creatorID: userId
    
            })
            res.json({
                message:"transaction created",
                transactionId: transaction._id
            })
        })


    userRouter.get('/usertransaction',usermiddleware, async function(req,res){
        const userId=req.userId;

        const purchases= await userTransactionModel.find({
            userId:userId,
        })

        let purchasedCourseIds=[];

        for(let i=0;i<purchases.length;i++){
            purchasedCourseIds.push(purchases[i].purchaseId);
        }
        res.json({
            purchases,
            courseData
        })
    })


    //edit one's transaction details
    userRouter.put('/edittransacion',usermiddleware, async function(req,res){
        const userId=req.userId;

        const {imageURL, title, description, price, purchaseId}=req.body;

        const edited=await userTransactionModel.updateOne({
            _id: purchaseId, //check from the function updateone (ctrl+click)- filter the course
            creatorID:userId
        },{
            imageURL: imageURL, 
            title: title,
            description: description,
            price:price,

        })
        res.json({
            message:"transaction updted",
            transactionId: transaction._id
        })
    })


module.exports={
    userRouter: userRouter
}