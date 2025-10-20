const Router= require("express");
const {adminmiddleware}=require("../middleware/usermidleware")
const { TransactionModel } = require("../db");
const transactionRouter=Router();
    


transactionRouter.post('/transaction', adminmiddleware, async function (req,res,next){
    const userId= req.userId;
    const transactionId= req.body.transactionId;

    await TransactionModel.create({
        userId:userId,
        transactionId:transactionId
    })
})
