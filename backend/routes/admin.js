const Router=require("express");
const adminRouter=Router();
const jwt = require("jsonwebtoken");
const {z}= require("zod");
const bcrypt=require("bcrypt");

const {adminModel, TransactionModel, userModel } =require("../db");

const {JWT_ADMIN_PASSWORD}= require("../../config");
const { adminmiddleware } = require("./middleware/adminmidleware");

// Zod validation schema for user signup
const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    firstName: z.string().min(1, "First name is required").max(50, "First name too long"),
    lastName: z.string().min(1, "Last name is required").max(50, "Last name too long")
});

    adminRouter.post('/signup',async function(req,res){
        const {email, password, firstName, lastName }=req.body; 
        
        // Zod validation
        try {
            const validatedData = signupSchema.parse({
                email,
                password,
                firstName,
                lastName
            });
            
            // Hash the password using bcrypt
            const hashedPassword = await bcrypt.hash(validatedData.password, 5);
            
            // If validation passes, create user
            await adminModel.create({
                email: validatedData.email,
                password: hashedPassword,
                firstName: validatedData.firstName,
                lastName: validatedData.lastName
            });
            
            res.status(201).json({
                message: "admin created successfully"
            });
            
        } catch(error) {
            if (error instanceof z.ZodError) {
                // Zod validation failed
                return res.status(400).json({
                    message: "Validation failed",
                    errors: error.errors && Array.isArray(error.errors)
                        ? error.errors.map(err => ({
                            field: Array.isArray(err.path) ? err.path.join('.') : String(err.path),
                            message: err.message
                        }))
                        : []
                });
            }
            
            // Check for duplicate email error
            if (error.code === 11000) {
                return res.status(409).json({
                    message: "admin with this email already exists"
                });
            }
            
            // Database or other error
            console.error("admin creation failed:", error);
            res.status(500).json({
                message: "Internal server error",
                error: error.message
            });
        }
    }) 

    
    // Zod validation schema for admin signin
    const signinSchema = z.object({
        email: z.string().email(),
        password: z.string().min(1, "Password is required")
    });



    //SIGIN
    adminRouter.post('/signin',async function(req,res){
        const {email,password}=req.body;

        // Zod validation for signin
        try {
            const validatedData = signinSchema.parse({
                email,
                password
            });

            const admin = await adminModel.findOne({ email: validatedData.email });

            if(!admin){
                return res.status(403).json({
                    message: "Incorrect credentials"
                });
            }

            // Compare password with hashed password
            const isPasswordValid = await bcrypt.compare(validatedData.password, admin.password);
            
            if(!isPasswordValid){
                return res.status(403).json({
                    message: "Incorrect credentials"
                });
            }

            const token=jwt.sign({
                id: admin._id
            }, JWT_ADMIN_PASSWORD);

            res.json({
                token: token,
                message: "signin successful"
            });
        } catch(error) {
            if (error instanceof z.ZodError) {
                // Zod validation failed
                return res.status(400).json({
                    message: "Validation failed",
                    errors: error.errors && Array.isArray(error.errors)
                        ? error.errors.map(err => ({
                            field: Array.isArray(err.path) ? err.path.join('.') : String(err.path),
                            message: err.message
                        }))
                        : []
                });
            }
            
            console.error("Admin signin failed:", error);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    })


        adminRouter.post('/createtransaction',adminmiddleware, usermiddleware, async function(req,res){

        const adminId=req.userId;

        const {imageURL, title, description, price}=req.body;

        const course=await TransactionModel.create({
            imageURL: imageURL,
            title: title,
            description: description,
            price:price,
            creatorID: adminId

        })
        res.json({
            message:"course created",
            courseId: course._id
        })
    })

    adminRouter.put('/edittransaction',adminmiddleware, async function(req,res){
        const adminId=req.userId;

        const {imageURL, title, description, price, courseId}=req.body;


        const course=await TransactionModel.updateOne({
            _id: courseId, //check from the function updateone (ctrl+click)- filter the course
            creatorID:adminId
        },{
            imageURL: imageURL, 
            title: title,
            description: description,
            price:price,

        })
        res.json({
            message:"course updted",
            courseId: course._id
        })
    })
    
    adminRouter.get('/transaction/bulk',adminmiddleware, async function(req,res){
        const adminId=req.userId;

        const courses=await TransactionModel.find({
            // _id: courseId, //check from the function updateone (ctrl+click)- filter the course
            creatorID:adminId
        });
        res.json({
            message:"courses found",
            courses
        })
    })


module.exports={
    adminRouter: adminRouter
}