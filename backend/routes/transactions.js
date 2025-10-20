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

module.exports = {
    transactionRouter
}
