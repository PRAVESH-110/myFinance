const Router= require("express");
const { adminmiddleware } = require("../middleware/adminmiddleware")
const { TransactionModel } = require("../db");
const transactionRouter=Router();
    


transactionRouter.post('/transaction', adminmiddleware, async function (req,res,next){
    const userId= req.userId;
    const transactionId= req.body.transactionId;

    await TransactionModel.create({
        userId:userId,
        transactionId:transactionId
    })
    res.json({ message: 'Transaction created successfully' });
})

transactionRouter.get('/transaction/bulk',adminmiddleware, async function(req,res){
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

module.exports = {
    transactionRouter
}
