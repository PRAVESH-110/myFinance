const mongoose =require('mongoose');

const Schema= mongoose.Schema;

const userSchema=new Schema({
    username:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    email:{type:String, required:true, unique:true},
})

const adminSchema=new Schema({
    email:{type:String, required: true, unique:true},
    password:{type:String, required:true},

})

const transactionSchema=new Schema({
    userId:{type:Schema.Types.ObjectId, ref:'User', required:true},
    amount:{type:Number, required:true},
    type:{type:String, enum:['income', 'expense'], required:true},
    category:{type:String, required:true},
    date:{type:Date, default:Date.now},
    description:{type:String}
})

const user=mongoose.model('User', userSchema);
const admin= mongoose.model('Admin', adminSchema);
const userTransaction= mongoose.model('transaction', transactionSchema);

module.export={
    user,
    admin,
    userTransaction
}